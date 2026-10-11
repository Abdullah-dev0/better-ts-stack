import { log } from "@clack/prompts";
import { execSync } from "node:child_process";

// Initializes a git repository in the given directory
export function initializeGitRepository(cwd: string): boolean {
  try {
    execSync("git init", { cwd, stdio: "ignore" });
    log.success("Git repository initialized");
    return true;
  } catch {
    // Not fatal: git may not be installed
    log.warn('Could not initialize git. Run "git init" yourself.');
    return false;
  }
}
