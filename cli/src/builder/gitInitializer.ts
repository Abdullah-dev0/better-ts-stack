import { execSync } from 'child_process';
import consola from 'consola';

// Checks if git is installed and available in the system PATH
function isGitAvailable(): boolean {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    consola.warn('Git is not installed or not available in PATH');
    return false;
  }
}

// Initializes a new git repository in the given directory
function initGit(cwd: string): boolean {
  consola.info('Initializing git repository...');

  try {
    execSync('git init', {
      cwd,
      stdio: 'ignore',
    });

    consola.success('Git repository initialized');
    return true;
  } catch {
    consola.warn('Failed to initialize git repository');
    return false;
  }
}

// Stages all files and creates an initial commit
function createInitialCommit(cwd: string): boolean {
  consola.info('Creating initial commit...');

  try {
    // Add all files
    execSync('git add .', {
      cwd,
      stdio: 'ignore',
    });

    // Create initial commit
    execSync('git commit -m "Initial commit from better-ts-stack"', {
      cwd,
      stdio: 'ignore',
    });

    consola.success('Initial commit created');
    return true;
  } catch (error) {
    consola.warn('Failed to create initial commit');
    consola.debug(`Error: ${error instanceof Error ? error.message : String(error)}`);
    consola.info('You can create the initial commit manually later');
    return false;
  }
}

// Coordinates the full git initialization process
export function initializeGitRepository(cwd: string): boolean {
  // Check if git is available
  if (!isGitAvailable()) {
    consola.warn('Git is not installed or not available in PATH');
    consola.info('Skipping git initialization. You can initialize git manually later.');
    return false;
  }

  // Initialize git repository
  const gitInitSuccess = initGit(cwd);
  if (!gitInitSuccess) {
    consola.info('Continuing with building...');
    return false;
  }

  // Create initial commit
  const commitSuccess = createInitialCommit(cwd);
  if (!commitSuccess) {
    consola.info('Continuing with building...');
    return false;
  }

  return true;
}
