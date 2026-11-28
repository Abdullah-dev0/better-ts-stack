// Command-line flag parsing; every flag is optional and falls back to a prompt
import { parseArgs } from "node:util";

import {
  aiOptions,
  AiSdk,
  ApiFramework,
  apiFrameworkOptions,
  backendFrameworkOptions,
  buildError,
  Database,
  DataOwner,
  Framework,
  frontendFrameworkOptions,
  ownerOptions,
  PackageManager,
  packageManagerOptions,
  Payments,
  paymentsOptions,
  StackChoices,
} from "./types";

const FRAMEWORKS: Framework[] = [
  ...backendFrameworkOptions,
  ...frontendFrameworkOptions,
].map((option) => option.value);
const DATABASES: Database[] = ["none", "prisma", "drizzle", "mongoose"];
const API_FRAMEWORKS: ApiFramework[] = apiFrameworkOptions.map(
  (option) => option.value
);
const OWNERS: DataOwner[] = ownerOptions.map((option) => option.value);
const AI_SDKS: AiSdk[] = aiOptions.map((option) => option.value);
const PAYMENTS: Payments[] = paymentsOptions.map((option) => option.value);
const PACKAGE_MANAGERS: PackageManager[] = packageManagerOptions.map(
  (option) => option.value
);

export const HELP_TEXT = `Usage: better-ts-stack [project-path] [options]

Options left out are asked interactively, unless --yes is given.

  --framework <name>      ${FRAMEWORKS.join(" | ")} (the web app in a monorepo)
  --monorepo              Turborepo with apps/web and apps/api
  --api <name>            ${API_FRAMEWORKS.join(" | ")}: the api of a monorepo
  --owner <app>           ${OWNERS.join(" | ")}: the monorepo app that owns users and data
                          (auth, database, AI chat route)
  --database <name>       ${DATABASES.join(" | ")}
  --pm <name>             ${PACKAGE_MANAGERS.join(" | ")}
  --auth, --no-auth       Add authentication
  --ai <name>             ${AI_SDKS.join(" | ")}: a streaming AI chat endpoint
  --payments <name>       ${PAYMENTS.join(" | ")}: subscriptions (needs --auth and
                          a database)
  --docker, --no-docker   Add Docker files
  --rate-limit, --no-rate-limit
                          Add rate limiting (Express and NestJS)
  --ci, --no-ci           Add a GitHub Actions workflow
  --no-agents             Leave out AGENTS.md for AI coding agents (added by
                          default)
  --vscode, --no-vscode   Add VS Code settings and recommended extensions
  --git, --no-git         Initialize a git repository
  --install, --no-install Install dependencies
  -y, --yes               Use defaults for missing options and skip confirmation
  --dry-run               List the files, dependencies, scripts, environment
                          variables, and commands without writing anything
  -h, --help              Show this help
  -v, --version           Show the version

Examples:
  better-ts-stack my-api --framework nestjs --database prisma --auth --yes
  better-ts-stack . --framework nextjs --database drizzle --pm pnpm
  better-ts-stack my-app --monorepo --framework nextjs --api express --database prisma --auth --yes
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
        monorepo: { type: "boolean" },
        api: { type: "string" },
        owner: { type: "string" },
        database: { type: "string" },
        pm: { type: "string" },
        auth: { type: "boolean" },
        ai: { type: "string" },
        payments: { type: "string" },
        docker: { type: "boolean" },
        "rate-limit": { type: "boolean" },
        ci: { type: "boolean" },
        agents: { type: "boolean" },
        vscode: { type: "boolean" },
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
    monorepo: values.monorepo,
    apiFramework: parseChoice("api", values.api, API_FRAMEWORKS),
    owner: parseChoice("owner", values.owner, OWNERS),
    database: parseChoice("database", values.database, DATABASES),
    packageManager: parseChoice("pm", values.pm, PACKAGE_MANAGERS),
    useAuth: values.auth,
    ai: parseChoice("ai", values.ai, AI_SDKS),
    payments: parseChoice("payments", values.payments, PAYMENTS),
    useDocker: values.docker,
    useRateLimit: values["rate-limit"],
    useCi: values.ci,
    useAgents: values.agents,
    useVscode: values.vscode,
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
