/**
 * Module registry implementation
 * Provides centralized access to all available modules (base, database, features)
 */

import path from 'path';
import fs from 'fs-extra';
import { ModuleConfig, Module, createBuildError } from '../types';

/**
 * Resolve the path to a module directory
 * Supports both base templates (e.g., 'backend/express') and modules (e.g., 'prisma')
 * @param id - Module ID or path (e.g., 'backend/express', 'prisma', 'docker')
 * @returns Absolute path to the module directory
 */
function resolveModulePath(id: string) {
  // If id contains a slash, it's a base template path like 'backend/express'
  if (id.includes('/')) {
    return path.join(__dirname, `../../templates/${id}`);
  }
  // Otherwise, it's a module in templates/modules/
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
 * @param id - Module ID ('express', 'prisma', 'mongoose', 'docker', 'auth')
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
