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

// Helper to wrap errors with build context
const wrapError = (error: unknown, message: string, code: string) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  throw createBuildError(`${message}: ${errorMessage}`, code, 1);
};

// Main function to orchestrate the project construction process
export async function build(config: ProjectConfig, targetDir: string): Promise<BuildResult> {
  consola.start('Starting project building...');

  try {
    // 1. Validate target directory
    consola.info('Validating target directory...');
    const validationResult = await validateDirectoryEmpty(targetDir);
    if (validationResult) throw createBuildError(validationResult, 'DIRECTORY_NOT_EMPTY', 1);

    // 2. Create target directory
    consola.info('Creating project directory...');
    await fs
      .ensureDir(targetDir)
      .catch((e) => wrapError(e, 'Failed to create directory', 'DIRECTORY_CREATE_ERROR'));

    // 3. Select modules
    consola.info('Selecting modules...');
    const selection = selectModules(config);

    // 4. Load modules
    consola.info('Loading module configurations...');
    const modules: Module[] = [];
    try {
      modules.push(await getModule(selection.base));
      for (const moduleId of selection.modules) {
        modules.push(await getModule(moduleId));
      }
    } catch (e) {
      wrapError(e, 'Failed to load modules', 'MODULE_LOADING_ERROR');
    }
    consola.success(
      `Selected ${modules.length} modules: ${modules.map((m) => m.config.id).join(', ')}`
    );

    // 5. Build template context
    consola.info('Building template context...');
    const templateContext = buildTemplateContext(config);

    // 6. Merge configurations
    const mergedConfig = mergeConfigurations(
      modules.map((m) => m.config),
      templateContext
    );

    // 7. Copy module files
    consola.info('Copying module files...');
    try {
      for (const module of modules) {
        consola.debug(`  - Copying ${module.config.id}...`);
        await copyModuleFiles(module.path, targetDir);
      }
      consola.success('Module files copied');
    } catch (e) {
      wrapError(e, 'Failed to copy module files', 'FILE_COPY_ERROR');
    }

    // 8. Process Handlebars templates
    consola.info('Processing template files...');
    try {
      const allTemplateFiles = modules.flatMap((m) => m.config.templateFiles || []);
      if (allTemplateFiles.length > 0) {
        await processTemplateFiles(targetDir, templateContext, allTemplateFiles);
        consola.success(`Processed ${allTemplateFiles.length} template file(s)`);
      } else {
        consola.info('  No template files to process');
      }
    } catch (e) {
      wrapError(e, 'Failed to process template files', 'TEMPLATE_PROCESSING_ERROR');
    }

    // 9. Generate package.json
    consola.info('Generating package.json...');
    await generatePackageJson(targetDir, mergedConfig, config).catch((e) =>
      wrapError(e, 'Failed to generate package.json', 'PACKAGE_JSON_ERROR')
    );
    consola.success('package.json generated');

    // 10. Generate environment files
    consola.info('Generating environment files...');
    await generateEnvFile(targetDir, mergedConfig.envVars).catch((e) =>
      wrapError(e, 'Failed to generate environment files', 'ENV_FILE_ERROR')
    );
    consola.success('Environment files generated');

    // 11. Install dependencies (optional)
    let depsInstalled = false;
    if (config.installDeps) {
      try {
        depsInstalled = installDependencies(config.packageManager, targetDir);
      } catch {
        consola.warn('Continuing despite dependency installation issues');
      }
    }

    // 12. Initialize git (optional)
    if (config.initGit) {
      try {
        initializeGitRepository(targetDir);
      } catch {
        consola.warn('Continuing despite git initialization issues');
      }
    }

    // 13. Done!
    consola.success('Project building completed successfully!');

    return {
      success: true,
      projectPath: targetDir,
      nextSteps: generateNextSteps(config, depsInstalled),
    };
  } catch (error) {
    if (isBuildError(error)) throw error;
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw createBuildError(`Building failed: ${errorMessage}`, 'BUILDING_ERROR', 1);
  }
}
