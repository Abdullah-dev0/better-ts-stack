"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  getAuthErrorMessage,
  type ForgotPasswordValues,
} from "@/lib/auth-schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    setAuthError(null);

    startTransition(async () => {
      // The link in the email opens /reset-password with a one-time token
      const result = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });

      if (result.error) {
        setAuthError(getAuthErrorMessage(result.error));
        return;
      }

      setIsSent(true);
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email and we will send you a link to choose a new one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSent ? (
          <FieldGroup>
            <Alert>
              <MailCheck />
              <AlertTitle>Check your email</AlertTitle>
              <AlertDescription>
                If an account exists for that email, a reset link is on its
                way. Without an email provider set up, the link is printed in
                the server terminal.
              </AlertDescription>
            </Alert>
            <FieldDescription className="text-center">
              <Link href="/sign-in">Back to login</Link>
            </FieldDescription>
          </FieldGroup>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <FieldGroup>
              <Field data-invalid={Boolean(form.formState.errors.email)}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(form.formState.errors.email)}
                  placeholder="you@example.com"
                  {...form.register("email")}
                />
                <FieldDescription>
                  Use the email you registered with.
                </FieldDescription>
                <FieldError errors={[form.formState.errors.email]} />
              </Field>

              {authError ? (
                <Alert variant="destructive">
                  <CircleAlert />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              ) : null}

              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Sending link
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Remembered it? <Link href="/sign-in">Back to login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
