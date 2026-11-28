// The stack builder at /builder: the choices it offers, the command they map
// to, the link that shares them, and the files the CLI would write for them
import { MODULE_FILES } from "./stack-files";

export type Framework = "express" | "nestjs" | "nextjs" | "tanstack";
export type Database = "none" | "prisma" | "drizzle" | "mongoose";
export type PackageManager = "npm" | "pnpm" | "bun";
export type Ai = "none" | "vercel" | "tanstack";
export type Payments = "none" | "polar" | "stripe";

export interface StackChoices {
  framework: Framework;
  database: Database;
  packageManager: PackageManager;
  ai: Ai;
  payments: Payments;
  useAuth: boolean;
  useDocker: boolean;
  useRateLimit: boolean;
  useCi: boolean;
  useAgents: boolean;
  useVscode: boolean;
}

export const PROJECT_NAME = "my-app";

export const DEFAULT_CHOICES: StackChoices = {
  framework: "nestjs",
  database: "prisma",
  packageManager: "npm",
  ai: "none",
  payments: "none",
  useAuth: true,
  useDocker: true,
  useRateLimit: false,
  useCi: false,
  useAgents: true,
  useVscode: false,
};

export interface StackOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

export const FRAMEWORK_OPTIONS: (StackOption<Framework> & {
  kind: "backend" | "full-stack";
})[] = [
  {
    value: "express",
    label: "Express",
    kind: "backend",
    description: "Express 5 API server",
  },
  {
    value: "nestjs",
    label: "NestJS",
    kind: "backend",
    description: "NestJS 12 API server",
  },
  {
    value: "nextjs",
    label: "Next.js",
    kind: "full-stack",
    description: "App Router, React 19",
  },
  {
    value: "tanstack",
    label: "TanStack Start",
    kind: "full-stack",
    description: "Vite, Nitro, React 19",
  },
];

export const DATABASE_OPTIONS: StackOption<Database>[] = [
  { value: "none", label: "None", description: "No database" },
  { value: "prisma", label: "Prisma", description: "PostgreSQL ORM" },
  { value: "drizzle", label: "Drizzle", description: "PostgreSQL ORM" },
  { value: "mongoose", label: "Mongoose", description: "MongoDB ODM" },
];

export const AI_OPTIONS: StackOption<Ai>[] = [
  { value: "none", label: "None", description: "No AI chat" },
  {
    value: "vercel",
    label: "Vercel AI SDK",
    description: "Streams through the Vercel AI Gateway",
  },
  {
    value: "tanstack",
    label: "TanStack AI",
    description: "Streams through the OpenAI adapter",
  },
];

export const PAYMENTS_OPTIONS: StackOption<Payments>[] = [
  { value: "none", label: "None", description: "No payments" },
  {
    value: "polar",
    label: "Polar",
    description: "Subscriptions, handles sales tax for you",
  },
  { value: "stripe", label: "Stripe", description: "Subscriptions" },
];

export const PACKAGE_MANAGER_OPTIONS: (StackOption<PackageManager> & {
  runner: string;
})[] = [
  { value: "npm", label: "npm", runner: "npx", description: "runs with npx" },
  {
    value: "pnpm",
    label: "pnpm",
    runner: "pnpm dlx",
    description: "runs with pnpm dlx",
  },
  { value: "bun", label: "bun", runner: "bunx", description: "runs with bunx" },
];

export function isBackend(framework: Framework): boolean {
  return framework === "express" || framework === "nestjs";
}

// Better Auth stores users and sessions, so full-stack auth needs a database
export function canUseAuth(choices: StackChoices): boolean {
  return isBackend(choices.framework) || choices.database !== "none";
}

// Rate limiting is offered for the backends only
export function canUseRateLimit(choices: StackChoices): boolean {
  return isBackend(choices.framework);
}

// The payment plugin runs inside Better Auth and keeps customers in the database
export function canUsePayments(choices: StackChoices): boolean {
  return choices.useAuth && canUseAuth(choices) && choices.database !== "none";
}

// Drops options that the CLI would reject for the chosen framework and database
export function normalizeChoices(choices: StackChoices): StackChoices {
  return {
    ...choices,
    useAuth: choices.useAuth && canUseAuth(choices),
    useRateLimit: choices.useRateLimit && canUseRateLimit(choices),
    payments: canUsePayments(choices) ? choices.payments : "none",
  };
}

