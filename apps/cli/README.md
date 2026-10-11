# better-ts-stack

> A CLI that scaffolds TypeScript backend and full-stack projects.

`better-ts-stack` creates an Express, NestJS, Next.js, or TanStack Start project with TypeScript, ESLint, and Prettier set up. Database, authentication, Docker, and git are optional.

## Quick Start

```bash
# Run instantly with npx
npx better-ts-stack

# Or install globally
npm install -g better-ts-stack
better-ts-stack
```

Run the command and answer the prompts. The CLI creates the project folder.

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

The project path can be a name (`my-app`), a nested path (`apps/api`), or `.` for the current directory.

## What It Can Scaffold

| Project type   | Stack                                   | Optional setup                                                           |
| -------------- | --------------------------------------- | ------------------------------------------------------------------------ |
| Backend API    | Express 5 or NestJS 12 + TypeScript     | PostgreSQL, MongoDB, Prisma, Drizzle, Mongoose, JWT auth, Docker, git    |
| Full-stack app | Next.js 16 or TanStack Start + React 19 | PostgreSQL, MongoDB, Prisma, Drizzle, Mongoose, Better Auth, Docker, git |

Notes:

- Better Auth is only offered for full-stack projects that use a database.

## Interactive Prompt Flow

Without flags, the CLI asks, in order:

1. Project name or path
2. Application type: `Backend API` or `Full-stack App`
3. Framework
   - Backend: `Express` or `NestJS`
   - Full-stack: `Next.js` or `TanStack Start`
4. Database: `none`, `PostgreSQL`, or `MongoDB`
5. ORM/ODM when a database is selected
   - PostgreSQL: `Prisma` or `Drizzle`
   - MongoDB: `Mongoose`
6. Package manager: `npm`, `pnpm`, or `bun`
7. Docker setup
8. Authentication
   - Express and NestJS apps: JWT-based auth
   - Next.js and TanStack Start apps: Better Auth, only when a database is selected
9. Git initialization
10. Dependency installation

The CLI does not ask for a port. Backend projects default to `PORT=3000`.

## What You Get

Every generated project includes:

- TypeScript with strict mode enabled
- ESLint and Prettier pre-configured
- `.env.example` and `.env` setup
- Ready-to-run project scripts
- Health check endpoint at `/health` for backend projects
- shadcn-compatible UI components for Next.js and TanStack Start projects
- Database wiring and schema setup when selected
- Authentication scaffolding when selected
- Docker files when selected
- Optional git repository initialization

## Requirements

- Node.js 24 or later

## Links

- [Documentation](https://better-ts-stack.abdullahtech.me/docs)
- [GitHub Repository](https://github.com/Abdullah-dev0/better-ts-stack)
- [Issue Tracker](https://github.com/Abdullah-dev0/better-ts-stack/issues)

## License

MIT
