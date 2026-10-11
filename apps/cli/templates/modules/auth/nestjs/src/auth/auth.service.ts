import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import bcrypt from "bcrypt";

import type { LoginInput, RegisterInput } from "./auth.schemas.js";
import { signToken } from "./jwt.js";
import {
  type AuthUser,
  isDuplicateEmailError,
  UsersService,
} from "./users.service.js";

const SALT_ROUNDS = 10;

export interface AuthResponse {
  user: Omit<AuthUser, "password">;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register({
    email,
    password,
    name = null,
  }: RegisterInput): Promise<AuthResponse> {
    if (await this.usersService.findByEmail(email)) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      const user = await this.usersService.create({
        email,
        name,
        password: hashedPassword,
      });
      return this.toAuthResponse(user);
    } catch (error) {
      // A concurrent request registered the same email after the check above
      if (isDuplicateEmailError(error)) {
        throw new ConflictException("User already exists");
      }
      throw error;
    }
  }

  async login({ email, password }: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.toAuthResponse(user);
  }

  private toAuthResponse({ id, email, name }: AuthUser): AuthResponse {
    return {
      user: { id, email, name },
      token: signToken({ sub: id, email, name }),
    };
  }
}
