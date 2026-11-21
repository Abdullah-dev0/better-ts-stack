import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import { authClient } from "~/lib/auth-client";
import {
  getAuthErrorMessage,
  signUpSchema,
  type SignUpValues,
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

export function SignUpForm({ providers }: { providers: SocialProvider[] }) {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setAuthError(null);

    startTransition(async () => {
      const result = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        // Where the link in the verification email leads after confirming
        callbackURL: "/dashboard",
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
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Start with a simple email and password sign-up flow powered by Better
          Auth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <SocialButtons providers={providers} />

            <Field data-invalid={Boolean(form.formState.errors.name)}>
              <FieldLabel htmlFor="name">Full name</FieldLabel>
              <Input
                id="name"
                autoComplete="name"
                aria-invalid={Boolean(form.formState.errors.name)}
                placeholder="Ada Lovelace"
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>

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
                This email will be used for future sign-ins.
              </FieldDescription>
              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.password)}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(form.formState.errors.password)}
                placeholder="Create a strong password"
                {...form.register("password")}
              />
              <FieldDescription>
                Use at least 8 characters for the generated starter flow.
              </FieldDescription>
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
                    Creating account
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
              <FieldDescription className="text-center">
                Already have an account? <Link to="/sign-in">Login</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
