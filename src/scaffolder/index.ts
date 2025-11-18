/**
 * Scaffolder orchestration engine
 * Orchestrates the entire project scaffolding process
 */

import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import {
  ProjectConfig,
  ScaffoldResult,
  Module,
  createScaffoldError,
  isScaffoldError,
} from '../types';
import { validateDirectoryEmpty } from '../validators';
import { selectModules } from './moduleSelector';
import { getModule } from '../modules/registry';
import { mergeConfigurations, generatePackageJson, generateEnvFile } from './configGenerator';
import { copyModuleFiles, processTemplateFiles } from './fileProcessor';
import { installDependencies } from './dependencyInstaller';
import { initializeGitRepository } from './gitInitializer';
import { generateNextSteps } from '../output/nextSteps';
import { buildTemplateContext, TemplateContext } from './templateContext';

/**
 * Main scaffolding function
 * Orchestrates the entire project scaffolding process (14 steps)
 * @param config - Project configuration from prompts
 * @returns Promise resolving to scaffold result with success status and next steps
 */
export async function scaffold(config: ProjectConfig): Promise<ScaffoldResult> {
  const absoluteTargetDir = path.resolve(config.targetDir);

  console.log(chalk.blue('\n🚀 Starting project scaffolding...\n'));

  try {
    // Step 1: Validate target directory doesn't exist or is empty
    console.log(chalk.gray('Validating target directory...'));
    const validationResult = await validateDirectoryEmpty(absoluteTargetDir);

    if (validationResult) {
      throw createScaffoldError(validationResult, 'DIRECTORY_NOT_EMPTY', 1);
    }

    // Step 2: Create target directory
    console.log(chalk.gray('Creating project directory...'));
    try {
      await fs.ensureDir(absoluteTargetDir);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createScaffoldError(
        `Failed to create target directory: ${errorMessage}`,
        'DIRECTORY_CREATE_ERROR',
        1
      );
    }

    // Step 3: Select modules based on project configuration
    console.log(chalk.gray('Selecting modules...'));
    const moduleIds = selectModules(config);

    // Step 4: Load all selected modules
    console.log(chalk.gray('Loading module configurations...'));
    const modules: Module[] = [];
    try {
      for (const moduleId of moduleIds) {
        const module = await getModule(moduleId);
        modules.push(module);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createScaffoldError(
        `Failed to load modules: ${errorMessage}`,
        'MODULE_LOADING_ERROR',
        1
      );
    }

    console.log(
      chalk.green(
        `✓ Selected ${modules.length} modules: ${modules.map((m) => m.config.id).join(', ')}`
      )
    );

    // Step 5: Build template context from project configuration
    console.log(chalk.gray('Building template context...'));
    const templateContext: TemplateContext = buildTemplateContext(config);
    console.log(chalk.green('✓ Template context built'));

    // Step 6: Process script variables in module configurations
    console.log(chalk.gray('Processing script variables...'));
    // Script processing happens inside mergeConfigurations

    // Step 7: Merge configurations from all modules
    console.log(chalk.gray('Merging module configurations...'));
    const mergedConfig = mergeConfigurations(
      modules.map((m) => m.config),
      templateContext
    );

    // Step 8: Copy files from all selected modules to target directory
    console.log(chalk.gray('\nCopying module files...'));
    try {
      for (const module of modules) {
        console.log(chalk.gray(`  - Copying ${module.config.id}...`));
        await copyModuleFiles(module.path, absoluteTargetDir);
      }

      console.log(chalk.green('✓ Module files copied'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createScaffoldError(
        `Failed to copy module files: ${errorMessage}`,
        'FILE_COPY_ERROR',
        1
      );
    }

    // Step 9: Process .hbs template files with Handlebars
    console.log(chalk.gray('Processing template files...'));
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
        console.log(chalk.green(`✓ Processed ${allTemplateFiles.length} template file(s)`));
      } else {
        console.log(chalk.gray('  No template files to process'));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createScaffoldError(
        `Failed to process template files: ${errorMessage}`,
        'TEMPLATE_PROCESSING_ERROR',
        1
      );
    }

    // Step 10: Generate final package.json from merged configuration
    console.log(chalk.gray('\nGenerating package.json...'));
    try {
      await generatePackageJson(absoluteTargetDir, mergedConfig, config);
      console.log(chalk.green('✓ package.json generated'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createScaffoldError(
        `Failed to generate package.json: ${errorMessage}`,
        'PACKAGE_JSON_ERROR',
        1
      );
    }

    // Step 11: Generate final .env.example and .env from merged env vars
    console.log(chalk.gray('Generating environment files...'));
    try {
      await generateEnvFile(absoluteTargetDir, mergedConfig.envVars);
      console.log(chalk.green('✓ Environment files generated'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createScaffoldError(
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
      } catch (error) {
        // Dependency installation errors are already handled in installDependencies
        // Just log and continue
        console.log(
          chalk.yellow('⚠ Continuing with scaffolding despite dependency installation issues')
        );
      }
    }

    // Step 13: Conditionally initialize git if user opted in
    if (config.initGit) {
      try {
        initializeGitRepository(absoluteTargetDir);
      } catch (error) {
        // Git initialization errors are already handled in initializeGitRepository
        // Just log and continue
        console.log(
          chalk.yellow('⚠ Continuing with scaffolding despite git initialization issues')
        );
      }
    }

    // Step 14: Generate next steps
    const nextSteps = generateNextSteps(config, depsInstalled);

    console.log(chalk.green('\n✨ Project scaffolding completed successfully!\n'));

    return {
      success: true,
      projectPath: absoluteTargetDir,
      nextSteps,
    };
  } catch (error) {
    // Handle errors and provide meaningful messages
    if (isScaffoldError(error)) {
      throw error;
    }

    // Wrap unknown errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw createScaffoldError(`Scaffolding failed: ${errorMessage}`, 'SCAFFOLDING_ERROR', 1);
  }
}
