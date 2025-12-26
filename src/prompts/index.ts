/**
 * Clack prompt definitions and prompt manager
 */

import { intro, text, select, confirm, isCancel, cancel, group } from '@clack/prompts';
import consola from 'consola';
import {
  ProjectConfig,
  applicationTypes,
  DatabaseOption,
  PackageManager,
  BackendFramework,
} from '../types';
import { validateProjectName } from '../validators';

// Type-safe option definitions
const applicationTypeOptions = [
  { value: 'backend' as const, label: 'Backend' },
  { value: 'frontend' as const, label: 'Frontend', hint: '(Coming Soon)' },
];

const frameworkOptions = [
  { value: 'express' as const, label: 'Express' },
  { value: 'hono' as const, label: 'Hono', hint: '(Coming Soon)' },
  { value: 'nest' as const, label: 'NestJS', hint: '(Coming Soon)' },
];

const databaseOptions = [
  { value: 'none' as const, label: 'None (Skip database setup)' },
  { value: 'prisma' as const, label: 'Prisma (Type-safe ORM)' },
  { value: 'mongoose' as const, label: 'Mongoose (Standard MongoDB ODM)' },
];

const packageManagerOptions = [
  { value: 'npm' as const, label: 'npm' },
  { value: 'pnpm' as const, label: 'pnpm' },
  { value: 'bun' as const, label: 'bun' },
];

const authOptions = [
  { value: false as const, label: 'No' },
  { value: true as const, label: 'Yes', hint: '(Coming Soon)' },
];

/**
 * Collects all user choices through interactive prompts
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns Promise resolving to ProjectConfig object with all selections
 */
export async function collectUserChoices(): Promise<ProjectConfig> {
  intro('🚀 better-ts-stack');

  const project = await group(
    {
      applicationType: async (): Promise<applicationTypes> => {
        // eslint-disable-next-line
        while (true) {
          const selection = await select({
            message: 'Application type:',
            options: applicationTypeOptions,
            initialValue: 'backend' as const,
          });

          if (isCancel(selection)) {
            cancel('Operation cancelled.');
            process.exit(0);
          }

          if (selection === 'frontend') {
            consola.warn('Frontend is coming soon! Please select Backend for now.');
            continue;
          }

          return selection;
        }
      },
      framework: async (): Promise<BackendFramework> => {
        // eslint-disable-next-line
        while (true) {
          const selection = await select({
            message: 'Select a backend framework:',
            options: frameworkOptions,
            initialValue: 'express' as const,
          });

          if (isCancel(selection)) {
            cancel('Operation cancelled.');
            process.exit(0);
          }

          if (selection === 'hono' || selection === 'nest') {
            consola.warn('This framework is coming soon! Please select another option.');
            continue;
          }

          return selection;
        }
      },
      projectName: () =>
        text({
          message: 'Project name:',
          placeholder: 'my-awesome-project',
          validate: (value) => validateProjectName(value),
        }),

      database: async (): Promise<DatabaseOption> => {
        const selection = await select({
          message: 'How would you like to interact with the database?',
          options: databaseOptions,
          initialValue: 'none' as const,
        });

        if (isCancel(selection)) {
          cancel('Operation cancelled.');
          process.exit(0);
        }

        return selection;
      },
      packageManager: async (): Promise<PackageManager> => {
        const selection = await select({
          message: 'Select a package manager:',
          options: packageManagerOptions,
          initialValue: 'npm' as const,
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
      useAuth: async (): Promise<boolean> => {
        // eslint-disable-next-line
        while (true) {
          const selection = await select({
            message: 'Add authentication?',
            options: authOptions,
            initialValue: false as const,
          });

          if (isCancel(selection)) {
            cancel('Operation cancelled.');
            process.exit(0);
          }

          if (selection === true) {
            consola.warn('Authentication is coming soon! Please select No for now.');
            continue;
          }

          return selection;
        }
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

  return project as ProjectConfig;
}

/**
 * Confirms the building with the user by displaying a summary
 * @param config - The project configuration to confirm
 * @returns Promise resolving to true if confirmed, false otherwise
 */
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
