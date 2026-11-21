import { Controller, Get, Req, UseGuards } from "@nestjs/common";

import {
  RemoteAuthGuard,
  type RequestWithSession,
  type Session,
} from "../auth/remote-auth.guard.js";

// Example of a protected route: the guard answers 401 without a session
@Controller("api/me")
@UseGuards(RemoteAuthGuard)
export class MeController {
  @Get()
  me(@Req() { session }: RequestWithSession): {
    user: Session["user"];
    session: { expiresAt: string };
  } {
    return { user: session.user, session: { expiresAt: session.session.expiresAt } };
  }
}
