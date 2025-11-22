/**
 * Core type definitions for the CLI builder
 */

/**
 * Available package managers
 */
export type PackageManager = 'npm' | 'pnpm' | 'bun';

/**
 * Available database options
 */
export type DatabaseOption = 'none' | 'prisma' | 'mongoose';

export type applicationTypes = 'frontend' | 'backend';

/**
 * Module type classification
 */
export type ModuleType = 'base' | 'database' | 'feature';

/**
 * Package dependencies
 */
export interface Dependencies {
  [packageName: string]: string;
}

/**
 * Available backend frameworks
 */
export type BackendFramework = 'express' | 'hono' | 'nest';

/**
 * Available frontend frameworks
 */
export type FrontendFramework = 'react';

/**
 * Unified framework type
 */
export type Framework = BackendFramework | FrontendFramework;

/**
 * Single unified configuration object used throughout the building pipeline
 * Replaces: UserChoices, CompositionContext, NextStepsContext, GeneratorContext
 */
export interface ProjectConfig {
  // Project basics
  projectName: string;
  applicationType: applicationTypes;
  framework: Framework;
  database: DatabaseOption;
  useDocker: boolean;
  useAuth: boolean;
  // Tooling
  packageManager: PackageManager;

  // Post-build options
  initGit: boolean;
  installDeps: boolean;
}

/**
 * Module configuration loaded from config.json
 */
export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  type: ModuleType;
  dependencies: Dependencies;
  devDependencies: Dependencies;
  scripts: Record<string, string>;
  envVars: Record<string, string>;
  templateFiles: string[];
}

/**
 * Module with configuration and file path
 * Consolidates ModuleDefinition and Module types
 */
export interface Module {
  config: ModuleConfig;
  path: string;
}

/**
 * Merged configuration from all selected modules
 * Later modules override earlier ones in case of conflicts
 */
export interface MergedConfig {
  dependencies: Dependencies;
  devDependencies: Dependencies;
  scripts: Record<string, string>;
  envVars: Record<string, string>;
}

/**
 * Result of building operation
 */
export interface BuildResult {
  success: boolean;
  projectPath: string;
  nextSteps: string[];
}

/**
 * Custom error for building operations
 */
export interface BuildError extends Error {
  code: string;
  exitCode: number;
}

/**
 * Factory function to create BuildError instances
 * Uses Object.assign to avoid type assertions
 * @param message - Error message
 * @param code - Error code for categorization
 * @param exitCode - Process exit code (default: 1)
 * @returns BuildError object
 */
export function createBuildError(message: string, code: string, exitCode: number = 1): BuildError {
  const error = new Error(message);
  return Object.assign(error, { code, exitCode });
}

/**
 * Type guard to check if an error is a BuildError
 * @param error - Error to check
 * @returns true if error is a BuildError
 */
export function isBuildError(error: unknown): error is BuildError {
  return (
    error instanceof Error &&
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'exitCode' in error &&
    typeof (error as BuildError).code === 'string' &&
    typeof (error as BuildError).exitCode === 'number'
  );
}

/**
 * Template context interface containing all variables available in Handlebars templates
 *
 * @property projectName - Name of the project being built
 * @property packageManager - Package manager choice (npm, pnpm, or bun)
 * @property database - Database selection (none, prisma, or mongoose)
 * @property port - Port number for the application (defaults to 3000)
 * @property useDocker - Whether Docker support is enabled
 * @property useAuth - Whether authentication module is enabled
 * @property helpers - Helper functions available in templates for string transformations
 */

export interface TemplateContext {
  projectName: string;
  packageManager: string;
  database: string;
  port: number;
  useDocker: boolean;
  useAuth: boolean;
  helpers: {
    lowercase: (str: string) => string;
    uppercase: (str: string) => string;
    kebabCase: (str: string) => string;
  };
}
