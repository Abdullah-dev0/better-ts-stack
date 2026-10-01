import { ProjectConfig } from "../types";

const MONGODB_AUTH_SETUP_URL =
  "https://better-ts-stack.abdullahtech.me/docs/modules/database#mongoose-and-mongodb";

// Node 24 releases before 24.20 report mismatched file stats on Windows, which
// makes srvx (TanStack's production server) reject every static asset
const MIN_TANSTACK_WINDOWS_NODE = [24, 20];

function isNodeBelow([major, minor]: number[]): boolean {
  const [currentMajor, currentMinor] = process.versions.node
    .split(".")
    .map(Number);
  return (
    currentMajor < major || (currentMajor === major && currentMinor < minor)
  );
}

// Generates a list of instructions for the user to follow after project creation
export function generateNextSteps(
  config: ProjectConfig,
  depsInstalled: boolean
): string[] {
  const steps: string[] = [];
  const isFullstack = config.applicationType === "fullstack";

  // Step 1: cd into project directory
  steps.push(`cd ${config.projectName}`);

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

  if (
    config.framework === "tanstack" &&
    process.platform === "win32" &&
    isNodeBelow(MIN_TANSTACK_WINDOWS_NODE)
  ) {
    steps.push(
      `Upgrade Node.js to ${MIN_TANSTACK_WINDOWS_NODE.join(".")} or newer: on Windows, ` +
        `Node ${process.versions.node} makes "npm start" return 404 for CSS, JS, and other static files`
    );
  }

  // Step 3: Install dependencies if not already done
  if (!depsInstalled) {
    steps.push(`${config.packageManager} install`);
  }

  // Step 4: Database-specific steps
  if (config.database === "prisma") {
    steps.push(`${config.packageManager} run prisma:generate`);
    steps.push(`${config.packageManager} run prisma:migrate`);
  } else if (config.database === "drizzle") {
    steps.push(`${config.packageManager} run db:generate`);
    steps.push(`${config.packageManager} run db:migrate`);
  } else if (config.database === "mongoose") {
    steps.push(
      "Ensure MongoDB is running locally or update MONGODB_URI in .env"
    );

    // Better Auth's MongoDB adapter uses transactions, which need a replica set
    if (config.useAuth && isFullstack) {
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

  return steps;
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
