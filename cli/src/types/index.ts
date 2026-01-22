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
export type BackendFramework = 'express' | 'hono';

// Main configuration object for the build pipeline
export interface ProjectConfig {
  // Project basics
  projectName: string;
  applicationType: ApplicationType;
  framework: BackendFramework;
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

// Unified error creation function
export function buildError(
  errorOrMessage: unknown,
  code: string,
  context?: string,
  exitCode: number = 1
): BuildError {
  const message = errorOrMessage instanceof Error ? errorOrMessage.message : String(errorOrMessage);
  const fullMessage = context ? `${context}: ${message}` : message;
  const error = new Error(fullMessage);
  return Object.assign(error, { code, exitCode });
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

// Type-safe option definitions
export const applicationTypeOptions = [
  { value: 'backend' as const, label: 'Backend' },
  { value: 'frontend' as const, label: 'Frontend', hint: '(Coming Soon)' },
];

export const frameworkOptions = [
  { value: 'express' as const, label: 'Express' },
  { value: 'hono' as const, label: 'Hono', hint: '(Coming Soon)' },
];

export const databaseOptions = [
  { value: 'none' as const, label: 'None (Skip database setup)' },
  { value: 'prisma' as const, label: 'Prisma (Type-safe ORM)' },
  { value: 'mongoose' as const, label: 'Mongoose (Standard MongoDB ODM)' },
];

export const packageManagerOptions = [
  { value: 'npm' as const, label: 'npm' },
  { value: 'pnpm' as const, label: 'pnpm' },
  { value: 'bun' as const, label: 'bun' },
];

export const authOptions = [
  { value: false as const, label: 'No' },
  { value: true as const, label: 'Yes' },
];
