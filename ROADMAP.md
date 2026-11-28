# Roadmap

One feature per minor release, no betas. A release ships when CI is green on its pull request (lint, type-check, `test:templates`, and the sampled install, build, smoke, Docker, and monorepo checks), plus a short manual check of only what the release adds, about 10 minutes. The full matrix runs weekly (`full-matrix.yml`) and does not block a release; what it finds becomes a patch release.

## Released

- **2.2.0** Better Auth on Express, NestJS, Next.js, and TanStack Start: email verification, password reset, GitHub and Google sign-in, Resend emails. shadcn/ui on Base UI, server-first Next.js pages, `better-ts-stack.json`, and AGENTS.md added by default.
- **2.2.1** Exact `@thallesp/nestjs-better-auth` version, `git` run without a shell, `.gitattributes` for LF line endings, a MongoDB sign-up troubleshooting note, and a port check and MongoDB retry in the Docker tests. Generated projects already declared Node 24 in `engines`; `npm install` still runs through the shell because npm and pnpm are `.cmd` files on Windows.
- **2.3.0** AI chat (`--ai vercel|tanstack`) on all four frameworks, and monorepos (`--monorepo`): a Turborepo with `apps/web` and an optional `apps/api`, where `--owner` picks the app that runs auth and data.
- **2.4.0** Payments (`--payments polar|stripe`) through the Better Auth plugins on all four frameworks and in monorepos. Stripe creates the customer at sign-up; Polar creates it at the first checkout and keeps it in step with user updates and deletions. The stack builder offers AI chat and payments.

## Planned

### Still open from 2.2.1

- **Manual checks nobody has done yet:** click through the Next.js and TanStack Start pages in a browser, run GitHub and Google sign-in, send a real email through Resend, and use the reset-password link.
- Decide whether `.agents/` and `skills-lock.json` are committed or ignored.

### Not built yet

- Docker with a monorepo, and a `packages/db` that both monorepo apps share.
- A live sandbox check that Polar's first checkout creates the customer, now that `createCustomerOnSignUp` is off.

### 2.5.0: `add` command (modules)

Add a module to a project that was already generated: Docker, CI, AGENTS.md, VS Code settings, rate limiting, auth, AI chat, and payments. It comes last so it can handle the monorepo layout and every module above.

- Never overwrites existing files.
- Reads `better-ts-stack.json` to find the stack, including a monorepo. For projects made before 2.2.0 it checks `package.json`, or asks.
