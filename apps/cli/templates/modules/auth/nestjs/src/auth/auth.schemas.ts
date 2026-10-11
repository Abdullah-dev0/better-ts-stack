import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;
// bcrypt ignores bytes beyond 72, so longer passwords would be silently truncated
const MAX_PASSWORD_BYTES = 72;

// Emails are trimmed and lowercased so sign-in is case-insensitive
const emailSchema = z
  .string("Email and password are required")
  .trim()
  .toLowerCase()
  .pipe(z.email("Email must be a valid email address"));

export const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string("Email and password are required")
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    )
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= MAX_PASSWORD_BYTES,
      `Password must be at most ${MAX_PASSWORD_BYTES} bytes`
    ),
  name: z.string("Name must be a string").nullish(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string("Email and password are required").min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
