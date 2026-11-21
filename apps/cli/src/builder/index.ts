import fs from "fs-extra";
import path from "node:path";
import { cwd } from "node:process";

import { generateNextSteps } from "../output/nextSteps";
import { buildError, BuildResult, isBuildError, ProjectConfig } from "../types";
import { PRESERVED_ENTRIES, validateDirectoryEmpty } from "../validators";
import { loadBuildInputs } from "./buildPlanner";
import {
  generateEnvFile,
  generatePackageJson,
  generatePnpmWorkspace,
  generateStackFile,
} from "./configGenerator";
import { installDependencies } from "./dependencyInstaller";
import { copyModuleFiles, processTemplateFiles } from "./fileProcessor";
import { initializeGitRepository } from "./gitInitializer";
import {
  generateMonorepoFiles,
  generateMonorepoNextSteps,
  generateMonorepoReadme,
} from "./monorepo";
import { getMonorepoApps } from "./monorepoApps";
import { generateReadme } from "./readmeGenerator";
import { generateRouteTree } from "./routeTree";

export { planBuild } from "./buildPlanner";

// Empties a directory except for the entries it may have had before the build
async function removeCreatedEntries(dir: string): Promise<void> {
  for (const entry of await fs.readdir(dir)) {
    if (!PRESERVED_ENTRIES.includes(entry)) {
      await fs.remove(path.join(dir, entry));
    }
  }
}

// Writes the files of one project: a single app, or one app of a monorepo
async function buildProjectFiles(
  config: ProjectConfig,
  targetDir: string
): Promise<void> {
  // Load the selected modules, build the template context, and merge the
  // module configurations
  const { modules, templateContext, mergedConfig } =
    await loadBuildInputs(config);

  for (const module of modules) {
    await copyModuleFiles(module.path, targetDir);
  }

  await processTemplateFiles(targetDir, templateContext);
  if (config.framework === "tanstack") await generateRouteTree(targetDir);

  await generatePackageJson(targetDir, mergedConfig, config);
  // A monorepo has one pnpm-workspace.yaml and one stack file, at the root
  if (config.packageManager === "pnpm" && !config.app) {
    await generatePnpmWorkspace(targetDir, mergedConfig.overrides);
  }

  await generateEnvFile(targetDir, mergedConfig.envVars);
  await generateReadme(targetDir, config, mergedConfig);
  if (!config.app) await generateStackFile(targetDir, config);
}

// Main function to orchestrate the project construction process
export async function build(
  config: ProjectConfig,
  targetDir: string
): Promise<BuildResult> {
  // 1. Validate target directory
  const validationResult = await validateDirectoryEmpty(targetDir);

  if (validationResult)
    throw buildError(validationResult, "DIRECTORY_NOT_EMPTY");

  const didDirectoryExist = await fs.pathExists(targetDir);

  try {
    // 2. Create target directory
    await fs.ensureDir(targetDir).catch((e) => {
      throw buildError(
        e,
        "DIRECTORY_CREATE_ERROR",
        "Failed to create directory"
      );
    });

    if (config.monorepo) {
      // Each app is built as a project of its own, then the root files
      const apps = getMonorepoApps(config);
      for (const app of apps) {
        await build(app.config, path.join(targetDir, app.dir));
      }
      await generateMonorepoFiles(targetDir, config, apps);
      await generateMonorepoReadme(targetDir, config);
      await generateStackFile(targetDir, config);
    } else {
      await buildProjectFiles(config, targetDir);
    }

    // 8. Install dependencies and initialize git (both optional); a failure
    // in either is reported as a warning and does not fail the build
    const depsInstalled =
      config.installDeps &&
      installDependencies(config.packageManager, targetDir);

    if (config.initGit) initializeGitRepository(targetDir);

    return {
      projectPath: targetDir,
      nextSteps: config.monorepo
        ? generateMonorepoNextSteps(
            config,
            path.relative(cwd(), targetDir),
            depsInstalled
          )
        : generateNextSteps(config, targetDir, depsInstalled),
    };
  } catch (error) {
    // Remove the partial project so a retry is not blocked by a non-empty
    // directory. A directory that already existed is emptied, not deleted,
    // and keeps what it had before, such as .git
    await (
      didDirectoryExist ? removeCreatedEntries(targetDir) : fs.remove(targetDir)
    ).catch(() => undefined);
    // Errors raised by the build steps already say what failed
    throw isBuildError(error)
      ? error
      : buildError(error, "BUILDING_ERROR", "Building failed");
  }
}
