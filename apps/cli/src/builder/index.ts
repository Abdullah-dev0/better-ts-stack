import fs from "fs-extra";

import { getModule } from "../modules/registry";
import { generateNextSteps } from "../output/nextSteps";
import { buildError, BuildResult, Module, ProjectConfig } from "../types";
import { validateDirectoryEmpty } from "../validators";
import {
  generateEnvFile,
  generatePackageJson,
  generatePnpmWorkspace,
  mergeConfigurations,
} from "./configGenerator";
import { installDependencies } from "./dependencyInstaller";
import { copyModuleFiles, processTemplateFiles } from "./fileProcessor";
import { initializeGitRepository } from "./gitInitializer";
import { selectModules } from "./moduleSelector";
import { buildTemplateContext } from "./templateContext";

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

    // 3. Select and load modules
    const selection = selectModules(config);
    const modules: Module[] = [];
    try {
      for (const id of [selection.base, ...selection.modules]) {
        modules.push(await getModule(id));
      }
    } catch (e) {
      throw buildError(e, "MODULE_LOADING_ERROR", "Failed to load modules");
    }

    // 4. Build template context and merge module configurations
    const templateContext = buildTemplateContext(config);
    const mergedConfig = mergeConfigurations(
      modules.map((m) => m.config),
      templateContext
    );

    // 5. Copy module files
    try {
      for (const module of modules) {
        await copyModuleFiles(module.path, targetDir);
      }
    } catch (e) {
      throw buildError(e, "FILE_COPY_ERROR", "Failed to copy module files");
    }

    // 6. Process Handlebars templates
    try {
      await processTemplateFiles(
        targetDir,
        templateContext,
        modules.flatMap((m) => m.config.templateFiles)
      );
    } catch (e) {
      throw buildError(
        e,
        "TEMPLATE_PROCESSING_ERROR",
        "Failed to process template files"
      );
    }

    // 7. Generate package.json
    await generatePackageJson(targetDir, mergedConfig, config);
    if (config.packageManager === "pnpm") {
      await generatePnpmWorkspace(targetDir, mergedConfig.overrides);
    }

    // 8. Generate environment files
    await generateEnvFile(targetDir, mergedConfig.envVars);

    // 9. Install dependencies and initialize git (both optional); a failure
    // in either is reported as a warning and does not fail the build
    const depsInstalled =
      config.installDeps &&
      installDependencies(config.packageManager, targetDir);

    if (config.initGit) initializeGitRepository(targetDir);

    return {
      success: true,
      projectPath: targetDir,
      nextSteps: generateNextSteps(config, targetDir, depsInstalled),
    };
  } catch (error) {
    // Remove the partial project so a retry is not blocked by a non-empty
    // directory; a directory that already existed is emptied, not deleted
    await (
      didDirectoryExist ? fs.emptyDir(targetDir) : fs.remove(targetDir)
    ).catch(() => undefined);
    throw buildError(error, "BUILDING_ERROR", "Building failed");
  }
}
