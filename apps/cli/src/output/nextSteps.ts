import path from "node:path";
import { cwd } from "node:process";

import { ProjectConfig } from "../types";

const MONGODB_AUTH_SETUP_URL =
  "https://better-ts-stack.abdullahtech.me/docs/modules/database#mongoose-and-mongodb";

// Generates a list of instructions for the user to follow after project
// creation. The README version leaves out the cd step, which only makes
// sense in the terminal
export function generateNextSteps(
  config: ProjectConfig,
  targetDir: string,
  depsInstalled: boolean,
  isForReadme = false
): string[] {
  const steps: string[] = [];
  const isFullstack = config.applicationType === "fullstack";

  // Step 1: cd into project directory, unless it was created in place
  // Quoted when it has spaces, so the command can be pasted as it is
  const relativeDir = path.relative(cwd(), targetDir);
  if (relativeDir && !isForReadme) {
    steps.push(
      /\s/.test(relativeDir) ? `cd "${relativeDir}"` : `cd ${relativeDir}`
    );
  }

  // Step 2: Set environment variables
  if (config.database !== "none") {
    steps.push(
      "Review the generated .env and set your database connection details"
    );
  }

  if (config.useAuth) {
    steps.push(
      isFullstack
        ? "Review BETTER_AUTH_SECRET and BETTER_AUTH_URL in .env"
        : "Review the generated JWT_SECRET in .env"
    );
  }

  // Step 3: Install dependencies if not already done
  if (!depsInstalled) {
    steps.push(`${config.packageManager} install`);
  }

  // Step 4: Database-specific steps. With Docker, Compose runs the database
  const hasDockerDatabase = config.useDocker && config.database !== "none";
  if (hasDockerDatabase) {
    steps.push("docker compose up -d db");
  }

  if (config.database === "prisma") {
    steps.push(`${config.packageManager} run prisma:generate`);
    steps.push(`${config.packageManager} run prisma:migrate`);
  } else if (config.database === "drizzle") {
    steps.push(`${config.packageManager} run db:generate`);
    steps.push(`${config.packageManager} run db:migrate`);
  } else if (config.database === "mongoose") {
    if (!hasDockerDatabase) {
      steps.push(
        "Ensure MongoDB is running locally or update MONGODB_URI in .env"
      );
    }

    // Better Auth's MongoDB adapter uses transactions, which need a replica
    // set; the Compose database already runs as one
    if (config.useAuth && isFullstack && !hasDockerDatabase) {
      steps.push(
        "Better Auth uses MongoDB transactions: run MongoDB as a replica set (or use Atlas) " +
          'and create the "user", "session", "account", and "verification" collections before signing up. ' +
          `See ${MONGODB_AUTH_SETUP_URL}`
      );
    }
  }

  // Step 5: Start dev server
  steps.push(`${config.packageManager} run dev`);

  if (config.useAuth) {
    steps.push(
      isFullstack
        ? "Visit /sign-up to create your first account"
        : "Create a user via POST /auth/register then login with /auth/login"
    );
  }

  if (config.useDocker) {
    steps.push(
      `To run the app in Docker instead: ${config.packageManager} run docker:up`
    );
  }

  return steps;
}
