// Command-line flag parsing; every flag is optional and falls back to a prompt
import { parseArgs } from "node:util";

import {
  backendFrameworkOptions,
  buildError,
  Database,
  Framework,
  frontendFrameworkOptions,
  PackageManager,
  packageManagerOptions,
  StackChoices,
} from "./types";

const FRAMEWORKS: Framework[] = [
  ...backendFrameworkOptions,
  ...frontendFrameworkOptions,
].map((option) => option.value);
const DATABASES: Database[] = ["none", "prisma", "drizzle", "mongoose"];
const PACKAGE_MANAGERS: PackageManager[] = packageManagerOptions.map(
  (option) => option.value
);

export const HELP_TEXT = `Usage: better-ts-stack [project-path] [options]

Options left out are asked interactively, unless --yes is given.

  --framework <name>      ${FRAMEWORKS.join(" | ")}
  --database <name>       ${DATABASES.join(" | ")}
  --pm <name>             ${PACKAGE_MANAGERS.join(" | ")}
  --auth, --no-auth       Add authentication
  --docker, --no-docker   Add Docker files
  --git, --no-git         Initialize a git repository
  --install, --no-install Install dependencies
  -y, --yes               Use defaults for missing options and skip confirmation
  --dry-run               Show what would be created without writing files
  -h, --help              Show this help
  -v, --version           Show the version

Examples:
  better-ts-stack my-api --framework nestjs --database prisma --auth --yes
  better-ts-stack . --framework nextjs --database drizzle --pm pnpm
`;

export interface CliArgs {
  projectPath?: string;
  choices: Partial<StackChoices>;
  yes: boolean;
  dryRun: boolean;
  help: boolean;
  version: boolean;
}

function parseChoice<T extends string>(
  flag: string,
  value: string | undefined,
  allowed: T[]
): T | undefined {
  if (value === undefined) return undefined;
  if (!allowed.includes(value as T)) {
    throw buildError(
      `Invalid value "${value}" for --${flag}. Use one of: ${allowed.join(", ")}`,
      "INVALID_ARGUMENT"
    );
  }
  return value as T;
}

export function parseCliArgs(argv: string[]): CliArgs {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      allowNegative: true,
      options: {
        framework: { type: "string" },
        database: { type: "string" },
        pm: { type: "string" },
        auth: { type: "boolean" },
        docker: { type: "boolean" },
        git: { type: "boolean" },
        install: { type: "boolean" },
        yes: { type: "boolean", short: "y" },
        "dry-run": { type: "boolean" },
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
      },
    });
  } catch (error) {
    throw buildError(error, "INVALID_ARGUMENT");
  }

  const { values, positionals } = parsed;
  if (positionals.length > 1) {
    throw buildError(
      `Expected one project path, got: ${positionals.join(" ")}`,
      "INVALID_ARGUMENT"
    );
  }

  const choices: Partial<StackChoices> = {
    framework: parseChoice("framework", values.framework, FRAMEWORKS),
    database: parseChoice("database", values.database, DATABASES),
    packageManager: parseChoice("pm", values.pm, PACKAGE_MANAGERS),
    useAuth: values.auth,
    useDocker: values.docker,
    initGit: values.git,
    installDeps: values.install,
  };

  return {
    projectPath: positionals[0],
    // Keep only the flags that were passed, so the rest can take defaults
    choices: Object.fromEntries(
      Object.entries(choices).filter(([, value]) => value !== undefined)
    ),
    yes: values.yes ?? false,
    dryRun: values["dry-run"] ?? false,
    help: values.help ?? false,
    version: values.version ?? false,
  };
}
