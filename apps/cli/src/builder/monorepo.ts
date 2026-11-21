// A Turborepo with apps/web and apps/api: each app is built like a single
// project, then the workspace files are written at the root
import fs from "fs-extra";
import { execSync } from "node:child_process";
import path from "node:path";

import { getModule } from "../modules/registry";
import {
  buildError,
  MergedConfig,
  PackageManager,
  ProjectConfig,
  TemplateContext,
} from "../types";
import { loadBuildInputs } from "./buildPlanner";
import { generatePnpmWorkspace } from "./configGenerator";
import { copyModuleFiles, processTemplateFiles } from "./fileProcessor";
import { API_PORT, MonorepoApp, TURBO_VERSION, WEB_PORT } from "./monorepoApps";
import { buildTemplateContext, getCiBuildEnv } from "./templateContext";

// Used when the package manager cannot be asked for its version; Turborepo
// needs the packageManager field to find the workspace
const FALLBACK_VERSIONS: Record<PackageManager, string> = {
  npm: "11.6.2",
  pnpm: "11.0.0",
  bun: "1.3.0",
};

function getPackageManagerVersion(packageManager: PackageManager): string {
  try {
    // Through the shell because npm and pnpm are .cmd files on Windows
    return execSync(`${packageManager} --version`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return FALLBACK_VERSIONS[packageManager];
  }
}

// Workspace overrides only take effect in the root package.json (npm, bun)
// or pnpm-workspace.yaml (pnpm), so the apps' overrides are collected here
async function collectOverrides(
  apps: MonorepoApp[]
): Promise<MergedConfig["overrides"]> {
  const overrides: MergedConfig["overrides"] = {};
  for (const app of apps) {
    const { mergedConfig } = await loadBuildInputs(app.config);
    Object.assign(overrides, mergedConfig.overrides);
  }
  return overrides;
}

const TURBO_JSON = {
  $schema: "https://turborepo.com/schema.json",
  // The apps read their own .env files; loose mode also passes CI variables
  envMode: "loose",
  tasks: {
    build: {
      inputs: ["$TURBO_DEFAULT$", ".env*"],
      // Next.js writes API_URL into its rewrites at build time; loose mode
      // leaves variables out of the cache key unless they are listed here
      env: ["API_URL"],
      outputs: ["dist/**", ".next/**", "!.next/cache/**", ".output/**"],
    },
    dev: { cache: false, persistent: true },
    start: { cache: false, persistent: true },
    lint: {},
    "type:check": {},
  },
};

const ROOT_GITIGNORE = `node_modules
.turbo
.env
.env.local
`;

export async function generateMonorepoFiles(
  targetDir: string,
  config: ProjectConfig,
  apps: MonorepoApp[]
): Promise<void> {
  try {
    const overrides = await collectOverrides(apps);
    const { packageManager } = config;
    const tasks = ["dev", "build", "start", "lint", "type:check"];
    const packageJson = {
      name: config.projectName,
      version: "1.0.0",
      private: true,
      packageManager: `${packageManager}@${getPackageManagerVersion(packageManager)}`,
      engines: { node: ">=24.0.0" },
      // pnpm reads the workspace from pnpm-workspace.yaml
      ...(packageManager !== "pnpm" && { workspaces: ["apps/*"] }),
      scripts: Object.fromEntries(
        tasks.map((task) => [task, `turbo run ${task}`])
      ),
      devDependencies: { turbo: TURBO_VERSION },
      ...(packageManager !== "pnpm" &&
        Object.keys(overrides).length > 0 && { overrides }),
    };

    await fs.writeFile(
      path.join(targetDir, "package.json"),
      JSON.stringify(packageJson, null, 2) + "\n"
    );
    await fs.writeFile(
      path.join(targetDir, "turbo.json"),
      JSON.stringify(TURBO_JSON, null, 2) + "\n"
    );
    await fs.writeFile(path.join(targetDir, ".gitignore"), ROOT_GITIGNORE);
    if (packageManager === "pnpm") {
      await generatePnpmWorkspace(targetDir, overrides, ["apps/*"]);
    }

    if (config.useCi) {
      // The workflow's install, build, type-check, and lint run at the root,
      // where turbo runs them in both apps
      const context: TemplateContext = {
        ...buildTemplateContext({ ...config, useDocker: false }),
        ciBuildEnv: apps.flatMap((app) => getCiBuildEnv(app.config)),
      };
      await copyModuleFiles((await getModule("ci")).path, targetDir);
      await processTemplateFiles(path.join(targetDir, ".github"), context);
    }
  } catch (error) {
    throw buildError(
      error,
      "MONOREPO_FILES_ERROR",
      "Failed to write the monorepo files"
    );
  }
}

const FRAMEWORK_NAMES: Record<string, string> = {
  nextjs: "Next.js",
  tanstack: "TanStack Start",
  express: "Express",
  nestjs: "NestJS",
};

// The folder of the app that owns users and data
function getOwnerDir(config: ProjectConfig): string {
  return config.apiFramework === "none" || config.owner === "web"
    ? "apps/web"
    : "apps/api";
}

export async function generateMonorepoReadme(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  const hasApi = config.apiFramework !== "none";
  const owned = [
    config.useAuth && "Better Auth",
    config.database !== "none" && "the database",
    config.ai !== "none" && "the AI chat route",
  ].filter(Boolean);
  const lines = [
    `# ${config.projectName}`,
    "",
    `Created with [better-ts-stack](https://better-ts-stack.abdullahtech.me/docs/modules/monorepo): a Turborepo with ${hasApi ? "two apps" : "one app, ready for more"}.`,
    "",
    "| App | Framework | Port |",
    "| --- | --- | --- |",
    `| \`apps/web\` | ${FRAMEWORK_NAMES[config.framework]} | ${WEB_PORT} |`,
    ...(hasApi
      ? [
          `| \`apps/api\` | ${FRAMEWORK_NAMES[config.apiFramework]} | ${API_PORT} |`,
          "",
          "Browsers only talk to `apps/web`. It forwards every `/api/*` request it does not answer itself to `apps/api` (`API_URL` in `apps/web/.env`).",
        ]
      : []),
    ...(hasApi && owned.length > 0
      ? [
          "",
          `\`${getOwnerDir(config)}\` owns users and data: ${owned.join(", ")}.${config.useAuth ? " The other app asks it for the session of each request." : ""}`,
        ]
      : []),
    "",
    "## Commands",
    "",
    "Run them at the root; Turborepo runs them in every app.",
    "",
    "```bash",
    ...["dev", "build", "start", "lint", "type:check"].map(
      (task) => `${config.packageManager} run ${task}`
    ),
    "```",
    "",
    "## Getting started",
    "",
    ...generateMonorepoNextSteps(config, "", false).map(
      (step, index) => `${index + 1}. ${step}`
    ),
    "",
  ];
  await fs.writeFile(path.join(targetDir, "README.md"), lines.join("\n"));
}

// The steps after creation; commands for one app run inside its folder
export function generateMonorepoNextSteps(
  config: ProjectConfig,
  relativeDir: string,
  depsInstalled: boolean
): string[] {
  const { packageManager: pm } = config;
  const owner = getOwnerDir(config);
  const steps: string[] = [];

  if (relativeDir) {
    steps.push(
      /\s/.test(relativeDir) ? `cd "${relativeDir}"` : `cd ${relativeDir}`
    );
  }
  if (config.database !== "none") {
    steps.push(`Review ${owner}/.env and set your database connection details`);
  }
  if (config.ai === "vercel") {
    steps.push(`Set AI_GATEWAY_API_KEY in ${owner}/.env`);
  } else if (config.ai === "tanstack") {
    steps.push(`Set OPENAI_API_KEY in ${owner}/.env`);
  }
  if (!depsInstalled) steps.push(`${pm} install`);

  if (config.database === "prisma") {
    steps.push(
      `cd ${owner} && ${pm} run prisma:generate && ${pm} run prisma:migrate && cd ../..`
    );
  } else if (config.database === "drizzle") {
    steps.push(
      `cd ${owner} && ${pm} run db:generate && ${pm} run db:migrate && cd ../..`
    );
  }

  steps.push(
    `${pm} run dev`,
    config.apiFramework === "none"
      ? `Open http://localhost:${WEB_PORT}`
      : `Open http://localhost:${WEB_PORT}; the api listens on port ${API_PORT}, and the web app forwards /api/* to it`
  );
  if (config.useAuth) steps.push("Visit /sign-up to create your first account");
  if (config.ai !== "none") steps.push("Visit /chat to talk to the model");
  return steps;
}
