import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";

import { type AuthTokenPayload, verifyToken } from "./jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

// Requires a valid "Authorization: Bearer <token>" header and sets request.user
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Authorization header missing or invalid"
      );
    }

    try {
      request.user = verifyToken(authHeader.substring("Bearer ".length));
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }

    return true;
  }
}
