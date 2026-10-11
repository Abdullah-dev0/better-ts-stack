/** Build each Docker project's image, run it next to a real database, and check HTTP responses. */
// Needs a running Docker daemon. Run after check-matrix.cjs: the database
// schema is pushed from the matching non-Docker project, which is already installed.
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  PORT,
  backendChecks,
  fullstackChecks,
  waitForServer,
} = require("./http-checks.cjs");
const matrix = JSON.parse(fs.readFileSync(process.argv[2]));
const framework = process.argv[3];
if (!["express", "nestjs", "nextjs", "tanstack"].includes(framework))
  throw new Error("Choose express, nestjs, nextjs, or tanstack");
const filter = process.argv[4];

const NETWORK = "bts-test";
const DB_CONTAINER = "bts-test-db";
const APP_CONTAINER = "bts-test-app";
const IMAGE = "bts-test-image";
const POSTGRES_HOST_PORT = 54329;

// Database containers, the URL the app container uses, and how to set up the schema
const DATABASES = {
  prisma: {
    runArgs: [
      "-e",
      "POSTGRES_PASSWORD=postgres",
      "-p",
      `${POSTGRES_HOST_PORT}:5432`,
      "postgres:17-alpine",
    ],
    readyCommand: ["pg_isready", "-U", "postgres"],
    env: `DATABASE_URL=postgresql://postgres:postgres@${DB_CONTAINER}:5432/postgres`,
    pushSchema: ["prisma", "db", "push"],
  },
  mongoose: {
    runArgs: ["mongo:8"],
    readyCommand: ["mongosh", "--quiet", "--eval", "db.runCommand({ping:1})"],
    env: `MONGODB_URI=mongodb://${DB_CONTAINER}:27017/myapp`,
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

  if (database.pushSchema) {
    const pushed = run(
      log,
      process.platform === "win32" ? "npx.cmd" : "npx",
      database.pushSchema,
      {
        cwd: c.target.replace(/-docker$/, "-local"),
        shell: process.platform === "win32",
        env: {
          ...process.env,
          DATABASE_URL: `postgresql://postgres:postgres@localhost:${POSTGRES_HOST_PORT}/postgres`,
        },
      }
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
  return framework === "express" || framework === "nestjs"
    ? backendChecks(c.config.useAuth)
    : fullstackChecks();
}

async function main() {
  const results = [];
  const setupLog = path.join(matrix.root, "docker-setup.log");
  run(setupLog, "docker", ["network", "create", NETWORK]);

  for (const c of matrix.cases.filter(
    (c) =>
      c.config.framework === framework &&
      c.config.packageManager === "npm" &&
      c.config.useDocker &&
      (!filter || c.name === filter)
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
    JSON.stringify(results, null, 2)
  );
  if (results.length === 0) throw new Error("No matching matrix cases");
  if (results.some((result) => result.failed)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
