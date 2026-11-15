import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import { authClient } from "~/lib/auth-client";
import {
  getAuthErrorMessage,
  signInSchema,
  type SignInValues,
  type SocialProvider,
} from "~/lib/auth-schema";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";

import { SocialButtons } from "./social-buttons";

export function SignInForm({ providers }: { providers: SocialProvider[] }) {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setAuthError(null);

    startTransition(async () => {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        setAuthError(getAuthErrorMessage(result.error));
        return;
      }

      navigate({ to: "/dashboard" });
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Sign in with your email and password to continue to your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <SocialButtons providers={providers} />

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

            <Field data-invalid={Boolean(form.formState.errors.password)}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(form.formState.errors.password)}
                placeholder="Enter your password"
                {...form.register("password")}
              />
              <FieldError errors={[form.formState.errors.password]} />
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
                    Signing in
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <FieldDescription className="text-center">
                Need an account? <Link to="/sign-up">Signup</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
