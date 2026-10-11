// Everything the CLI prints outside of prompts
import path from "node:path";
import { cwd } from "node:process";

import { BuildPlan, DEFAULT_PORT, ProjectConfig } from "../types";
import { amber, bold, dim, lavender, lime, pink, red } from "./theme";

// "better-ts-stack" in the figlet Big font
const WORDMARK = [
  "  _          _   _                   _                  _             _",
  " | |        | | | |                 | |                | |           | |",
  " | |__   ___| |_| |_ ___ _ __ ______| |_ ___ ______ ___| |_ __ _  ___| | __",
  " | '_ \\ / _ \\ __| __/ _ \\ '__|______| __/ __|______/ __| __/ _` |/ __| |/ /",
  " | |_) |  __/ |_| ||  __/ |         | |_\\__ \\      \\__ \\ || (_| | (__|   <",
  " |_.__/ \\___|\\__|\\__\\___|_|          \\__|___/      |___/\\__\\__,_|\\___|_|\\_\\",
];

function write(line = "") {
  process.stdout.write(`${line}\n`);
}

export const success = (message: string) => write(`${lime("✓")} ${message}`);
export const info = (message: string) => write(dim(`· ${message}`));
export const warn = (message: string) => write(`${amber("!")} ${message}`);
export const error = (message: string) => write(`${red("×")} ${message}`);

const WORDMARK_WIDTH = Math.max(...WORDMARK.map((line) => line.length));

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning.";
  if (hour < 18) return "Good afternoon.";
  return "Good evening.";
}

// Opens the session with the wordmark, tagline, and key hints. An interactive
// session starts on a cleared screen; console.clear() does nothing when piped
export function showBanner(version: string, isInteractive: boolean) {
  if (isInteractive) console.clear();

  write();
  if ((process.stdout.columns ?? 80) > WORDMARK_WIDTH) {
    for (const line of WORDMARK) write(lime(line));
  } else {
    write(lime(bold("better-ts-stack")));
  }
  write();
  write(lavender(bold("TypeScript projects, ready to run.")));
  if (isInteractive) {
    write(dim(greeting()));
    write(lime(bold("Answer a few questions to get started.")));
    write(
      dim(`v${version} · ↑↓ to move · enter to confirm · ctrl+c to cancel`)
    );
  } else {
    write(dim(`v${version}`));
  }
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

  write(`  ${amber(bold(config.projectName))}`);
  write(`  ${pink("Stack")}  ${stack.filter(Boolean).join(" · ")}`);
  write(`  ${pink("Setup")}  ${setup.filter(Boolean).join(" · ")}`);
  write(`  ${pink("Path ")}  ${path.relative(cwd(), targetDir) || "."}`);
  write();
}

// Prints a titled list, or nothing when the list is empty
function showSection(title: string, lines: string[]) {
  if (lines.length === 0) return;

  write(`  ${amber(bold(title))} ${dim(`(${lines.length})`)}`);
  for (const line of lines) write(`  ${line}`);
  write();
}

// Formats name/value pairs as two aligned columns
function toColumns(entries: Record<string, string>): string[] {
  const width = Math.max(0, ...Object.keys(entries).map((key) => key.length));
  return Object.entries(entries).map(
    ([key, value]) => `${key.padEnd(width)}  ${dim(value)}`
  );
}

// Shows everything a build would produce, for --dry-run
export function showPlan(plan: BuildPlan) {
  showSection("Files", plan.files);
  showSection("Dependencies", toColumns(plan.dependencies));
  showSection("Dev dependencies", toColumns(plan.devDependencies));
  showSection("Overrides", toColumns(plan.overrides));
  showSection("Scripts", toColumns(plan.scripts));
  showSection(
    "Environment variables",
    Object.entries(plan.envVars).map(([key, value]) => `${key}=${dim(value)}`)
  );
  showSection("Commands", plan.commands.map(lime));
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
