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

  // Better Auth checks the Origin of requests that carry fetch metadata, as
  // Node.js fetch does; the server's own URL is always trusted
  const authPost = (pathname, body, headers = {}) =>
    request(pathname, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: `http://localhost:${PORT}`,
        ...headers,
      },
      body,
    });
  const bearer = (token) => ({ authorization: `Bearer ${token}` });
  const user = { email: "Smoke@Test.dev", password: "pw123456", name: "Smoke" };

  // Without the rate-limit module, Better Auth allows 3 sign-ups and 3
  // sign-ins per 10 seconds in production, so these stay within that
  const signUp = await authPost(
    "/api/auth/sign-up/email",
    JSON.stringify(user),
  );
  const signIn = await authPost(
    "/api/auth/sign-in/email",
    JSON.stringify({
      email: user.email.toLowerCase(),
      password: user.password,
    }),
  );
  const token = signIn.headers.get("set-auth-token");
  checks.push(
    [
      "rate limit headers",
      Boolean(useRateLimit),
      hasRateLimitHeaders(await request("/api/me")),
    ],
    ["sign up", 200, signUp.status],
    [
      "sign up returns a bearer token",
      true,
      Boolean(signUp.headers.get("set-auth-token")),
    ],
    [
      "sign up same email, other case",
      422,
      (
        await authPost(
          "/api/auth/sign-up/email",
          JSON.stringify({ ...user, email: "smoke@test.dev" }),
        )
      ).status,
    ],
    [
      "sign up short password",
      400,
      (
        await authPost(
          "/api/auth/sign-up/email",
          '{"email":"a@b.dev","password":"1","name":"A"}',
        )
      ).status,
    ],
    ["sign in", 200, signIn.status],
    ["GET /api/me without a token", 401, (await request("/api/me")).status],
    [
      "GET /api/me with the token",
      200,
      (await request("/api/me", { headers: bearer(token) })).status,
    ],
    [
      "password reset for an unknown email",
      200,
      (
        await authPost(
          "/api/auth/request-password-reset",
          '{"email":"nobody@test.dev"}',
        )
      ).status,
    ],
    [
      "password reset with a bad token",
      400,
      (
        await authPost(
          "/api/auth/reset-password",
          '{"token":"bad","newPassword":"pw654321"}',
        )
      ).status,
    ],
    [
      "sign out",
      200,
      (await authPost("/api/auth/sign-out", "{}", bearer(token))).status,
    ],
    [
      "GET /api/me after sign out",
      401,
      (await request("/api/me", { headers: bearer(token) })).status,
    ],
  );

  // Sign-up, sign-in, and password reset allow 10 attempts per IP in 15 minutes
  if (useRateLimit) {
    const wrong = JSON.stringify({
      email: "smoke@test.dev",
      password: "wrong-password",
    });
    let lastStatus;
    for (let attempt = 0; attempt < 10; attempt++)
      lastStatus = (await authPost("/api/auth/sign-in/email", wrong)).status;
    checks.push(["sign in after the auth limit", 429, lastStatus]);
  }
  return checks;
}

// Pages must load and so must the first stylesheet they reference
async function fullstackChecks(useAuth) {
  const home = await request("/");
  const stylesheet = home.text.match(/href="(\/[^"]+\.css[^"]*)"/)?.[1];
  const checks = [
    ["GET /", 200, home.status],
    ["stylesheet linked from /", true, Boolean(stylesheet)],
    [
      `GET ${stylesheet}`,
      200,
      stylesheet ? (await request(stylesheet)).status : null,
    ],
  ];
  if (!useAuth) return checks;

  const signUpRequest = () =>
    request("/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: `http://localhost:${PORT}`,
      },
      body: JSON.stringify({
        email: "smoke@test.dev",
        password: "pw123456",
        name: "Smoke",
      }),
    });
  let signUp = await signUpRequest();
  // Better Auth's MongoDB adapter builds its indexes in the background when
  // the app starts. A sign-up that arrives during the build fails once with
  // "catalog changes; please retry" (FAILED_TO_CREATE_USER), as MongoDB asks
  if (signUp.status === 422 && signUp.text.includes("FAILED_TO_CREATE_USER")) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    signUp = await signUpRequest();
  }
  // The session cookie, without its attributes
  const cookie = (signUp.headers.get("set-cookie") ?? "").split(";")[0];
  const dashboard = await request("/dashboard", {
    headers: { cookie },
    redirect: "manual",
  });
  checks.push(
    ["GET /sign-in", 200, (await request("/sign-in")).status],
    ["GET /forgot-password", 200, (await request("/forgot-password")).status],
    [
      "GET /reset-password with an expired link",
      200,
      (await request("/reset-password?error=INVALID_TOKEN")).status,
    ],
    ["sign up", 200, signUp.status],
    ["GET /dashboard signed in", 200, dashboard.status],
    [
      "dashboard asks to verify the email",
      true,
      dashboard.text.includes("Verify your email"),
    ],
    [
      "GET /dashboard signed out",
      true,
      [302, 307].includes(
        (await request("/dashboard", { redirect: "manual" })).status,
      ),
    ],
  );
  return checks;
}

// The tests have no model API key, so the chat route is checked up to the
// model call: a request without a session or without messages is refused
async function aiChecks({ ai, useAuth, applicationType }) {
  if (!ai || ai === "none") return [];
  const checks = [];
  if (applicationType === "fullstack") {
    const page = await request("/chat", { redirect: "manual" });
    checks.push(
      useAuth
        ? [
            "GET /chat signed out redirects",
            true,
            [302, 307].includes(page.status),
          ]
        : ["GET /chat", 200, page.status],
    );
  }
  checks.push([
    useAuth
      ? "POST /api/chat without a session"
      : "POST /api/chat without messages",
    useAuth ? 401 : 400,
    (await postJson("/api/chat", "{}")).status,
  ]);
  return checks;
}

// The tests have no provider account: the apps start with these keys, and the
// webhook is checked up to its signature check
const DUMMY_PAYMENT_ENV = {
  stripe: {
    STRIPE_SECRET_KEY: "sk_test_dummy",
    STRIPE_WEBHOOK_SECRET: "whsec_dummy",
  },
  polar: {
    POLAR_ACCESS_TOKEN: "polar_oat_dummy",
    POLAR_WEBHOOK_SECRET: "dummy",
  },
};

// An event with a wrong signature is refused before the plugin reads it
async function paymentChecks({ payments }) {
  if (!payments || payments === "none") return [];
  const [pathname, expected, headers] =
    payments === "stripe"
      ? ["/api/auth/stripe/webhook", 400, { "stripe-signature": "t=1,v1=bad" }]
      : [
          "/api/auth/polar/webhooks",
          403,
          {
            "webhook-id": "msg_smoke",
            "webhook-timestamp": String(Math.floor(Date.now() / 1000)),
            "webhook-signature": "v1,bad",
          },
        ];
  const response = await request(pathname, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: `http://localhost:${PORT}`,
      ...headers,
    },
    body: '{"type":"smoke.test","data":{}}',
  });
  return [[`POST ${pathname} with a bad signature`, expected, response.status]];
}

module.exports = {
  PORT,
  request,
  DUMMY_PAYMENT_ENV,
  paymentChecks,
  aiChecks,
  backendChecks,
  fullstackChecks,
  waitForServer,
};
