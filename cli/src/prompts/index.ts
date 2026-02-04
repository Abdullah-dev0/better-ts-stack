import { cancel, confirm, isCancel, select, text } from "@clack/prompts";
import consola from "consola";

import {
  ApplicationType,
  applicationTypeOptions,
  ProjectConfig,
} from "../types";
import { validateProjectName } from "../validators";
import { collectBackendChoices } from "./backend";
import { collectFrontendChoices } from "./frontend";

// Collects user input via interactive prompts
export async function collectUserChoices() {
  const projectName = await text({
    message: "Project name:",
    placeholder: "my-awesome-project",
    validate: (value) => validateProjectName(value),
  });

  if (isCancel(projectName)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  const applicationType = await select<ApplicationType>({
    message: "Application type:",
    options: applicationTypeOptions,
    initialValue: "backend",
  });

  if (isCancel(applicationType)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  let userChoices;
  if (applicationType === "backend") {
    userChoices = await collectBackendChoices();
  } else if (applicationType === "frontend") {
    userChoices = await collectFrontendChoices();
  } else {
    cancel("Invalid application type selected.");
    process.exit(0);
  }

  const choices: ProjectConfig = {
    projectName,
    applicationType,
    ...userChoices,
  };

  return choices;
}

// Displays a summary and asks for final confirmation before building
export async function confirmBuild(config: ProjectConfig, targetDir: string) {
  consola.info("Project Summary:");

  consola.box(
    `Project Name:    ${config.projectName}\n` +
      `Target Dir:      ${targetDir}\n` +
      `App Type:        ${config.applicationType}\n` +
      `Framework:       ${config.framework}\n` +
      `Database:        ${config.database}\n` +
      `Auth:            ${config.useAuth ? "Yes" : "No"}\n` +
      `Docker:          ${config.useDocker ? "Yes" : "No"}\n` +
      `Package Mgr:     ${config.packageManager}\n` +
      `Git Init:        ${config.initGit ? "Yes" : "No"}\n` +
      `Install Deps:    ${config.installDeps ? "Yes" : "No"}`
  );

  const shouldContinue = await confirm({
    message: "Looks good? Ready to build?",
    initialValue: true,
  });

  if (isCancel(shouldContinue)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  if (!shouldContinue) {
    cancel("Building cancelled by user.");
    process.exit(0);
  }
}
