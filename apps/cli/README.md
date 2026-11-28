# better-ts-stack

> A CLI that scaffolds TypeScript backend and full-stack projects.

`better-ts-stack` creates an Express, NestJS, Next.js, or TanStack Start project with TypeScript, ESLint, and Prettier set up. Database, authentication, AI chat, payments, Docker, a Turborepo monorepo, and git are optional.

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
| `--vscode` / `--no-vscode`         | Add VS Code settings and extensions                                  |
| `--git` / `--no-git`               | Initialize a git repository                                          |
| `--install` / `--no-install`       | Install dependencies                                                 |
| `-y`, `--yes`                      | Use defaults for missing options, no prompts                         |
| `--dry-run`                        | List what would be created, write nothing                            |
| `-h`, `--help`                     | Show help                                                            |
| `-v`, `--version`                  | Show the version                                                     |

`--database` names the ORM, which also selects the database: `prisma` and `drizzle` use PostgreSQL, `mongoose` uses MongoDB.

With `--yes`, the defaults are Express, no database, no auth, no rate limiting, no Docker, no CI, no VS Code settings, an `AGENTS.md`, git initialized, and dependencies not installed. The package manager defaults to the one that ran the CLI: `pnpm` for `pnpm dlx`, `bun` for `bunx`, and `npm` otherwise.

The project path can be a name (`my-app`), a nested path (`apps/api`), or `.` for the current directory.

## What It Can Scaffold

| Project type   | Stack                                                                    | Optional setup                                                                                     |
| -------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Backend API    | Express 5 or NestJS 12 + TypeScript                                      | PostgreSQL, MongoDB, Prisma, Drizzle, Mongoose, Better Auth, AI chat, Polar or Stripe, Docker, git |
| Full-stack app | Next.js 16 or TanStack Start + React 19                                  | PostgreSQL, MongoDB, Prisma, Drizzle, Mongoose, Better Auth, AI chat, Polar or Stripe, Docker, git |
| Monorepo       | Next.js or TanStack Start in `apps/web`, Express or NestJS in `apps/api` | The same, without Docker for now                                                                   |

Notes:

- Better Auth is offered for every framework; full-stack projects need a database for it.
- Payments need auth and a database.

## Interactive Prompt Flow

Without flags, the CLI asks, in order:

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

`AGENTS.md` and `CLAUDE.md` are added without a question; pass `--no-agents` to leave them out.

The CLI does not ask for a port. Backend projects default to `PORT=3000`.

## What You Get

Every generated project includes:

- TypeScript with strict mode enabled
- ESLint and Prettier pre-configured
- `.env.example` and `.env` setup
- Ready-to-run project scripts
- Health check endpoint at `/health` for backend projects
- shadcn/ui components built on Base UI for Next.js and TanStack Start projects
- Database wiring and schema setup when selected
- Authentication scaffolding when selected
- A streaming AI chat route, and a chat page on Next.js and TanStack Start, when selected
- Polar or Stripe checkout, customer portal, and webhook when selected
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
