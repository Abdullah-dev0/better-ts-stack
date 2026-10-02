/** Start built matrix projects in production mode and check HTTP responses. */
// Run after check-matrix.cjs has installed and built the projects. Only cases
// without a database are covered, since the others need a running server.
const fs = require("node:fs");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const matrix = JSON.parse(fs.readFileSync(process.argv[2]));
const framework = process.argv[3];
if (!["express", "nextjs", "tanstack"].includes(framework))
  throw new Error("Choose express, nextjs, or tanstack");
const filter = process.argv[4];
const PORT = 3000; // Matches BETTER_AUTH_URL in the generated .env

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

async function waitForServer(url) {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error(`Server did not start: ${url}`);
}

async function request(pathname, options = {}) {
  const res = await fetch(`http://localhost:${PORT}${pathname}`, options);
  return { status: res.status, text: await res.text() };
}

function postJson(pathname, body) {
  return request(pathname, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

// Each check returns [label, expected, actual]
async function expressChecks(useAuth) {
  const checks = [
    ["GET /health", 200, (await request("/health")).status],
    ["malformed JSON", 400, (await postJson("/health", "{bad")).status],
  ];
  if (!useAuth) return checks;

  const user = JSON.stringify({
    email: "Smoke@Test.dev",
    password: "pw123456",
  });
  checks.push(
    ["register", 201, (await postJson("/auth/register", user)).status],
    [
      "register same email, other case",
      409,
      (await postJson("/auth/register", user.toLowerCase())).status,
    ],
    [
      "register without body",
      400,
      (await request("/auth/register", { method: "POST" })).status,
    ],
    [
      "register short password",
      400,
      (await postJson("/auth/register", '{"email":"a@b.dev","password":"1"}'))
        .status,
    ],
    [
      "register oversized body",
      413,
      (
        await postJson(
          "/auth/register",
          JSON.stringify({ email: "a".repeat(200000) })
        )
      ).status,
    ],
    ["login", 200, (await postJson("/auth/login", user)).status]
  );

  const race = JSON.stringify({ email: "race@test.dev", password: "pw123456" });
  const statuses = await Promise.all(
    [1, 2, 3].map(async () => (await postJson("/auth/register", race)).status)
  );
  checks.push([
    "3 concurrent duplicate registers",
    "201,409,409",
    statuses.sort().join(","),
  ]);
  return checks;
}

// Pages must load and so must the first stylesheet they reference
async function fullstackChecks() {
  const home = await request("/");
  const stylesheet = home.text.match(/href="(\/[^"]+\.css[^"]*)"/)?.[1];
  return [
    ["GET /", 200, home.status],
    ["stylesheet linked from /", true, Boolean(stylesheet)],
    [
      `GET ${stylesheet}`,
      200,
      stylesheet ? (await request(stylesheet)).status : null,
    ],
  ];
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
        framework === "express"
          ? await expressChecks(c.config.useAuth)
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
