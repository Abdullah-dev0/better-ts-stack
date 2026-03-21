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
  signUpSchema,
  type SignUpValues,
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

export function SignUpForm() {
  const router = useRouter();
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
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Start with a simple email and password sign-up flow powered by Better
          Auth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          <FieldGroup>
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
                Creating account
              </>
            ) : (
              "Signup"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-medium text-sky-700 hover:text-sky-800" href="/sign-in">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
