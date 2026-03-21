import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

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
                Welcome {session.user.name}
              </h1>
              <p className="text-sm text-slate-600">{session.user.email}</p>
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
                The generated proxy only performs an optimistic cookie check. The
                authoritative guard happens here with{" "}
                <code className="font-mono text-slate-900">
                  auth.api.getSession({"{"} headers: await headers() {"}"})
                </code>
                .
              </p>
              <p>
                That keeps route protection aligned with Better Auth&apos;s
                Next.js guidance while staying easy to extend.
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
              <p>Replace the demo dashboard with your first authenticated page.</p>
              <p>Extend the schema with profile or onboarding fields.</p>
              <p>Add provider-based auth or email verification later if needed.</p>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "outline" }), "w-fit gap-2")}
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
