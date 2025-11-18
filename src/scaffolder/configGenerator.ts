/**
 * Configuration generation utilities
 * Handles merging module configurations and generating output files
 */

import fs from 'fs-extra';
import path from 'path';
import { ProjectConfig, MergedConfig, ModuleConfig, createScaffoldError } from '../types';

/**
 * Merge configurations from multiple modules
 * Later modules override earlier ones in case of conflicts
 * @param modules - Array of module configurations to merge
 * @returns Merged configuration
 */
export function mergeConfigurations(modules: ModuleConfig[]): MergedConfig {
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

    // Merge scripts
    if (module.scripts) {
      Object.assign(merged.scripts, module.scripts);
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
