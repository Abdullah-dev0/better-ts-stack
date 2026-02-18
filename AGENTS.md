# AGENTS.md - Coding Guidelines for better-ts-stack

## Project Overview

TypeScript CLI monorepo that generates fully configured TypeScript projects with backend, frontend, database, Docker support via interactive setup.

**Structure:** `cli/` (Node.js CLI generator), `client/` (Next.js 16 + React 19 docs site)

## Build, Lint & Development Commands

### From root (npm workspaces)

```bash
npm run build              # Build all workspaces
npm run build:cli          # Build CLI only
npm run build:client       # Build client only
npm run dev:cli            # CLI with hot reload (tsx)
npm run dev:client         # Next.js dev server
npm run lint               # Lint all workspaces
npm run lint:fix           # Auto-fix lint issues
npm run type:check         # TypeScript check (no emit)
npm run format             # Format code (Prettier - CLI only)
npm run start:cli          # Run compiled CLI
npm run start:client       # Run Next.js production server
```

### Individual workspaces

```bash
# CLI (cli/): npm run dev | build | start | lint | lint:fix | format
# Client (client/): npm run dev | build | lint | lint:fix
```

### Running Tests

No test framework configured. When added: CLI: `npx vitest run <file>`, Client: `npx jest <file>`

## Code Style Guidelines

### TypeScript Configuration

**CLI:** ES2020, CommonJS, strict, noUnusedLocals, noUnusedParameters, noImplicitReturns

**Client:** ES2017, ESNext modules, strict, react-jsx, `@/*` path alias

### Formatting (Prettier - CLI only)

Semi-colons required, double quotes, ES5 trailing commas, print width 80, tab width 2 spaces, arrow functions always parentheses, LF line endings.

**Import Order:** `^react` → `^next` → `<THIRD_PARTY_MODULES>` → `^@repo/(.*)$` → `^@/` → `^[./]`

### ESLint Rules

- CLI: no-unused-vars (error), no-floating-promises (error), no-explicit-any (warn), no-console (off)
- Client: eslint-config-next with core-web-vitals

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Functions/variables | camelCase | `buildProject` |
| Types/Interfaces | PascalCase | `ProjectConfig` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_PORT` |
| React components | PascalCase | `Button` |
| Files | match main export | `button.tsx` |
| Booleans | is/has prefix | `isEnabled` |

### Import Patterns

**CLI:** Use `node:` prefix for built-ins, named exports for utilities
```typescript
import path from "node:path";
import { cwd } from "node:process";
import fs from "fs-extra";
import { buildError } from "./types";
```

**Client:** Use `@/` path alias, prefer server components
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

### CLI (`cli/src/`)

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

### Client (`client/`)

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

### Templates (`cli/templates/`)

- `backend/express/` - Express.js template
- `frontend/nextjs/` - Next.js template
- `modules/` - Modular feature additions (Handlebars `.hbs` files)

## Module System

Modules in `cli/templates/modules/` have `ModuleConfig` with: id, name, type ("base" | "database" | "feature"), dependencies, devDependencies, scripts, envVars, templateFiles.

## Dependencies

**CLI:** @clack/prompts, consola, fs-extra, handlebars, zod

**Client:** next, react 19, @radix-ui/react-slot, tailwindcss v4, motion, fumadocs-ui, lucide-react

## Important Notes

- Node.js 18+ required
- Run `npm run lint && npm run type:check` before committing
- CLI console output is expected (not an error)
- Use `buildError()` for all CLI error handling
- Husky + lint-staged: runs ESLint fix and Prettier on staged files
- No Cursor or Copilot rules configured
