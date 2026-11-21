import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignUpForm } from "~/components/auth/sign-up-form";
import { Badge } from "~/components/ui/badge";
import { getSession, getSocialProviders } from "~/lib/auth-functions";

export const Route = createFileRoute("/sign-up")({
  beforeLoad: async () => {
    // Two independent server calls, made at the same time
    const [session, providers] = await Promise.all([
      getSession(),
      getSocialProviders(),
    ]);

    if (session) {
      throw redirect({ to: "/dashboard" });
    }

    return { providers };
  },
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <div className="grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden flex-col gap-5 lg:flex">
          <Badge variant="outline">Better Auth</Badge>
          <h1 className="text-4xl font-semibold tracking-tight">
            Create your account.
          </h1>
          <p className="max-w-md text-base leading-7 text-muted-foreground">
            Sign up with email and password, or with GitHub or Google once
            their keys are set. A verification link goes to your inbox.
          </p>
        </section>
        <SignUpForm
          providers={Route.useRouteContext({ select: (ctx) => ctx.providers })}
        />
      </div>
    </main>
  );
}
