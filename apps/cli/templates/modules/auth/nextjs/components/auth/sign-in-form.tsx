"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import {
  getAuthErrorMessage,
  signInSchema,
  type SignInValues,
} from "@/lib/auth-schema";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const router = useRouter();
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

      router.push("/dashboard");
      router.refresh();
    });
  });

  return (
    <Card className="border-white/80 bg-white/90 shadow-2xl shadow-slate-200/70 backdrop-blur">
      <CardHeader className="space-y-2">
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Sign in with your email and password to continue to your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
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
              <FieldDescription>Use the email you registered with.</FieldDescription>
              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.password)}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
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
          </FieldGroup>

          {authError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {authError}
            </div>
          ) : null}

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircle className="mr-2 size-4 animate-spin" />
                Signing in
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-slate-600">
          Need an account?{" "}
          <Link className="font-medium text-sky-700 hover:text-sky-800" href="/sign-up">
            Signup
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
