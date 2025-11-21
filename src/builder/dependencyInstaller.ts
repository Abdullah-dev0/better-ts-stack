import { execSync } from 'child_process';
import consola from 'consola';
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

  consola.info(`Installing dependencies with ${packageManager}...`);
  consola.debug(`Running: ${command}`);

  try {
    execSync(command, {
      cwd,
      stdio: 'inherit', // Show installation progress in real-time
    });

    consola.success('Dependencies installed successfully');
    return true;
  } catch (error) {
    // Display helpful error message but don't throw - allow building to continue
    consola.warn('Failed to install dependencies');
    consola.debug(`Error: ${error instanceof Error ? error.message : String(error)}`);
    consola.info(`You can install dependencies manually later by running: ${command}`);
    return false;
  }
}
