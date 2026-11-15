"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import {
  getAuthErrorMessage,
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/auth-schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

// The link in the reset email opens /reset-password?token=..., or
// ?error=INVALID_TOKEN when the token is invalid or has expired. Reading it here,
// in the browser, lets the page itself be static
export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("error") ? null : searchParams.get("token");
  const [isPending, startTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!token) return;
    setAuthError(null);

    startTransition(async () => {
      const result = await authClient.resetPassword({
        newPassword: values.password,
        token,
      });

      if (result.error) {
        setAuthError(getAuthErrorMessage(result.error));
        return;
      }

      setIsDone(true);
    });
  });

  if (!token || isDone) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{isDone ? "Password changed" : "Link expired"}</CardTitle>
          <CardDescription>
            {isDone
              ? "You were signed out on every device. Log in with your new password."
              : "This reset link is invalid or has expired. Ask for a new one."}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link href={isDone ? "/sign-in" : "/forgot-password"} />}
          >
            {isDone ? "Go to login" : "Send a new link"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription>
          You will be signed out on every device after the change.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(form.formState.errors.password)}>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(form.formState.errors.password)}
                {...form.register("password")}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>

            <Field
              data-invalid={Boolean(form.formState.errors.confirmPassword)}
            >
              <FieldLabel htmlFor="confirmPassword">
                Confirm new password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(form.formState.errors.confirmPassword)}
                {...form.register("confirmPassword")}
              />
              <FieldError errors={[form.formState.errors.confirmPassword]} />
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
                    Saving
                  </>
                ) : (
                  "Save new password"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
