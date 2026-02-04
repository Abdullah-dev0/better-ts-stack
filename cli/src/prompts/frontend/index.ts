import { cancel, confirm, group, isCancel, select } from "@clack/prompts";
import consola from "consola";

import {
  FrontendAuthOption,
  frontendAuthOptions,
  FrontendFramework,
  frontendFrameworkOptions,
  PackageManager,
  packageManagerOptions,
} from "../../types";

export const collectFrontendChoices = async () => {
  const project = await group(
    {
      framework: async () => {
        let selection;

        while (!selection) {
          const result = await select<FrontendFramework>({
            message: "Select a frontend framework:",
            options: frontendFrameworkOptions,
            initialValue: "nextjs",
          });

          if (isCancel(result)) {
            cancel("Operation cancelled.");
            process.exit(0);
          }

          if (result === "vite") {
            consola.warn(
              "This framework is coming soon! Please select another option."
            );
            continue;
          }

          selection = result;
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
      useAuth: async () => {
        const selection = await select<FrontendAuthOption>({
          message: "Add authentication?",
          options: frontendAuthOptions,
          initialValue: "none",
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
