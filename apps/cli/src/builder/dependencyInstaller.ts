import { execSync } from "child_process";
import consola from "consola";

import type { PackageManager } from "../types";

// Installs project dependencies in the target directory
export function installDependencies(
  packageManager: PackageManager,
  cwd: string
): boolean {
  const command = `${packageManager} install`;

  consola.info(`Installing dependencies with ${packageManager}...`);
  consola.debug(`Running: ${command}`);

  try {
    execSync(command, {
      cwd,
      stdio: "inherit", // Show installation progress in real-time
    });

    consola.success("Dependencies installed successfully");
    return true;
  } catch (error) {
    // Display helpful error message but don't throw - allow building to continue
    consola.warn("Failed to install dependencies");
    consola.debug(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    consola.info(
      `You can install dependencies manually later by running: ${command}`
    );
    return false;
  }
}
