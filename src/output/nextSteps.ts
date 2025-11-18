/**
 * Next steps generator
 * Generates contextual next steps based on user choices and scaffolding results
 */

import { ProjectConfig } from '../types';

/**
 * Generate next steps based on project configuration
 * Creates a list of commands and instructions for the user to follow
 * @param config - Project configuration
 * @param depsInstalled - Whether dependencies were already installed
 * @returns Array of next step strings
 */
export function generateNextSteps(config: ProjectConfig, depsInstalled: boolean): string[] {
  const steps: string[] = [];

  // Step 1: cd into project directory
  steps.push(`cd ${config.projectName}`);

  // Step 2: Set environment variables
  steps.push('Copy .env.example to .env and set your environment variables');

  // Step 3: Install dependencies if not already done
  if (!depsInstalled) {
    const installCmd = getInstallCommand(config.packageManager);
    steps.push(installCmd);
  }

  // Step 4: Database-specific steps
  if (config.database === 'prisma') {
    // Prisma requires generate and migrate
    steps.push(`${getRunCommand(config.packageManager)} prisma:generate`);
    steps.push(`${getRunCommand(config.packageManager)} prisma:migrate`);
  } else if (config.database === 'mongoose') {
    // Mongoose just needs MongoDB running
    steps.push('Ensure MongoDB is running locally or update MONGODB_URI in .env');
  }

  // Step 5: Start dev server
  steps.push(`${getRunCommand(config.packageManager)} dev`);

  return steps;
}

/**
 * Get the install command for the specified package manager
 * @param packageManager - Package manager to use
 * @returns Install command string
 */
function getInstallCommand(packageManager: string): string {
  switch (packageManager) {
    case 'npm':
      return 'npm install';
    case 'pnpm':
      return 'pnpm install';
    case 'bun':
      return 'bun install';
    default:
      return 'npm install';
  }
}

/**
 * Get the run command prefix for the specified package manager
 * @param packageManager - Package manager to use
 * @returns Run command prefix string
 */
function getRunCommand(packageManager: string): string {
  switch (packageManager) {
    case 'npm':
      return 'npm run';
    case 'pnpm':
      return 'pnpm run';
    case 'bun':
      return 'bun run';
    default:
      return 'npm run';
  }
}

/**
 * Display success message with next steps
 * @param _projectName - Name of the created project (reserved for future use)
 * @param steps - Array of next step strings
 * @returns Complete formatted message with success banner and next steps
 */
export function displayNextSteps(_projectName: string, steps: string[]): string {
  const formattedSteps = steps.map((step, index) => `  ${index + 1}. ${step}`).join('\n');

  const message = `
✨ Project created successfully!

Next steps:
${formattedSteps}

Your server will be running at http://localhost:3000
`;

  return message;
}
