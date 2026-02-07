import { ProjectConfig } from "../types";

// Determines which base and feature modules to include based on user configuration
export function selectModules(config: ProjectConfig) {
  // Determine framework for module integration
  const framework =
    config.applicationType === "backend" ? config.framework : "nextjs";

  // Select base template based on app type
  const base =
    config.applicationType === "backend"
      ? `backend/${config.framework}`
      : `frontend/${config.framework}`;

  const modules: Array<{ id: string; framework: string }> = [];

  // Add database module if selected
  if (config.database !== "none") {
    modules.push({ id: config.database, framework });
  }

  // Add feature modules based on configuration
  if (config.useDocker) {
    modules.push({ id: "docker", framework });
  }

  if (config.useAuth) {
    modules.push({ id: "auth", framework });
  }

  return { base, modules };
}
