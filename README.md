# better-ts-stack

> Build production-ready TypeScript projects in seconds

An interactive CLI tool that generates fully configured TypeScript projects with your choice of backend framework, database, authentication, and Docker support—all through a guided prompt flow.

## ✨ Features

- 🚀 Interactive CLI with guided prompts — no flags or subcommands needed
- 📦 Modular architecture — include only what you need
- 🎯 Backend API template (Express.js with TypeScript)
- 🌐 Full-stack template (Next.js 16 with App Router)
- 🗄️ Database integration: PostgreSQL (Prisma or Drizzle) or MongoDB (Mongoose)
- 🔐 Authentication: JWT for Express, Better Auth for Next.js (requires a database)
- 🐳 Optional Docker support with multi-stage builds
- 🔧 TypeScript with strict mode enabled
- 🎨 ESLint + Prettier pre-configured
- ♻️ Hot reload for development

## 🚀 Quick Start

```bash
# Using npx (recommended)
npx better-ts-stack

# Or install globally
npm install -g better-ts-stack
better-ts-stack
```

Answer the prompts and get a project ready to run.

## 📋 Prompt Flow

The CLI guides you through these questions in order:

1. **Project name** — becomes the folder name and `package.json` name
2. **Application type** — `Backend API` or `Full-stack`
   - **Backend**: prompts for framework (Express; NestJS coming soon)
   - **Full-stack**: auto-selects Next.js (no framework prompt)
3. **Database type** — `none`, `PostgreSQL`, or `MongoDB`
4. **ORM/ODM** (if a database is selected):
   - PostgreSQL → `Prisma` or `Drizzle`
   - MongoDB → `Prisma` (adapter) or `Mongoose`
5. **Package manager** — `npm`, `pnpm`, or `bun`
6. **Docker** — include Docker configuration? (yes/no)
7. **Authentication** — add auth?
   - Express: JWT-based auth (always available)
   - Next.js: Better Auth (only prompted when a database is selected)
8. **Git** — initialize a git repository and create an initial commit? (yes/no)
9. **Install dependencies** — run the install command now? (yes/no)

> **Note**: The CLI does not ask for a port. The server port defaults to `3000` via the `PORT` environment variable.

## 📦 What You Get

After running the CLI you have a fully configured project with:

- TypeScript in strict mode across all generated files
- ESLint and Prettier configuration
- Environment variable setup (`.env.example` / `.env`)
- A health check endpoint (`GET /health`) for backend projects
- Database connection and ORM setup (if selected)
- Authentication scaffolding (if selected)
- Docker files (if selected)
- Optional git repository with an initial commit

## 🧩 Available Modules

### Backend — Express (always included for `backend` type)

- Express.js server with TypeScript
- Middleware: `cors`, `helmet`, `morgan`
- Health check route at `/health`
- `dev`, `build`, `start`, `lint`, `format`, `type:check` scripts

### Frontend — Next.js (always included for `fullstack` type)

- Next.js 16 with React 19 and App Router
- Tailwind CSS v4
- `dev`, `build`, `start`, `lint` scripts
- A proxy configuration file (`proxy.ts`) rendered from a Handlebars template

### Database modules

| Combination                         | Template files generated                                    |
| ----------------------------------- | ----------------------------------------------------------- |
| PostgreSQL + Prisma (Express)       | `prisma/schema.prisma`, `src/lib/prisma.ts`                 |
| PostgreSQL + Prisma (Next.js)       | `prisma/schema.prisma`, `lib/prisma.ts`, `prisma.config.ts` |
| PostgreSQL + Drizzle (Next.js only) | `lib/schema.ts`, `lib/db.ts`, `drizzle.config.ts`           |
| MongoDB + Mongoose (Express only)   | `src/lib/db.ts.hbs` (rendered)                              |

### Auth modules

| Context           | Implementation                  | Generated files                                                                                                                           |
| ----------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Express backend   | JWT + bcrypt                    | `src/lib/jwt.ts`, `src/middleware/requireAuth.ts`, `src/services/userStore.ts`, `src/routes/auth.ts`, `src/controllers/authController.ts` |
| Next.js fullstack | Better Auth (requires database) | `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`                                                                     |

### Docker module

| Files generated                             |
| ------------------------------------------- |
| `Dockerfile` (multi-stage, framework-aware) |
| `docker-compose.yml`                        |
| `.dockerignore`                             |

Scripts added: `docker:build`, `docker:up`, `docker:down`, `docker:logs`

## 🔧 Technology Stack

| Layer              | Technology                                    |
| ------------------ | --------------------------------------------- |
| Runtime            | Node.js 18+ with TypeScript 5.x               |
| Backend framework  | Express.js 4                                  |
| Frontend framework | Next.js 16 / React 19                         |
| Database ORMs      | Prisma, Drizzle, Mongoose                     |
| Auth               | JWT (`jsonwebtoken` + `bcrypt`) / Better Auth |
| Hot reload         | `tsx watch` (Express) / `next dev` (Next.js)  |
| Linting            | ESLint 9 with TypeScript plugin               |
| Formatting         | Prettier                                      |

## 🤝 Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## 📄 License

MIT
