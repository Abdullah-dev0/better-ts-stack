# Roadmap

One feature per minor release, no betas. Every release must pass `npm run test:templates`, `check-matrix`, `smoke-matrix`, and `docker-matrix`, plus a manual run, before it is published.

## Released

- **2.2.0** Better Auth on Express, NestJS, Next.js, and TanStack Start: email verification, password reset, GitHub and Google sign-in, Resend emails. shadcn/ui on Base UI, server-first Next.js pages, `better-ts-stack.json`, and AGENTS.md added by default.
- **2.2.1** Exact `@thallesp/nestjs-better-auth` version, `git` run without a shell, `.gitattributes` for LF line endings, a MongoDB sign-up troubleshooting note, and a port check and MongoDB retry in the Docker tests. Generated projects already declared Node 24 in `engines`; `npm install` still runs through the shell because npm and pnpm are `.cmd` files on Windows.

## Planned

### Still open from 2.2.1

- **Manual checks nobody has done yet:** click through the Next.js and TanStack Start pages in a browser, run GitHub and Google sign-in, send a real email through Resend, and use the reset-password link.
- Decide whether `.agents/` and `skills-lock.json` are committed or ignored.

### 2.3.0: AI chat and monorepo

Two features in one release.

**AI chat (Vercel AI SDK and TanStack AI):** `--ai none|vercel|tanstack`, on all four frameworks: Express, NestJS, Next.js, and TanStack Start.

- A chat endpoint that streams the model's reply as it is generated, and a chat page that shows it.
- A stop button that cancels the request: the browser aborts the stream and the server stops calling the model.
- Vercel AI SDK and TanStack AI, each offered on every framework where it works.
- The model provider and API key come from `.env`. The chat route needs a signed-in user when auth is selected.
- Check the current Vercel AI SDK and TanStack AI APIs before building, since both change often.

Built: Express and NestJS get `POST /api/chat`; Next.js and TanStack Start also get a `/chat` page. Vercel uses the AI Gateway (`AI_GATEWAY_API_KEY`, `AI_MODEL`), TanStack AI uses its OpenAI adapter (`OPENAI_API_KEY`, `AI_MODEL`).

**Monorepo:** `--monorepo`, opt-in. A Turborepo with `apps/web` (`--framework nextjs|tanstack`) and an optional `apps/api` (`--api express|nestjs|none`). The AI chat module has to work in both layouts.

- With an api, the CLI asks which app owns users and data (`--owner web|api`, web by default and easier): that app runs Better Auth, holds the database, and serves the AI chat route. The other app asks it for sessions. Auth without a database forces the api, and the CLI says so.
- `--api none` leaves the web app on its own, owning everything.
- The web app forwards the `/api/*` requests it does not answer to the api, so browsers only talk to one origin.
- Not in 2.3.0: Docker with a monorepo, shared tsconfig and ESLint packages, a docs app (`--docs`, Fumadocs), and two full apps that both sign users in (needs `packages/auth` and `packages/db`, then the `add` command). `packages/db` moves to 2.4.0, where payments needs a table both apps share.

Still to do before release: a manual run with a real model key (streaming, and the stop button ending the model call, including through the monorepo proxy), and the stack builder on the website.

### 2.4.0: Payments

`--payments none|polar|stripe`. Needs auth and a database. Built on the monorepo layout from 2.3.0, with the `packages/db` package both apps share.

- Next.js and TanStack Start use the Better Auth plugins; Express and NestJS use the Polar and Stripe SDKs.
- A shared subscription table and UI.
- The Stripe webhook needs the raw request body.

### 2.5.0: `add` command (modules)

Add a module to a project that was already generated: Docker, CI, AGENTS.md, VS Code settings, rate limiting, auth, AI chat, and payments. It comes last so it can handle the monorepo layout and every module above.

- Never overwrites existing files.
- Reads `better-ts-stack.json` to find the stack, including a monorepo. For projects made before 2.2.0 it checks `package.json`, or asks.
