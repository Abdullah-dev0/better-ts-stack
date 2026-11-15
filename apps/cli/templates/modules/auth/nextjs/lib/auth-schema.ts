import { z } from "zod";

const emailSchema = z.email("Enter a valid email address.");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.");

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = signInSchema.extend({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be 50 characters or fewer."),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string() })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: passwordSchema,
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

// Sign-in providers the auth server can turn on (see auth.ts)
export type SocialProvider = "github" | "google";

export function getAuthErrorMessage(error: unknown) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }

    if ("statusText" in error && typeof error.statusText === "string") {
      return error.statusText;
    }
  }

  return "Something went wrong. Please try again.";
}
