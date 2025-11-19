import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * Check if git is available on the system
 * @param - None
 * @returns true if git is installed and available, false otherwise
 */
function isGitAvailable(): boolean {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Initialize a git repository in the specified directory
 * @param cwd - The working directory where git should be initialized
 * @returns true if git init succeeded, false if it failed
 */
function initGit(cwd: string): boolean {
  console.log(chalk.blue('\n🔧 Initializing git repository...'));

  try {
    execSync('git init', {
      cwd,
      stdio: 'ignore',
    });

    console.log(chalk.green('✓ Git repository initialized'));
    return true;
  } catch (error) {
    console.log(chalk.yellow('⚠ Warning: Failed to initialize git repository'));
    console.log(chalk.gray(`Error: ${error instanceof Error ? error.message : String(error)}`));
    return false;
  }
}

/**
 * Create an initial commit with all files in the repository
 * @param cwd - The working directory where the commit should be created
 * @returns true if commit succeeded, false if it failed
 */
function createInitialCommit(cwd: string): boolean {
  console.log(chalk.blue('📝 Creating initial commit...'));

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

    console.log(chalk.green('✓ Initial commit created\n'));
    return true;
  } catch (error) {
    console.log(chalk.yellow('⚠ Warning: Failed to create initial commit'));
    console.log(chalk.gray(`Error: ${error instanceof Error ? error.message : String(error)}`));
    console.log(chalk.gray('You can create the initial commit manually later\n'));
    return false;
  }
}

/**
 * Initialize git repository and create initial commit
 * Handles the complete git initialization workflow with proper error handling
 * @param cwd - The working directory where git should be initialized
 * @returns true if git was successfully initialized and committed, false otherwise
 */
export function initializeGitRepository(cwd: string): boolean {
  // Check if git is available
  if (!isGitAvailable()) {
    console.log(chalk.yellow('\n⚠ Warning: Git is not installed or not available in PATH'));
    console.log(
      chalk.gray('Skipping git initialization. You can initialize git manually later.\n')
    );
    return false;
  }

  // Initialize git repository
  const gitInitSuccess = initGit(cwd);
  if (!gitInitSuccess) {
    console.log(chalk.gray('Continuing with building...\n'));
    return false;
  }

  // Create initial commit
  const commitSuccess = createInitialCommit(cwd);
  if (!commitSuccess) {
    console.log(chalk.gray('Continuing with building...\n'));
    return false;
  }

  return true;
}
