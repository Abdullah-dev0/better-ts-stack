// Utilities for merging module configurations and generating project files
import fs from "fs-extra";
import Handlebars from "handlebars";
import { randomBytes } from "node:crypto";
import path from "node:path";

import {
  buildError,
  Framework,
  MergedConfig,
  ModuleConfig,
  ProjectConfig,
  TemplateContext,
} from "../types";

// Frameworks whose generated project uses ES modules
const ESM_FRAMEWORKS: Framework[] = ["tanstack", "nestjs"];

// Compiled entry file of each backend framework
const BACKEND_ENTRY_FILES: Partial<Record<Framework, string>> = {
  express: "dist/index.js",
  nestjs: "dist/main.js",
};

// Replaces Handlebars variables within script command strings
export function processScriptVariables(
  scripts: Record<string, string>,
  context: TemplateContext
): Record<string, string> {
  const processedScripts: Record<string, string> = {};

  for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
    try {
      const template = Handlebars.compile(scriptCommand, { noEscape: true });
      processedScripts[scriptName] = template(context, {
        helpers: context.helpers,
      });
    } catch (error) {
      throw buildError(
        error,
        "TEMPLATE_SCRIPT_ERROR",
        `Failed to process script "${scriptName}"`
      );
    }
  }

  return processedScripts;
}

// Merges configurations from multiple modules, processing script variables
export function mergeConfigurations(
  modules: ModuleConfig[],
  context: TemplateContext
): MergedConfig {
  const merged: MergedConfig = {
    dependencies: {},
    devDependencies: {},
    overrides: {},
    scripts: {},
    envVars: {},
  };

  // Merge each module's configuration
  // Later modules override earlier ones
  for (const module of modules) {
    Object.assign(merged.dependencies, module.dependencies);
    Object.assign(merged.devDependencies, module.devDependencies);
    Object.assign(merged.overrides, module.overrides);
    Object.assign(
      merged.scripts,
      processScriptVariables(module.scripts, context)
    );
    Object.assign(merged.envVars, module.envVars);
  }

  return merged;
}

// Generates the final package.json file from the merged configuration
export async function generatePackageJson(
  targetDir: string,
  mergedConfig: MergedConfig,
  config: ProjectConfig
): Promise<void> {
  try {
    const isFullstack = config.applicationType === "fullstack";
    // In a monorepo the overrides go in the root package.json, where they work
    const overrides =
      !config.app && Object.keys(mergedConfig.overrides).length
        ? mergedConfig.overrides
        : undefined;
    const packageJson = {
      name: config.projectName,
      version: "1.0.0",
      private: true,
      engines: { node: ">=24.0.0" },
      description: `Project created with better-ts-stack using ${config.database !== "none" ? config.database : "no database"}`,
      ...(ESM_FRAMEWORKS.includes(config.framework) ? { type: "module" } : {}),
      ...(isFullstack ? {} : { main: BACKEND_ENTRY_FILES[config.framework] }),
      scripts: mergedConfig.scripts,
      keywords: isFullstack
        ? config.framework === "tanstack"
          ? ["tanstack-start", "react", "typescript"]
          : ["nextjs", "react", "typescript"]
        : ["backend", "typescript", config.framework],
      author: "",
      license: "MIT",
      dependencies: mergedConfig.dependencies,
      devDependencies: mergedConfig.devDependencies,
      overrides,
    };

    const packageJsonPath = path.join(targetDir, "package.json");
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n",
      "utf-8"
    );
  } catch (error) {
    throw buildError(
      error,
      "PACKAGE_JSON_ERROR",
      "Failed to generate package.json"
    );
  }
}

// Template dependencies with install scripts. pnpm 11+ fails the install when
// these are not approved; entries for packages a project lacks are ignored.
const PNPM_BUILD_DEPENDENCIES = [
  "@prisma/engines",
  "esbuild",
  "prisma",
  "unrs-resolver",
];

