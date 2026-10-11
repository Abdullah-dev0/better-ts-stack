/** Start built matrix projects in production mode and check HTTP responses. */
// Run after check-matrix.cjs has installed and built the projects. Only cases
// without a database are covered, since the others need a running server.
const fs = require("node:fs");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
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

function startServer(cwd, log) {
  const fd = fs.openSync(log, "a");
  const child = spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["run", "start"],
    {
      cwd,
      stdio: ["ignore", fd, fd],
      shell: process.platform === "win32",
      detached: process.platform !== "win32",
      env: { ...process.env, PORT: String(PORT), NEXT_TELEMETRY_DISABLED: "1" },
    }
  );
  return () => {
    // npm starts the server as a grandchild, so stop the whole process tree
    if (process.platform === "win32")
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
    else process.kill(-child.pid, "SIGKILL");
    fs.closeSync(fd);
  };
}

async function main() {
  const results = [];
  for (const c of matrix.cases.filter(
    (c) =>
      c.config.framework === framework &&
      c.config.packageManager === "npm" &&
      !c.config.useDocker &&
      c.config.database === "none" &&
      (!filter || c.name === filter)
  )) {
    const log = path.join(matrix.root, c.name + ".smoke.log");
    const stop = startServer(c.target, log);
    let checks;
    try {
      await waitForServer(`http://localhost:${PORT}/`);
      checks =
        framework === "express" || framework === "nestjs"
          ? await backendChecks(c.config.useAuth)
          : await fullstackChecks();
    } catch (error) {
      checks = [["server", "running", error.message]];
    } finally {
      stop();
    }
    const failed = checks.filter(([, expected, actual]) => expected !== actual);
    results.push({ name: c.name, log, checks, failed: failed.length });
    console.log(c.name, failed.length ? "FAIL" : "ok");
    for (const [label, expected, actual] of failed)
      console.log(`  ${label}: expected ${expected}, got ${actual}`);
  }

  fs.writeFileSync(
    path.join(matrix.root, (filter || framework) + "-smoke-results.json"),
    JSON.stringify(results, null, 2)
  );
  if (results.length === 0) throw new Error("No matching matrix cases");
  if (results.some((result) => result.failed)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
