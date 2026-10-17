// Context builder for Handlebars, providing variables and helpers for templates
import {
  DEFAULT_PORT,
  DockerCommands,
  PackageManager,
  ProjectConfig,
  TemplateContext,
} from "../types";

// The lockfile is optional: a project built before its first install has
// none, so each install falls back to a plain install without it
const DOCKER_COMMANDS: Record<PackageManager, DockerCommands> = {
  npm: {
    setup: "",
    manifests: "package.json package-lock.json*",
    install: "if [ -f package-lock.json ]; then npm ci; else npm install; fi",
    installProduction:
      "if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi",
    cleanCache: "npm cache clean --force",
    run: "npm run",
  },
  pnpm: {
    setup: "RUN npm install -g pnpm@11",
    manifests: "package.json pnpm-lock.yaml* pnpm-workspace.yaml",
    install:
      "if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi",
    installProduction:
      "if [ -f pnpm-lock.yaml ]; then pnpm install --prod --frozen-lockfile; else pnpm install --prod; fi",
    cleanCache: "pnpm store prune",
    run: "pnpm run",
  },
  bun: {
    setup:
      "COPY --from=oven/bun:1-alpine /usr/local/bin/bun /usr/local/bin/bun",
    manifests: "package.json bun.lock*",
    install:
      "if [ -f bun.lock ]; then bun install --frozen-lockfile; else bun install; fi",
    installProduction:
      "if [ -f bun.lock ]; then bun install --production --frozen-lockfile; else bun install --production; fi",
    cleanCache: "rm -rf /root/.bun/install/cache",
    run: "bun run",
  },
};

export function buildTemplateContext(config: ProjectConfig): TemplateContext {
  return {
    projectName: config.projectName,
    packageManager: config.packageManager,
    database: config.database,
    framework: config.framework,
    port: DEFAULT_PORT,
    useDocker: config.useDocker,
    useAuth: config.useAuth,
    useRateLimit: config.useRateLimit,
    docker: DOCKER_COMMANDS[config.packageManager],
    helpers: {
      eq: (a: string, b: string) => a === b,
      runner: () => {
        if (config.packageManager === "bun") return "bun";
        return "node";
      },
    },
  };
}
