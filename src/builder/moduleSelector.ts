/**
 * Module selection logic
 * Determines which modules to include based on project configuration
 */

import { ProjectConfig } from '../types';

/**
 * Select which modules to include based on project configuration
 * @param config - Project configuration from prompts
 * @returns Array of module IDs to include
 */
export function selectModules(config: ProjectConfig): string[] {
  const modules = ['express-base']; // Always include base

  // Add database module if selected
  if (config.database !== 'none') {
    modules.push(config.database);
  }

  // Add feature modules based on configuration
  if (config.useDocker) {
    modules.push('docker');
  }

  if (config.useAuth) {
    modules.push('auth');
  }

  return modules;
}
