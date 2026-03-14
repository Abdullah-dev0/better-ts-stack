# AGENTS.md - Coding Guidelines for better-ts-stack

## Project Overview

TypeScript CLI monorepo that generates fully configured TypeScript projects with backend, frontend, database, Docker support via interactive setup.

**Structure:** Turborepo monorepo with `apps/cli` (Node.js CLI generator), `apps/docs` (Next.js 16 + React 19 docs site), and `packages/eslint-config` and `packages/prettier-config` (shared configs).

> Run commands from the repo root using Turbo, or from individual package directories.

## Build, Lint & Development Commands

### From repo root (recommended)

```bash
npm run dev            # Run dev in all packages
npm run build          # Build all packages
npm run lint           # Lint all packages
npm run type:check     # Type-check all packages
```

### CLI (apps/cli/)

```bash
cd apps/cli
npm run dev            # CLI with hot reload (tsx)
npm run build          # Compile TypeScript
npm run start          # Run compiled CLI
npm run lint           # ESLint
npm run lint:fix       # Auto-fix lint issues
npm run format         # Prettier format
npm run format:check   # Check formatting
npm run type:check     # TypeScript check (no emit)
```

### Docs (apps/docs/)

```bash
cd apps/docs
npm run dev            # Next.js dev server
npm run build          # Production build
npm run start          # Run production server
npm run lint           # ESLint
npm run lint:fix       # Auto-fix lint issues
npm run type:check     # TypeScript check (no emit)
```

### Running Tests

No test framework configured. When added: CLI: `npx vitest run <file>`, Client: `npx jest <file>`

## Code Style Guidelines

### TypeScript Configuration

**CLI:** ES2020, CommonJS, strict, noUnusedLocals, noUnusedParameters, noImplicitReturns

**Client:** ES2017, ESNext modules, strict, react-jsx, `@/*` path alias

### Formatting (Prettier - shared via `@better-ts-stack/prettier-config`)

Semi-colons required, double quotes, ES5 trailing commas, print width 80, tab width 2 spaces, arrow functions always parentheses, LF line endings.

**Import Order:** `^react` → `^next` → `<THIRD_PARTY_MODULES>` → `^@repo/(.*)$` → `^@/` → `^[./]`

### ESLint Rules

- CLI: uses `@better-ts-stack/eslint-config/node`, no-unused-vars (error), no-floating-promises (error), no-explicit-any (warn), no-console (off)
- Docs: eslint-config-next with core-web-vitals

### Naming Conventions

| Type                | Convention        | Example         |
| ------------------- | ----------------- | --------------- |
| Functions/variables | camelCase         | `buildProject`  |
| Types/Interfaces    | PascalCase        | `ProjectConfig` |
| Constants           | UPPER_SNAKE_CASE  | `DEFAULT_PORT`  |
| React components    | PascalCase        | `Button`        |
| Files               | match main export | `button.tsx`    |
| Booleans            | is/has prefix     | `isEnabled`     |

### Import Patterns

**CLI:** Use `node:` prefix for built-ins, named exports for utilities

```typescript
import path from "node:path";
import { cwd } from "node:process";
import fs from "fs-extra";
import { buildError } from "./types";
```

**Docs:** Use `@/` path alias, prefer server components

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";
```

### Error Handling

**CLI:** Use `buildError()` from `src/types/index.ts`, wrap async with try-catch, use consola for logging

**Client:** Next.js error boundaries, try-catch async, proper HTTP status codes

### React/Next.js Patterns

- Default: Server Components (no directive needed)
- Use `"use client"` only when needed (useState, useEffect, event handlers)

```typescript
"use client";
import * as React from "react";
export function Component({ children, ...props }: React.ComponentProps<typeof SomeProvider>) {
  return <SomeProvider {...props}>{children}</SomeProvider>;
}
```

## Architecture

### CLI (`apps/cli/src/`)

```
src/
├── index.ts           # Entry point
├── intro.ts           # Interactive intro
├── types/             # Types & buildError()
├── prompts/           # User interaction (@clack/prompts)
├── builder/           # Project generation pipeline
├── validators/        # Input validation (Zod)
├── output/            # Output formatting
└── modules/           # Module registry
```

Patterns: Barrel exports via `index.ts`, feature folders, pure functions, async/await, Zod validation, consola logging

### Docs (`apps/docs/`)

```
app/
├── layout.tsx         # Root layout
├── page.tsx           # Home page
├── docs/              # Documentation (fumadocs)
└── api/               # API routes
components/
├── ui/                # UI primitives (Radix, shadcn-style)
├── motion/            # Animation components
└── *.tsx              # Feature components
```

Patterns: Next.js App Router, Server Components default, Tailwind CSS v4, Radix UI, fumadocs

### Templates (`apps/cli/templates/`)

- `backend/express/` - Express.js template
- `frontend/nextjs/` - Next.js template
- `modules/` - Modular feature additions (Handlebars `.hbs` files)

## Module System

Modules in `apps/cli/templates/modules/` have `ModuleConfig` with: id, name, type ("base" | "database" | "feature"), dependencies, devDependencies, scripts, envVars, templateFiles.

## Dependencies

**CLI:** @clack/prompts, consola, fs-extra, handlebars, zod

**Docs:** next, react 19, @radix-ui/react-slot, tailwindcss v4, motion, fumadocs-ui, lucide-react

**Shared packages:** `@better-ts-stack/eslint-config`, `@better-ts-stack/prettier-config`

## Important Notes

- Node.js 18+ required
- Run `npm run lint && npm run type:check` from root before committing
- CLI console output is expected (not an error)
- Use `buildError()` for all CLI error handling
- Husky + lint-staged configured at repo root: runs ESLint fix and Prettier on staged files
- No Cursor or Copilot rules configured
