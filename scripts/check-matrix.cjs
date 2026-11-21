const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { inScope } = require("./samples.cjs");
const matrix = JSON.parse(fs.readFileSync(process.argv[2]));
const framework = process.argv[3];
if (!["express", "nestjs", "nextjs", "tanstack"].includes(framework))
  throw new Error("Choose express, nestjs, nextjs, or tanstack");
const filter = process.argv[4];
// Cases are independent folders, so several install and build at once
const CONCURRENCY = Number(
  process.env.BTS_CONCURRENCY || Math.min(4, os.availableParallelism()),
);
const results = [];

// One command string: Node.js deprecates arguments passed with shell
function run(command, cwd, fd) {
  return new Promise((resolve) => {
    const child = spawn(command, {
      cwd,
      stdio: ["ignore", fd, fd],
      shell: true,
      timeout: 600000,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    });
    child.on("error", (error) =>
      resolve({ status: null, error: error.message }),
    );
    child.on("close", (status) => resolve({ status }));
  });
}

async function check(c) {
  const log = path.join(matrix.root, c.name + ".log");
  const fd = fs.openSync(log, "a");
  const checks = [];
  for (const args of [
    ["install", "--no-fund", "--no-audit"],
    ["run", "build"],
    ["run", "type:check"],
    ["run", "lint"],
  ]) {
    const command = "npm " + args.join(" ");
    const r = await run(command, c.target, fd);
    checks.push({ command, status: r.status, error: r.error });
    if (r.status !== 0) break;
  }
  fs.closeSync(fd);
  results.push({ name: c.name, target: c.target, log, checks });
  fs.writeFileSync(
    path.join(matrix.root, (filter || framework) + "-results.json"),
    JSON.stringify(results, null, 2),
  );
  console.log(c.name, JSON.stringify(checks));
}

async function main() {
  const queue = matrix.cases.filter(
    (c) =>
      c.config.framework === framework &&
      // check-monorepo.cjs runs the monorepos
      !c.config.monorepo &&
      c.config.packageManager === "npm" &&
      !c.config.useDocker &&
      inScope(c, filter),
  );
  if (queue.length === 0) throw new Error("No matching matrix cases");
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      for (let c = queue.shift(); c; c = queue.shift()) await check(c);
    }),
  );
  if (
    results.some((result) => result.checks.some((check) => check.status !== 0))
  )
    process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
