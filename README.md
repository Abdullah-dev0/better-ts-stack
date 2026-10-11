# better-ts-stack

> A CLI that scaffolds TypeScript backend and full-stack projects.

Answer a few prompts, or pass flags, to pick a framework, database, authentication, and Docker setup. The CLI writes a project that is ready to install and run.

## Features

- Interactive prompts, or flags for scripts and CI
- Only the modules you select are added
- Backend API templates (Express or NestJS with TypeScript)
- Full-stack templates (Next.js 16 or TanStack Start with React)
- Database integration: PostgreSQL (Prisma or Drizzle) or MongoDB (Mongoose)
- Authentication: JWT for Express and NestJS, Better Auth for Next.js and TanStack Start (requires a database)
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

| Flag                         | Values                                       |
| ---------------------------- | -------------------------------------------- |
| `--framework <name>`         | `express`, `nestjs`, `nextjs`, `tanstack`    |
| `--database <name>`          | `none`, `prisma`, `drizzle`, `mongoose`      |
| `--pm <name>`                | `npm`, `pnpm`, `bun`                         |
| `--auth` / `--no-auth`       | Add authentication                           |
| `--docker` / `--no-docker`   | Add Docker files                             |
| `--git` / `--no-git`         | Initialize a git repository                  |
| `--install` / `--no-install` | Install dependencies                         |
| `-y`, `--yes`                | Use defaults for missing options, no prompts |
| `--dry-run`                  | List what would be created, write nothing    |
| `-h`, `--help`               | Show help                                    |
| `-v`, `--version`            | Show the version                             |

`--database` names the ORM, which also selects the database: `prisma` and `drizzle` use PostgreSQL, `mongoose` uses MongoDB.

With `--yes`, the defaults are Express, no database, no auth, no Docker, npm, git initialized, and dependencies not installed.

The project path can be a name (`my-app`), a nested path (`apps/api`), or `.` for the current directory. The last folder name becomes the `package.json` name.

## Prompt Flow

The CLI guides you through these questions in order:

1. **Project name** — a name or path; the folder name becomes the `package.json` name
2. **Application type** — `Backend API` or `Full-stack`
   - **Backend**: prompts for framework (`Express` or `NestJS`)
   - **Full-stack**: prompts for frontend framework (`Next.js` or `TanStack Start`)
3. **Database type** — `none`, `PostgreSQL`, or `MongoDB`
4. **ORM/ODM** (if a database is selected):
   - PostgreSQL → `Prisma` or `Drizzle`
   - MongoDB → `Mongoose`
5. **Package manager** — `npm`, `pnpm`, or `bun`
6. **Docker** — include Docker configuration? (yes/no)
7. **Authentication** — add auth?
   - Express / NestJS: JWT-based auth (always available)
   - Next.js / TanStack Start: Better Auth (only prompted when a database is selected)
8. **Git** — initialize a git repository? (yes/no)
9. **Install dependencies** — run the install command now? (yes/no)

> **Note**: The CLI does not ask for a port. The server port defaults to `3000` via the `PORT` environment variable.

## What You Get

A generated project includes:

- TypeScript in strict mode across all generated files
- ESLint and Prettier configuration
- Environment variable setup (`.env.example` / `.env`)
- A health check endpoint (`GET /health`) for backend projects
- Database connection and ORM setup (if selected)
- Authentication scaffolding (if selected)
- Docker files (if selected)
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
- Tailwind CSS v4
- `dev`, `build`, `start`, `lint` scripts
- A proxy configuration file (`proxy.ts`) rendered from a Handlebars template

### Frontend — TanStack Start

- TanStack Start (React) with TanStack Router, React Query, and SSR
- Tailwind CSS v4
- Vite-based build (no Nitro) producing `dist/server/server.js` + `dist/client`
- Production serving via `srvx` (`start` script, also used in Docker)
- `~/*` path alias and `components.json` (shadcn-style) configured for UI components
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

| Context            | Implementation                  | Generated files                                                                                                                           |
| ------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Express backend    | JWT + bcrypt                    | `src/lib/jwt.ts`, `src/middleware/requireAuth.ts`, `src/services/userStore.ts`, `src/routes/auth.ts`, `src/controllers/authController.ts` |
| NestJS backend     | JWT + bcrypt                    | `src/auth/` (module, controller, service, guard, Zod schemas, users service)                                                              |
| Next.js fullstack  | Better Auth (requires database) | `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`                                                                     |
| TanStack fullstack | Better Auth (requires database) | `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/auth-functions.ts`, `src/routes/api/auth/$.ts`                                      |

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
| Auth               | JWT (`jsonwebtoken` + `bcrypt`) / Better Auth                                                        |
| Hot reload         | `tsx watch` (Express) / `nest start --watch` (NestJS) / `next dev` (Next.js) / `vite dev` (TanStack) |
| Linting            | ESLint 10 with TypeScript plugin                                                                     |
| Formatting         | Prettier                                                                                             |

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

MIT
