import { useNavigate } from "@tanstack/react-router";
import { useState, useTransition } from "react";
import { LogOut } from "lucide-react";

import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

export function SignOutButton() {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-start gap-2">
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

            navigate({ to: "/sign-in" });
          });
        }}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" />
            Signing out
          </>
        ) : (
          <>
            <LogOut data-icon="inline-start" />
            Sign out
          </>
        )}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
