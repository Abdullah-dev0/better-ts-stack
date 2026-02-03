import { NextFunction, Request, Response } from 'express';
import { AuthTokenPayload, verifyToken } from '../lib/jwt';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    res.status(401).json({ error: 'Authorization header missing or invalid' });
    return;
  }

  const token = authHeader.substring('Bearer '.length);

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
