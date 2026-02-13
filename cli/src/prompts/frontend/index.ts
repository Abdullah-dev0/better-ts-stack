import { cancel, confirm, group, isCancel, select } from "@clack/prompts";

import {
  authOptions,
  DatabaseType,
  databaseTypeOptions,
  FrontendFramework,
  isValidOrmOption,
  mongodbOrmOptions,
  OrmOption,
  PackageManager,
  packageManagerOptions,
  postgresqlOrmOptions,
  PromptChoices,
} from "../../types";

export const collectFrontendChoices = async (): Promise<PromptChoices> => {
  const project = await group(
    {
      framework: async (): Promise<FrontendFramework> => {
        // Auto-select Next.js since it's the only option
        return Promise.resolve("nextjs");
      },
      databaseType: async () => {
        const selection = await select<DatabaseType>({
          message: "Select a database:",
          options: databaseTypeOptions,
          initialValue: "none",
        });

        if (isCancel(selection)) {
          cancel("Operation cancelled.");
          process.exit(0);
        }

        return selection;
      },
      orm: async ({ results }) => {
        // Type guard to narrow the databaseType from unknown to DatabaseType
        const dbType = results.databaseType;

        // Skip ORM selection if no database type was selected
        if (dbType === "none") {
          return "none" as const;
        }

        // Select ORM based on database type
        if (dbType !== "mongodb" && dbType !== "postgresql") {
          return "none" as const;
        }

        const ormOptions =
          dbType === "mongodb" ? mongodbOrmOptions : postgresqlOrmOptions;

        const selection = await select<OrmOption>({
          message: `Select an ORM for ${dbType}:`,
          options: ormOptions,
          initialValue: "prisma",
        });

        if (isCancel(selection)) {
          cancel("Operation cancelled.");
          process.exit(0);
        }

        return selection;
      },
      packageManager: async () => {
        const selection = await select<PackageManager>({
          message: "Select a package manager:",
          options: packageManagerOptions,
          initialValue: "npm",
        });

        if (isCancel(selection)) {
          cancel("Operation cancelled.");
          process.exit(0);
        }

        return selection;
      },
      useDocker: () =>
        confirm({
          message: "Use Docker?",
          initialValue: false,
        }),
      useAuth: async ({ results }) => {
        // Better Auth template requires a database-backed adapter
        if (results.databaseType === "none") {
          return false;
        }

        const selection = await select<boolean>({
          message: "Add Better Auth?",
          options: authOptions,
          initialValue: false,
        });

        if (isCancel(selection)) {
          cancel("Operation cancelled.");
          process.exit(0);
        }

        return selection;
      },
      initGit: () =>
        confirm({
          message: "Init git?",
          initialValue: true,
        }),

      installDeps: () =>
        confirm({
          message: "Install dependencies now?",
          initialValue: false,
        }),
    },
    {
      onCancel: () => {
        cancel("Operation cancelled.");
        process.exit(0);
      },
    }
  );

  // Transform the group result into the proper typed object
  // Validate orm using type guard
  if (!isValidOrmOption(project.orm)) {
    throw new Error(`Invalid ORM option: ${String(project.orm)}`);
  }

  const result: PromptChoices = {
    framework: project.framework,
    databaseType: project.databaseType,
    orm: project.orm,
    packageManager: project.packageManager,
    useDocker: Boolean(project.useDocker),
    useAuth: Boolean(project.useAuth),
    initGit: Boolean(project.initGit),
    installDeps: Boolean(project.installDeps),
  };

  return result;
};
