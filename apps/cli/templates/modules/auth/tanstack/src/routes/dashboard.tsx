import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { ChangePasswordForm } from "~/components/auth/change-password-form";
import { EmailVerificationCard } from "~/components/auth/email-verification-card";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getSession } from "~/lib/auth-functions";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session) {
      throw redirect({ to: "/sign-in" });
    }

    return { user: session.user };
  },
  component: Dashboard,
});

function Dashboard() {
  const user = Route.useRouteContext({ select: (ctx) => ctx.user });

  return (
    <main className="min-h-svh bg-muted px-6 py-16 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <Badge variant="secondary">
              <ShieldCheck data-icon="inline-start" />
              Authenticated session
            </Badge>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome {user.name}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <SignOutButton />
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <EmailVerificationCard
            email={user.email}
            emailVerified={user.emailVerified}
          />
          <ChangePasswordForm />
          <Card>
            <CardHeader>
              <CardTitle>Protected route example</CardTitle>
              <CardDescription>
                This page verifies the session on the server before rendering
                any content.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-muted-foreground">
              <p>
                The route guard calls{" "}
                <code className="font-mono text-foreground">getSession()</code>{" "}
                in <code className="font-mono text-foreground">beforeLoad</code>,
                which reads the cookie headers server-side via{" "}
                <code className="font-mono text-foreground">
                  auth.api.getSession
                </code>{" "}
                on every render and navigation.
              </p>
              <p>
                That keeps route protection aligned with Better Auth&apos;s
                TanStack Start guidance while staying easy to extend.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested next steps</CardTitle>
              <CardDescription>
                Keep the generated auth flow, then customize the app around your
                product.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-muted-foreground">
              <p>
                Replace the demo dashboard with your first authenticated page.
              </p>
              <p>Extend the schema with profile or onboarding fields.</p>
              <p>
                Add a GitHub or Google client ID and secret to .env to turn on
                social sign-in, and RESEND_API_KEY to send real emails.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link to="/" />}
              >
                Back to home
                <ArrowRight data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  );
}
