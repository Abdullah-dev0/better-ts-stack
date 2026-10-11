// Icons are now referenced by name strings for server/client component compatibility
// Icon components are imported and mapped in client components

// ============================================================================
// NAVBAR CONSTANTS
// ============================================================================
export interface NavbarLink {
  href: string;
  label: string;
  external: boolean;
}

export const NAVBAR_CONFIG = {
  brand: {
    name: "better-ts-stack",
    logo: "TS",
  },
  banner: {
    icon: "Zap",
    text: "Version 2.0: NestJS, a flag for every prompt, and a new CLI.",
    tagline: "npx better-ts-stack",
  },
  links: [
    { href: "/docs", label: "Docs", external: false },
    {
      href: "https://github.com/Abdullah-dev0/better-ts-stack",
      label: "GitHub",
      external: true,
    },
  ] as const satisfies readonly NavbarLink[],
  cta: {
    text: "Get Started",
    href: "/docs",
  },
} as const;

// ============================================================================
// HERO SECTION CONSTANTS
// ============================================================================
export const HERO_CONFIG = {
  badge: {
    icon: "Sparkles",
    text: "Version 2.0",
  },
  headline: {
    main: "Scaffold a TypeScript project.",
    second: "One command.",
    accent: "Ready to run.",
  },
  subheadline:
    "Pick a framework, a database, authentication, and Docker. The CLI writes a project that installs, builds, and lints without extra setup.",
  cta: {
    primary: {
      text: "Get Started",
      icon: "ArrowRight",
      href: "/docs/installation",
    },
    secondary: {
      text: "View Documentation",
      href: "/docs",
    },
  },
} as const;

// ============================================================================
// ARCHITECTURE GRID CONSTANTS
// ============================================================================
export interface Feature {
  icon: string; // Icon name as string for server/client component compatibility
  title: string;
  description: string;
  color: string;
  badge: string | null;
  size: "normal" | "large";
}

export const ARCHITECTURE_FEATURES: Feature[] = [
  {
    icon: "Server",
    title: "Backend",
    description:
      "Express 5 or NestJS 12 with TypeScript, security headers, CORS, and a health check route.",
    color: "text-module-backend",
    badge: null,
    size: "large",
  },
  {
    icon: "Database",
    title: "PostgreSQL",
    description:
      "Prisma or Drizzle with a starter schema, a database client, and migration scripts.",
    color: "text-module-database",
    badge: null,
    size: "normal",
  },
  {
    icon: "Box",
    title: "MongoDB",
    description: "A Mongoose connection and a typed User model.",
    color: "text-primary",
    badge: null,
    size: "normal",
  },
  {
    icon: "Container",
    title: "Docker",
    description:
      "A multi-stage Dockerfile, a Compose file, and scripts to build and run the image.",
    color: "text-muted-foreground",
    badge: null,
    size: "normal",
  },
  {
    icon: "Layout",
    title: "Full-stack",
    description:
      "Next.js 16 or TanStack Start with React 19, Tailwind CSS v4, and shadcn-style components.",
    color: "text-module-frontend",
    badge: null,
    size: "large",
  },
  {
    icon: "Shield",
    title: "Authentication",
    description:
      "JWT with bcrypt and Zod validation for backends. Better Auth for full-stack apps.",
    color: "text-primary",
    badge: null,
    size: "normal",
  },
];

export const ARCHITECTURE_SECTION = {
  badge: "Modules",
  title: {
    main: "Pick what you need.",
    accent: "Skip the rest.",
  },
  description:
    "Every module is optional. The CLI only adds the files and dependencies for what you select.",
} as const;

// ============================================================================
// CORRECTNESS SECTION CONSTANTS
// ============================================================================
export interface StackItem {
  icon: string; // Icon name as string for server/client component compatibility
  label: string;
  sub: string;
  color: string;
}

export const STACK_ITEMS: StackItem[] = [
  {
    icon: "Database",
    label: "Database",
    sub: "PostgreSQL (Prisma, Drizzle) or MongoDB (Mongoose)",
    color: "text-primary",
  },
  {
    icon: "Layers",
    label: "Authentication",
    sub: "JWT + bcrypt or Better Auth",
    color: "text-module-backend",
  },
  {
    icon: "Server",
    label: "Server",
    sub: "Express, NestJS, Next.js, or TanStack Start",
    color: "text-muted-foreground",
  },
  {
    icon: "UploadCloud",
    label: "Deployment",
    sub: "Dockerfile + Compose",
    color: "text-module-database",
  },
];

export interface FeatureCard {
  icon: string; // Icon name as string for server/client component compatibility
  title: string;
  description: string;
}

export const CORRECTNESS_FEATURE_CARDS: FeatureCard[] = [
  {
    icon: "Code2",
    title: "Strict TypeScript",
    description:
      "Every template uses strict mode, with ESLint and Prettier already configured.",
  },
  {
    icon: "GitBranch",
    title: "Only what you pick",
    description:
      "No unused packages or files. Skip the database or auth and they are not there.",
  },
  {
    icon: "Zap",
    title: "Tested combinations",
    description:
      "Every stack is installed, built, type-checked, and linted in CI on Linux and Windows.",
  },
];

export const CORRECTNESS_SECTION = {
  badge: "How It Works",
  title: "What you get",
  description:
    "A project you can read: plain TypeScript, with no generator runtime left behind.",
  typesPreserved: "Strict TypeScript in every layer",
  comparison: {
    bad: {
      label: "By hand",
      description:
        "Wire up TypeScript, linting, the ORM, auth, and Docker yourself.",
    },
    good: {
      label: "better-ts-stack",
      description: "Answer a few prompts or pass flags, then start coding.",
    },
  },
  templates: {
    title: "Templates that run",
    description:
      "Choose a framework, a database, and a package manager (npm, pnpm, or bun). The generated project installs, builds, and starts without extra configuration.",
  },
} as const;

// ============================================================================
// FOOTER CONSTANTS
// ============================================================================
export const FOOTER_CONFIG = {
  brand: {
    name: "better-ts-stack",
    logo: "TS",
  },
  copyright: {
    year: new Date().getFullYear(),
    text: "Open source under MIT.",
  },
  social: [
    {
      href: "https://github.com/Abdullah-dev0/better-ts-stack",
      icon: "Github",
      label: "GitHub",
    },
  ],
  pages: [
    { href: "/", label: "Home" },
    { href: "/docs", label: "Docs" },
    { href: "/docs/usage", label: "Usage" },
    { href: "/docs/structure", label: "Architecture" },
  ],
} as const;
