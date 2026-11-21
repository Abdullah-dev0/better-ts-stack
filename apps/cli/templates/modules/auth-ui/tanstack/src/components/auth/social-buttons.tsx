import { useState, useTransition } from "react";

import { authClient } from "~/lib/auth-client";
import { getAuthErrorMessage, type SocialProvider } from "~/lib/auth-schema";
import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldSeparator } from "~/components/ui/field";
import { Spinner } from "~/components/ui/spinner";

const PROVIDER_LABELS: Record<SocialProvider, string> = {
  github: "GitHub",
  google: "Google",
};

// One button per provider turned on in lib/auth.ts; renders nothing when
// GitHub and Google sign-in are both off
export function SocialButtons({ providers }: { providers: SocialProvider[] }) {
  const [isPending, startTransition] = useTransition();
  // The provider whose button was clicked, for its "Redirecting" label
  const [chosen, setChosen] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (providers.length === 0) {
    return null;
  }

  function signIn(provider: SocialProvider) {
    setError(null);
    setChosen(provider);
    startTransition(async () => {
      // Redirects to the provider; the user comes back to the dashboard
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
        errorCallbackURL: "/sign-in",
      });

      if (result.error) {
        setError(getAuthErrorMessage(result.error));
      }
    });
  }

  return (
    <>
      <Field data-invalid={Boolean(error)}>
        {providers.map((provider) => (
          <Button
            key={provider}
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => signIn(provider)}
          >
            {isPending && chosen === provider ? (
              <>
                <Spinner data-icon="inline-start" />
                Redirecting
              </>
            ) : (
              `Continue with ${PROVIDER_LABELS[provider]}`
            )}
          </Button>
        ))}
        {error ? <FieldError>{error}</FieldError> : null}
      </Field>
      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
        Or continue with email
      </FieldSeparator>
    </>
  );
}
