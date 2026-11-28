/** Install, build, type-check, and lint each monorepo of a matrix, then start both apps and check them through the web app. */
// Usage: node scripts/check-monorepo.cjs <matrix.json> [case-name]
const fs = require("node:fs");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const {
  PORT,
  DUMMY_PAYMENT_ENV,
  aiChecks,
  paymentChecks,
  request,
  waitForServer,
} = require("./http-checks.cjs");

const { inScope } = require("./samples.cjs");

const API_PORT = 3001;
const matrix = JSON.parse(fs.readFileSync(process.argv[2]));
// pnpm's folder names push deep paths past Windows' 260-character limit, and
// vite build then fails with ERR_PACKAGE_IMPORT_NOT_DEFINED
if (process.platform === "win32" && matrix.root.length > 90) {
  console.warn(
    `Warning: ${matrix.root} is ${matrix.root.length} characters long. pnpm cases may fail on Windows' path limit; use a short folder such as C:\\bts`,
  );
}
const filter = process.argv[3];

function spawnTree(command, cwd, fd, env = {}) {
  // One command string: Node.js deprecates arguments passed with shell
  const child = spawn(command, {
    cwd,
    stdio: ["ignore", fd, fd],
    shell: true,
    detached: process.platform !== "win32",
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", ...env },
  });
  // The package manager runs the real work as a grandchild, and killing the
  // shell alone leaves it running: stop the whole tree
  const stop = () => {
    if (process.platform === "win32")
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
    else process.kill(-child.pid, "SIGKILL");
  };
  return { child, stop };
}

// Resolves with the exit code, or null when the command ran past 15 minutes
function run(command, cwd, fd) {
  const { child, stop } = spawnTree(command, cwd, fd);
  return new Promise((resolve) => {
    const timer = setTimeout(stop, 15 * 60 * 1000);
    child.on("exit", (code) => {
      clearTimeout(timer);
      resolve(code);
    });
  });
}

function start(pm, cwd, port, fd, payments) {
  return spawnTree(`${pm} run start`, cwd, fd, {
    PORT: String(port),
    AI_GATEWAY_API_KEY: "dummy",
    OPENAI_API_KEY: "dummy",
    ...DUMMY_PAYMENT_ENV[payments],
  }).stop;
}

// Each check returns [label, expected, actual]; every request goes to the web
// app, which answers it or forwards it to the api
async function monorepoChecks({ apiFramework, useAuth, owner, database }) {
  const checks = [["GET /", 200, (await request("/")).status]];
  // Without an api there is nothing to forward to
  if (apiFramework === "none") return checks;
  if (!useAuth) {
    // No route answers /api/me, so the api's 404 handler does
    checks.push([
      "GET /api/me reaches the api",
      404,
      (await request("/api/me")).status,
    ]);
    return checks;
  }

  checks.push([
    "GET /api/me without a session",
    401,
    (await request("/api/me")).status,
  ]);
  // Only an api on the in-memory store can sign up without a database server
  if (owner !== "api" || database !== "none") return checks;

  const signUp = await request("/api/auth/sign-up/email", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: `http://localhost:${PORT}`,
    },
    body: JSON.stringify({
      email: "mono@test.dev",
      password: "pw123456",
      name: "Mono",
    }),
  });
  const cookie = (signUp.headers.get("set-cookie") ?? "").split(";")[0];
  checks.push(
    ["sign up through the proxy", 200, signUp.status],
    ["session cookie set", true, cookie.includes("session_token")],
    [
      "GET /dashboard signed in",
      200,
      (await request("/dashboard", { headers: { cookie } })).status,
    ],
    [
      "GET /api/me signed in",
      200,
      (await request("/api/me", { headers: { cookie } })).status,
    ],
  );
  return checks;
}

// A gzipped reply reaches the browser only once it is complete, so the web app
// must pass the api's stream on uncompressed. The headers arrive before the
// model call, which fails here for lack of a real key
async function streamChecks({ ai, apiFramework, useAuth, owner, database }) {
  // Only a chat route in the api goes through the proxy, and signing in needs
  // the in-memory store, as in monorepoChecks
  if (!ai || ai === "none" || apiFramework === "none" || owner !== "api")
    return [];
  if (useAuth && database !== "none") return [];
  const headers = {
    "content-type": "application/json",
    "accept-encoding": "gzip",
    origin: `http://localhost:${PORT}`,
  };
  if (useAuth) {
    const signIn = await request("/api/auth/sign-in/email", {
      method: "POST",
      headers,
      body: JSON.stringify({ email: "mono@test.dev", password: "pw123456" }),
    });
    headers.cookie = (signIn.headers.get("set-cookie") ?? "").split(";")[0];
  }
  const message = { id: "m1", role: "user" };
  const body =
    ai === "vercel"
      ? { messages: [{ ...message, parts: [{ type: "text", text: "hi" }] }] }
      : {
          threadId: "t1",
          runId: "r1",
          state: {},
          messages: [{ ...message, content: "hi" }],
          tools: [],
          context: [],
          forwardedProps: {},
        };
  const reply = await request("/api/chat", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return [
    ["POST /api/chat streams", 200, reply.status],
    ["chat stream not compressed", null, reply.headers.get("content-encoding")],
  ];
}

async function main() {
  const results = [];
  for (const c of matrix.cases.filter(
    (c) => c.config.monorepo && inScope(c, filter),
  )) {
    const pm = c.config.packageManager;
    const log = path.join(matrix.root, `${c.name}.monorepo.log`);
    const fd = fs.openSync(log, "a");
    let checks = [];
    for (const command of [
      `${pm} install`,
      `${pm} run build`,
      `${pm} run type:check`,
      `${pm} run lint`,
    ]) {
      const status = await run(command, c.target, fd);
      checks.push([command, 0, status]);
      if (status !== 0) break;
    }

    if (checks.every(([, expected, actual]) => expected === actual)) {
      const hasApi = c.config.apiFramework !== "none";
      const stopApi = hasApi
        ? start(
            pm,
            path.join(c.target, "apps/api"),
            API_PORT,
            fd,
            c.config.payments,
          )
        : () => {};
      const stopWeb = start(
        pm,
        path.join(c.target, "apps/web"),
        PORT,
        fd,
        c.config.payments,
      );
      try {
        if (hasApi) await waitForServer(`http://localhost:${API_PORT}/health`);
        await waitForServer(`http://localhost:${PORT}/`);
        checks.push(...(await monorepoChecks(c.config)));
        checks.push(...(await aiChecks(c.config)));
        checks.push(...(await streamChecks(c.config)));
        // The provider sends webhooks to the web app, which forwards them to
        // the api when the api owns users
        checks.push(...(await paymentChecks(c.config)));
      } catch (error) {
        checks.push(["servers", "running", error.message]);
      } finally {
        stopWeb();
        stopApi();
      }
    }
    fs.closeSync(fd);

    const failed = checks.filter(([, expected, actual]) => expected !== actual);
    results.push({ name: c.name, log, checks, failed: failed.length });
    console.log(c.name, failed.length ? "FAIL" : "ok");
    for (const [label, expected, actual] of failed)
      console.log(`  ${label}: expected ${expected}, got ${actual}`);
  }
  fs.writeFileSync(
    path.join(matrix.root, "monorepo-results.json"),
    JSON.stringify(results, null, 2),
  );
  if (results.some((result) => result.failed)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
