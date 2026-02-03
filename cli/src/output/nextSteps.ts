import { ProjectConfig } from "../types";

// Generates a list of instructions for the user to follow after project creation
export function generateNextSteps(
  config: ProjectConfig,
  depsInstalled: boolean
): string[] {
  const steps: string[] = [];

  // Step 1: cd into project directory
  steps.push(`cd ${config.projectName}`);

  // Step 2: Set environment variables
  steps.push("Copy .env.example to .env and set your environment variables");

  if (config.useAuth) {
    steps.push("Set JWT_SECRET in .env (required for auth)");
    steps.push(
      "Create a user via POST /auth/register then login with /auth/login"
    );
  }

  // Step 3: Install dependencies if not already done
  if (!depsInstalled) {
    const installCmd = getInstallCommand(config.packageManager);
    steps.push(installCmd);
  }

  // Step 4: Database-specific steps
  if (config.database === "prisma") {
    steps.push(`${getRunCommand(config.packageManager)} prisma:generate`);
    steps.push(`${getRunCommand(config.packageManager)} prisma:migrate`);
  } else if (config.database === "mongoose") {
    // Mongoose just needs MongoDB running
    steps.push(
      "Ensure MongoDB is running locally or update MONGODB_URI in .env"
    );
  }

  // Step 5: Start dev server
  steps.push(`${getRunCommand(config.packageManager)} dev`);

  return steps;
}

// Returns the dependency installation command for a package manager
function getInstallCommand(packageManager: string): string {
  switch (packageManager) {
    case "npm":
      return "npm install";
    case "pnpm":
      return "pnpm install";
    case "bun":
      return "bun install";
    default:
      return "npm install";
  }
}

// Returns the script execution prefix for a package manager
function getRunCommand(packageManager: string): string {
  switch (packageManager) {
    case "npm":
      return "npm run";
    case "pnpm":
      return "pnpm run";
    case "bun":
      return "bun run";
    default:
      return "npm run";
  }
}

// Formats the next steps into a success message string
export function displayNextSteps(
  _projectName: string,
  steps: string[]
): string {
  const formattedSteps = steps
    .map((step, index) => `  ${index + 1}. ${step}`)
    .join("\n");

  const message = `
✨ Project created successfully!

Next steps:
${formattedSteps}

Your server will be running at http://localhost:3000
`;

  return message;
}
