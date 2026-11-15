import { Request, Response, Router } from "express";

import { getSession, requireAuth } from "../middleware/requireAuth";

const router: Router = Router();

// Example of a protected route: returns the signed-in user
router.get("/", requireAuth, (_req: Request, res: Response) => {
  const { user, session } = getSession(res);
  res.status(200).json({ user, session: { expiresAt: session.expiresAt } });
});

export default router;
