# better-ts-stack

> Build production-ready full-stack projects in seconds

A powerful CLI tool that generates fully configured TypeScript projects with backend, frontend (coming soon), database integration, Docker support, and more—all through an interactive setup.

## Installation & Usage

```bash
# Using npx (recommended – no install)
npx better-ts-stack

# Or install globally
npm install -g better-ts-stack
better-ts-stack
# or
create-ts-stack
```

Answer a few simple questions and get a complete project ready to run.

## Features

- Interactive CLI with smart prompts
- Modular architecture—choose only what you need
- Production-ready configuration out of the box
- Backend support (Express.js with TypeScript)
- Frontend support (React, Next.js, Vue - coming soon)
- Optional Docker support with multi-stage builds
- Database integration (PostgreSQL with Prisma or MongoDB with Mongoose)
- JWT authentication ready (coming soon)
- TypeScript with strict mode enabled
- ESLint + Prettier pre-configured
- Hot reload for development
- Comprehensive documentation and examples

## What You Get

After running the CLI, you'll have a fully configured project with:

- Backend server with TypeScript (Express.js currently, more coming soon)
- TypeScript configuration with strict mode
- Environment variable management
- Error handling and logging
- Database integration (if selected)
- Docker configuration (if selected)
- Git repository initialized (optional)
- Dependencies installed (optional)
- Clear next steps and documentation

## Interactive Setup

The CLI will guide you through:

1. **Project name** – Name of your project
2. **Project type** – Backend, Frontend, or Full-stack (frontend coming soon)
3. **Package manager** – npm, pnpm, or bun
4. **Database** – None, PostgreSQL (Prisma), or MongoDB (Mongoose)
5. **Port** – Server port (default: 3000)
6. **Docker** – Include Docker configuration?
7. **Git** – Initialize git repository?
8. **Install dependencies** – Install packages now?

## Requirements

- Node.js 18 or later

## Links

- [GitHub repository](https://github.com/Abdullah-dev0/better-ts-stack)
- [Issue tracker](https://github.com/Abdullah-dev0/better-ts-stack/issues)

## License

MIT
