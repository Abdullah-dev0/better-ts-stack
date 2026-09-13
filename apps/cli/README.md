# better-ts-stack

> Generate production-ready TypeScript apps from an interactive CLI

`better-ts-stack` scaffolds backend and full-stack TypeScript projects with sensible defaults, batteries-included tooling, and optional database, auth, Docker, and git setup.

## Quick Start

```bash
# Run instantly with npx
npx better-ts-stack

# Or install globally
npm install -g better-ts-stack
better-ts-stack
```

Run the command, answer the prompts, and the CLI generates a ready-to-work project for you.

## What It Can Scaffold

| Project type   | Stack                              | Optional setup                                                        |
| -------------- | ---------------------------------- | --------------------------------------------------------------------- |
| Backend API    | Express + TypeScript               | PostgreSQL, MongoDB, Prisma, Drizzle, Mongoose, JWT auth, Docker, git |
| Full-stack app | Next.js 16 + React 19 + TypeScript | PostgreSQL, MongoDB, Prisma, Better Auth, Docker, git                 |

Notes:

- Express is the current backend implementation.
- NestJS appears in the prompt flow as "Coming Soon".
- Better Auth is only available for full-stack projects when a database is selected.

## Interactive Prompt Flow

The CLI is fully interactive. There are no subcommands or flags.

You will be guided through:

1. Project name
2. Application type: `Backend API` or `Full-stack App`
3. Backend framework for backend apps: `Express` (`NestJS` is coming soon)
4. Database: `none`, `PostgreSQL`, or `MongoDB`
5. ORM/ODM when a database is selected
   - PostgreSQL: `Prisma` or `Drizzle`
   - MongoDB: `Mongoose`
6. Package manager: `npm`, `pnpm`, or `bun`
7. Docker setup
8. Authentication
   - Express apps: JWT-based auth
   - Next.js apps: Better Auth when a database is enabled
9. Git initialization
10. Dependency installation

The CLI does not ask for a port. Backend projects default to `PORT=3000`.

## What You Get

Every generated project includes the essentials:

- TypeScript with strict mode enabled
- ESLint and Prettier pre-configured
- `.env.example` and `.env` setup
- Ready-to-run project scripts
- Health check endpoint at `/health` for backend projects
- shadcn-compatible UI foundation for Next.js projects
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

## Release 1.0.8

Requires Node.js 24+. Dependencies and templates use current stable releases, with TypeScript 6.0.3 held for typescript-eslint compatibility and Node.js types aligned to 24.x. Express and Next.js support PostgreSQL with Prisma or Drizzle and MongoDB with Mongoose. Prisma generation runs before builds; Docker uses Node.js 24 and Compose v2.

See [upgrade notes](https://better-ts-stack.abdullahtech.me/docs/upgrade-notes) for compatibility changes and maintainer publishing commands.
