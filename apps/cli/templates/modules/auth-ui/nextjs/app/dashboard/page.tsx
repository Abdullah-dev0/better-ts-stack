import { Suspense } from "react";

import Link from "next/link";
import { redirect } from "next/navigation";

import { ArrowRight, ShieldCheck } from "lucide-react";

import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { EmailVerificationCard } from "@/components/auth/email-verification-card";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/session";

// The parts that need the user wait for the session in their own <Suspense>
// boundary, so the rest of the page is sent without waiting for it
async function DashboardHeader() {
  const session = await getSession();

  // proxy.ts already sent visitors without a session cookie to /sign-in; this
  // catches an expired or revoked session
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary">
          <ShieldCheck data-icon="inline-start" />
          Authenticated session
        </Badge>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome {session.user.name}
          </h1>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
      </div>
      <SignOutButton />
    </header>
  );
}

function DashboardHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}

async function EmailVerification() {
  const session = await getSession();

  return session ? (
    <EmailVerificationCard
      email={session.user.email}
      emailVerified={session.user.emailVerified}
    />
  ) : null;
}

export default function DashboardPage() {
  return (
    <main className="min-h-svh bg-muted px-6 py-16 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <Suspense fallback={<DashboardHeaderSkeleton />}>
          <DashboardHeader />
        </Suspense>

        <section className="grid gap-5 md:grid-cols-2">
          <Suspense fallback={<Skeleton className="h-40 rounded-xl" />}>
            <EmailVerification />
          </Suspense>
          <ChangePasswordForm />
          <Card>
            <CardHeader>
              <CardTitle>Protected route example</CardTitle>
              <CardDescription>
                The page is sent right away; the parts that need the user stream
                in once the server has checked the session.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-muted-foreground">
              <p>
                <code className="font-mono text-foreground">proxy.ts</code>{" "}
                sends visitors without a session cookie to the sign-in page.
                Each part that needs the user calls{" "}
                <code className="font-mono text-foreground">getSession()</code>{" "}
                from{" "}
                <code className="font-mono text-foreground">
                  lib/session.ts
                </code>{" "}
                inside its own{" "}
                <code className="font-mono text-foreground">
                  &lt;Suspense&gt;
                </code>{" "}
                boundary, and the session is looked up once per request.
              </p>
              <p>
                Check the session on the server like this in every protected
                page, route handler, and server action.
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
                render={<Link href="/" />}
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
