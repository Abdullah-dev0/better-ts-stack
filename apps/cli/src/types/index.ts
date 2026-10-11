// Core type definitions for the CLI builder

// Supported package managers
export type PackageManager = "npm" | "pnpm" | "bun";

// Database layer; each ORM/ODM implies its database (Mongoose: MongoDB, others: PostgreSQL)
export type Database = "none" | "prisma" | "drizzle" | "mongoose";

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
export type FrontendFramework = "nextjs" | "tanstack";

export type Framework = BackendFramework | FrontendFramework;

// Main configuration object for the build pipeline
export interface ProjectConfig {
  // Project basics
  projectName: string;
  applicationType: ApplicationType;
  framework: Framework;

  database: Database;
  useDocker: boolean;
  useAuth: boolean;

  // Tooling
  packageManager: PackageManager;

  // Post-build options
  initGit: boolean;
  installDeps: boolean;
}

// Stack options that can come from CLI flags or prompts
export type StackChoices = Omit<
  ProjectConfig,
  "projectName" | "applicationType"
>;

// Used for every choice not given as a flag when --yes is passed
export const DEFAULT_CHOICES: StackChoices = {
  framework: "express",
  database: "none",
  useDocker: false,
  useAuth: false,
  packageManager: "npm",
  initGit: true,
  installDeps: false,
};

// Port the generated server listens on
export const DEFAULT_PORT = 3000;

// Module configuration from config.json
export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  type: ModuleType;
  dependencies: Dependencies;
  devDependencies: Dependencies;
  overrides: Dependencies;
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
  overrides: Dependencies;
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
    eq: (a: string, b: string) => boolean;
    runner: () => string;
  };
}

// Type-safe option definitions
export const applicationTypeOptions = [
  {
    value: "backend" as const,
    label: "Backend API",
    hint: "Express or NestJS",
  },
  {
    value: "fullstack" as const,
    label: "Full-stack app",
    hint: "Next.js or TanStack Start",
  },
];

export const backendFrameworkOptions = [
  { value: "express" as const, label: "Express" },
  { value: "nestjs" as const, label: "NestJS" },
];

export const frontendFrameworkOptions = [
  { value: "nextjs" as const, label: "Next.js 16", hint: "App Router" },
  {
    value: "tanstack" as const,
    label: "TanStack Start",
    hint: "React, release candidate",
  },
];

// Database system options; the ORM is chosen in a second step
export const databaseSystemOptions = [
  { value: "none" as const, label: "None", hint: "skip database setup" },
  { value: "mongodb" as const, label: "MongoDB" },
  { value: "postgresql" as const, label: "PostgreSQL" },
];

// ORM options for MongoDB
export const mongodbOrmOptions = [
  { value: "mongoose" as const, label: "Mongoose", hint: "MongoDB ODM" },
];

// ORM options for PostgreSQL
export const postgresqlOrmOptions = [
  { value: "prisma" as const, label: "Prisma", hint: "type-safe ORM" },
  { value: "drizzle" as const, label: "Drizzle", hint: "lightweight ORM" },
];

export const packageManagerOptions = [
  { value: "npm" as const, label: "npm" },
  { value: "pnpm" as const, label: "pnpm" },
  { value: "bun" as const, label: "bun" },
];

// Backend frameworks produce an API server, the others a full-stack app
export function getApplicationType(framework: Framework): ApplicationType {
  return backendFrameworkOptions.some((option) => option.value === framework)
    ? "backend"
    : "fullstack";
}
