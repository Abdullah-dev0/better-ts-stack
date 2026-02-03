// Utilities for merging module configurations and generating project files
import fs from "fs-extra";
import Handlebars from "handlebars";
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
  const helpers = {
    ...context.helpers,
  };

  const processedScripts: Record<string, string> = {};

  for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
    try {
      const template = Handlebars.compile(scriptCommand, { noEscape: true });
      processedScripts[scriptName] = template(context, { helpers });
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
    scripts: {},
    envVars: {},
  };

  // Merge each module's configuration
  // Later modules override earlier ones
  for (const module of modules) {
    // Merge dependencies
    if (module.dependencies) {
      Object.assign(merged.dependencies, module.dependencies);
    }

    // Merge devDependencies
    if (module.devDependencies) {
      Object.assign(merged.devDependencies, module.devDependencies);
    }

    // Merge scripts - process variables before merging
    if (module.scripts) {
      const processedScripts = processScriptVariables(module.scripts, context);
      Object.assign(merged.scripts, processedScripts);
    }

    // Merge environment variables
    if (module.envVars) {
      Object.assign(merged.envVars, module.envVars);
    }
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
    const packageJson = {
      name: config.projectName,
      version: "1.0.0",
      description: `Project created with better-ts-stack using ${config.database !== "none" ? config.database : "no database"}`,
      main: "dist/index.js",
      scripts: mergedConfig.scripts,
      keywords: ["backend", "typescript", "express"],
      author: "",
      license: "MIT",
      dependencies: mergedConfig.dependencies,
      devDependencies: mergedConfig.devDependencies,
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

    // Add each environment variable
    for (const [key, value] of Object.entries(envVars)) {
      envContent += `${key}=${value}\n`;
    }

    // Write .env.example
    const envExamplePath = path.join(targetDir, ".env.example");
    await fs.writeFile(envExamplePath, envContent, "utf-8");

    // Copy .env.example to .env
    const envPath = path.join(targetDir, ".env");
    await fs.copy(envExamplePath, envPath);
  } catch (error) {
    throw buildError(
      error,
      "ENV_FILE_ERROR",
      "Failed to generate environment files"
    );
  }
}
