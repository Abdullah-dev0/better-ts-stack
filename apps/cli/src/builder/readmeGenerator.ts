// Writes the README.md of a generated project
import fs from "fs-extra";
import path from "node:path";

import { generateNextSteps } from "../output/nextSteps";
import {
  buildError,
  Database,
  Framework,
  MergedConfig,
  ProjectConfig,
} from "../types";
import { GENERATED_SECRETS } from "./configGenerator";

const DOCS_URL = "https://better-ts-stack.abdullahtech.me/docs";

const FRAMEWORK_LABELS: Record<Framework, string> = {
  express: "Express 5",
  nestjs: "NestJS 12",
  nextjs: "Next.js 16 (App Router)",
  tanstack: "TanStack Start",
};

const DATABASE_LABELS: Record<Exclude<Database, "none">, string> = {
  prisma: "Prisma with PostgreSQL",
  drizzle: "Drizzle with PostgreSQL",
  mongoose: "Mongoose with MongoDB",
};

// Renders rows as a Markdown table; pipes inside cells are escaped
function table(headers: string[], rows: string[][]): string[] {
  const cell = (text: string) => text.replace(/\|/g, "\\|");
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
  ];
}

// Builds the README content from the project's choices and merged config
export function renderReadme(
  config: ProjectConfig,
  mergedConfig: MergedConfig,
  targetDir: string
): string {
  const isFullstack = config.applicationType === "fullstack";
  const lines: string[] = [
    `# ${config.projectName}`,
    "",
    `Created with [better-ts-stack](${DOCS_URL}).`,
    "",
    "## Stack",
    "",
    `- **Framework:** ${FRAMEWORK_LABELS[config.framework]}`,
  ];

  if (config.database !== "none") {
    lines.push(`- **Database:** ${DATABASE_LABELS[config.database]}`);
  }
  if (config.useAuth) {
    lines.push(
      isFullstack
        ? "- **Auth:** Better Auth with email and password"
        : "- **Auth:** JWT with `/auth/register`, `/auth/login`, and `/auth/me`"
    );
  }
  if (config.useDocker) lines.push("- **Docker:** Dockerfile and Compose file");
  lines.push(`- **Package manager:** ${config.packageManager}`, "");

  const steps = generateNextSteps(config, targetDir, false, true);
  lines.push(
    "## Getting started",
    "",
    ...steps.map((step, index) => {
      const isCommand = /^(npm|pnpm|bun|docker) /.test(step);
      return `${index + 1}. ${isCommand ? `\`${step}\`` : step}`;
    }),
    ""
  );

  // "pre" and "post" hooks run on their own, so only the commands to type
  // are listed
  const scripts = Object.entries(mergedConfig.scripts).filter(
    ([name]) => !/^(pre|post)./.test(name)
  );
  if (scripts.length > 0) {
    lines.push(
      "## Scripts",
      "",
      ...table(
        ["Command", "Runs"],
        scripts.map(([name, command]) => [
          `\`${config.packageManager} run ${name}\``,
          `\`${command}\``,
        ])
      ),
      ""
    );
  }

  const envVars = Object.entries(mergedConfig.envVars);
  if (envVars.length > 0) {
    lines.push(
      "## Environment variables",
      "",
      "`.env` holds your local values and is not committed. `.env.example` lists the same variables for other developers.",
      "",
      ...table(
        ["Variable", "Default"],
        envVars.map(([key, value]) => [
          `\`${key}\``,
          GENERATED_SECRETS.includes(key)
            ? "A random value generated in `.env`"
            : `\`${value}\``,
        ])
      ),
      ""
    );
  }

  lines.push(
    "## Learn more",
    "",
    `- [${isFullstack ? "Full-stack" : "Backend"} guide](${DOCS_URL}/modules/${isFullstack ? "frontend" : "backend"})`
  );
  if (config.database !== "none") {
    lines.push(`- [Database guide](${DOCS_URL}/modules/database)`);
  }
  if (config.useAuth) lines.push(`- [Auth guide](${DOCS_URL}/modules/auth)`);
  if (config.useDocker) {
    lines.push(`- [Docker guide](${DOCS_URL}/modules/docker)`);
  }
  lines.push(`- [Troubleshooting](${DOCS_URL}/troubleshooting)`, "");

  return lines.join("\n");
}

// Writes README.md into the project
export async function generateReadme(
  targetDir: string,
  config: ProjectConfig,
  mergedConfig: MergedConfig
): Promise<void> {
  try {
    await fs.writeFile(
      path.join(targetDir, "README.md"),
      renderReadme(config, mergedConfig, targetDir),
      "utf-8"
    );
  } catch (error) {
    throw buildError(error, "README_ERROR", "Failed to generate README.md");
  }
}
