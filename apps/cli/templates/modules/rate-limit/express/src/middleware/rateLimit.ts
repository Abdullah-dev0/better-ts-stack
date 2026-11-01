import { rateLimit } from "express-rate-limit";

// Limits count requests per client IP. Behind a reverse proxy or load
// balancer, set app.set("trust proxy", 1) so the real client IP is used.
const FIFTEEN_MINUTES = 15 * 60 * 1000;

// Every route: 100 requests per IP in 15 minutes. The health check is left out
// because Docker and load balancers call it on a schedule
export const apiLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req) => req.path === "/health",
});

// Sign-up and login: 10 attempts per IP in 15 minutes, against password guessing
export const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
