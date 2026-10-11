import { execSync } from "node:child_process";

import { info, success, warn } from "../ui";

// True when the directory is already tracked by a git repository above it
export function isInsideGitRepository(cwd: string): boolean {
  try {
    const output = execSync("git rev-parse --is-inside-work-tree", {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
    });
    return output.toString().trim() === "true";
  } catch {
    return false;
  }
}

// Initializes a git repository in the given directory
export function initializeGitRepository(cwd: string): boolean {
  // A project created inside a repository (apps/api in a monorepo) must not
  // get a nested repository of its own
  if (isInsideGitRepository(cwd)) {
    info("Already inside a git repository, skipped git init");
    return false;
  }

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
