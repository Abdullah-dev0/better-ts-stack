import { log } from "@clack/prompts";
import { execSync } from "node:child_process";

import type { PackageManager } from "../types";

// Installs project dependencies in the target directory
export function installDependencies(
  packageManager: PackageManager,
  cwd: string
): boolean {
  const command = `${packageManager} install`;

  log.step(`Installing dependencies with ${packageManager}`);

  try {
    execSync(command, {
      cwd,
      stdio: "inherit", // Show installation progress in real-time
    });

    log.success("Dependencies installed");
    return true;
  } catch {
    // Not fatal: the project is complete and the install can be run later
    log.warn(`Could not install dependencies. Run "${command}" yourself.`);
    return false;
  }
}
