import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignInForm } from "~/components/auth/sign-in-form";
import { getSession } from "~/lib/auth-functions";

export const Route = createFileRoute("/sign-in")({
  beforeLoad: async () => {
    const session = await getSession();

    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: SignInPage,
});

function SignInPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-6 py-16 sm:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl items-center gap-12 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden space-y-5 lg:block">
          <span className="inline-flex rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-sky-700">
            Better Auth
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Welcome back.
          </h1>
          <p className="max-w-md text-base leading-7 text-slate-600">
            This generated starter includes protected routes, session-aware page
            guards, and reusable auth form primitives you can extend from here.
          </p>
        </section>
        <SignInForm />
      </div>
    </main>
  );
}