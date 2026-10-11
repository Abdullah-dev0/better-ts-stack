// Everything the CLI prints outside of prompts
import path from "node:path";
import { cwd } from "node:process";

import { DEFAULT_PORT, ProjectConfig } from "../types";
import { amber, bold, dim, lavender, lime, pink, red } from "./theme";

// "better-ts-stack" drawn with box characters
const WORDMARK = [
  "┌┐ ┌─┐┌┬┐┌┬┐┌─┐┬─┐   ┌┬┐┌─┐   ┌─┐┌┬┐┌─┐┌─┐┬┌─",
  "├┴┐├┤  │  │ ├┤ ├┬┘─── │ └─┐───└─┐ │ ├─┤│  ├┴┐",
  "└─┘└─┘ ┴  ┴ └─┘┴└─    ┴ └─┘   └─┘ ┴ ┴ ┴└─┘┴ ┴",
];

function write(line = "") {
  process.stdout.write(`${line}\n`);
}

export const success = (message: string) => write(`${lime("✓")} ${message}`);
export const info = (message: string) => write(dim(`· ${message}`));
export const warn = (message: string) => write(`${amber("!")} ${message}`);
export const error = (message: string) => write(`${red("×")} ${message}`);

// Opens the session with the wordmark, tagline, and key hints
export function showBanner(version: string) {
  const fitsWordmark = (process.stdout.columns ?? 80) >= WORDMARK[0].length + 2;

  write();
  if (fitsWordmark) {
    for (const line of WORDMARK) write(`  ${amber(line)}`);
  } else {
    write(`  ${amber(bold("better-ts-stack"))}`);
  }
  write();
  write(`  ${lavender(bold("TypeScript projects, ready to run."))}`);
  write(
    `  ${dim(`v${version} · ↑↓ to move · enter to confirm · ctrl+c to cancel`)}`
  );
  write();
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

  write();
  write(`  ${amber(bold(config.projectName))}`);
  write(`  ${pink("Stack")}  ${stack.filter(Boolean).join(" · ")}`);
  write(`  ${pink("Setup")}  ${setup.filter(Boolean).join(" · ")}`);
  write(`  ${pink("Path ")}  ${path.relative(cwd(), targetDir) || "."}`);
  write();
}

// Shows the numbered next steps, with the commands to run highlighted
export function showNextSteps(steps: string[]) {
  write();
  write(`  ${amber(bold("Next steps"))}`);
  steps.forEach((step, index) => {
    const isCommand = /^(cd|npm|pnpm|bun) /.test(step);
    write(`  ${dim(`${index + 1}.`)} ${isCommand ? lime(step) : step}`);
  });
  write();
  write(`  ${dim(`Your app will run at http://localhost:${DEFAULT_PORT}`)}`);
  write();
}
