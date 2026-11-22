# better-ts-stack

better-ts-stack is a CLI that generates TypeScript projects from a few prompts or flags.

## Application types

**Backend API**:
The application type for a server-only project, built on Express or NestJS.
_Avoid_: backend app, API project

## Monorepo apps

**web app**:
The Next.js or TanStack Start app in a monorepo, in `apps/web`.
_Avoid_: frontend, client

**api**:
The optional Express or NestJS app in a monorepo, in `apps/api`. Always lowercase, so it reads as the app's name and not as a Backend API project.
_Avoid_: API, backend, server
