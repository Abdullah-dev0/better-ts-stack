import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { auth } from "@/lib/auth";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ecfeff_100%)] px-6 py-16 sm:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl items-center gap-12 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden space-y-5 lg:block">
          <span className="inline-flex rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-sky-700">
            Better Auth
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Create your account.
          </h1>
          <p className="max-w-md text-base leading-7 text-slate-600">
            Start with email and password today, then layer in profile data,
            onboarding, and provider-based auth when your product needs it.
          </p>
        </section>
        <SignUpForm />
      </div>
    </main>
  );
}
