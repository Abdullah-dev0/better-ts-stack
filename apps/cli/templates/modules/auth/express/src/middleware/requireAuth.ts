import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

import { auth, type Session } from "../lib/auth";

// Accepts a session cookie or an "Authorization: Bearer <token>" header and
// stores the session in res.locals.session; answers 401 without one
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  auth.api
    .getSession({ headers: fromNodeHeaders(req.headers) })
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
