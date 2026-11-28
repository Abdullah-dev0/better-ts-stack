# better-ts-stack

> A CLI that scaffolds TypeScript backend and full-stack projects.

Answer a few prompts, or pass flags, to pick a framework, database, authentication, AI chat, payments, and Docker setup, as one project or a Turborepo monorepo. The CLI writes a project that is ready to install and run.

## Features

- Interactive prompts, or flags for scripts and CI
- Only the modules you select are added
- Backend API templates (Express or NestJS with TypeScript)
- Full-stack templates (Next.js 16 or TanStack Start with React)
- Database integration: PostgreSQL (Prisma or Drizzle) or MongoDB (Mongoose)
- Authentication: Better Auth for every framework, with email verification, password reset, and GitHub and Google sign-in (Next.js and TanStack Start need a database)
- AI chat: a streaming chat route on the Vercel AI SDK or TanStack AI, and a chat page on Next.js and TanStack Start
- Payments: Polar or Stripe subscriptions through the Better Auth plugin, with checkout, the customer portal, and a signed webhook
- Monorepo: a Turborepo with a Next.js or TanStack Start web app and an optional Express or NestJS api
- Optional Docker support with multi-stage builds
- TypeScript with strict mode enabled
- ESLint + Prettier pre-configured
- Hot reload for development

## Quick Start

```bash
# Using npx (recommended)
npx better-ts-stack

# Or install globally
npm install -g better-ts-stack
better-ts-stack
```

Answer the prompts and the CLI creates the project folder.

## Flags

Every prompt has a flag. Options you leave out are asked interactively, unless you pass `--yes`.

```bash
# No prompts at all
npx better-ts-stack my-api --framework nestjs --database prisma --auth --yes

# Create the project in the current (empty) directory
npx better-ts-stack . --framework nextjs --database drizzle --pm pnpm
```

| Flag                               | Values                                                               |
| ---------------------------------- | -------------------------------------------------------------------- |
| `--framework <name>`               | `express`, `nestjs`, `nextjs`, `tanstack`                            |
| `--database <name>`                | `none`, `prisma`, `drizzle`, `mongoose`                              |
| `--pm <name>`                      | `npm`, `pnpm`, `bun`                                                 |
| `--auth` / `--no-auth`             | Add authentication                                                   |
| `--ai <name>`                      | `none`, `vercel`, `tanstack`: a streaming AI chat                    |
| `--payments <name>`                | `none`, `polar`, `stripe`: subscriptions (needs auth and a database) |
| `--monorepo`                       | Turborepo with `apps/web` and `apps/api`                             |
| `--api <name>`                     | `express`, `nestjs`, `none`: the monorepo api                        |
| `--owner <app>`                    | `web`, `api`: the monorepo app with auth and data                    |
| `--docker` / `--no-docker`         | Add Docker files                                                     |
| `--rate-limit` / `--no-rate-limit` | Add rate limiting (Express and NestJS)                               |
| `--ci` / `--no-ci`                 | Add a GitHub Actions workflow                                        |
| `--no-agents`                      | Leave out AGENTS.md (added by default)                               |
| `--vscode` / `--no-vscode`         | Add VS Code settings and recommended extensions                      |
| `--git` / `--no-git`               | Initialize a git repository                                          |
| `--install` / `--no-install`       | Install dependencies                                                 |
| `-y`, `--yes`                      | Use defaults for missing options, no prompts                         |
| `--dry-run`                        | List what would be created, write nothing                            |
| `-h`, `--help`                     | Show help                                                            |
| `-v`, `--version`                  | Show the version                                                     |

`--database` names the ORM, which also selects the database: `prisma` and `drizzle` use PostgreSQL, `mongoose` uses MongoDB.

With `--yes`, the defaults are Express, no database, no auth, no rate limiting, no Docker, no CI, no VS Code settings, an `AGENTS.md`, git initialized, and dependencies not installed. The package manager defaults to the one that ran the CLI: `pnpm` for `pnpm dlx`, `bun` for `bunx`, and `npm` otherwise.

The project path can be a name (`my-app`), a nested path (`apps/api`), or `.` for the current directory. The last folder name becomes the `package.json` name.

## Prompt Flow

The CLI guides you through these questions in order:

1. **Project name.** A name or a path. The folder name becomes the `package.json` name.
2. **Monorepo.** One project, or a Turborepo with `apps/web` and `apps/api`?
3. **Framework.**
   - In a monorepo: the web app (`Next.js` or `TanStack Start`) and the api (`Express`, `NestJS`, or none)
   - Otherwise: `Backend API` (`Express` or `NestJS`) or `Full-stack` (`Next.js` or `TanStack Start`)
4. **Database.** `none`, `PostgreSQL`, or `MongoDB`.
5. **ORM or ODM**, when a database is selected: `Prisma` or `Drizzle` for PostgreSQL, `Mongoose` for MongoDB.
6. **Package manager.** `npm`, `pnpm`, or `bun`.
7. **Docker.** Not offered for a monorepo yet.
8. **Authentication.** Better Auth for every framework. Next.js and TanStack Start need a database, unless a monorepo api runs auth.
9. **AI chat.** `None`, `Vercel AI SDK`, or `TanStack AI`.
10. **Payments.** `None`, `Polar`, or `Stripe`. Asked only with auth and a database.
11. **Owner.** In a monorepo with an api: the app that runs auth, the database, AI chat, and payments.
12. **Rate limiting.** Express, NestJS, or a monorepo api.
13. **CI.** A GitHub Actions workflow.
14. **VS Code.** Workspace settings and recommended extensions.
15. **Git.** Initialize a repository.
16. **Install dependencies.** Run the install command now.

