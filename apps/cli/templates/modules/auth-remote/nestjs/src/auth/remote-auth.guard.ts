import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";

import { env } from "../env.js";

// What Better Auth's get-session endpoint returns for a signed-in user
export interface Session {
  user: { id: string; name: string; email: string; emailVerified: boolean };
  session: { expiresAt: string };
}

export type RequestWithSession = Request & { session: Session };

// Better Auth runs in the web app: the request's session cookie (or bearer
// token) is checked there. Add @UseGuards(RemoteAuthGuard) to a controller or
// route that needs a signed-in user; the session is on request.session
@Injectable()
export class RemoteAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithSession>();
    const headers: Record<string, string> = {};
    if (request.headers.cookie) headers.cookie = request.headers.cookie;
    if (request.headers.authorization) {
      headers.authorization = request.headers.authorization;
    }

    const response = await fetch(`${env.AUTH_URL}/api/auth/get-session`, {
      headers,
    });
    const session = response.ok
      ? ((await response.json()) as Session | null)
      : null;
    if (!session) throw new UnauthorizedException();

    request.session = session;
    return true;
  }
}
