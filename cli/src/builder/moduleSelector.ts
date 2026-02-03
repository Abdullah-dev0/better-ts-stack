import { ProjectConfig } from "../types";

// Determines which base and feature modules to include based on user configuration
export function selectModules(config: ProjectConfig) {
  // Select base framework based on application type and framework choice
  const base =
    config.applicationType === "backend"
      ? `backend/${config.framework}`
      : `frontend/${config.framework}`;

  const modules: string[] = [];

  // Add database module if selected
  if (config.database !== "none") {
    modules.push(config.database);
  }

  // Add feature modules based on configuration
  if (config.useDocker) {
    modules.push("docker");
  }

  if (config.useAuth) {
    modules.push("auth");
  }

  return { base, modules };
}
