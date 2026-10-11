import { cancel, confirm, isCancel, note, text } from "@clack/prompts";
import path from "node:path";
import { cwd } from "node:process";

import { buildError, ProjectConfig } from "../types";
import { validateProjectPath } from "../validators";
import { ask } from "./stack";

export { collectStackChoices } from "./stack";

// Returns the project path from the command line, or asks for it
export async function collectProjectPath(
  preset: string | undefined,
  isNonInteractive: boolean
): Promise<string> {
  if (preset !== undefined) {
    const error = validateProjectPath(preset);
    if (error) throw buildError(error, "INVALID_ARGUMENT");
  } else if (isNonInteractive) {
    throw buildError(
      "A project path is required with --yes, for example: better-ts-stack my-app --yes",
      "INVALID_ARGUMENT"
    );
  }

  return ask(preset, () =>
    text({
      message: "Project name:",
      placeholder: "my-awesome-project",
      validate: (value) => validateProjectPath(value ?? ""),
    })
  );
}

// Displays a summary of what will be built
export function showSummary(config: ProjectConfig, targetDir: string) {
  const stack = [
    config.framework,
    config.database !== "none" && config.database,
    config.useAuth && "auth",
    config.useDocker && "docker",
  ];
  const setup = [
    config.packageManager,
    config.initGit && "git",
    config.installDeps && "install dependencies",
  ];

  note(
    [
      `Project    ${config.projectName}`,
      `Directory  ${path.relative(cwd(), targetDir) || "."}`,
      `Stack      ${stack.filter(Boolean).join(" · ")}`,
      `Setup      ${setup.filter(Boolean).join(" · ")}`,
    ].join("\n"),
    "Summary"
  );
}

// Asks for final confirmation before building
export async function confirmBuild() {
  const shouldContinue = await confirm({
    message: "Create this project?",
    initialValue: true,
  });

  if (isCancel(shouldContinue)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  if (!shouldContinue) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
}
