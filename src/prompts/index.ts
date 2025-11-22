/**
 * Clack prompt definitions and prompt manager
 */

import { intro, text, select, confirm, isCancel, cancel, group } from '@clack/prompts';
import consola from 'consola';
import { ProjectConfig, applicationTypes, DatabaseOption, PackageManager } from '../types';
import { validateProjectName } from '../validators';

/**
 * Collects all user choices through interactive prompts
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns Promise resolving to ProjectConfig object with all selections
 */
export async function collectUserChoices() {
  intro('🚀 better-ts-stack');

  const project = await group(
    {
      applicationType: () =>
        select<{ value: applicationTypes; label: string }[], applicationTypes>({
          message: 'Application type:',
          options: [
            { value: 'frontend' as const, label: 'Frontend' },
            { value: 'backend' as const, label: 'Backend' },
          ],
          initialValue: 'backend',
        }),
      framework: ({ results }) => {
        const isBackend = results.applicationType === 'backend';

        if (isBackend) {
          return select({
            message: 'Select a backend framework:',
            options: [
              { value: 'express' as const, label: 'Express' },
              { value: 'hono' as const, label: 'Hono' },
              { value: 'nest' as const, label: 'NestJS' },
            ],
            initialValue: 'express',
          });
        }

        return select({
          message: 'Select a frontend framework:',
          options: [{ value: 'react' as const, label: 'React' }],
          initialValue: 'react',
        });
      },
      projectName: () =>
        text({
          message: 'Project name:',
          placeholder: 'my-awesome-project',
          validate: (value): string | void => {
            return validateProjectName(value);
          },
        }),

      database: () =>
        select<{ value: DatabaseOption; label: string }[], DatabaseOption>({
          message: 'How would you like to interact with the database?',
          options: [
            { value: 'none' as const, label: 'None (Skip database setup)' },
            { value: 'prisma' as const, label: 'Prisma (Type-safe ORM)' },
            { value: 'mongoose' as const, label: 'Mongoose (Standard MongoDB ODM)' },
          ],
          initialValue: 'none',
        }),
      packageManager: () =>
        select<{ value: PackageManager; label: string }[], PackageManager>({
          message: 'Select a package manager:',
          options: [
            { value: 'npm' as const, label: 'npm' },
            { value: 'pnpm' as const, label: 'pnpm' },
            { value: 'bun' as const, label: 'bun' },
          ],
          initialValue: 'npm',
        }),
      useDocker: () =>
        confirm({
          message: 'Use Docker?',
          initialValue: false,
        }),
      useAuth: () =>
        confirm({
          message: 'Add authentication?',
          initialValue: false,
        }),
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
