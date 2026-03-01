// Module registry for accessing base templates and feature modules
import fs from "fs-extra";
import path from "path";
import { z } from "zod";

import { buildError, ModuleConfig } from "../types";

const moduleConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["base", "database", "feature"]),
  dependencies: z.record(z.string(), z.string()).default({}),
  devDependencies: z.record(z.string(), z.string()).default({}),
  scripts: z.record(z.string(), z.string()).default({}),
  envVars: z.record(z.string(), z.string()).default({}),
  templateFiles: z.array(z.string()).default([]),
});

// Determines the absolute filesystem path for a given module ID
function resolveModulePath(id: string) {
  // Base templates: backend/express, frontend/nextjs
  if (id.startsWith("backend/") || id.startsWith("frontend/")) {
    return path.join(__dirname, `../../templates/${id}`);
  }
  // Compound module ids: auth/express, auth/nextjs, prisma/express, etc.
  if (id.includes("/")) {
    return path.join(__dirname, `../../templates/modules/${id}`);
  }
  // Simple module ids: docker, mongoose
  return path.join(__dirname, `../../templates/modules/${id}`);
}

// Reads and parses a module's config.json file
async function loadModuleConfig(modulePath: string): Promise<ModuleConfig> {
  const configPath = path.join(modulePath, "config.json");

  try {
    const configContent = await fs.readFile(configPath, "utf-8");
    const rawConfig = JSON.parse(configContent) as unknown;
    const config = moduleConfigSchema.parse(rawConfig);
    return config;
  } catch (error) {
    throw buildError(
      error,
      "MODULE_CONFIG_ERROR",
      `Failed to load module config from ${configPath}`
    );
  }
}

// Retrieves a module's path and configuration by its ID
export async function getModule(id: string) {
  const modulePath = resolveModulePath(id);

  // Check if module directory exists
  const exists = await fs.pathExists(modulePath);

  if (!exists) {
    throw buildError(`Module not found: ${id}`, "MODULE_NOT_FOUND");
  }

  // Load module configuration
  const config = await loadModuleConfig(modulePath);

  return {
    config,
    path: modulePath,
  };
}
