import type { NextFunction, Request, Response } from "express";

import { env } from "../env";

// What Better Auth's get-session endpoint returns for a signed-in user
export interface Session {
  user: { id: string; name: string; email: string; emailVerified: boolean };
  session: { expiresAt: string };
}

// Better Auth runs in the web app: the request's session cookie (or bearer
// token) is checked there, and the session is stored in res.locals.session.
// Answers 401 without one
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const headers: Record<string, string> = {};
  if (req.headers.cookie) headers.cookie = req.headers.cookie;
  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }

  fetch(`${env.AUTH_URL}/api/auth/get-session`, { headers })
    .then(async (response) =>
      response.ok ? ((await response.json()) as Session | null) : null
    )
    .then((session) => {
      if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      res.locals.session = session;
      next();
    })
    .catch(next);
}

// The session requireAuth stored, for handlers that run after it
export function getSession(res: Response): Session {
  return res.locals.session as Session;
}
