import { isCancel } from "@clack/core";

import {
  aiOptions,
  ApiFramework,
  apiFrameworkOptions,
  ApplicationType,
  applicationTypeOptions,
  backendFrameworkOptions,
  buildError,
  Database,
  databaseSystemOptions,
  DataOwner,
  Framework,
  frontendFrameworkOptions,
  getApplicationType,
  mongodbOrmOptions,
  ownerOptions,
  PackageManager,
  packageManagerOptions,
  paymentsOptions,
  postgresqlOrmOptions,
  StackChoices,
} from "../types";
import { confirm, info, select } from "../ui";

// The package manager that started the CLI (pnpm dlx, bunx, npx), from the
// user agent it passes to the process; npm when it cannot be told
export function detectPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent ?? "";
  const name = userAgent.split("/")[0];
  return packageManagerOptions.some((option) => option.value === name)
    ? (name as PackageManager)
    : "npm";
}

// Returns the preset value when there is one, otherwise asks the user
export async function ask<T>(
  preset: T | undefined,
  prompt: () => Promise<T | symbol>
): Promise<T> {
  if (preset !== undefined) return preset;

  // Without a terminal a prompt reads end-of-input and looks like a cancel
  if (!process.stdin.isTTY) {
    throw buildError(
      "Cannot ask questions without an interactive terminal. Pass --yes, or give every option as a flag (see --help)",
      "NOT_INTERACTIVE"
    );
  }

  const answer = await prompt();
  if (isCancel(answer)) {
    info("Cancelled. Nothing was created.");
    // 130 is the usual exit code for a run stopped with Ctrl+C
    process.exit(130);
  }
  return answer;
}

async function askFramework(): Promise<Framework | symbol> {
  const applicationType = await select<ApplicationType>({
    message: "Application type",
    options: applicationTypeOptions,
    initialValue: "backend",
  });
  if (isCancel(applicationType)) return applicationType;

  return applicationType === "backend"
    ? select<Framework>({
        message: "Backend framework",
        options: backendFrameworkOptions,
        initialValue: "express",
      })
    : select<Framework>({
        message: "Frontend framework",
        options: frontendFrameworkOptions,
        initialValue: "nextjs",
      });
}

async function askDatabase(): Promise<Database | symbol> {
  const system = await select({
    message: "Database",
    options: databaseSystemOptions,
    initialValue: "none",
  });
  if (isCancel(system) || system === "none") return system;

  const options =
    system === "mongodb" ? mongodbOrmOptions : postgresqlOrmOptions;
  return select<Database>({
    message: "ORM",
    options,
    initialValue: options[0].value,
  });
}

// The monorepo app that owns users and data. It is asked only when there is
// a server and something to own; every other case is settled here and said
async function askOwner(
  preset: DataOwner | undefined,
  {
    hasServer,
    hasData,
    mustBeApi,
  }: { hasServer: boolean; hasData: boolean; mustBeApi: boolean }
): Promise<DataOwner> {
  if (!hasServer) {
    if (preset === "api") {
      throw buildError(
        "--owner api needs an api. Add --api express or --api nestjs",
        "INVALID_ARGUMENT"
      );
    }
    return "web";
  }
  if (mustBeApi) {
    if (preset === "web") {
      throw buildError(
        "Auth in the web app needs a database. Add --database, or use --owner api",
        "INVALID_ARGUMENT"
      );
    }
    info(
      "Users and data live in the api: Better Auth in the web app needs a database"
    );
    return "api";
  }
  if (!hasData) return preset ?? "web";
  return ask(preset, () =>
    select<DataOwner>({
      message: "Which app owns users and data (auth, database, AI)?",
      options: ownerOptions,
      initialValue: "web",
    })
  );
}

