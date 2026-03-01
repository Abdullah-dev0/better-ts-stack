# better-ts-stack

> Build production-ready full-stack projects in seconds

A powerful CLI tool that generates fully configured TypeScript projects with backend, full-stack frontend, database integration, Docker support, and more—all through an interactive setup.

## ✨ Features

- 🚀 Interactive CLI with smart prompts
- 📦 Modular architecture—choose only what you need
- 🔧 Production-ready configuration out of the box
- 🎯 Backend support (Express.js with TypeScript)
- 🌐 Full-stack frontend support (Next.js 16)
- � Optional Docker support with multi-stage builds
- � Database integration (PostgreSQL with Prisma or MongoDB with Mongoose)
- 🔐 Authentication support (JWT for Express, Better Auth for Next.js)
- � TypeScript with strict mode enabled
- 🎨 ESLint + Prettier pre-configured
- 🔄 Hot reload for development
- 📚 Comprehensive documentation and examples

## 🚀 Quick Start

```bash
# Using npx (recommended)
npx better-ts-stack

# Or install globally
npm install -g better-ts-stack
better-ts-stack
```

Answer a few simple questions and get a complete project ready to run.

## 📋 What You Get

After running the CLI, you'll have a fully configured project with:

- Backend server with TypeScript (Express.js)
- Frontend application (Next.js 16 for full-stack projects)
- TypeScript configuration with strict mode
- Environment variable management
- Error handling and logging
- Database integration (if selected)
- Docker configuration (if selected)
- Git repository initialized (optional)
- Dependencies installed (optional)
- Clear next steps and documentation

## 🎯 Interactive Setup

The CLI will guide you through setup with questions like:

1. **Project name** - Name of your project
2. **Project type** - Backend API or Full-stack app
3. **Package manager** - npm, pnpm, or bun
4. **Database** - None, PostgreSQL (Prisma), or MongoDB (Mongoose)
5. **Port** - Server port (default: 3000)
6. **Docker** - Include Docker configuration?
7. **Git** - Initialize git repository?
8. **Install dependencies** - Install packages now?

## 📦 Available Modules

### Backend Modules

#### Express Base (Always Included)

- Express.js server with TypeScript
- Middleware setup (cors, helmet, compression)
- Environment configuration
- Error handling
- Health check endpoint
- Development and production scripts

#### Prisma (PostgreSQL)

- Prisma ORM configuration
- PostgreSQL connection setup
- Example schema and models
- Migration scripts
- Type-safe database queries

#### Mongoose (MongoDB)

- Mongoose ODM configuration
- MongoDB connection setup
- Example schemas and models
- Connection pooling
- Type definitions

### Frontend Modules

#### Next.js

- Next.js 16 with App Router
- Server and client components
- API routes integration
- Optimized production builds

### Infrastructure Modules

#### Docker

- Multi-stage Dockerfile
- Docker Compose configuration
- Production-optimized builds
- Development and production environments
- .dockerignore file

## 🔧 Technology Stack Used

### Backend

- **Runtime**: Node.js with TypeScript 5.3+
- **Framework**: Express.js
- **Validation**: Zod
- **Development**: tsx for hot reload

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Built with modern best practices for full-stack TypeScript development.

---

**Ready to build your next project?** Run `npx better-ts-stack` and get started in seconds!
