import { createFileRoute } from "@tanstack/react-router";

import { ResetPasswordForm } from "~/components/auth/reset-password-form";

// The link in the reset email lands here with ?token=..., or with ?error=...
// when the token is invalid or has expired
export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token, error } = Route.useSearch();

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <ResetPasswordForm token={error ? null : (token ?? null)} />
      </div>
    </main>
  );
}
