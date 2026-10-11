import { log, outro } from "@clack/prompts";
import fs from "fs-extra";
import path from "node:path";
import { cwd } from "node:process";

import { HELP_TEXT, parseCliArgs } from "./args";
import { build } from "./builder";
import { showIntro } from "./intro";
import { showNextSteps } from "./output/nextSteps";
import {
  collectProjectPath,
  collectStackChoices,
  confirmBuild,
  showSummary,
} from "./prompts";
import {
  buildError,
  DEFAULT_CHOICES,
  getApplicationType,
  ProjectConfig,
} from "./types";
import { validateDirectoryEmpty } from "./validators";

// Main entry point for the CLI tool
async function main(): Promise<void> {
  const args = parseCliArgs(process.argv.slice(2));

  if (args.help) {
    console.log(HELP_TEXT);
    return;
  }

  const { version } = (await fs.readJson(
    path.join(__dirname, "../package.json")
  )) as { version: string };

  if (args.version) {
    console.log(version);
    return;
  }

  showIntro(version);

  const projectPath = await collectProjectPath(args.projectPath, args.yes);
  const targetDir = path.resolve(cwd(), projectPath);

  // Fail before the remaining prompts when the directory cannot be used
  const directoryError = await validateDirectoryEmpty(targetDir);
  if (directoryError) throw buildError(directoryError, "DIRECTORY_NOT_EMPTY");

  const choices = await collectStackChoices(
    args.yes ? { ...DEFAULT_CHOICES, ...args.choices } : args.choices
  );

  const config: ProjectConfig = {
    projectName: path.basename(targetDir),
    applicationType: getApplicationType(choices.framework),
    ...choices,
  };

  showSummary(config, targetDir);

  if (args.dryRun) {
    outro("Dry run: no files were written.");
    return;
  }

  if (!args.yes) await confirmBuild();

  const result = await build(config, targetDir);

  showNextSteps(result.nextSteps);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    // Errors raised by the CLI carry a code and a message meant for the user
    log.error(
      err instanceof Error && "code" in err ? err.message : String(err)
    );
    process.exit(1);
  });
