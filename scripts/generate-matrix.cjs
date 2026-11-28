/** Generate every supported combination into [output-dir] (default: a new temp dir). */
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { build } = require("../apps/cli/dist/builder");
const { markSamples } = require("./samples.cjs");

const BACKEND_ENTRY_FILES = {
  express: "dist/index.js",
  nestjs: "dist/main.js",
};

const AI_BY_PACKAGE_MANAGER = {
  npm: "none",
  pnpm: "vercel",
  bun: "tanstack",
};

async function main() {
  const root = process.argv[2]
    ? path.resolve(process.argv[2])
    : await fs.mkdtemp(path.join(os.tmpdir(), "better-ts-stack-"));
  const cases = [];
  for (const framework of ["express", "nestjs", "nextjs", "tanstack"]) {
    for (const database of ["none", "prisma", "drizzle", "mongoose"]) {
      for (const useAuth of [false, true]) {
        if (
          (framework === "nextjs" || framework === "tanstack") &&
          database === "none" &&
          useAuth
        )
          continue;
        // Rate limiting is offered for the backends only
        const rateLimitChoices = BACKEND_ENTRY_FILES[framework]
          ? [false, true]
          : [false];
        for (const useRateLimit of rateLimitChoices)
          for (const packageManager of ["npm", "pnpm", "bun"]) {
            for (const useDocker of [false, true])
              // check-matrix and smoke-matrix run the npm local cases, so those
              // get every AI choice; Docker builds the others with one SDK each
              for (const ai of packageManager === "npm" && !useDocker
                ? ["none", "vercel", "tanstack"]
                : [AI_BY_PACKAGE_MANAGER[packageManager]])
                // Payments need auth and a database
                for (const payments of useAuth && database !== "none"
                  ? ["none", "polar", "stripe"]
                  : ["none"]) {
                  const name = `${framework}-${database}-${useAuth ? "auth" : "plain"}${useRateLimit ? "-ratelimit" : ""}${ai === "none" ? "" : `-ai-${ai}`}${payments === "none" ? "" : `-pay-${payments}`}-${packageManager}-${useDocker ? "docker" : "local"}`;
                  const target = path.join(root, name);
                  const config = {
                    projectName: name,
                    framework,
                    applicationType: BACKEND_ENTRY_FILES[framework]
                      ? "backend"
                      : "fullstack",
                    database,
                    useAuth,
                    ai,
                    payments,
                    useRateLimit,
                    useDocker,
                    useCi: !useDocker,
                    useAgents: useDocker,
                    useVscode: useDocker,
                    packageManager,
                    initGit: false,
                    installDeps: false,
                  };
                  await build(config, target);
                  const files = await fs.readdir(target, { recursive: true });
                  assert(!files.some((file) => file.endsWith(".hbs")), name);
                  assert(files.includes(".gitignore"), name);
                  assert(files.includes("README.md"), name);
                  const stack = JSON.parse(
                    await fs.readFile(
                      path.join(target, "better-ts-stack.json"),
                    ),
                  );
                  assert.deepEqual(
                    [
                      stack.framework,
                      stack.database,
                      stack.packageManager,
                      stack.auth,
                      stack.ai,
                      stack.payments,
                      stack.docker,
                    ],
                    [
                      framework,
                      database,
                      packageManager,
                      useAuth,
                      ai,
                      payments,
                      useDocker,
                    ],
                    `${name}: better-ts-stack.json`,
                  );
                  assert.equal(
                    files.some((file) => file.endsWith("ci.yml")),
                    config.useCi,
                    `${name}: ci.yml`,
                  );
                  assert.equal(
                    files.includes("AGENTS.md"),
                    config.useAgents,
                    `${name}: AGENTS.md`,
                  );
                  if (config.useAgents) {
                    const agents = await fs.readFile(
                      path.join(target, "AGENTS.md"),
                      "utf8",
                    );
                    // Every condition rendered, and none left a run of blank lines
                    assert(
                      !agents.includes("{{") && !agents.includes("\n\n\n"),
                      `${name}: AGENTS.md`,
                    );
                  }
                  const manifest = JSON.parse(
                    await fs.readFile(path.join(target, "package.json")),
                  );
                  for (const version of Object.values({
                    ...manifest.dependencies,
                    ...manifest.devDependencies,
                  })) {
                    // A caret range on an exact version; prereleases such as
                    // Nitro's 3.0.x-beta are allowed
                    assert(
                      /^\^?\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/.test(version),
                      `${name}: ${version}`,
                    );
                  }
                  assert(
                    !JSON.stringify(manifest.scripts).includes("{{"),
                    name,
                  );
                  if (BACKEND_ENTRY_FILES[framework])
                    assert.equal(
                      manifest.scripts.start,
                      `cross-env NODE_ENV=production ${packageManager === "bun" ? "bun" : "node"} ${BACKEND_ENTRY_FILES[framework]}`,
                    );
                  // pnpm 11+ ignores package.json "pnpm" and needs build approvals
                  assert(!manifest.pnpm, `${name}: package.json pnpm field`);
                  assert.equal(
                    files.includes("pnpm-workspace.yaml"),
                    packageManager === "pnpm",
                    `${name}: pnpm-workspace.yaml`,
                  );
                  // NODE_ENV comes from the scripts, so .env must not pin it
                  const env = await fs.readFile(
                    path.join(target, ".env"),
                    "utf8",
                  );
                  assert(!/^NODE_ENV=/m.test(env), `${name}: NODE_ENV in .env`);
                  // The provider's keys are listed for the user to fill in
                  assert.equal(
                    /^STRIPE_SECRET_KEY=/m.test(env),
                    payments === "stripe",
                    `${name}: STRIPE_SECRET_KEY`,
                  );
                  assert.equal(
                    /^POLAR_ACCESS_TOKEN=/m.test(env),
                    payments === "polar",
                    `${name}: POLAR_ACCESS_TOKEN`,
                  );
                  cases.push({ name, target, config });
                }
          }
      }
    }
  }
  cases.push(...(await generateMonorepos(root)));
  await checkCliDefaults(root);
  markSamples(cases);
  const report = { root, cases };
  await fs.writeFile(
    path.join(root, "matrix.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(
    `Generated and checked ${cases.length} combinations, ${cases.filter((c) => c.sample).length} of them sampled for the slow checks (FULL_MATRIX=1 runs all). Matrix: ${path.join(root, "matrix.json")}`,
  );
}

// The cases above call build() directly; this runs the real CLI with --yes, so
// argument parsing, the defaults, and the prompts' checks are covered too
async function checkCliDefaults(root) {
  const cli = path.join(__dirname, "../apps/cli/dist/index.js");
  const dir = path.join(root, "cli-defaults");
  await fs.mkdir(dir, { recursive: true });
  const runs = [
    ...["express", "nestjs", "nextjs", "tanstack"].map((framework) => [
      framework,
      ["--framework", framework],
    ]),
    ["monorepo", ["--monorepo"]],
  ];
  for (const [name, flags] of runs) {
    const r = spawnSync(
      process.execPath,
      [cli, name, ...flags, "--no-git", "--no-install", "--yes"],
      { cwd: dir, encoding: "utf8" },
    );
    assert.equal(r.status, 0, `--yes ${name} failed:\n${r.stdout}${r.stderr}`);
    await fs.access(path.join(dir, name, "better-ts-stack.json"));
  }
  // A wrong combination still fails with a message, not a crash
  const bad = spawnSync(
    process.execPath,
    [cli, "bad", "--api", "express", "--no-git", "--no-install", "--yes"],
    { cwd: dir, encoding: "utf8" },
  );
  assert.equal(bad.status, 1);
  assert.match(bad.stdout + bad.stderr, /Add --monorepo/);
}
// Monorepo layouts. Auth in the api runs without a database (Better Auth's
// memory store), so check-monorepo.cjs can sign up without PostgreSQL; the
// cases with a database only build
const MONOREPO_LAYOUTS = [
  // The web app on its own owns everything
  {
    layout: "solo",
    api: false,
    useAuth: false,
    owner: "web",
    database: "none",
  },
  {
    layout: "plain",
    api: true,
    useAuth: false,
    owner: "web",
    database: "none",
  },
  {
    layout: "dataapi",
    api: true,
    useAuth: false,
    owner: "api",
    database: "drizzle",
  },
  // Without a database, auth has to run in the api
  {
    layout: "authapi",
    api: true,
    useAuth: true,
    owner: "api",
    database: "none",
  },
  {
    layout: "authweb",
    api: true,
    useAuth: true,
    owner: "web",
    database: "drizzle",
  },
  // The payments plugin runs in the owner; the web app only adds the client
  {
    layout: "payapi",
    api: true,
    useAuth: true,
    owner: "api",
    database: "drizzle",
    payments: "stripe",
  },
  {
    layout: "payweb",
    api: true,
    useAuth: true,
    owner: "web",
    database: "prisma",
    payments: "polar",
  },
];

async function generateMonorepos(root) {
  const cases = [];
  let index = 0;
  for (const framework of ["nextjs", "tanstack"])
    for (const layout of MONOREPO_LAYOUTS)
      for (const apiFramework of layout.api
        ? ["express", "nestjs"]
        : ["none"]) {
        const { useAuth, owner, database, payments = "none" } = layout;
        // Each package manager and AI SDK comes around in turn
        const packageManager = ["npm", "pnpm", "bun"][index % 3];
        const ai = ["vercel", "tanstack", "none"][
          (index + Math.floor(index / 3)) % 3
        ];
        index++;
        const name = `mono-${framework}-${apiFramework}-${layout.layout}-ai-${ai}-${packageManager}`;
        const target = path.join(root, name);
        const config = {
          projectName: name,
          framework,
          applicationType: "fullstack",
          monorepo: true,
          apiFramework,
          owner,
          database,
          useAuth,
          ai,
          payments,
          useRateLimit: false,
          useDocker: false,
          useCi: true,
          useAgents: true,
          useVscode: false,
          packageManager,
          initGit: false,
          installDeps: false,
        };
        await build(config, target);
        const files = await fs.readdir(target, { recursive: true });
        assert(!files.some((file) => file.endsWith(".hbs")), name);
        const stack = JSON.parse(
          await fs.readFile(path.join(target, "better-ts-stack.json")),
        );
        assert.deepEqual(
          [stack.monorepo, stack.framework, stack.api, stack.owner],
          [true, framework, apiFramework, owner],
          `${name}: better-ts-stack.json`,
        );
        const manifest = JSON.parse(
          await fs.readFile(path.join(target, "package.json")),
        );
        assert.equal(manifest.scripts.build, "turbo run build", name);
        assert(manifest.packageManager.startsWith(`${packageManager}@`), name);
        const apps = layout.api ? ["apps/web", "apps/api"] : ["apps/web"];
        assert.deepEqual(
          (await fs.readdir(path.join(target, "apps"))).sort(),
          apps.map((app) => app.slice(5)).sort(),
          `${name}: apps`,
        );
        for (const app of apps) {
          const appFiles = await fs.readdir(path.join(target, app));
          // One workspace file and one stack file, at the root
          assert(!appFiles.includes("pnpm-workspace.yaml"), `${name}: ${app}`);
          assert(!appFiles.includes("better-ts-stack.json"), `${name}: ${app}`);
        }
        // The owner holds the database and auth; the web app forwards /api/*
        // only when there is an api
        const ownerDir = owner === "web" ? "apps/web" : "apps/api";
        for (const app of apps) {
          const env = await fs.readFile(path.join(target, app, ".env"), "utf8");
          const isOwner = app === ownerDir;
          if (database !== "none") {
            assert.equal(
              /^DATABASE_URL=/m.test(env),
              isOwner,
              `${name}: ${app}`,
            );
          }
          if (useAuth) {
            assert.equal(
              /^BETTER_AUTH_SECRET=/m.test(env),
              isOwner,
              `${name}: ${app}`,
            );
          }
          if (app === "apps/web") {
            assert.equal(/^API_URL=/m.test(env), layout.api, `${name}: proxy`);
          }
          assert.equal(
            /^(STRIPE_SECRET_KEY|POLAR_ACCESS_TOKEN)=/m.test(env),
            payments !== "none" && isOwner,
            `${name}: ${app} payment keys`,
          );
        }
        cases.push({ name, target, config, layout: layout.layout });
      }
  return cases;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
