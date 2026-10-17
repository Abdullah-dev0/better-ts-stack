import { isCancel } from "@clack/core";

import {
  ApplicationType,
  applicationTypeOptions,
  backendFrameworkOptions,
  buildError,
  Database,
  databaseSystemOptions,
  Framework,
  frontendFrameworkOptions,
  getApplicationType,
  mongodbOrmOptions,
  PackageManager,
  packageManagerOptions,
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

// Collects the stack choices, prompting only for those missing from the preset
export async function collectStackChoices(
  preset: Partial<StackChoices>
): Promise<StackChoices> {
  const framework = await ask(preset.framework, askFramework);
  const database = await ask(preset.database, askDatabase);
  const packageManager = await ask(preset.packageManager, () =>
    select({
      message: "Package manager",
      options: packageManagerOptions,
      initialValue: detectPackageManager(),
    })
  );
  const useDocker = await ask(preset.useDocker, () =>
    confirm({ message: "Add Docker?", initialValue: false })
  );

  // Better Auth stores users and sessions, so full-stack auth needs a database
  const isFullstack = getApplicationType(framework) === "fullstack";
  const isAuthAvailable = !isFullstack || database !== "none";
  if (preset.useAuth && !isAuthAvailable) {
    throw buildError(
      `Auth for ${framework} needs a database. Add --database prisma, drizzle, or mongoose`,
      "INVALID_ARGUMENT"
    );
  }
  const useAuth = isAuthAvailable
    ? await ask(preset.useAuth, () =>
        confirm({
          message: isFullstack ? "Add Better Auth?" : "Add JWT authentication?",
          initialValue: false,
        })
      )
    : false;

  // Better Auth limits its own endpoints, so only the backends offer this
  if (preset.useRateLimit && isFullstack) {
    throw buildError(
      `Rate limiting is available for Express and NestJS. Better Auth in ${framework} already limits its own endpoints`,
      "INVALID_ARGUMENT"
    );
  }
  const useRateLimit = isFullstack
    ? false
    : await ask(preset.useRateLimit, () =>
        confirm({ message: "Add rate limiting?", initialValue: false })
      );

  const initGit = await ask(preset.initGit, () =>
    confirm({ message: "Initialize a git repository?", initialValue: true })
  );
  const installDeps = await ask(preset.installDeps, () =>
    confirm({ message: "Install dependencies now?", initialValue: false })
  );

  return {
    framework,
    database,
    packageManager,
    useDocker,
    useAuth,
    useRateLimit,
    initGit,
    installDeps,
  };
}