// Collects the stack choices, prompting only for those missing from the preset
export async function collectStackChoices(
  preset: Partial<StackChoices>
): Promise<StackChoices> {
  const monorepo = await ask(preset.monorepo, () =>
    confirm({
      message: "Create a monorepo (Turborepo with apps/web and apps/api)?",
      initialValue: false,
    })
  );

  const framework = monorepo
    ? await ask(preset.framework, () =>
        select<Framework>({
          message: "Web app (apps/web)",
          options: frontendFrameworkOptions,
          initialValue: "nextjs",
        })
      )
    : await ask(preset.framework, askFramework);
  const isFullstack = getApplicationType(framework) === "fullstack";
  if (monorepo && !isFullstack) {
    throw buildError(
      `--framework is the web app of a monorepo: use nextjs or tanstack, and --api ${framework}`,
      "INVALID_ARGUMENT"
    );
  }
  if (!monorepo && preset.apiFramework) {
    throw buildError(
      "--api names the api of a monorepo. Add --monorepo",
      "INVALID_ARGUMENT"
    );
  }
  const apiFramework = monorepo
    ? await ask(preset.apiFramework, () =>
        select<ApiFramework>({
          message: "API server (apps/api)",
          options: apiFrameworkOptions,
          initialValue: "express",
        })
      )
    : "none";
  const hasServer = monorepo && apiFramework !== "none";

  const database = await ask(preset.database, askDatabase);
  const packageManager = await ask(preset.packageManager, () =>
    select({
      message: "Package manager",
      options: packageManagerOptions,
      initialValue: detectPackageManager(),
    })
  );

  // shortcut: each app's Dockerfile installs from its own lockfile, which a
  // workspace does not have; needs turbo prune and a root Compose file
  if (monorepo && preset.useDocker) {
    throw buildError(
      "Docker is not available for monorepos yet. Leave out --docker",
      "INVALID_ARGUMENT"
    );
  }
  const useDocker = monorepo
    ? false
    : await ask(preset.useDocker, () =>
        confirm({ message: "Add Docker?", initialValue: false })
      );

  // Better Auth stores users and sessions, so full-stack auth needs a
  // database; an api server can run it without one (in memory)
  const isAuthAvailable = !isFullstack || database !== "none" || hasServer;
  if (preset.useAuth && !isAuthAvailable) {
    throw buildError(
      `Auth for ${framework} needs a database. Add --database prisma, drizzle, or mongoose`,
      "INVALID_ARGUMENT"
    );
  }
  const useAuth = isAuthAvailable
    ? await ask(preset.useAuth, () =>
        confirm({
          message: "Add authentication (Better Auth)?",
          initialValue: false,
        })
      )
    : false;

  const ai = await ask(preset.ai, () =>
    select({
      message: "AI chat",
      options: aiOptions,
      initialValue: "none",
    })
  );

  // The plugins store customers and subscriptions next to the users
  const isPaymentsAvailable = useAuth && database !== "none";
  if (preset.payments && preset.payments !== "none" && !isPaymentsAvailable) {
    throw buildError(
      "Payments need auth and a database. Add --auth and --database prisma, drizzle, or mongoose",
      "INVALID_ARGUMENT"
    );
  }
  const payments = isPaymentsAvailable
    ? await ask(preset.payments, () =>
        select({
          message: "Payments (subscriptions)",
          options: paymentsOptions,
          initialValue: "none",
        })
      )
    : "none";

  const owner = await askOwner(preset.owner, {
    hasServer,
    hasData: database !== "none" || ai !== "none",
    // Better Auth in the web app stores its users in the database
    mustBeApi: useAuth && database === "none",
  });

  // Better Auth limits its own endpoints, so only the backends offer this; a
  // monorepo's api limits its own routes
  const hasApi = !isFullstack || hasServer;
  if (preset.useRateLimit && !hasApi) {
    throw buildError(
      `Rate limiting is available for Express and NestJS. Better Auth in ${framework} already limits its own endpoints`,
      "INVALID_ARGUMENT"
    );
  }
  const useRateLimit = hasApi
    ? await ask(preset.useRateLimit, () =>
        confirm({ message: "Add rate limiting?", initialValue: false })
      )
    : false;

  const useCi = await ask(preset.useCi, () =>
    confirm({ message: "Add GitHub Actions CI?", initialValue: false })
  );

  // AGENTS.md is always added without asking; --no-agents leaves it out
  const useAgents = preset.useAgents ?? true;

  const useVscode = await ask(preset.useVscode, () =>
    confirm({ message: "Add VS Code settings?", initialValue: false })
  );

  const initGit = await ask(preset.initGit, () =>
    confirm({ message: "Initialize a git repository?", initialValue: true })
  );
  const installDeps = await ask(preset.installDeps, () =>
    confirm({ message: "Install dependencies now?", initialValue: false })
  );

  return {
    framework,
    monorepo,
    apiFramework,
    owner,
    database,
    packageManager,
    useDocker,
    useAuth,
    ai,
    payments,
    useRateLimit,
    useCi,
    useAgents,
    useVscode,
    initGit,
    installDeps,
  };
}
