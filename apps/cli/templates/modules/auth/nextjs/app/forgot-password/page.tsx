import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
