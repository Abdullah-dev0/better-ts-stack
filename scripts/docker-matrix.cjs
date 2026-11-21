/** Build each Docker project's image, run it next to a real database, and check HTTP responses. */
// Needs a running Docker daemon. Run after check-matrix.cjs: the database
// schema is pushed from the matching non-Docker project, which is already installed.
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  PORT,
  aiChecks,
  backendChecks,
  fullstackChecks,
  waitForServer,
} = require("./http-checks.cjs");
const { inScope } = require("./samples.cjs");
const matrix = JSON.parse(fs.readFileSync(process.argv[2]));
const framework = process.argv[3];
if (!["express", "nestjs", "nextjs", "tanstack"].includes(framework))
  throw new Error("Choose express, nestjs, nextjs, or tanstack");
const filter = process.argv[4];

const NETWORK = "bts-test";
const DB_CONTAINER = "bts-test-db";
const APP_CONTAINER = "bts-test-app";
const IMAGE = "bts-test-image";
// Below 49152: Windows reserves blocks of the dynamic port range for Hyper-V
// and WSL, and a port in a reserved block cannot be published
const POSTGRES_HOST_PORT = 45432;

// Database containers, the URL the app container uses, and how to set up the
// schema. PostgreSQL runs without a password: it is a throwaway test container
const DATABASES = {
  prisma: {
    runArgs: [
      "-e",
      "POSTGRES_HOST_AUTH_METHOD=trust",
      "-p",
      `${POSTGRES_HOST_PORT}:5432`,
      "postgres:17-alpine",
    ],
    readyCommand: ["pg_isready", "-U", "postgres"],
    env: `DATABASE_URL=postgresql://postgres@${DB_CONTAINER}:5432/postgres`,
    pushSchema: ["prisma", "db", "push"],
  },
  // A one-node replica set, as in the generated Compose file: Better Auth in
  // Next.js and TanStack Start uses transactions, which need one. The ready
  // check starts the replica set and waits until the node can take writes
  mongoose: {
    runArgs: ["mongo:8", "--replSet", "rs0", "--bind_ip_all"],
    readyCommand: [
      "mongosh",
      "--quiet",
      "--eval",
      "try { rs.status() } catch (e) { rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'localhost:27017' }] }) }; if (!db.hello().isWritablePrimary) quit(1)",
    ],
    env: `MONGODB_URI=mongodb://${DB_CONTAINER}:27017/myapp?directConnection=true`,
    // Better Auth's collections, created before the first sign-up as the
    // database docs describe
    setupCommand: [
      "mongosh",
      "myapp",
      "--quiet",
      "--eval",
      "['user', 'session', 'account', 'verification'].forEach((name) => db.createCollection(name))",
    ],
  },
};
DATABASES.drizzle = {
  ...DATABASES.prisma,
  pushSchema: ["drizzle-kit", "push", "--force"],
};

// Runs a command with its output appended to the log; returns true on success
function run(log, command, args, options = {}) {
  const fd = fs.openSync(log, "a");
  const result = spawnSync(command, args, {
    stdio: ["ignore", fd, fd],
    timeout: 900000,
    ...options,
  });
  fs.closeSync(fd);
  return result.status === 0;
}

function removeContainers(log) {
  run(log, "docker", ["rm", "-f", APP_CONTAINER, DB_CONTAINER]);
}

async function startDatabase(log, c) {
  const database = DATABASES[c.config.database];
  if (!database) return [];

  const started = run(log, "docker", [
    "run",
    "-d",
    "--name",
    DB_CONTAINER,
    "--network",
    NETWORK,
    ...database.runArgs,
  ]);
  if (!started) throw new Error("Database container did not start");

  for (let attempt = 0; ; attempt++) {
    if (run(log, "docker", ["exec", DB_CONTAINER, ...database.readyCommand]))
      break;
    if (attempt === 60) throw new Error("Database did not become ready");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (
    database.setupCommand &&
    !run(log, "docker", ["exec", DB_CONTAINER, ...database.setupCommand])
  )
    throw new Error("Database setup failed");

  if (database.pushSchema) {
    const pushed = run(
      log,
      // One command string: Node.js deprecates arguments passed with shell
      `npx ${database.pushSchema.join(" ")}`,
      [],
      {
        // The npm project without Docker, which check-matrix.cjs installed
        cwd: c.target.replace(/-(npm|pnpm|bun)-docker$/, "-npm-local"),
        shell: true,
        env: {
          ...process.env,
          DATABASE_URL: `postgresql://postgres@localhost:${POSTGRES_HOST_PORT}/postgres`,
        },
      },
    );
    if (!pushed) throw new Error("Database schema push failed");
  }

  return ["-e", database.env];
}

async function checkCase(c, log) {
  const databaseEnv = await startDatabase(log, c);

  if (!run(log, "docker", ["build", "-t", IMAGE, c.target]))
    throw new Error("docker build failed");

  const started = run(log, "docker", [
    "run",
    "-d",
    "--name",
    APP_CONTAINER,
    "--network",
    NETWORK,
    "-p",
    `${PORT}:${PORT}`,
    "--env-file",
    path.join(c.target, ".env"),
    ...databaseEnv,
    IMAGE,
  ]);
  if (!started) throw new Error("App container did not start");

  await waitForServer(`http://localhost:${PORT}/`);
  const checks =
    framework === "express" || framework === "nestjs"
      ? await backendChecks(c.config.useAuth, c.config.useRateLimit)
      : await fullstackChecks(c.config.useAuth);
  return [...checks, ...(await aiChecks(c.config))];
}

// Fails at once when another program holds the app port: otherwise every
// case reports only "App container did not start"
async function assertPortFree(port) {
  const net = require("node:net");
  await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", () =>
      reject(
        new Error(
          `Port ${port} is in use. Stop the program using it and run again.`,
        ),
      ),
    );
    server.listen(port, () => server.close(resolve));
  });
}

async function main() {
  await assertPortFree(PORT);
  const results = [];
  const setupLog = path.join(matrix.root, "docker-setup.log");
  run(setupLog, "docker", ["network", "create", NETWORK]);

  for (const c of matrix.cases.filter(
    (c) =>
      c.config.framework === framework &&
      c.config.useDocker &&
      inScope(c, filter),
  )) {
    const log = path.join(matrix.root, c.name + ".docker.log");
    removeContainers(log);
    let checks;
    try {
      checks = await checkCase(c, log);
    } catch (error) {
      checks = [["container", "running", error.message]];
    }
    run(log, "docker", ["logs", APP_CONTAINER]);
    removeContainers(log);

    const failed = checks.filter(([, expected, actual]) => expected !== actual);
    results.push({ name: c.name, log, checks, failed: failed.length });
    console.log(c.name, failed.length ? "FAIL" : "ok");
    for (const [label, expected, actual] of failed)
      console.log(`  ${label}: expected ${expected}, got ${actual}`);
  }

  run(setupLog, "docker", ["network", "rm", NETWORK]);
  run(setupLog, "docker", ["rmi", IMAGE]);

  fs.writeFileSync(
    path.join(matrix.root, (filter || framework) + "-docker-results.json"),
    JSON.stringify(results, null, 2),
  );
  if (results.length === 0) throw new Error("No matching matrix cases");
  if (results.some((result) => result.failed)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
