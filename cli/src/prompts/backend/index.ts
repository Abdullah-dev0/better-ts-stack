import { cancel, confirm, group, isCancel, select, text } from "@clack/prompts";
import consola from "consola";

import {
  authOptions,
  BackendFramework,
  backendFrameworkOptions,
  DatabaseOption,
  databaseOptions,
  PackageManager,
  packageManagerOptions
} from "../../types";
import { validateProjectName } from "../../validators";

export const collectBackendChoices = async () => {
  const project = await group(
    {
      framework: async () => {
        let selection;

        while (!selection) {
          const result = await select<BackendFramework>({
            message: "Select a backend framework:",
            options: backendFrameworkOptions,
            initialValue: "express",
          });

          if (isCancel(result)) {
            cancel("Operation cancelled.");
            process.exit(0);
          }

          if (result === "hono") {
            consola.warn(
              "This framework is coming soon! Please select another option."
            );
            continue;
          }

          selection = result;
        }

        return selection;
      },
      projectName: () =>
        text({
          message: "Project name:",
          placeholder: "my-awesome-project",
          validate: (value) => validateProjectName(value),
        }),

      database: async () => {
        const selection = await select<DatabaseOption>({
          message: "How would you like to interact with the database?",
          options: databaseOptions,
          initialValue: "none",
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
      useAuth: async () => {
        const selection = await select({
          message: "Add authentication?",
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

  return project;
};
