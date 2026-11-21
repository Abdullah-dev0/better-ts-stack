// The two apps of a monorepo: their folders, ports, and configs
import { ProjectConfig } from "../types";

export const WEB_PORT = 3000;
export const API_PORT = 3001;
const WEB_URL = `http://localhost:${WEB_PORT}`;

export const TURBO_VERSION = "^2.11.13";

export interface MonorepoApp {
  dir: "apps/web" | "apps/api";
  config: ProjectConfig;
}

// The app that owns users and data gets Better Auth, the database, and the AI
// chat route; without an api the web app owns them. The prompts settle owner
export function getMonorepoApps(config: ProjectConfig): MonorepoApp[] {
  const { apiFramework } = config;
  const isWebOwner = apiFramework === "none" || config.owner === "web";
  const shared = {
    packageManager: config.packageManager,
    useAuth: config.useAuth,
    useDocker: false,
    // CI runs once at the root; git and the install also run there
    useCi: false,
    useAgents: config.useAgents,
    useVscode: config.useVscode,
    monorepo: false,
    apiFramework: config.apiFramework,
    owner: config.owner,
    initGit: false,
    installDeps: false,
  };

  const web: ProjectConfig = {
    ...shared,
    projectName: "web",
    applicationType: "fullstack",
    framework: config.framework,
    database: isWebOwner ? config.database : "none",
    // The web app shows the chat page; the route runs in the owner
    ai: config.ai,
    useRateLimit: false,
    app: { role: "web", isOwner: isWebOwner, envOverrides: {} },
  };

  if (apiFramework === "none") return [{ dir: "apps/web", config: web }];

  const api: ProjectConfig = {
    ...shared,
    projectName: "api",
    applicationType: "backend",
    framework: apiFramework,
    database: isWebOwner ? "none" : config.database,
    ai: isWebOwner ? "none" : config.ai,
    useRateLimit: config.useRateLimit,
    app: {
      role: "api",
      isOwner: !isWebOwner,
      envOverrides: {
        PORT: String(API_PORT),
        // Browsers only call the web app, which forwards to the api; Better
        // Auth trusts the web origin through CORS_ORIGIN
        CORS_ORIGIN: WEB_URL,
        // Email links and OAuth callbacks go to the site the user is on
        ...(config.useAuth && !isWebOwner && { BETTER_AUTH_URL: WEB_URL }),
      },
    },
  };

  return [
    { dir: "apps/web", config: web },
    { dir: "apps/api", config: api },
  ];
}
