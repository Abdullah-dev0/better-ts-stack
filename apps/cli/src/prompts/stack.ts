import { cancel, confirm, group, isCancel, select } from "@clack/prompts";
import consola from "consola";

import {
  ApplicationType,
  authOptions,
  BackendFramework,
  backendFrameworkOptions,
  DatabaseType,
  databaseTypeOptions,
  FrontendFramework,
  frontendFrameworkOptions,
  mongodbOrmOptions,
  OrmOption,
  PackageManager,
  packageManagerOptions,
  postgresqlOrmOptions,
  PromptChoices,
} from "../types";

export async function collectStackChoices(
  applicationType: ApplicationType
): Promise<PromptChoices> {
  return group<{ [K in keyof PromptChoices]: PromptChoices[K] | symbol }>(
    {
      framework: async () => {
        if (applicationType === "backend") {
          while (true) {
            const selection = await select<BackendFramework>({
              message: "Select a backend framework:",
              options: backendFrameworkOptions,
              initialValue: "express",
            });
            if (isCancel(selection) || selection !== "nestjs")
              return selection;
            consola.warn(
              "This framework is coming soon! Please select another option."
            );
          }
        }

        return select<FrontendFramework>({
          message: "Select a frontend framework:",
          options: frontendFrameworkOptions,
          initialValue: "nextjs",
        });
      },
      databaseType: () =>
        select<DatabaseType>({
          message: "Select a database:",
          options: databaseTypeOptions,
          initialValue: "none",
        }),
      orm: async ({ results }): Promise<OrmOption | symbol> => {
        if (results.databaseType === "none") return "none" as const;
        const options =
          results.databaseType === "mongodb"
            ? mongodbOrmOptions
            : postgresqlOrmOptions;
        return select<OrmOption>({
          message: `Select an ORM for ${results.databaseType}:`,
          options,
          initialValue: options[0].value,
        });
      },
      packageManager: () =>
        select<PackageManager>({
          message: "Select a package manager:",
          options: packageManagerOptions,
          initialValue: "npm",
        }),
      useDocker: () => confirm({ message: "Use Docker?", initialValue: false }),
      useAuth: async ({ results }): Promise<boolean | symbol> => {
        if (applicationType === "fullstack" && results.databaseType === "none")
          return false;
        return select({
          message:
            applicationType === "fullstack"
              ? "Add Better Auth?"
              : "Add authentication?",
          options: authOptions,
          initialValue: false,
        });
      },
      initGit: () =>
        confirm({
          message: "Initialize a git repository?",
          initialValue: true,
        }),
      installDeps: () =>
        confirm({ message: "Install dependencies now?", initialValue: false }),
    },
    {
      onCancel: () => {
        cancel("Operation cancelled.");
        process.exit(0);
      },
    }
  );
}
