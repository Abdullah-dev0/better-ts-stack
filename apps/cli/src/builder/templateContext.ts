// Context builder for Handlebars, providing variables and helpers for templates
import { ProjectConfig } from "../types";

// Converts string to lowercase
export function lowercase(str: string): string {
  return str.toLowerCase();
}

// Converts string to uppercase
export function uppercase(str: string): string {
  return str.toUpperCase();
}

// Converts string to kebab-case
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase to kebab-case
    .replace(/[\s_]+/g, "-") // spaces and underscores to hyphens
    .toLowerCase();
}

export function buildTemplateContext(config: ProjectConfig) {
  const framework =
    config.applicationType === "backend" ? config.framework : "nextjs";
  return {
    projectName: config.projectName,
    packageManager: config.packageManager,
    database: config.database ?? "none",
    framework,
    port: 3000, // Default port
    useDocker: config.useDocker ?? false,
    useAuth: config.useAuth,
    helpers: {
      lowercase,
      uppercase,
      kebabCase,
      eq: (a: string, b: string) => a === b,
      runner: () => {
        if (config.packageManager === "bun") return "bun";
        if (config.packageManager === "pnpm") return "pnpm";
        return "node";
      },
    },
  };
}
