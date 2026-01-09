// Core type definitions for the CLI builder

// Supported package managers
export type PackageManager = 'npm' | 'pnpm' | 'bun';
// Supported database options
export type DatabaseOption = 'none' | 'prisma' | 'mongoose';

export type ApplicationType = 'frontend' | 'backend';

// Module classification types
export type ModuleType = 'base' | 'database' | 'feature';

// Package dependencies map
export interface Dependencies {
  [packageName: string]: string;
}

// Supported backend frameworks
export type BackendFramework = 'express' | 'hono' | 'nest';

// Supported frontend frameworks
export type FrontendFramework = 'react';

// Unified framework type
export type Framework = BackendFramework | FrontendFramework;

// Main configuration object for the build pipeline
export interface ProjectConfig {
  // Project basics
  projectName: string;
  applicationType: ApplicationType;
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

// Module configuration from config.json
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

// Represents a module with its config and file path
export interface Module {
  config: ModuleConfig;
  path: string;
}

// Combined configuration from multiple modules
export interface MergedConfig {
  dependencies: Dependencies;
  devDependencies: Dependencies;
  scripts: Record<string, string>;
  envVars: Record<string, string>;
}

// Result of the build operation
export interface BuildResult {
  success: boolean;
  projectPath: string;
  nextSteps: string[];
}

// Custom error for build failures
export interface BuildError extends Error {
  code: string;
  exitCode: number;
}

// Creates a new BuildError instance
export function createBuildError(message: string, code: string, exitCode: number = 1): BuildError {
  const error = new Error(message);
  return Object.assign(error, { code, exitCode });
}

// Checks if an error is a BuildError
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

// Variables and helpers available in Handlebars templates

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
