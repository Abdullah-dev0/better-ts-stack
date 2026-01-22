import { outro } from '@clack/prompts';
import consola from 'consola';
import path from 'path';
import { cwd } from 'process';
import { build } from './builder';
import { displayNextSteps } from './output/nextSteps';
import { collectUserChoices, confirmBuild } from './prompts';

// Main entry point for the CLI tool
async function main(): Promise<void> {
  const config = await collectUserChoices();
  const targetDir = path.resolve(cwd(), config.projectName);

  await confirmBuild(config, targetDir);

  const result = await build(config, targetDir);

  if (result.success) {
    const nextStepsMessage = displayNextSteps(config.projectName, result.nextSteps);
    consola.success(nextStepsMessage);
    outro('Happy coding!');
    process.exit(0);
  }
}

main().catch((err) => {
  consola.error('❌ Error:', err);
  process.exit(1);
});