> **Note**: The CLI does not ask for a port. The server port defaults to `3000` via the `PORT` environment variable.

## What You Get

A generated project includes:

- TypeScript in strict mode across all generated files
- ESLint and Prettier configuration
- Environment variable setup (`.env.example` / `.env`)
- A health check endpoint (`GET /health`) for backend projects
- Database connection and ORM setup (if selected)
- Authentication scaffolding (if selected)
- A streaming AI chat route, and a chat page for Next.js and TanStack Start (if selected)
- Polar or Stripe checkout, customer portal, and webhook (if selected)
- Docker files (if selected)
- A GitHub Actions workflow (if selected)
- An `AGENTS.md` with the stack, commands, and rules for AI coding agents, plus a `CLAUDE.md` that points Claude Code to it (always, unless you pass `--no-agents`)
- VS Code settings that fix lint problems on save, and recommended extensions for the stack (if selected)
- Optional git repository initialization

## Available Modules

### Backend — Express (always included for `backend` type)

- Express.js server with TypeScript
- Middleware: `cors`, `helmet`, `morgan`
- Health check route at `/health`
- `dev`, `build`, `start`, `lint`, `format`, `type:check` scripts

### Backend — NestJS

- NestJS 12 server with TypeScript and ES modules
- `helmet` and CORS enabled, shutdown hooks for clean database disconnects
- Health check route at `/health`
- `dev` (`nest start --watch`), `build`, `start`, `lint`, `format`, `type:check` scripts

### Frontend — Next.js

- Next.js 16 with React 19 and App Router
- Tailwind CSS v4 with shadcn/ui components built on Base UI (`base-vega` style), ready for `npx shadcn add`
- `dev`, `build`, `start`, `lint` scripts
- With Better Auth, `proxy.ts` redirects signed-out visitors away from `/dashboard`

### Frontend — TanStack Start

- TanStack Start (React) with TanStack Router, React Query, and SSR
- Tailwind CSS v4 with shadcn/ui components built on Base UI (`base-vega` style), ready for `npx shadcn add`
- Production server built by Nitro (`node .output/server/index.mjs`), also used in Docker
- `~/*` path alias, also used by `components.json`
- `dev`, `build`, `start`, `preview`, `type:check`, `lint` scripts
- Auth routes use server functions (`createServerFn`) with cookie-based sessions

### Database modules

| Combination                                         | Template files generated                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| PostgreSQL + Prisma (Express)                       | `prisma/schema.prisma`, `src/lib/prisma.ts`                                           |
| PostgreSQL + Prisma (NestJS)                        | `prisma/schema.prisma`, `src/prisma/prisma.service.ts`, `src/prisma/prisma.module.ts` |
| PostgreSQL + Drizzle (NestJS)                       | `src/database/schema.ts`, `src/database/database.module.ts`, `drizzle.config.ts`      |
| MongoDB + Mongoose (NestJS)                         | `src/users/user.schema.ts` (connection set up in `src/app.module.ts`)                 |
| PostgreSQL + Prisma (Next.js / TanStack)            | `prisma/schema.prisma`, `lib/prisma.ts` / `src/lib/prisma.ts`, `prisma.config.ts`     |
| PostgreSQL + Drizzle (Express / Next.js / TanStack) | `src/lib/schema.ts` / `lib/schema.ts`, database helper, `drizzle.config.ts`           |
| MongoDB + Mongoose (Express / Next.js / TanStack)   | `src/lib/db.ts` / `lib/db.ts`, `src/models/User.ts` / `models/User.ts`                |

### Auth modules

| Context            | Implementation                  | Generated files                                                                                      |
| ------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Express backend    | Better Auth                     | `src/lib/auth.ts`, `src/lib/email.ts`, `src/middleware/requireAuth.ts`, `src/routes/me.ts`           |
| NestJS backend     | Better Auth                     | `src/auth/` (auth server, module, emails), `src/me/me.controller.ts`                                 |
| Next.js fullstack  | Better Auth (requires database) | `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`                                |
| TanStack fullstack | Better Auth (requires database) | `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/auth-functions.ts`, `src/routes/api/auth/$.ts` |

### Docker module

| Files generated                             |
| ------------------------------------------- |
| `Dockerfile` (multi-stage, framework-aware) |
| `docker-compose.yml`                        |
| `.dockerignore`                             |

Scripts added: `docker:build`, `docker:up`, `docker:down`, `docker:logs`

## Technology Stack

| Layer              | Technology                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| Runtime            | Node.js 24+ with TypeScript 6.0                                                                      |
| Backend framework  | Express.js 5 / NestJS 12                                                                             |
| Frontend framework | Next.js 16 / TanStack Start / React 19                                                               |
| Database ORMs      | Prisma, Drizzle, Mongoose                                                                            |
| Auth               | Better Auth                                                                                          |
| AI chat            | Vercel AI SDK or TanStack AI                                                                         |
| Payments           | Polar or Stripe, through the Better Auth plugins                                                     |
| Monorepo           | Turborepo                                                                                            |
| Hot reload         | `tsx watch` (Express) / `nest start --watch` (NestJS) / `next dev` (Next.js) / `vite dev` (TanStack) |
| Linting            | ESLint 10 with TypeScript plugin                                                                     |
| Formatting         | Prettier                                                                                             |

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

MIT
