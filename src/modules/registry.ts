/**
 * Module registry implementation
 * Provides centralized access to all available modules (base, database, features)
 */

import path from 'path';
import fs from 'fs-extra';
import { ModuleConfig, Module, createBuildError } from '../types';

/**
 * Resolve the path to a module directory
 * @param id - Module ID
 * @returns Absolute path to the module directory
 */
function resolveModulePath(id: string) {
  if (id === 'express-base') {
    return path.join(__dirname, '../../templates/express-base');
  }
  return path.join(__dirname, `../../templates/modules/${id}`);
}

/**
 * Load and parse a module's config.json file
 * @param modulePath - Path to the module directory
 * @returns Promise resolving to the module configuration
 */
async function loadModuleConfig(modulePath: string): Promise<ModuleConfig> {
  const configPath = path.join(modulePath, 'config.json');

  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    // Type annotation provides runtime validation expectation
    const config = JSON.parse(configContent) as ModuleConfig;
    return config;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw createBuildError(
      `Failed to load module config from ${configPath}: ${errorMessage}`,
      'MODULE_CONFIG_ERROR'
    );
  }
}

/**
 * Get a module by ID tecnically its a name
 * @param id - Module ID ('express-base', 'prisma', 'mongoose', 'docker', 'auth')
 * @returns Promise resolving to the module with config and path
 * @throws Error if module is not found or config cannot be loaded
 */
export async function getModule(id: string): Promise<Module> {
  const modulePath = resolveModulePath(id);

  // Check if module directory exists
  const exists = await fs.pathExists(modulePath);

  if (!exists) {
    throw createBuildError(`Module not found: ${id}`, 'MODULE_NOT_FOUND');
  }

  // Load module configuration
  const config = await loadModuleConfig(modulePath);

  return {
    config,
    path: modulePath,
  };
}
