import fs from "fs-extra";
import path from "node:path";

import { generateNextSteps } from "../output/nextSteps";
import { buildError, BuildResult, isBuildError, ProjectConfig } from "../types";
import { PRESERVED_ENTRIES, validateDirectoryEmpty } from "../validators";
import { loadBuildInputs } from "./buildPlanner";
import {
  generateEnvFile,
  generatePackageJson,
  generatePnpmWorkspace,
} from "./configGenerator";
import { installDependencies } from "./dependencyInstaller";
import { copyModuleFiles, processTemplateFiles } from "./fileProcessor";
import { initializeGitRepository } from "./gitInitializer";
import { generateReadme } from "./readmeGenerator";

export { planBuild } from "./buildPlanner";

// Empties a directory except for the entries it may have had before the build
async function removeCreatedEntries(dir: string): Promise<void> {
  for (const entry of await fs.readdir(dir)) {
    if (!PRESERVED_ENTRIES.includes(entry)) {
      await fs.remove(path.join(dir, entry));
    }
  }
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

    // 3. Load the selected modules, build the template context, and merge
    // the module configurations
    const { modules, templateContext, mergedConfig } =
      await loadBuildInputs(config);

    // 4. Copy module files
    for (const module of modules) {
      await copyModuleFiles(module.path, targetDir);
    }

    // 5. Process Handlebars templates
    await processTemplateFiles(targetDir, templateContext);

    // 6. Generate package.json
    await generatePackageJson(targetDir, mergedConfig, config);
    if (config.packageManager === "pnpm") {
      await generatePnpmWorkspace(targetDir, mergedConfig.overrides);
    }

    // 7. Generate environment files and the README
    await generateEnvFile(targetDir, mergedConfig.envVars);
    await generateReadme(targetDir, config, mergedConfig);

    // 8. Install dependencies and initialize git (both optional); a failure
    // in either is reported as a warning and does not fail the build
    const depsInstalled =
      config.installDeps &&
      installDependencies(config.packageManager, targetDir);

    if (config.initGit) initializeGitRepository(targetDir);

    return {
      projectPath: targetDir,
      nextSteps: generateNextSteps(config, targetDir, depsInstalled),
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