// Writes pnpm-workspace.yaml, where pnpm 11+ reads overrides and build approvals
// (it ignores the "pnpm" field in package.json)
export async function generatePnpmWorkspace(
  targetDir: string,
  overrides: Record<string, string>,
  // Workspace folders, for a monorepo
  packages: string[] = []
): Promise<void> {
  const lines: string[] = [];

  if (packages.length > 0) {
    lines.push("packages:");
    for (const folder of packages) lines.push(`  - "${folder}"`);
  }

  if (Object.keys(overrides).length > 0) {
    lines.push("overrides:");
    for (const [name, version] of Object.entries(overrides)) {
      lines.push(`  "${name}": "${version}"`);
    }
  }

  lines.push("allowBuilds:");
  for (const name of PNPM_BUILD_DEPENDENCIES) {
    lines.push(`  "${name}": true`);
  }

  // pnpm 10 reads build approvals from this key instead
  lines.push("onlyBuiltDependencies:");
  for (const name of PNPM_BUILD_DEPENDENCIES) {
    lines.push(`  - "${name}"`);
  }

  try {
    await fs.writeFile(
      path.join(targetDir, "pnpm-workspace.yaml"),
      lines.join("\n") + "\n",
      "utf-8"
    );
  } catch (error) {
    throw buildError(
      error,
      "PNPM_WORKSPACE_ERROR",
      "Failed to generate pnpm-workspace.yaml"
    );
  }
}

// Variables that get a random value in .env instead of the module's default
export const GENERATED_SECRETS = ["BETTER_AUTH_SECRET"];

// Name of the file that records how a project was generated
export const STACK_FILE = "better-ts-stack.json";

// Records the stack choices, so later commands (such as adding a module to the
// project) know what the project was generated with
export async function generateStackFile(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  try {
    const { version } = (await fs.readJson(
      path.join(__dirname, "../../package.json")
    )) as { version: string };
    const stack = {
      cliVersion: version,
      framework: config.framework,
      ...(config.monorepo && {
        monorepo: true,
        api: config.apiFramework,
        owner: config.owner,
      }),
      database: config.database,
      packageManager: config.packageManager,
      auth: config.useAuth,
      ai: config.ai,
      payments: config.payments,
      docker: config.useDocker,
      rateLimit: config.useRateLimit,
      ci: config.useCi,
      agents: config.useAgents,
      vscode: config.useVscode,
    };
    await fs.writeFile(
      path.join(targetDir, STACK_FILE),
      JSON.stringify(stack, null, 2) + "\n",
      "utf-8"
    );
  } catch (error) {
    throw buildError(
      error,
      "STACK_FILE_ERROR",
      `Failed to write ${STACK_FILE}`
    );
  }
}

// Generates .env and .env.example files from merged environment variables
export async function generateEnvFile(
  targetDir: string,
  envVars: Record<string, string>
): Promise<void> {
  try {
    // Build .env.example content with comments
    let envContent = "# Environment Variables\n";
    envContent +=
      "# Copy this file to .env and update with your actual values\n\n";

    let localEnvContent = "# Environment Variables\n";
    localEnvContent +=
      "# Local values for this project. Do not commit them\n\n";

    // Add each environment variable
    for (const [key, value] of Object.entries(envVars)) {
      const resolvedValue = GENERATED_SECRETS.includes(key)
        ? randomBytes(32).toString("hex")
        : value;
      envContent += `${key}=${value}\n`;
      localEnvContent += `${key}=${resolvedValue}\n`;
    }

    // Write .env.example
    const envExamplePath = path.join(targetDir, ".env.example");
    await fs.writeFile(envExamplePath, envContent, "utf-8");

    // Keep generated secrets out of the shareable example file.
    const envPath = path.join(targetDir, ".env");
    await fs.writeFile(envPath, localEnvContent, "utf-8");
  } catch (error) {
    throw buildError(
      error,
      "ENV_FILE_ERROR",
      "Failed to generate environment files"
    );
  }
}
