# AGENTS.md - Coding Guidelines for better-ts-stack

## Project Overview

This is a TypeScript CLI tool monorepo that generates fully configured TypeScript projects with backend, frontend, database integration, Docker support, and more through an interactive setup.

**Monorepo Structure:**
- `cli/` - The CLI tool package (Node.js CLI application)
- `client/` - Next.js documentation website (Next.js 16 + React 19)

## Build, Lint & Development Commands

### CLI Package (`cli/`)

```bash
cd cli

# Development - run with tsx (hot reload)
npm run dev

# Build - compile TypeScript to dist/
npm run build

# Run compiled code
npm start

# Type checking (no emit)
npm run type:check

# Linting
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues

# Formatting
npm run format            # Format with Prettier
npm run format:check      # Check formatting
```

### Client Package (`client/`)

```bash
cd client

# Development
npm run dev               # Start Next.js dev server

# Build
npm run build             # Build for production

# Linting
npm run lint              # ESLint check
```

## Code Style Guidelines

### TypeScript Configuration

**CLI (`cli/tsconfig.json`):**
- Target: ES2020, Module: CommonJS
- Strict mode enabled with full type safety
- No unused variables or parameters allowed
- Output: `dist/` directory

**Client (`client/tsconfig.json`):**
- Target: ES2017
- Module: ESNext with bundler resolution
- JSX: react-jsx
- Path mapping: `@/*` maps to project root

### Formatting (Prettier) - CLI only

- Semi-colons: required
- Double quotes (singleQuote: false)
- Trailing commas: ES5 compatible
- Print width: 80 characters
- Tab width: 2 spaces (no tabs)
- Arrow function parentheses: always
- End of line: LF

**Import Order (via @trivago/prettier-plugin-sort-imports):**
1. `^react` - React imports
2. `^next` - Next.js imports
3. `<THIRD_PARTY_MODULES>` - Third-party libraries
4. `^@repo/(.*)$` - Monorepo packages
5. `^@/(.*)$` - Path aliases
6. `^[./]` - Local imports

### ESLint Rules

**CLI:**
- Explicit function return types: off (inferred preferred)
- No explicit any: warn
- No unused vars: error
- No floating promises: error (must handle all async calls)
- Console statements: allowed (CLI tool needs output)

**Client:**
- Uses `eslint-config-next` with TypeScript support
- Follows Next.js core web vitals rules

### Imports & Module Structure

**CLI:**
- Use Node.js built-in imports with `node:` prefix: `import path from 'node:path'`
- Third-party imports next (sorted by Prettier)
- Local imports last using relative paths
- Prefer named exports for utilities
- Default exports for main entry points

**Client:**
- Use path alias `@/` for imports from project root
- Import order handled by Prettier plugin
- Follow React/Next.js conventions

### Naming Conventions

- Functions/variables: camelCase (e.g., `buildProject`, `validateInput`)
- Types/Interfaces: PascalCase (e.g., `ProjectConfig`, `BuildResult`)
- Constants: UPPER_SNAKE_CASE for true constants
- Files: camelCase or PascalCase matching main export
- Boolean variables: prefix with verb (e.g., `isEnabled`, `hasError`)
- React components: PascalCase

### Error Handling

**CLI:**
- Use `buildError()` helper from `src/types/index.ts` for all errors
- Always wrap async operations with try-catch
- Provide context in error messages: `throw buildError(e, 'CODE', 'context')`
- Use consola for user-facing messages, not console.log
- Exit codes: 0 for success, 1 for errors

**Client:**
- Use Next.js error boundaries for React errors
- Handle async errors with try-catch
- Use appropriate HTTP status codes for API routes

### Testing

**No test framework currently configured** in either package.

When adding tests, consider:
- CLI: Vitest or Jest for unit testing
- Client: Jest with React Testing Library for component testing

### Git Hooks

Husky + lint-staged configured in CLI:
- Pre-commit: Runs Prettier and ESLint on staged files
- Configured in `cli/.husky/` and `cli/.lintstagedrc.json`

### Architecture Patterns

**CLI:**
- Barrel exports via `index.ts` in each directory
- Group related functionality in feature folders
- Keep functions pure when possible
- Async/await preferred over callbacks
- Use Zod for runtime validation
- Use consola for structured logging

**Client:**
- App Router structure (Next.js 13+)
- Server Components by default
- Client Components only when needed ('use client')
- Tailwind CSS v4 for styling
- Radix UI primitives for accessible components

### Project Structure

**CLI (`cli/src/`):**
```
src/
  index.ts          # CLI entry point
  types/            # Type definitions & errors
  prompts/          # User interaction logic
  builder/          # Project generation logic
  validators/       # Input validation
  output/           # Output formatting
  modules/          # Module registry
```

**Client (`client/`):**
```
app/                # Next.js App Router
components/         # React components
public/             # Static assets
```

### Dependencies

**CLI Runtime:**
- @clack/prompts - Interactive CLI prompts
- consola - Structured logging
- fs-extra - Enhanced file system operations
- handlebars - Template engine
- zod - Schema validation

**Client Runtime:**
- next - Next.js framework
- react/react-dom - React 19
- @radix-ui/react-slot - UI primitives
- tailwindcss v4 - Styling
- motion - Animation library

### Important Notes

- CLI is a Node.js tool - console output is expected and necessary
- Handlebars templates are in `cli/templates/` directory
- Node.js 18+ required
- Client uses Next.js 16 with React 19 (bleeding edge)
- Run lint/typecheck before committing changes
- No Cursor rules or Copilot instructions found in repo
