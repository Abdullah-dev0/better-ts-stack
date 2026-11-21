import { Suspense } from "react";

import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { Badge } from "@/components/ui/badge";
import { getSession, socialProviders } from "@/lib/session";

// Sends a signed-in visitor to the dashboard. It runs in its own <Suspense>
// boundary, so the form is sent without waiting for the session lookup
async function RedirectIfSignedIn() {
  if (await getSession()) {
    redirect("/dashboard");
  }

  return null;
}

export default function SignUpPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <div className="grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden flex-col gap-5 lg:flex">
          <Badge variant="outline">Better Auth</Badge>
          <h1 className="text-4xl font-semibold tracking-tight">
            Create your account.
          </h1>
          <p className="max-w-md text-base leading-7 text-muted-foreground">
            Sign up with email and password, or with GitHub or Google once their
            keys are set. A verification link goes to your inbox.
          </p>
        </section>
        <SignUpForm providers={socialProviders} />
      </div>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
    </main>
  );
}
