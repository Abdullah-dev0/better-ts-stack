# better-ts-stack

> Scaffold production-ready full-stack projects in seconds

A powerful CLI tool that generates fully configured TypeScript projects with backend, frontend (coming soon), database integration, Docker support, and more—all through an interactive setup.

## ✨ Features

- 🚀 Interactive CLI with smart prompts
- 📦 Modular architecture—choose only what you need
- 🔧 Production-ready configuration out of the box
- 🎯 Backend support (Express.js with TypeScript)
- 🌐 Frontend support (React, Next.js, Vue - coming soon)
- � JOptional Docker support with multi-stage builds
- � Dateabase integration (PostgreSQL with Prisma or MongoDB with Mongoose)
- 🔐 JWT authentication ready (coming soon)
- �  TypeScript with strict mode enabled
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

- Backend server with TypeScript (Express.js currently, more coming soon)
- Frontend application (React, Next.js, Vue - coming soon)
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
2. **Project type** - Backend, Frontend, or Full-stack (frontend coming soon)
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

### Frontend Modules (Coming Soon)

#### React
- React 18+ with TypeScript
- Vite for blazing fast development
- React Router for navigation
- Pre-configured build pipeline

#### Next.js
- Next.js 14+ with App Router
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

## 🏗️ Project Structure

```
your-project/
├── src/
│   ├── index.ts              # Application entry point
│   ├── routes/               # API routes
│   ├── models/               # Database models (if database selected)
│   └── config/               # Configuration files
├── prisma/                   # Prisma schema (if Prisma selected)
│   └── schema.prisma
├── .env                      # Environment variables
├── .env.example              # Environment template
├── Dockerfile                # Docker config (if Docker selected)
├── docker-compose.yml        # Docker Compose (if Docker selected)
├── tsconfig.json             # TypeScript configuration
├── .eslintrc.js              # ESLint configuration
├── .prettierrc               # Prettier configuration
└── package.json              # Dependencies and scripts
```

## 🛠️ Generated Scripts

Your project will include these npm scripts:

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production server
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # Type check without building
```

## 💡 Example Usage

```bash
$ npx better-ts-stack

? What is your project name? my-api
? Which package manager do you want to use? npm
? Which database do you want to use? PostgreSQL (Prisma)
? What port should the server run on? 3000
? Do you want to include Docker configuration? Yes
? Do you want to initialize a git repository? Yes
? Do you want to install dependencies now? Yes

✓ Project scaffolded successfully!
✓ Dependencies installed
✓ Git repository initialized

📁 Project created at: ./my-api

Next steps:
  1. cd my-api
  2. Copy .env.example to .env and configure
  3. Run: npm run dev
  4. Visit: http://localhost:3000
```

## 🔧 Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript 5.3+
- **Framework**: Express.js (more coming soon)
- **Databases**: PostgreSQL (Prisma) or MongoDB (Mongoose)
- **Validation**: Zod
- **Development**: tsx for hot reload

### Frontend (Coming Soon)
- **Frameworks**: React, Next.js
- **Build Tools**: Vite, Next.js built-in
- **Styling**: Tailwind CSS, CSS Modules

### Shared
- **Language**: TypeScript 5.3+
- **Code Quality**: ESLint + Prettier
- **Containerization**: Docker + Docker Compose
- **Version Control**: Git

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## �️ Roadmapd

- ✅ Backend scaffolding with Express.js
- ✅ Database integration (Prisma, Mongoose)
- ✅ Docker support
- 🚧 Frontend scaffolding (React, Next.js)
- 🚧 JWT authentication module
- 🚧 Full-stack templates with integrated frontend/backend
- 🚧 CI/CD templates

## 🙏 Acknowledgments

Built with modern best practices for full-stack TypeScript development.

---

**Ready to build your next project?** Run `npx better-ts-stack` and get started in seconds!

