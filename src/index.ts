import consola from 'consola';
import { collectUserChoices, confirmBuild } from './prompts';
import { build } from './builder';
import { displayNextSteps } from './output/nextSteps';
import { isBuildError } from './types';
import { outro } from '@clack/prompts';
import path from 'path';
import { cwd } from 'process';

/**
 * Main CLI function
 * Orchestrates the entire CLI workflow from welcome message to completion
 */
export async function main(): Promise<void> {
  try {
    // Display welcome message
    // Note: Intro is now handled in collectUserChoices

    const config = await collectUserChoices();

    const targetDir = path.resolve(cwd(), config.projectName);

    // Confirm choices before building
    const confirmed = await confirmBuild(config, targetDir);

    if (!confirmed) {
      // This path is largely handled by confirmBuild's cancellation check,
      // but keeping it for safety if logic changes.
      process.exit(0);
    }

    // Call builder with ProjectConfig directly
    const result = await build(config, targetDir);

    // Display next steps on success
    if (result.success) {
      const nextStepsMessage = displayNextSteps(config.projectName, result.nextSteps);
      consola.success(nextStepsMessage);
      outro('Happy coding!');
      process.exit(0);
    } else {
      consola.error('\n❌ Building failed\n');
      process.exit(1);
    }
  } catch (error) {
    // Handle errors and display error messages
    if (isBuildError(error)) {
      consola.error(`\n❌ Error: ${error.message}`);
      consola.info(`   Code: ${error.code}\n`);
      process.exit(error.exitCode);
    }

    // Handle unknown errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    consola.error(`\n❌ Unexpected error: ${errorMessage}\n`);

    if (error instanceof Error && error.stack) {
      consola.debug(error.stack);
    }

    process.exit(1);
  }
}

main().catch((err) => {
  consola.error('❌ Error:', err);
});
