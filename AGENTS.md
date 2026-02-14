# AGENTS.md - Coding Guidelines for better-ts-stack

## Project Overview

TypeScript CLI monorepo that generates fully configured TypeScript projects with backend, frontend, database, Docker support via interactive setup.

**Structure:**

- `cli/` - Node.js CLI tool
- `client/` - Next.js 16 + React 19 documentation website

## Build, Lint & Development Commands

### From root (npm workspaces)

```bash
# Build all
npm run build
npm run build:cli
npm run build:client

# Dev
npm run dev:cli       # CLI with hot reload
npm run dev:client    # Next.js dev server

# Lint / type-check all
npm run lint
npm run lint:fix
npm run type:check

# Format (CLI has Prettier config)
npm run format
npm run format:check

# Run built apps
npm run start:cli
npm run start:client
```

### CLI (`cli/`)

```bash
cd cli

# Development (hot reload)
npm run dev

# Build to dist/
npm run build

# Run compiled
npm start

# Type check (no emit)
npm run type:check

# Lint
npm run lint
npm run lint:fix      # Auto-fix

# Format
npm run format
npm run format:check
```

### Client (`client/`)

```bash
cd client
npm run dev           # Dev server
npm run build         # Production build
npm run lint          # ESLint check
```

## Code Style Guidelines

### TypeScript

**CLI:** ES2020, CommonJS, strict mode, no unused vars
**Client:** ES2017, ESNext modules, react-jsx, `@/*` path alias

### Formatting (Prettier - CLI)

- Semi-colons required, double quotes, ES5 trailing commas
- Print width: 80, tab width: 2 spaces
- Arrow functions: always parentheses

**Import Order:**

1. `^react` → 2. `^next` → 3. `<THIRD_PARTY_MODULES>` → 4. `^@repo/(.*)$` → 5. `^@/` → 6. `^[./]`

### ESLint Rules

- CLI: No unused vars (error), no floating promises (error), any (warn), console allowed
- Client: eslint-config-next with Next.js core web vitals

### Naming Conventions

- Functions/variables: `camelCase`
- Types/Interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: match main export (camelCase or PascalCase)
- Booleans: `isEnabled`, `hasError`
- React components: `PascalCase`

### Imports

- CLI: Use `node:` prefix for Node.js built-ins, named exports for utilities, default for entry points
- Client: Use `@/` path alias, prefer server components

### Error Handling

- CLI: Use `buildError()` from `src/types/index.ts`, wrap async with try-catch, use consola, exit 0/1
- Client: Next.js error boundaries, try-catch async, proper HTTP status codes

### Testing

No test framework configured. When adding tests:

- CLI: Vitest or Jest
- Client: Jest + React Testing Library

Run single test: `npx vitest run <file>` or `npx jest <file>`

## Architecture

**CLI:**

- Barrel exports via `index.ts` in each directory
- Feature folders, pure functions preferred
- Async/await, Zod for validation, consola for logging

**Client:**

- Next.js App Router, Server Components by default
- `'use client'` only when needed
- Tailwind CSS v4, Radix UI primitives

**Project Structure (`cli/src/`):**

```
src/
  index.ts      # Entry point
  types/        # Types & errors
  prompts/      # User interaction
  builder/      # Project generation
  validators/   # Input validation
  output/       # Output formatting
  modules/      # Module registry
```

## Dependencies

**CLI:** @clack/prompts, consola, fs-extra, handlebars, zod
**Client:** next, react 19, @radix-ui/react-slot, tailwindcss v4, motion

## Important Notes

- CLI requires console output (expected)
- Handlebars templates: `cli/templates/`
- Node.js 18+ required
- Run lint/typecheck before committing
- No Cursor or Copilot rules configured
