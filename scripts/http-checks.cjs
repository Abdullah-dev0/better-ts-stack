/** HTTP checks shared by smoke-matrix.cjs and docker-matrix.cjs. */
const PORT = 3000; // Matches BETTER_AUTH_URL in the generated .env

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
  return { status: res.status, headers: res.headers, text: await res.text() };
}

function postJson(pathname, body) {
  return request(pathname, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

// express-rate-limit sends RateLimit-*, @nestjs/throttler X-RateLimit-*
function hasRateLimitHeaders(response) {
  return [...response.headers.keys()].some((name) =>
    name.includes("ratelimit"),
  );
}

// Each check returns [label, expected, actual]
async function backendChecks(useAuth, useRateLimit) {
  const health = await request("/health");
  const checks = [
    ["GET /health", 200, health.status],
    ["malformed JSON", 400, (await postJson("/health", "{bad")).status],
    // Docker and load balancers call it on a schedule, so it is never limited
    ["GET /health not rate limited", false, hasRateLimitHeaders(health)],
  ];
  if (!useAuth) return checks;

  const user = JSON.stringify({
    email: "Smoke@Test.dev",
    password: "pw123456",
  });
  checks.push(
    [
      "rate limit headers",
      Boolean(useRateLimit),
      hasRateLimitHeaders(await request("/auth/me")),
    ],
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
          JSON.stringify({ email: "a".repeat(200000) }),
        )
      ).status,
    ],
    ["login", 200, (await postJson("/auth/login", user)).status],
  );

  const race = JSON.stringify({ email: "race@test.dev", password: "pw123456" });
  const statuses = await Promise.all(
    [1, 2, 3].map(async () => (await postJson("/auth/register", race)).status),
  );
  checks.push([
    "3 concurrent duplicate registers",
    "201,409,409",
    statuses.sort().join(","),
  ]);

  // Sign-up and login allow 10 attempts per IP in 15 minutes
  if (useRateLimit) {
    const wrong = JSON.stringify({
      email: "smoke@test.dev",
      password: "wrong",
    });
    let lastStatus;
    for (let attempt = 0; attempt < 10; attempt++)
      lastStatus = (await postJson("/auth/login", wrong)).status;
    checks.push(["login after the auth limit", 429, lastStatus]);
  }
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

module.exports = { PORT, backendChecks, fullstackChecks, waitForServer };
