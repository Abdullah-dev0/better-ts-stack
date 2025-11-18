/**
 * Inquirer prompt definitions and prompt manager
 */

import inquirer from 'inquirer';
import path from 'path';
import { ProjectConfig } from '../types';
import { validateProjectName } from '../validators';

/**
 * Project name input prompt with validation
 */
const projectNamePrompt: inquirer.InputQuestion = {
  type: 'input',
  name: 'projectName',
  message: 'Project name:',
  validate: (input: string) => {
    const result = validateProjectName(input);
    return result;
  },
};

/**
 * Database selection prompt
 */

const databasePrompt: inquirer.ListQuestion = {
  type: 'list',
  name: 'database', // This variable name is fine
  message: 'How would you like to interact with the database?', // More accurate
  choices: [
    {
      name: 'None (Skip database setup)',
      value: 'none',
    },
    {
      name: 'Prisma (Type-safe ORM)', // Cleaner
      value: 'prisma',
    },
    {
      name: 'Mongoose (Standard MongoDB ODM)',
      value: 'mongoose',
    },
  ],
  default: 'none',
};
/**
 * Package manager selection prompt
 */
const packageManagerPrompt: inquirer.ListQuestion = {
  type: 'list',
  name: 'packageManager',
  message: 'Select a package manager:',
  choices: [
    { name: 'npm', value: 'npm' },
    { name: 'pnpm', value: 'pnpm' },
    { name: 'bun', value: 'bun' },
  ],
  default: 'npm',
};

/**
 * Docker confirmation prompt
 */
const dockerPrompt: inquirer.ConfirmQuestion = {
  type: 'confirm',
  name: 'useDocker',
  message: 'Use Docker?',
  default: false,
};

/**
 * Auth confirmation prompt
 */
const authPrompt: inquirer.ConfirmQuestion = {
  type: 'confirm',
  name: 'useAuth',
  message: 'Add authentication?',
  default: false,
};

/**
 * Git initialization confirmation prompt
 */
const gitPrompt: inquirer.ConfirmQuestion = {
  type: 'confirm',
  name: 'initGit',
  message: 'Init git?',
  default: true,
};

/**
 * Dependency installation confirmation prompt
 */
const installDepsPrompt: inquirer.ConfirmQuestion = {
  type: 'confirm',
  name: 'installDeps',
  message: 'Install dependencies now?',
  default: true,
};

/**
 * Collects all user choices through interactive prompts
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns Promise resolving to ProjectConfig object with all selections
 */
export async function collectUserChoices(cwd: string = process.cwd()): Promise<ProjectConfig> {
  const answers = await inquirer.prompt<Omit<ProjectConfig, 'targetDir'>>([
    projectNamePrompt,
    databasePrompt,
    packageManagerPrompt,
    dockerPrompt,
    authPrompt,
    gitPrompt,
    installDepsPrompt,
  ]);

  // Calculate targetDir based on projectName and current working directory
  const targetDir = path.resolve(cwd, answers.projectName);

  return {
    ...answers,
    targetDir,
  };
}
