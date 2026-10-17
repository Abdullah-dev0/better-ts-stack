// The stack picker on the home page: the choices it offers, the command they
// map to, and the files the CLI would write for them
import { MODULE_FILES } from "./stack-files";

export type Framework = "express" | "nestjs" | "nextjs" | "tanstack";
export type Database = "none" | "prisma" | "drizzle" | "mongoose";
export type PackageManager = "npm" | "pnpm" | "bun";

export interface StackChoices {
  framework: Framework;
  database: Database;
  packageManager: PackageManager;
  useAuth: boolean;
  useDocker: boolean;
  useRateLimit: boolean;
}

export const PROJECT_NAME = "my-app";

export const DEFAULT_CHOICES: StackChoices = {
  framework: "nestjs",
  database: "prisma",
  packageManager: "npm",
  useAuth: true,
  useDocker: true,
  useRateLimit: false,
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
    description: "Express 5 API with tsx watch",
  },
  {
    value: "nestjs",
    label: "NestJS",
    kind: "backend",
    description: "NestJS 12 API as ES modules",
  },
  {
    value: "nextjs",
    label: "Next.js",
    kind: "full-stack",
    description: "Next.js 16 App Router and React 19",
  },
  {
    value: "tanstack",
    label: "TanStack Start",
    kind: "full-stack",
    description: "File-based routing on Vite and Nitro",
  },
];

export const DATABASE_OPTIONS: StackOption<Database>[] = [
  { value: "none", label: "None", description: "No database" },
  { value: "prisma", label: "Prisma", description: "PostgreSQL ORM" },
  { value: "drizzle", label: "Drizzle", description: "PostgreSQL ORM" },
  { value: "mongoose", label: "Mongoose", description: "MongoDB ODM" },
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

// Drops options that the CLI would reject for the chosen framework and database
export function normalizeChoices(choices: StackChoices): StackChoices {
  return {
    ...choices,
    useAuth: choices.useAuth && canUseAuth(choices),
    useRateLimit: choices.useRateLimit && canUseRateLimit(choices),
  };
}

// The command for these choices; the package manager comes from the runner,
// so it needs no --pm flag
export function buildCommand(choices: StackChoices): string[] {
  const runner =
    PACKAGE_MANAGER_OPTIONS.find((o) => o.value === choices.packageManager)
      ?.runner ?? "npx";
  const parts = [
    `${runner} better-ts-stack ${PROJECT_NAME}`,
    `--framework ${choices.framework}`,
  ];
  if (choices.database !== "none") parts.push(`--database ${choices.database}`);
  if (choices.useAuth) parts.push("--auth");
  if (choices.useRateLimit) parts.push("--rate-limit");
  if (choices.useDocker) parts.push("--docker");
  parts.push("--yes");
  return parts;
}

export type FileSource = "base" | "database" | "auth" | "docker" | "rate-limit";

export interface ProjectFile {
  path: string;
  source: FileSource;
}

// Files the builder writes itself instead of copying them from a module
const GENERATED_FILES = ["package.json", ".env", ".env.example", "README.md"];

// Mirrors planBuild() in apps/cli/src/builder/buildPlanner.ts
export function listProjectFiles(choices: StackChoices): ProjectFile[] {
  const { framework } = choices;
  const modules: [string, FileSource][] = [[`base/${framework}`, "base"]];
  if (choices.database !== "none")
    modules.push([`${choices.database}/${framework}`, "database"]);
  if (choices.useDocker) modules.push(["docker", "docker"]);
  if (choices.useAuth) modules.push([`auth/${framework}`, "auth"]);
  if (choices.useRateLimit)
    modules.push([`rate-limit/${framework}`, "rate-limit"]);

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

export interface MatrixCase {
  name: string;
  framework: Framework;
  database: Database;
}

// Every combination scripts/generate-matrix.cjs builds and CI checks
export function listMatrixCases(): MatrixCase[] {
  const cases: MatrixCase[] = [];
  for (const { value: framework } of FRAMEWORK_OPTIONS) {
    for (const { value: database } of DATABASE_OPTIONS) {
      for (const useAuth of [false, true]) {
        if (!isBackend(framework) && database === "none" && useAuth) continue;
        for (const useRateLimit of isBackend(framework)
          ? [false, true]
          : [false]) {
          for (const { value: pm } of PACKAGE_MANAGER_OPTIONS) {
            for (const useDocker of [false, true]) {
              cases.push({
                framework,
                database,
                name: `${framework}-${database}-${useAuth ? "auth" : "plain"}${useRateLimit ? "-ratelimit" : ""}-${pm}-${useDocker ? "docker" : "local"}`,
              });
            }
          }
        }
      }
    }
  }
  return cases;
}