// The command for these choices; the package manager comes from the runner,
// so it needs no --pm flag
export function buildCommand(
  choices: StackChoices,
  projectName: string = PROJECT_NAME
): string[] {
  const runner =
    PACKAGE_MANAGER_OPTIONS.find((o) => o.value === choices.packageManager)
      ?.runner ?? "npx";
  const parts = [
    `${runner} better-ts-stack ${projectName}`,
    `--framework ${choices.framework}`,
  ];
  if (choices.database !== "none") parts.push(`--database ${choices.database}`);
  if (choices.useAuth) parts.push("--auth");
  if (choices.ai !== "none") parts.push(`--ai ${choices.ai}`);
  if (choices.payments !== "none") parts.push(`--payments ${choices.payments}`);
  if (choices.useRateLimit) parts.push("--rate-limit");
  if (choices.useDocker) parts.push("--docker");
  if (choices.useCi) parts.push("--ci");
  // AGENTS.md is added by default
  if (!choices.useAgents) parts.push("--no-agents");
  if (choices.useVscode) parts.push("--vscode");
  parts.push("--yes");
  return parts;
}

export type FileSource =
  | "base"
  | "database"
  | "auth"
  | "ai"
  | "docker"
  | "rate-limit"
  | "ci"
  | "agents"
  | "vscode";

export interface ProjectFile {
  path: string;
  source: FileSource;
}

// Files the builder writes itself instead of copying them from a module
const GENERATED_FILES = [
  "package.json",
  ".env",
  ".env.example",
  "README.md",
  "better-ts-stack.json",
];

// Mirrors planBuild() in apps/cli/src/builder/buildPlanner.ts
export function listProjectFiles(choices: StackChoices): ProjectFile[] {
  const { framework } = choices;
  const modules: [string, FileSource][] = [[`base/${framework}`, "base"]];
  if (choices.database !== "none")
    modules.push([`${choices.database}/${framework}`, "database"]);
  if (choices.useDocker) modules.push(["docker", "docker"]);
  if (choices.useAuth) modules.push([`auth/${framework}`, "auth"]);
  if (choices.ai !== "none") {
    if (!isBackend(framework))
      modules.push([`ai-page/${choices.ai}/${framework}`, "ai"]);
    modules.push([`ai/${choices.ai}/${framework}`, "ai"]);
  }
  if (choices.useRateLimit)
    modules.push([`rate-limit/${framework}`, "rate-limit"]);
  if (choices.useCi) modules.push(["ci", "ci"]);
  if (choices.useAgents) modules.push(["agents", "agents"]);
  if (choices.useVscode) modules.push(["vscode", "vscode"]);

  // Later modules overwrite files of earlier ones, so each path is listed once
  const files = new Map<string, FileSource>();
  for (const file of GENERATED_FILES) files.set(file, "base");
  if (choices.packageManager === "pnpm")
    files.set("pnpm-workspace.yaml", "base");
  for (const [id, source] of modules) {
    for (const file of MODULE_FILES[id] ?? []) {
      if (!files.has(file)) files.set(file, source);
    }
  }

  return [...files].map(([path, source]) => ({ path, source }));
}

export interface TreeNode {
  name: string;
  path: string;
  source: FileSource;
  children: TreeNode[];
}

