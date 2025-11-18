/**
 * Core type definitions for the CLI scaffolder
 */

/**
 * Available package managers
 */
export type PackageManager = 'npm' | 'pnpm' | 'bun';

/**
 * Available database options
 */
export type DatabaseOption = 'none' | 'prisma' | 'mongoose';

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
 * Single unified configuration object used throughout the scaffolding pipeline
 * Replaces: UserChoices, CompositionContext, NextStepsContext, GeneratorContext
 */
export interface ProjectConfig {
  // Project basics
  projectName: string;
  targetDir: string;

  // Module selection
  database: DatabaseOption;
  useDocker: boolean;
  useAuth: boolean;

  // Tooling
  packageManager: PackageManager;

  // Post-scaffold options
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
 * Result of scaffolding operation
 */
export interface ScaffoldResult {
  success: boolean;
  projectPath: string;
  nextSteps: string[];
}

/**
 * Custom error for scaffolding operations
 */
export interface ScaffoldError extends Error {
  code: string;
  exitCode: number;
}

/**
 * Factory function to create ScaffoldError instances
 * Uses Object.assign to avoid type assertions
 * @param message - Error message
 * @param code - Error code for categorization
 * @param exitCode - Process exit code (default: 1)
 * @returns ScaffoldError object
 */
export function createScaffoldError(
  message: string,
  code: string,
  exitCode: number = 1
): ScaffoldError {
  const error = new Error(message);
  return Object.assign(error, { code, exitCode });
}

/**
 * Type guard to check if an error is a ScaffoldError
 * @param error - Error to check
 * @returns true if error is a ScaffoldError
 */
export function isScaffoldError(error: unknown): error is ScaffoldError {
  return (
    error instanceof Error &&
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'exitCode' in error &&
    typeof (error as ScaffoldError).code === 'string' &&
    typeof (error as ScaffoldError).exitCode === 'number'
  );
}
