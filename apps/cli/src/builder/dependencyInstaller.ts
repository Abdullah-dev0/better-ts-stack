import { execSync } from "node:child_process";

import type { PackageManager } from "../types";
import { info, success, warn } from "../ui";

// Installs project dependencies in the target directory
export function installDependencies(
  packageManager: PackageManager,
  cwd: string
): boolean {
  const command = `${packageManager} install`;

  info(`Installing dependencies with ${packageManager}`);

  try {
    execSync(command, {
      cwd,
      stdio: "inherit", // Show installation progress in real-time
    });

    success("Dependencies installed");
    return true;
  } catch {
    // Not fatal: the project is complete and the install can be run later
    warn(`Could not install dependencies. Run "${command}" yourself.`);
    return false;
  }
}
