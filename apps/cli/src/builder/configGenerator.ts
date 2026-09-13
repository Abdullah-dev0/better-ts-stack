// Utilities for merging module configurations and generating project files
import fs from "fs-extra";
import Handlebars from "handlebars";
import { randomBytes } from "node:crypto";
import path from "path";

import {
  buildError,
  MergedConfig,
  ModuleConfig,
  ProjectConfig,
  TemplateContext,
} from "../types";

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
    const overrides = Object.keys(mergedConfig.overrides).length
      ? mergedConfig.overrides
      : undefined;
    const packageJson = {
      name: config.projectName,
      version: "1.0.0",
      private: true,
      engines: { node: ">=24.0.0" },
      description: `Project created with better-ts-stack using ${config.database !== "none" ? config.database : "no database"}`,
      ...(isFullstack ? {} : { main: "dist/index.js" }),
      scripts: mergedConfig.scripts,
      keywords: isFullstack
        ? ["nextjs", "react", "typescript"]
        : ["backend", "typescript", "express"],
      author: "",
      license: "MIT",
      dependencies: mergedConfig.dependencies,
      devDependencies: mergedConfig.devDependencies,
      overrides,
      pnpm:
        config.packageManager === "pnpm" && overrides
          ? { overrides }
          : undefined,
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

    let localEnvContent = envContent;

    // Add each environment variable
    for (const [key, value] of Object.entries(envVars)) {
      const resolvedValue = ["JWT_SECRET", "BETTER_AUTH_SECRET"].includes(key)
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
