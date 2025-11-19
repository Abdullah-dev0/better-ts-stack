import chalk from 'chalk';
import { collectUserChoices, confirmScaffold } from './prompts';
import { scaffold } from './scaffolder';
import { displayNextSteps } from './output/nextSteps';
import { isScaffoldError } from './types';

/**
 * Main CLI function
 * Orchestrates the entire CLI workflow from welcome message to completion
 */
export async function main(): Promise<void> {
  try {
    // Display welcome message
    console.log(chalk.bold.cyan('\n╔════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║                                        ║'));
    console.log(chalk.bold.cyan('║      🚀 better-ts-stack                ║'));
    console.log(chalk.bold.cyan('║                                        ║'));
    console.log(chalk.bold.cyan('║  Scaffold production-ready backends    ║'));
    console.log(chalk.bold.cyan('║                                        ║'));
    console.log(chalk.bold.cyan('╚════════════════════════════════════════╝\n'));
    console.log(chalk.bold("Let's set up your project:\n"));
    const config = await collectUserChoices();

    // Confirm choices before scaffolding
    const confirmed = await confirmScaffold(config);

    if (!confirmed) {
      console.log(chalk.yellow('\n⚠ Scaffolding cancelled by user.\n'));
      process.exit(0);
    }

    // Call scaffolder with ProjectConfig directly
    const result = await scaffold(config);

    // Display next steps on success
    if (result.success) {
      const nextStepsMessage = displayNextSteps(config.projectName, result.nextSteps);
      console.log(chalk.green(nextStepsMessage));
      process.exit(0);
    } else {
      console.error(chalk.red('\n❌ Scaffolding failed\n'));
      process.exit(1);
    }
  } catch (error) {
    // Handle errors and display error messages
    if (isScaffoldError(error)) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      console.error(chalk.gray(`   Code: ${error.code}\n`));
      process.exit(error.exitCode);
    }

    // Handle unknown errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`\n❌ Unexpected error: ${errorMessage}\n`));

    if (error instanceof Error && error.stack) {
      console.error(chalk.gray(error.stack));
    }

    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err);
});
