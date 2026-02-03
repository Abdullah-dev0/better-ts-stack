# AGENTS.md - Coding Guidelines for better-ts-stack

## Project Overview

A TypeScript CLI tool that generates fully configured TypeScript projects with backend, frontend, database integration, Docker support, and more through an interactive setup.

## Build, Lint & Development Commands

```bash
# Development - run with tsx (hot reload)
npm run dev

# Build - compile TypeScript to dist/
npm run build

# Run compiled code
npm start

# Type checking (no emit)
npm run type-check

# Linting
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues

# Formatting
npm run format            # Format src/**/*.ts with Prettier
```

## Code Style Guidelines

### TypeScript Configuration

- Target: ES2020, Module: CommonJS
- Strict mode enabled with full type safety
- Explicit return types encouraged but not required
- No `any` types (warning level)
- All imports must use type-only imports where applicable
- No unused variables or parameters allowed

### Formatting (Prettier)

- Semi-colons: required
- Single quotes
- Trailing commas: ES5 compatible
- Print width: 100 characters
- Tab width: 2 spaces (no tabs)
- Arrow function parentheses: always
- End of line: LF

### ESLint Rules

- Explicit function return types: off (inferred preferred)
- No explicit any: warn
- No unused vars: error
- No floating promises: error (handle all async calls)
- Console statements: allowed (CLI tool)

### Imports & Module Structure

- Use Node.js built-in imports with `node:` prefix: `import path from 'node:path'`
- Third-party imports next, alphabetically sorted
- Local imports last, using relative paths with explicit file extensions omitted
- Prefer named exports for utilities, default exports for main entry points

### Naming Conventions

- Functions: camelCase (e.g., `buildProject`, `validateInput`)
- Types/Interfaces: PascalCase (e.g., `ProjectConfig`, `BuildResult`)
- Constants: UPPER_SNAKE_CASE for true constants
- Files: camelCase or PascalCase matching main export
- Boolean variables: prefix with verb (e.g., `isEnabled`, `hasError`)

### Error Handling

- Use `buildError()` helper from `src/types/index.ts` for all errors
- Always wrap async operations with try-catch
- Provide context in error messages: `throw buildError(e, 'CODE', 'context')`
- Use consola for user-facing messages, not console
- Exit codes: 0 for success, 1 for errors

### Architecture Patterns

- Barrel exports via `index.ts` in each directory
- Group related functionality in feature folders
- Keep functions pure when possible
- Async/await preferred over callbacks
- Use Zod for runtime validation
- Use consola for structured logging

### Project Structure

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

### Dependencies

- Runtime: @clack/prompts, consola, fs-extra, handlebars, zod
- No test framework currently configured

## Important Notes

- This is a CLI tool - console output is expected and necessary
- Handlebars templates are in `templates/` directory
- Node.js 18+ required
- Project generates other TypeScript projects, not a web app itself
