import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

// A static page: the form reads the token from the URL in the browser, inside
// <Suspense> as useSearchParams() requires
export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
