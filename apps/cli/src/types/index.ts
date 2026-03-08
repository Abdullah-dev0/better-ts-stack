// Core type definitions for the CLI builder

// Supported package managers
export type PackageManager = "npm" | "pnpm" | "bun";

// Database type (what database system to use)
export type DatabaseType = "mongodb" | "postgresql" | "none";

// ORM/ODM options
export type OrmOption = "prisma" | "mongoose" | "drizzle" | "none";

// Legacy: kept for backward compatibility, will be derived from databaseType + orm
export type DatabaseOption = "none" | "prisma" | "mongoose" | "drizzle";

export type ApplicationType = "backend" | "fullstack";

// Module classification types
export type ModuleType = "base" | "database" | "feature";

// Package dependencies map
export interface Dependencies {
  [packageName: string]: string;
}

// Supported backend frameworks
export type BackendFramework = "express" | "nestjs";

// Supported frontend frameworks
export type FrontendFramework = "nextjs";

// Main configuration object for the build pipeline
export interface ProjectConfig {
  // Project basics
  projectName: string;
  applicationType: ApplicationType;
  framework: BackendFramework | FrontendFramework;

  // Database configuration
  databaseType: DatabaseType;
  orm: OrmOption;
  database: DatabaseOption; // Derived from databaseType + orm for backward compatibility

  useDocker: boolean;
  useAuth: boolean;

  // Tooling
  packageManager: PackageManager;

  // Post-build options
  initGit: boolean;
  installDeps: boolean;
}

/**
 * Shared type for prompt choices (used by both frontend and backend collectors).
 * This is essentially ProjectConfig without the derived/initial fields.
 */
export type PromptChoices = Omit<
  ProjectConfig,
  "projectName" | "applicationType" | "database"
>;

/** Type guard to validate OrmOption values */
export function isValidOrmOption(value: unknown): value is OrmOption {
  return (
    value === "prisma" ||
    value === "mongoose" ||
    value === "drizzle" ||
    value === "none"
  );
}

/**
 * Derives the database option from database type and ORM selection.
 * Returns "none" if either is "none", otherwise returns the ORM which
 * must be a valid DatabaseOption (prisma, mongoose, or drizzle).
 */
export function deriveDatabase(
  databaseType: DatabaseType,
  orm: OrmOption
): DatabaseOption {
  if (databaseType === "none" || orm === "none") {
    return "none";
  }
  // At this point, orm must be one of: prisma, mongoose, drizzle
  // which are all valid DatabaseOption values
  return orm;
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
  const message =
    errorOrMessage instanceof Error
      ? errorOrMessage.message
      : String(errorOrMessage);
  const fullMessage = context ? `${context}: ${message}` : message;
  const error = new Error(fullMessage);
  return Object.assign(error, { code, exitCode });
}

// Variables and helpers available in Handlebars templates

export interface TemplateContext {
  projectName: string;
  packageManager: string;
  database: string;
  framework: string;
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
  { value: "backend" as const, label: "Backend API (Express/NestJS)" },
  { value: "fullstack" as const, label: "Full-stack App (Next.js)" },
];

export const backendFrameworkOptions = [
  { value: "express" as const, label: "Express" },
  { value: "nestjs" as const, label: "NestJS", hint: "(Coming Soon)" },
];

export const frontendFrameworkOptions = [
  { value: "nextjs" as const, label: "Next.js 16 (App Router)" },
];

// Database type options (what database system)
export const databaseTypeOptions = [
  { value: "none" as const, label: "None (Skip database setup)" },
  { value: "mongodb" as const, label: "MongoDB" },
  { value: "postgresql" as const, label: "PostgreSQL" },
];

// ORM options for MongoDB
export const mongodbOrmOptions = [
  { value: "prisma" as const, label: "Prisma (Type-safe ORM)" },
  { value: "mongoose" as const, label: "Mongoose (MongoDB ODM)" },
];

// ORM options for PostgreSQL
export const postgresqlOrmOptions = [
  { value: "prisma" as const, label: "Prisma (Type-safe ORM)" },
  { value: "drizzle" as const, label: "Drizzle (Lightweight ORM)" },
];

// Legacy database options (for backward compatibility)
export const databaseOptions = [
  { value: "none" as const, label: "None (Skip database setup)" },
  { value: "prisma" as const, label: "Prisma (Type-safe ORM)" },
  { value: "mongoose" as const, label: "Mongoose (Standard MongoDB ODM)" },
  { value: "drizzle" as const, label: "Drizzle (Lightweight ORM)" },
];

export const packageManagerOptions = [
  { value: "npm" as const, label: "npm" },
  { value: "pnpm" as const, label: "pnpm" },
  { value: "bun" as const, label: "bun" },
];

export const authOptions = [
  { value: false as const, label: "No" },
  { value: true as const, label: "Yes" },
];
