import { Controller, Get } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

// Example of a protected route: the global auth guard answers 401 without a
// session cookie or an "Authorization: Bearer <token>" header
@Controller("api/me")
export class MeController {
  @Get()
  me(@Session() { user, session }: UserSession): {
    user: UserSession["user"];
    session: { expiresAt: Date };
  } {
    return { user, session: { expiresAt: session.expiresAt } };
  }
}
