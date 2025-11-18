import { execSync } from 'child_process';
import chalk from 'chalk';
import type { PackageManager } from '../types';

/**
 * Get the install command for the specified package manager
 * @param packageManager - The package manager to use (npm, pnpm, or bun)
 * @returns The install command string
 */
function getInstallCommand(packageManager: PackageManager): string {
  const commands: Record<PackageManager, string> = {
    npm: 'npm install',
    pnpm: 'pnpm install',
    bun: 'bun install',
  };

  return commands[packageManager];
}

/**
 * Install dependencies using the specified package manager
 * @param packageManager - The package manager to use
 * @param cwd - The working directory where dependencies should be installed
 * @returns true if installation succeeded, false if it failed
 */
export function installDependencies(packageManager: PackageManager, cwd: string): boolean {
  const command = getInstallCommand(packageManager);

  console.log(chalk.blue(`\n📦 Installing dependencies with ${packageManager}...`));
  console.log(chalk.gray(`Running: ${command}`));

  try {
    execSync(command, {
      cwd,
      stdio: 'inherit', // Show installation progress in real-time
    });

    console.log(chalk.green('✓ Dependencies installed successfully\n'));
    return true;
  } catch (error) {
    // Display helpful error message but don't throw - allow scaffolding to continue
    console.log(chalk.yellow('\n⚠ Warning: Failed to install dependencies'));
    console.log(chalk.gray(`Error: ${error instanceof Error ? error.message : String(error)}`));
    console.log(
      chalk.yellow(`You can install dependencies manually later by running: ${command}\n`)
    );
    return false;
  }
}
