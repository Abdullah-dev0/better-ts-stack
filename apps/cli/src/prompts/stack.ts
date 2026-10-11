import { cancel, confirm, isCancel, select } from "@clack/prompts";

import {
  ApplicationType,
  applicationTypeOptions,
  authOptions,
  backendFrameworkOptions,
  buildError,
  Database,
  databaseSystemOptions,
  Framework,
  frontendFrameworkOptions,
  getApplicationType,
  mongodbOrmOptions,
  packageManagerOptions,
  postgresqlOrmOptions,
  StackChoices,
} from "../types";

// Returns the preset value when there is one, otherwise asks the user
export async function ask<T>(
  preset: T | undefined,
  prompt: () => Promise<T | symbol>
): Promise<T> {
  if (preset !== undefined) return preset;

  const answer = await prompt();
  if (isCancel(answer)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
  return answer;
}

async function askFramework(): Promise<Framework | symbol> {
  const applicationType = await select<ApplicationType>({
    message: "Application type:",
    options: applicationTypeOptions,
    initialValue: "backend",
  });
  if (isCancel(applicationType)) return applicationType;

  return applicationType === "backend"
    ? select<Framework>({
        message: "Select a backend framework:",
        options: backendFrameworkOptions,
        initialValue: "express",
      })
    : select<Framework>({
        message: "Select a frontend framework:",
        options: frontendFrameworkOptions,
        initialValue: "nextjs",
      });
}

async function askDatabase(): Promise<Database | symbol> {
  const system = await select({
    message: "Select a database:",
    options: databaseSystemOptions,
    initialValue: "none",
  });
  if (isCancel(system) || system === "none") return system;

  const options =
    system === "mongodb" ? mongodbOrmOptions : postgresqlOrmOptions;
  return select<Database>({
    message: `Select an ORM for ${system}:`,
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
      message: "Select a package manager:",
      options: packageManagerOptions,
      initialValue: "npm",
    })
  );
  const useDocker = await ask(preset.useDocker, () =>
    confirm({ message: "Use Docker?", initialValue: false })
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
        select({
          message: isFullstack ? "Add Better Auth?" : "Add authentication?",
          options: authOptions,
          initialValue: false,
        })
      )
    : false;

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
    initGit,
    installDeps,
  };
}
