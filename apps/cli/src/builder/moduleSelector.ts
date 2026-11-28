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

  // Database, auth, and rate-limit modules have one variant per framework
  // (prisma/express, auth/nextjs, ...); the Docker, CI, and agents modules are
  // shared
  if (config.database !== "none")
    modules.push(`${config.database}/${framework}`);
  if (config.useDocker) modules.push("docker");
  // Full-stack auth and AI chat come in two halves: the pages (auth-ui,
  // ai-page) and the server side (auth, ai). In a monorepo the server side
  // runs in one app (the owner); the other app asks it for sessions
  // (auth-remote), and the web app forwards /api/* to the api (proxy)
  const isFullstack = config.applicationType === "fullstack";
  const isOwner = config.app?.isOwner ?? true;
  if (config.useAuth) {
    if (isFullstack) modules.push(`auth-ui/${framework}`);
    modules.push(`${isOwner ? "auth" : "auth-remote"}/${framework}`);
  }
  if (config.ai !== "none") {
    if (isFullstack) modules.push(`ai-page/${config.ai}/${framework}`);
    if (isOwner) modules.push(`ai/${config.ai}/${framework}`);
  }
  // The server plugin runs where Better Auth runs; a web app that only asks
  // the owner for sessions still needs the package for its client plugin
  if (config.payments !== "none") {
    if (isOwner) modules.push(`payments/${config.payments}`);
    else if (isFullstack) modules.push(`payments-client/${config.payments}`);
  }
  if (config.app?.role === "web" && config.apiFramework !== "none") {
    modules.push(`proxy/${framework}`);
  }
  if (config.useRateLimit) modules.push(`rate-limit/${framework}`);
  if (config.useCi) modules.push("ci");
  if (config.useAgents) modules.push("agents");
  if (config.useVscode) modules.push("vscode");

  return { base, modules };
}
