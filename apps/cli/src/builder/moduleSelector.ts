import { ProjectConfig } from "../types";

// Determines which base and feature modules to include based on user configuration
export function selectModules(config: ProjectConfig) {
  const { framework } = config;

  // Select base template based on app type
  const base =
    config.applicationType === "backend"
      ? `backend/${framework}`
      : `frontend/${framework}`;

  const modules: string[] = [];

  // Database and auth modules have one variant per framework (prisma/express,
  // auth/nextjs, ...); the Docker module is shared
  if (config.database !== "none")
    modules.push(`${config.database}/${framework}`);
  if (config.useDocker) modules.push("docker");
  if (config.useAuth) modules.push(`auth/${framework}`);

  return { base, modules };
}
