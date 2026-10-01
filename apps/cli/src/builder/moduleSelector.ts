import { ProjectConfig } from "../types";

// Determines which base and feature modules to include based on user configuration
export function selectModules(config: ProjectConfig) {
  // Determine framework for module integration
  const framework = config.framework;

  // Select base template based on app type
  const base =
    config.applicationType === "backend"
      ? `backend/${config.framework}`
      : `frontend/${config.framework}`;

  const modules: Array<{ id: string; framework: string }> = [];

  // Add database module if selected (compound ids: prisma/express, drizzle/nextjs, mongoose/tanstack, ...)
  if (config.database !== "none") {
    modules.push({ id: `${config.database}/${framework}`, framework });
  }

  // Add feature modules based on configuration
  if (config.useDocker) {
    modules.push({ id: "docker", framework });
  }

  if (config.useAuth) {
    modules.push({ id: `auth/${framework}`, framework });
  }

  return { base, modules };
}
