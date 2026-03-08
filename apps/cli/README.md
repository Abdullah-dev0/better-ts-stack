# better-ts-stack

> Build production-ready TypeScript projects in seconds

An interactive CLI tool that generates fully configured TypeScript projects with your choice of backend framework, database, authentication, and Docker support.

## Installation & Usage

```bash
# Using npx (recommended — no install required)
npx better-ts-stack

# Or install globally
npm install -g better-ts-stack
better-ts-stack
```

Answer the prompts and get a fully configured project ready to run.

## Prompt Flow

The CLI is entirely interactive — there are no subcommands or flags. It will guide you through:

1. **Project name** — becomes the folder name and `package.json` name
2. **Application type** — `Backend API` or `Full-stack`
   - **Backend**: prompts for framework (Express; NestJS coming soon)
   - **Full-stack**: auto-selects Next.js
3. **Database type** — `none`, `PostgreSQL`, or `MongoDB`
4. **ORM/ODM** (only shown when a database is selected):
   - PostgreSQL → `Prisma` or `Drizzle`
   - MongoDB → `Prisma` (adapter) or `Mongoose`
5. **Package manager** — `npm`, `pnpm`, or `bun`
6. **Docker** — include Docker configuration?
7. **Authentication** — add auth?
   - Express: JWT-based auth
   - Next.js: Better Auth (only prompted when a database is selected)
8. **Git** — initialize a git repository with an initial commit?
9. **Install dependencies** — run the install command now?

> The CLI does not prompt for a port. The server port defaults to `3000` via the `PORT` environment variable.

## What You Get

- TypeScript in strict mode
- ESLint + Prettier pre-configured
- Environment variable setup (`.env.example` / `.env`)
- Health check endpoint at `/health` (backend projects)
- Database connection and ORM setup (if selected)
- Authentication scaffolding (if selected)
- Docker files (if selected)
- Optional git repository with an initial commit

## Requirements

- Node.js 18 or later

## Links

- [Documentation](https://better-ts-stack.vercel.app/docs)
- [GitHub Repository](https://github.com/Abdullah-dev0/better-ts-stack)
- [Issue Tracker](https://github.com/Abdullah-dev0/better-ts-stack/issues)

## License

MIT
