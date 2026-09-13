import { createFileRoute, redirect } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { SignOutButton } from "~/components/auth/sign-out-button";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getSession } from "~/lib/auth-functions";
import { cn } from "~/lib/utils";

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
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-200/60 backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-700">
              <ShieldCheck className="size-4" />
              Authenticated session
            </span>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Welcome {user.name}
              </h1>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
          </div>
          <SignOutButton />
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Protected route example</CardTitle>
              <CardDescription>
                This page verifies the session on the server before rendering any
                content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <p>
                The route guard calls{" "}
                <code className="font-mono text-slate-900">getSession()</code> in
                <code className="font-mono text-slate-900"> beforeLoad</code>,
                which reads the cookie headers server-side via{" "}
                <code className="font-mono text-slate-900">
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
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>
                Replace the demo dashboard with your first authenticated page.
              </p>
              <p>Extend the schema with profile or onboarding fields.</p>
              <p>
                Add provider-based auth or email verification later if needed.
              </p>
              <Link
                to="/"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-fit gap-2"
                )}
              >
                Back to home
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}