import { intro, text, select, confirm, isCancel, cancel, group } from '@clack/prompts';
import consola from 'consola';
import {
  ProjectConfig,
  ApplicationType,
  DatabaseOption,
  BackendFramework,
  PackageManager,
  applicationTypeOptions,
  frameworkOptions,
  databaseOptions,
  packageManagerOptions,
  authOptions,
} from '../types';
import { validateProjectName } from '../validators';

// Collects user input via interactive prompts
export async function collectUserChoices() {
  intro('🚀 better-ts-stack');

  const project = await group(
    {
      applicationType: async () => {
        let selection ;

        while (!selection) {
          const result = await select<ApplicationType>({
            message: 'Application type:',
            options: applicationTypeOptions,
            initialValue: 'backend',
          });

          if (isCancel(result)) {
            cancel('Operation cancelled.');
            process.exit(0);
          }

          if (result === 'frontend') {
            consola.warn('Frontend is coming soon! Please select Backend for now.');
            continue;
          }

          selection = result;
        }

        return selection;
      },
      framework: async () => {
        let selection;

        while (!selection) {
          const result = await select<BackendFramework>({
            message: 'Select a backend framework:',
            options: frameworkOptions,
            initialValue: 'express',
          });

          if (isCancel(result)) {
            cancel('Operation cancelled.');
            process.exit(0);
          }

          if (result === 'hono') {
            consola.warn('This framework is coming soon! Please select another option.');
            continue;
          }

          selection = result;
        }

        return selection;
      },
      projectName: () =>
        text({
          message: 'Project name:',
          placeholder: 'my-awesome-project',
          validate: (value) => validateProjectName(value),
        }),

      database: async () => {
        const selection = await select<DatabaseOption>({
          message: 'How would you like to interact with the database?',
          options: databaseOptions,
          initialValue: 'none',
        });

        if (isCancel(selection)) {
          cancel('Operation cancelled.');
          process.exit(0);
        }

        return selection;
      },
      packageManager: async () => {
        const selection = await select<PackageManager>({
          message: 'Select a package manager:',
          options: packageManagerOptions,
          initialValue: 'npm',
        });

        if (isCancel(selection)) {
          cancel('Operation cancelled.');
          process.exit(0);
        }

        return selection;
      },
      useDocker: () =>
        confirm({
          message: 'Use Docker?',
          initialValue: false,
        }),
      useAuth: async () => {
        const selection = await select({
          message: 'Add authentication?',
          options: authOptions,
          initialValue: false,
        });

        if (isCancel(selection)) {
          cancel('Operation cancelled.');
          process.exit(0);
        }

        return selection;
      },
      initGit: () =>
        confirm({
          message: 'Init git?',
          initialValue: true,
        }),
        
      installDeps: () =>
        confirm({
          message: 'Install dependencies now?',
          initialValue: false,
        }),
    },
    {
      onCancel: () => {
        cancel('Operation cancelled.');
        process.exit(0);
      },
    }
  );

  return project;
}

// Displays a summary and asks for final confirmation before building
export async function confirmBuild(config: ProjectConfig, targetDir: string) {
  consola.info('Project Summary:');

  consola.box(
    `Project Name:    ${config.projectName}\n` +
      `Target Dir:      ${targetDir}\n` +
      `App Type:        ${config.applicationType}\n` +
      `Framework:       ${config.framework}\n` +
      `Database:        ${config.database}\n` +
      `Auth:            ${config.useAuth ? 'Yes' : 'No'}\n` +
      `Docker:          ${config.useDocker ? 'Yes' : 'No'}\n` +
      `Package Mgr:     ${config.packageManager}\n` +
      `Git Init:        ${config.initGit ? 'Yes' : 'No'}\n` +
      `Install Deps:    ${config.installDeps ? 'Yes' : 'No'}`
  );

  const shouldContinue = await confirm({
    message: 'Looks good? Ready to build?',
    initialValue: true,
  });

  if (isCancel(shouldContinue)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  if (!shouldContinue) {
    cancel('Building cancelled by user.');
    return false;
  }

  return true;
}
