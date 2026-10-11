// Context builder for Handlebars, providing variables and helpers for templates
import { DEFAULT_PORT, ProjectConfig, TemplateContext } from "../types";

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

export function buildTemplateContext(config: ProjectConfig): TemplateContext {
  return {
    projectName: config.projectName,
    packageManager: config.packageManager,
    database: config.database,
    framework: config.framework,
    port: DEFAULT_PORT,
    useDocker: config.useDocker,
    useAuth: config.useAuth,
    helpers: {
      lowercase,
      uppercase,
      kebabCase,
      eq: (a: string, b: string) => a === b,
      runner: () => {
        if (config.packageManager === "bun") return "bun";
        return "node";
      },
    },
  };
}
