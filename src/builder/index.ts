import consola from 'consola';
import fs from 'fs-extra';
import { getModule } from '../modules/registry';
import { generateNextSteps } from '../output/nextSteps';
import { Module, ProjectConfig, BuildResult, createBuildError, isBuildError } from '../types';
import { validateDirectoryEmpty } from '../validators';
import { generateEnvFile, generatePackageJson, mergeConfigurations } from './configGenerator';
import { installDependencies } from './dependencyInstaller';
import { copyModuleFiles, processTemplateFiles } from './fileProcessor';
import { initializeGitRepository } from './gitInitializer';
import { selectModules } from './moduleSelector';
import { buildTemplateContext } from './templateContext';

/**
 * Main building function
 * Orchestrates the entire project building process (14 steps)
 * @param config - Project configuration from prompts
 * @returns Promise resolving to build result with success status and next steps
 */
export async function build(config: ProjectConfig, targetDir: string): Promise<BuildResult> {
  const absoluteTargetDir = targetDir;

  consola.start('Starting project building...');

  try {
    // Step 1: Validate target directory doesn't exist or is empty
    consola.info('Validating target directory...');
    const validationResult = await validateDirectoryEmpty(absoluteTargetDir);

    if (validationResult) {
      throw createBuildError(validationResult, 'DIRECTORY_NOT_EMPTY', 1);
    }

    // Step 2: Create target directory
    consola.info('Creating project directory...');
    try {
      await fs.ensureDir(absoluteTargetDir);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createBuildError(
        `Failed to create target directory: ${errorMessage}`,
        'DIRECTORY_CREATE_ERROR',
        1
      );
    }

    // Step 3: Select modules based on project configuration
    consola.info('Selecting modules...');
    const selection = selectModules(config);

    // Step 4: Load all selected modules (base + additional modules)
    consola.info('Loading module configurations...');
    const modules: Module[] = [];
    try {
      // Load base template first
      const baseModule = await getModule(selection.base);
      modules.push(baseModule);

      // Load additional modules
      for (const moduleId of selection.modules) {
        const module = await getModule(moduleId);
        modules.push(module);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createBuildError(`Failed to load modules: ${errorMessage}`, 'MODULE_LOADING_ERROR', 1);
    }

    consola.success(
      `Selected ${modules.length} modules: ${modules.map((m) => m.config.id).join(', ')}`
    );

    // Step 5: Build template context from project configuration
    consola.info('Building template context...');
    const templateContext = buildTemplateContext(config);

    // Step 6: Merge configurations from all modules

    const mergedConfig = mergeConfigurations(
      modules.map((m) => m.config),
      templateContext
    );

    // Step 8: Copy files from all selected modules to target directory
    consola.info('Copying module files...');
    try {
      for (const module of modules) {
        consola.debug(`  - Copying ${module.config.id}...`);
        await copyModuleFiles(module.path, absoluteTargetDir);
      }

      consola.success('Module files copied');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createBuildError(`Failed to copy module files: ${errorMessage}`, 'FILE_COPY_ERROR', 1);
    }

    // Step 9: Process .hbs template files with Handlebars
    consola.info('Processing template files...');
    try {
      // Collect all template files from all modules
      const allTemplateFiles: string[] = [];
      for (const module of modules) {
        if (module.config.templateFiles && module.config.templateFiles.length > 0) {
          allTemplateFiles.push(...module.config.templateFiles);
        }
      }

      if (allTemplateFiles.length > 0) {
        await processTemplateFiles(absoluteTargetDir, templateContext, allTemplateFiles);
        consola.success(`Processed ${allTemplateFiles.length} template file(s)`);
      } else {
        consola.info('  No template files to process');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createBuildError(
        `Failed to process template files: ${errorMessage}`,
        'TEMPLATE_PROCESSING_ERROR',
        1
      );
    }

    // Step 10: Generate final package.json from merged configuration
    consola.info('Generating package.json...');
    try {
      await generatePackageJson(absoluteTargetDir, mergedConfig, config);
      consola.success('package.json generated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createBuildError(
        `Failed to generate package.json: ${errorMessage}`,
        'PACKAGE_JSON_ERROR',
        1
      );
    }

    // Step 11: Generate final .env.example and .env from merged env vars
    consola.info('Generating environment files...');
    try {
      await generateEnvFile(absoluteTargetDir, mergedConfig.envVars);
      consola.success('Environment files generated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createBuildError(
        `Failed to generate environment files: ${errorMessage}`,
        'ENV_FILE_ERROR',
        1
      );
    }

    // Step 12: Conditionally install dependencies if user opted in
    let depsInstalled = false;
    if (config.installDeps) {
      try {
        depsInstalled = installDependencies(config.packageManager, absoluteTargetDir);
      } catch {
        // Dependency installation errors are already handled in installDependencies
        // Just log and continue
        consola.warn('Continuing with building despite dependency installation issues');
      }
    }

    // Step 13: Conditionally initialize git if user opted in
    if (config.initGit) {
      try {
        initializeGitRepository(absoluteTargetDir);
      } catch {
        // Git initialization errors are already handled in initializeGitRepository
        // Just log and continue
        consola.warn('Continuing with building despite git initialization issues');
      }
    }

    // Step 14: Generate next steps
    const nextSteps = generateNextSteps(config, depsInstalled);

    consola.success('Project building completed successfully!');

    return {
      success: true,
      projectPath: absoluteTargetDir,
      nextSteps,
    };
  } catch (error) {
    // Handle errors and provide meaningful messages
    if (isBuildError(error)) {
      throw error;
    }

    // Wrap unknown errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw createBuildError(`Building failed: ${errorMessage}`, 'BUILDING_ERROR', 1);
  }
}
