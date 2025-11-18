/**
 * Configuration generation utilities
 * Handles merging module configurations and generating output files
 */

import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { ProjectConfig, MergedConfig, ModuleConfig, createScaffoldError } from '../types';
import { TemplateContext } from './templateContext';

/**
 * Process script variables using Handlebars template engine
 *
 * Replaces `{{variable}}` placeholders in package.json scripts with actual values
 * from the template context. This ensures scripts like `docker build -t {{projectName}}`
 * are properly rendered before being merged into the final package.json.
 *
 * @param scripts - Record of script names to script commands (may contain {{variables}})
 * @param context - Template context with all available variables
 * @returns Record of script names to processed script commands (variables replaced)
 * @throws {ScaffoldError} If template compilation fails or undefined variables are encountered
 * @example
 * ```typescript
 * const scripts = {
 *   'docker:build': 'docker build -t {{projectName}} .',
 *   'start': 'node dist/index.js'
 * };
 * const context = { projectName: 'my-app', ... };
 * const processed = processScriptVariables(scripts, context);
 * // processed['docker:build'] === 'docker build -t my-app .'
 * // processed['start'] === 'node dist/index.js' (unchanged)
 * ```
 */
export function processScriptVariables(
  scripts: Record<string, string>,
  context: TemplateContext
): Record<string, string> {
  const processedScripts: Record<string, string> = {};

  for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
    try {
      // Check if script contains variables ({{...}})
      if (scriptCommand.includes('{{')) {
        // Compile and render the script as a Handlebars template
        const template = Handlebars.compile(scriptCommand, { strict: true });
        processedScripts[scriptName] = template(context);
      } else {
        // No variables, pass through unchanged
        processedScripts[scriptName] = scriptCommand;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw createScaffoldError(
        `Failed to process script "${scriptName}": ${errorMessage}`,
        'TEMPLATE_SCRIPT_ERROR'
      );
    }
  }

  return processedScripts;
}

/**
 * Merge configurations from multiple modules
 * Later modules override earlier ones in case of conflicts
 *
 * Processes script variables using Handlebars before merging to ensure
 * all {{variable}} placeholders are replaced with actual values from the
 * template context. This prevents literal placeholders from appearing in
 * the final package.json.
 *
 * @param modules - Array of module configurations to merge
 * @param context - Template context with all available variables for script processing
 * @returns Merged configuration with all script variables processed
 */
export function mergeConfigurations(
  modules: ModuleConfig[],
  context: TemplateContext
): MergedConfig {
  const merged: MergedConfig = {
    dependencies: {},
    devDependencies: {},
    scripts: {},
    envVars: {},
  };

  // Merge each module's configuration
  // Later modules override earlier ones
  for (const module of modules) {
    // Merge dependencies
    if (module.dependencies) {
      Object.assign(merged.dependencies, module.dependencies);
    }

    // Merge devDependencies
    if (module.devDependencies) {
      Object.assign(merged.devDependencies, module.devDependencies);
    }

    // Merge scripts - process variables before merging
    if (module.scripts) {
      const processedScripts = processScriptVariables(module.scripts, context);
      Object.assign(merged.scripts, processedScripts);
    }

    // Merge environment variables
    if (module.envVars) {
      Object.assign(merged.envVars, module.envVars);
    }
  }

  return merged;
}

/**
 * Generate package.json file from merged configuration
 * @param targetDir - Target directory for the package.json file
 * @param mergedConfig - Merged configuration from all modules
 * @param config - Project configuration with project information
 */
export async function generatePackageJson(
  targetDir: string,
  mergedConfig: MergedConfig,
  config: ProjectConfig
): Promise<void> {
  try {
    const packageJson = {
      name: config.projectName,
      version: '1.0.0',
      description: `Backend project created with better-ts-stack`,
      main: 'dist/index.js',
      scripts: mergedConfig.scripts,
      keywords: ['backend', 'typescript', 'express'],
      author: '',
      license: 'MIT',
      dependencies: mergedConfig.dependencies,
      devDependencies: mergedConfig.devDependencies,
    };

    const packageJsonPath = path.join(targetDir, 'package.json');
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw createScaffoldError(
      `Failed to generate package.json: ${errorMessage}`,
      'PACKAGE_JSON_ERROR'
    );
  }
}

/**
 * Generate environment files (.env.example and .env) from merged environment variables
 * @param targetDir - Target directory for the environment files
 * @param envVars - Environment variables from merged configuration
 */
export async function generateEnvFile(
  targetDir: string,
  envVars: Record<string, string>
): Promise<void> {
  try {
    // Build .env.example content with comments
    let envContent = '# Environment Variables\n';
    envContent += '# Copy this file to .env and update with your actual values\n\n';

    // Add each environment variable
    for (const [key, value] of Object.entries(envVars)) {
      envContent += `${key}=${value}\n`;
    }

    // Write .env.example
    const envExamplePath = path.join(targetDir, '.env.example');
    await fs.writeFile(envExamplePath, envContent, 'utf-8');

    // Copy .env.example to .env
    const envPath = path.join(targetDir, '.env');
    await fs.copy(envExamplePath, envPath);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw createScaffoldError(
      `Failed to generate environment files: ${errorMessage}`,
      'ENV_FILE_ERROR'
    );
  }
}
