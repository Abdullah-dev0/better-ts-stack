import type { Framework } from "@/lib/stack";

export const GITHUB_URL = "https://github.com/Abdullah-dev0/better-ts-stack";
export const NPM_URL = "https://www.npmjs.com/package/better-ts-stack";

// "better-ts-stack" in the figlet Big font, as the CLI prints it
// (apps/cli/src/ui/messages.ts)
export const WORDMARK = [
  "  _          _   _                   _                  _             _",
  " | |        | | | |                 | |                | |           | |",
  " | |__   ___| |_| |_ ___ _ __ ______| |_ ___ ______ ___| |_ __ _  ___| | __",
  " | '_ \\ / _ \\ __| __/ _ \\ '__|______| __/ __|______/ __| __/ _` |/ __| |/ /",
  " | |_) |  __/ |_| ||  __/ |         | |_\\__ \\      \\__ \\ || (_| | (__|   <",
  " |_.__/ \\___|\\__|\\__\\___|_|          \\__|___/      |___/\\__\\__,_|\\___|_|\\_\\",
].join("\n");

// The page's sections, in order; the status bar and the number keys use them
export const SECTIONS = [
  { id: "init", label: "init" },
  { id: "builder", label: "builder" },
  { id: "modules", label: "modules" },
  { id: "ci", label: "ci" },
] as const;

export interface NavLink {
  href: string;
  label: string;
  external: boolean;
}

export const NAV_LINKS = [
  { href: "/docs", label: "Docs", external: false },
  { href: "/#builder", label: "Builder", external: false },
  { href: "/#modules", label: "Modules", external: false },
  { href: "/docs/upgrade-notes", label: "Changelog", external: false },
] as const satisfies readonly NavLink[];

// ============================================================================
// INIT PANE
// ============================================================================
export const INIT_PANE = {
  tagline: "TypeScript projects, ready to run.",
  description:
    "A CLI that scaffolds Express, NestJS, Next.js, and TanStack Start projects with a database, authentication, and Docker already set up.",
  hint: "Run it with no flags and it asks for each option.",
  builder: {
    text: "Pick every option here and copy the generated command.",
    link: "open builder",
  },
  docs: {
    text: "Flags, prompts, and the generated structure.",
    link: "read the docs",
  },
} as const;

// ============================================================================
// MODULES PANE
// ============================================================================
export interface ModuleEntry {
  flag: string;
  title: string;
  description: string;
  frameworks: readonly Framework[];
}

export const MODULE_ENTRIES: ModuleEntry[] = [
  {
    flag: "--framework express",
    title: "Express",
    description:
      "Express 5 with security headers, CORS, a health check route, and tsx watch.",
    frameworks: ["express"],
  },
  {
    flag: "--framework nestjs",
    title: "NestJS",
    description:
      "NestJS 12 as ES modules, with security headers and a health controller.",
    frameworks: ["nestjs"],
  },
  {
    flag: "--framework nextjs",
    title: "Next.js",
    description:
      "Next.js 16 App Router, React 19, Tailwind CSS v4, and shadcn-style components.",
    frameworks: ["nextjs"],
  },
  {
    flag: "--framework tanstack",
    title: "TanStack Start",
    description:
      "File-based routing, Vite in development, and a Nitro production server.",
    frameworks: ["tanstack"],
  },
  {
    flag: "--database prisma",
    title: "Prisma",
    description:
      "PostgreSQL with a starter schema, a client, and migration scripts.",
    frameworks: ["express", "nestjs", "nextjs", "tanstack"],
  },
  {
    flag: "--database drizzle",
    title: "Drizzle",
    description:
      "PostgreSQL with a typed schema, a client, and drizzle-kit scripts.",
    frameworks: ["express", "nestjs", "nextjs", "tanstack"],
  },
  {
    flag: "--database mongoose",
    title: "Mongoose",
    description: "MongoDB with a connection helper and a typed User model.",
    frameworks: ["express", "nestjs", "nextjs", "tanstack"],
  },
  {
    flag: "--auth",
    title: "Authentication",
    description:
      "JWT, bcrypt, and Zod for backends. Better Auth with sign-in and sign-up pages for full-stack apps.",
    frameworks: ["express", "nestjs", "nextjs", "tanstack"],
  },
  {
    flag: "--rate-limit",
    title: "Rate limiting",
    description: "Per-IP limits with express-rate-limit or @nestjs/throttler.",
    frameworks: ["express", "nestjs"],
  },
  {
    flag: "--docker",
    title: "Docker",
    description:
      "A multi-stage Dockerfile, a Compose file, and scripts to run them.",
    frameworks: ["express", "nestjs", "nextjs", "tanstack"],
  },
];

// ============================================================================
// CI PANE
// ============================================================================
export const CI_PANE = {
  description:
    "Every pull request generates each combination the CLI can produce, then installs, builds, type-checks, lints, and starts it.",
  steps: ["generate", "install", "build", "type-check", "lint", "start"],
  runners: ["ubuntu-latest", "windows-latest"],
  principles: [
    {
      title: "strict by default",
      description:
        "Strict TypeScript in every template, with ESLint and Prettier configured.",
    },
    {
      title: "only what you pick",
      description:
        "Skip the database or auth and their packages and files are not there.",
    },
    {
      title: "nothing left behind",
      description:
        "A plain project you own. No generator runtime, no lock-in.",
    },
  ],
} as const;

// ============================================================================
// FOOTER
// ============================================================================
export const FOOTER_LINKS = [
  { href: "/docs", label: "docs", external: false },
  { href: "/docs/usage", label: "usage", external: false },
  { href: "/docs/structure", label: "structure", external: false },
  { href: "/docs/troubleshooting", label: "troubleshooting", external: false },
  { href: GITHUB_URL, label: "github", external: true },
  { href: NPM_URL, label: "npm", external: true },
] as const satisfies readonly NavLink[];
