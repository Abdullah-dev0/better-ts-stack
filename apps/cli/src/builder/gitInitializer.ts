import { execSync } from "node:child_process";

import { success, warn } from "../ui";

// Initializes a git repository in the given directory
export function initializeGitRepository(cwd: string): boolean {
  try {
    execSync("git init", { cwd, stdio: "ignore" });
    success("Git repository initialized");
    return true;
  } catch {
    // Not fatal: git may not be installed
    warn('Could not initialize git. Run "git init" yourself.');
    return false;
  }
}