// Nests flat paths into folders, folders first, each level sorted by name
export function buildTree(files: ProjectFile[]): TreeNode[] {
  const root: TreeNode = { name: "", path: "", source: "base", children: [] };
  for (const file of files) {
    let node = root;
    const segments = file.path.split("/");
    segments.forEach((name, i) => {
      const path = segments.slice(0, i + 1).join("/");
      let child = node.children.find((c) => c.name === name);
      if (!child) {
        child = { name, path, source: file.source, children: [] };
        node.children.push(child);
      }
      node = child;
    });
  }

  const sort = (nodes: TreeNode[]): TreeNode[] =>
    nodes
      .sort((a, b) => {
        const aIsDir = a.children.length > 0;
        const bIsDir = b.children.length > 0;
        if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map((n) => ({ ...n, children: sort(n.children) }));

  return sort(root.children);
}

// Same rules as projectNameSchema in apps/cli/src/validators/index.ts
export function isValidProjectName(name: string): boolean {
  return (
    /^[a-z0-9-]+$/.test(name) &&
    !name.startsWith("-") &&
    !name.endsWith("-") &&
    name.length <= 214
  );
}

type Extra = Exclude<FileSource, "base" | "database" | "ai">;

const EXTRA_KEYS = {
  auth: "useAuth",
  docker: "useDocker",
  "rate-limit": "useRateLimit",
  ci: "useCi",
  agents: "useAgents",
  vscode: "useVscode",
} as const satisfies Record<Extra, keyof StackChoices>;

const EXTRAS = Object.keys(EXTRA_KEYS) as Extra[];

// The query string that reopens the builder with these choices
export function toSearchParams(
  choices: StackChoices,
  projectName: string = PROJECT_NAME
): string {
  const params = new URLSearchParams({
    framework: choices.framework,
    database: choices.database,
    pm: choices.packageManager,
    with: EXTRAS.filter((extra) => choices[EXTRA_KEYS[extra]]).join(","),
  });
  if (choices.ai !== "none") params.set("ai", choices.ai);
  if (choices.payments !== "none") params.set("payments", choices.payments);
  if (projectName !== PROJECT_NAME && isValidProjectName(projectName))
    params.set("name", projectName);
  // Commas are safe in a query string and read better unescaped
  return params.toString().replaceAll("%2C", ",");
}

export type SearchParams = Record<string, string | string[] | undefined>;

function pickOption<T extends string>(
  options: readonly StackOption<T>[],
  value: string | string[] | undefined,
  fallback: T
): T {
  return options.find((option) => option.value === value)?.value ?? fallback;
}

// Reads a shared link; anything missing or unknown falls back to the default
export function fromSearchParams(params: SearchParams): {
  choices: StackChoices;
  projectName: string;
} {
  const choices: StackChoices = {
    ...DEFAULT_CHOICES,
    framework: pickOption(
      FRAMEWORK_OPTIONS,
      params.framework,
      DEFAULT_CHOICES.framework
    ),
    database: pickOption(
      DATABASE_OPTIONS,
      params.database,
      DEFAULT_CHOICES.database
    ),
    packageManager: pickOption(
      PACKAGE_MANAGER_OPTIONS,
      params.pm,
      DEFAULT_CHOICES.packageManager
    ),
    ai: pickOption(AI_OPTIONS, params.ai, DEFAULT_CHOICES.ai),
    payments: pickOption(
      PAYMENTS_OPTIONS,
      params.payments,
      DEFAULT_CHOICES.payments
    ),
  };
  if (typeof params.with === "string") {
    const picked = params.with.split(",");
    for (const extra of EXTRAS)
      choices[EXTRA_KEYS[extra]] = picked.includes(extra);
  }
  const name = params.name;
  return {
    choices: normalizeChoices(choices),
    projectName:
      typeof name === "string" && isValidProjectName(name)
        ? name
        : PROJECT_NAME,
  };
}

// Ready-made stacks: buttons in the builder and the recipes on the home page.
// A preset leaves the package manager alone.
export interface StackPreset {
  id: string;
  label: string;
  description: string;
  choices: Omit<StackChoices, "packageManager">;
}

export const STACK_PRESETS: StackPreset[] = [
  {
    id: "minimal",
    label: "minimal api",
    description: "Express with strict TypeScript and nothing else to delete.",
    choices: {
      framework: "express",
      database: "none",
      ai: "none",
      payments: "none",
      useAuth: false,
      useDocker: false,
      useRateLimit: false,
      useCi: false,
      useAgents: true,
      useVscode: false,
    },
  },
  {
    id: "api",
    label: "production api",
    description:
      "NestJS on PostgreSQL with sign-in, rate limits, Docker, and CI.",
    choices: {
      framework: "nestjs",
      database: "drizzle",
      ai: "none",
      payments: "none",
      useAuth: true,
      useDocker: true,
      useRateLimit: true,
      useCi: true,
      useAgents: true,
      useVscode: false,
    },
  },
  {
    id: "saas",
    label: "saas starter",
    description:
      "Next.js with Prisma and sign-in, sign-up, and password reset pages.",
    choices: {
      framework: "nextjs",
      database: "prisma",
      ai: "none",
      payments: "none",
      useAuth: true,
      useDocker: true,
      useRateLimit: false,
      useCi: true,
      useAgents: true,
      useVscode: false,
    },
  },
  {
    id: "vite",
    label: "full-stack on vite",
    description:
      "TanStack Start with Drizzle and Better Auth, served by Nitro.",
    choices: {
      framework: "tanstack",
      database: "drizzle",
      ai: "none",
      payments: "none",
      useAuth: true,
      useDocker: false,
      useRateLimit: false,
      useCi: false,
      useAgents: true,
      useVscode: true,
    },
  },
];

export function matchesPreset(
  choices: StackChoices,
  preset: StackPreset
): boolean {
  return (
    Object.keys(preset.choices) as (keyof StackPreset["choices"])[]
  ).every((key) => choices[key] === preset.choices[key]);
}

// How many combinations scripts/generate-matrix.cjs builds and CI checks
export function countMatrixCases(): number {
  // Every package manager with and without Docker; npm without Docker gets
  // each AI choice, the other five one AI choice each
  const aiVariants = AI_OPTIONS.length + PACKAGE_MANAGER_OPTIONS.length * 2 - 1;
  let count = 0;
  for (const { value: framework } of FRAMEWORK_OPTIONS) {
    for (const { value: database } of DATABASE_OPTIONS) {
      for (const useAuth of [false, true]) {
        if (!isBackend(framework) && database === "none" && useAuth) continue;
        const rateLimitVariants = isBackend(framework) ? 2 : 1;
        const paymentVariants =
          useAuth && database !== "none" ? PAYMENTS_OPTIONS.length : 1;
        count += rateLimitVariants * aiVariants * paymentVariants;
      }
    }
  }
  // shortcut: mirrors MONOREPO_LAYOUTS by hand (two web frameworks, each alone
  // and in six layouts with Express or NestJS); update it with that list
  return count + 2 * (1 + 6 * 2);
}
