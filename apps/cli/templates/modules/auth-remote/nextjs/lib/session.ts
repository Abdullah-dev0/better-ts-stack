import { cache } from "react";

import { headers } from "next/headers";

import type { SocialProvider } from "./auth-schema";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

// What Better Auth's get-session endpoint returns for a signed-in user
export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
  };
  session: { expiresAt: string };
}

// The session of the current request. Better Auth runs in the api, so the
// cookie is sent there; cache() asks once per request, however many
// components need it
export const getSession = cache(async (): Promise<Session | null> => {
  const response = await fetch(`${API_URL}/api/auth/get-session`, {
    headers: { cookie: (await headers()).get("cookie") ?? "" },
    cache: "no-store",
  });
  return response.ok ? ((await response.json()) as Session | null) : null;
});

// The providers whose keys are set in the api's .env, listed in AUTH_PROVIDERS
// (for example "github,google"); the sign-in and sign-up pages show a button
// for each
export const socialProviders = (process.env.AUTH_PROVIDERS ?? "")
  .split(",")
  .map((name) => name.trim())
  .filter((name): name is SocialProvider =>
    ["github", "google"].includes(name)
  );
