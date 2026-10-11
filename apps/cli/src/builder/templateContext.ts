// Context builder for Handlebars, providing variables and helpers for templates
import { DEFAULT_PORT, ProjectConfig, TemplateContext } from "../types";

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
      eq: (a: string, b: string) => a === b,
      runner: () => {
        if (config.packageManager === "bun") return "bun";
        return "node";
      },
    },
  };
}
