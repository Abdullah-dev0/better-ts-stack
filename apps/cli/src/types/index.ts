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

// SDK behind the AI chat endpoint (and page, on Next.js and TanStack Start)
export type AiSdk = "none" | "vercel" | "tanstack";

// Subscriptions through a Better Auth plugin; needs auth and a database
export type Payments = "none" | "polar" | "stripe";

// The monorepo app that owns users and data: it runs Better Auth, holds the
// database, and serves the AI chat route; the other app reaches it over HTTP
export type DataOwner = "web" | "api";

// The api of a monorepo; "none" leaves the web app on its own
export type ApiFramework = BackendFramework | "none";

// What the monorepo builder sets on the config of each of its two apps
export interface MonorepoApp {
  role: "web" | "api";
  // Runs auth, the database, and the AI chat route
  isOwner: boolean;
  // .env values that differ from the modules' defaults (ports, URLs)
  envOverrides: Record<string, string>;
}

// Main configuration object for the build pipeline
export interface ProjectConfig {
  // Project basics
  projectName: string;
  applicationType: ApplicationType;
  framework: Framework;

  database: Database;
  useDocker: boolean;
  useAuth: boolean;
  ai: AiSdk;
  payments: Payments;
  // Express and NestJS only; Better Auth limits its own endpoints
  useRateLimit: boolean;
  useCi: boolean;
  // AGENTS.md and CLAUDE.md for AI coding agents
  useAgents: boolean;
  // .vscode/settings.json and extensions.json
  useVscode: boolean;

  // Turborepo with apps/web (framework) and apps/api (apiFramework)
  monorepo: boolean;
  apiFramework: ApiFramework;
  owner: DataOwner;
  // Set on the two app configs a monorepo build creates, never by the user
  app?: MonorepoApp;

  // Tooling
  packageManager: PackageManager;

  // Post-build options
  initGit: boolean;
  installDeps: boolean;
}

// Stack options that can come from CLI flags or prompts
export type StackChoices = Omit<
  ProjectConfig,
  "projectName" | "applicationType" | "app"
>;

// Used for every choice not given as a flag when --yes is passed
export const DEFAULT_CHOICES: StackChoices = {
  framework: "express",
  database: "none",
  useDocker: false,
  useAuth: false,
  ai: "none",
  payments: "none",
  useRateLimit: false,
  useCi: false,
  useAgents: true,
  useVscode: false,
  monorepo: false,
  apiFramework: "express",
  owner: "web",
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

// What a build would produce, as shown by --dry-run
export interface BuildPlan extends MergedConfig {
  // Paths relative to the project directory
  files: string[];
  // Commands run after the files are written
  commands: string[];
}

// Result of the build operation
export interface BuildResult {
  projectPath: string;
  nextSteps: string[];
}

// Custom error for build failures
export interface BuildError extends Error {
  code: string;
}

// Unified error creation function
export function buildError(
  errorOrMessage: unknown,
  code: string,
  context?: string
): BuildError {
  const message =
    errorOrMessage instanceof Error
      ? errorOrMessage.message
      : String(errorOrMessage);
  const fullMessage = context ? `${context}: ${message}` : message;
  const error = new Error(fullMessage);
  return Object.assign(error, { code });
}

// True for errors created by buildError(), whose message is meant for the user
export function isBuildError(error: unknown): error is BuildError {
  return error instanceof Error && "code" in error;
}

// Variables and helpers available in Handlebars templates

// Package manager commands the Dockerfile runs
export interface DockerCommands {
  // Dockerfile lines that make the package manager available, or ""
  setup: string;
  // Files copied before the install: package.json, lockfile, workspace file
  manifests: string;
  install: string;
  // Installs production dependencies only
  installProduction: string;
  // Removes the download cache so it does not ship in the image
  cleanCache: string;
  // Prefix for package.json scripts: "npm run", "pnpm run", "bun run"
  run: string;
}

export interface TemplateContext {
  projectName: string;
  packageManager: string;
  database: string;
  framework: string;
  port: number;
  useDocker: boolean;
  useAuth: boolean;
  ai: string;
  useAi: boolean;
  payments: string;
  useRateLimit: boolean;
  useCi: boolean;
  // Monorepo web app: unknown /api/* requests go to the api
  useProxy: boolean;
  // Monorepo app that checks sessions with the app running Better Auth
  useRemoteAuth: boolean;
  // The api of a monorepo, which only the web app's proxy calls
  isMonorepoApi: boolean;
  docker: DockerCommands;
  // Variables the CI build step sets
  ciBuildEnv: { name: string; value: string }[];
  helpers: {
    eq: (a: string, b: string) => boolean;
    // {{#if (or a b)}}
    or: (...args: unknown[]) => boolean;
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
    hint: "Vite and React",
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

export const aiOptions = [
  { value: "none" as const, label: "None" },
  { value: "vercel" as const, label: "Vercel AI SDK" },
  { value: "tanstack" as const, label: "TanStack AI" },
];

export const paymentsOptions = [
  { value: "none" as const, label: "None" },
  {
    value: "polar" as const,
    label: "Polar",
    hint: "handles sales tax for you",
  },
  { value: "stripe" as const, label: "Stripe" },
];

export const ownerOptions = [
  {
    value: "web" as const,
    label: "The web app",
    hint: "easiest: pages read the session and the database in-process",
  },
  {
    value: "api" as const,
    label: "The api",
    hint: "one server for users, data, and business logic; the web app reaches it through a proxy",
  },
];

export const apiFrameworkOptions = [
  ...backendFrameworkOptions,
  {
    value: "none" as const,
    label: "None",
    hint: "the web app runs everything",
  },
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
