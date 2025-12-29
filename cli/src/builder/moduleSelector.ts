import { ProjectConfig } from '../types';

/**
 * Select which modules to include based on project configuration
 * Returns an object with base template path and additional module IDs
 *
 * @param config - Project configuration from prompts
 * @returns Object containing base template path and array of additional module IDs
 */
export function selectModules(config: ProjectConfig): {
  base: string;
  modules: string[];
} {
  // Select base framework based on application type and framework choice
  const base =
    config.applicationType === 'backend'
      ? `backend/${config.framework}`
      : `frontend/${config.framework}`;

  const modules: string[] = [];

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

  return { base, modules };
}
