"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoaderCircle, LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await authClient.signOut();

            if (result.error) {
              setError("Unable to sign out right now. Please try again.");
              return;
            }

            router.push("/sign-in");
            router.refresh();
          });
        }}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <LoaderCircle className="mr-2 size-4 animate-spin" />
            Signing out
          </>
        ) : (
          <>
            <LogOut className="mr-2 size-4" />
            Sign out
          </>
        )}
      </Button>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
