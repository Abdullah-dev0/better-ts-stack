const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const matrix = JSON.parse(fs.readFileSync(process.argv[2]));
const framework = process.argv[3];
if (!["express", "nextjs", "tanstack"].includes(framework))
  throw new Error("Choose express, nextjs, or tanstack");
const filter = process.argv[4];
const results = [];
for (const c of matrix.cases.filter(
  (c) =>
    c.config.framework === framework &&
    c.config.packageManager === "npm" &&
    !c.config.useDocker &&
    (!filter || c.name === filter)
)) {
  const log = path.join(matrix.root, c.name + ".log");
  const fd = fs.openSync(log, "a");
  const checks = [];
  for (const args of [
    ["install", "--no-fund", "--no-audit"],
    ["run", "build"],
    ["run", "type:check"],
    ["run", "lint"],
  ]) {
    const r = spawnSync(
      process.platform === "win32" ? "npm.cmd" : "npm",
      args,
      {
        cwd: c.target,
        stdio: ["ignore", fd, fd],
        shell: process.platform === "win32",
        timeout: 600000,
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      }
    );
    checks.push({
      command: "npm " + args.join(" "),
      status: r.status,
      error: r.error?.message,
    });
    if (r.status !== 0) break;
  }
  fs.closeSync(fd);
  results.push({ name: c.name, target: c.target, log, checks });
  fs.writeFileSync(
    path.join(matrix.root, (filter || framework) + "-results.json"),
    JSON.stringify(results, null, 2)
  );
  console.log(c.name, JSON.stringify(checks));
}

if (results.some((result) => result.checks.some((check) => check.status !== 0)))
  process.exitCode = 1;

if (results.length === 0) throw new Error("No matching matrix cases");
