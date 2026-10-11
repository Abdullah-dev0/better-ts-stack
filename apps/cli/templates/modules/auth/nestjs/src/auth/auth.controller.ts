import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { type AuthenticatedRequest, AuthGuard } from "./auth.guard.js";
import {
  type LoginInput,
  loginSchema,
  type RegisterInput,
  registerSchema,
} from "./auth.schemas.js";
import { type AuthResponse, AuthService } from "./auth.service.js";
import type { AuthTokenPayload } from "./jwt.js";
import { ZodValidationPipe } from "./zod-validation.pipe.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterInput
  ): Promise<AuthResponse> {
    return this.authService.register(body);
  }

  @Post("login")
  @HttpCode(200)
  login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginInput
  ): Promise<AuthResponse> {
    return this.authService.login(body);
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@Req() request: AuthenticatedRequest): { user?: AuthTokenPayload } {
    return { user: request.user };
  }
}
