"use client";

import { useState, useTransition } from "react";
import { BadgeCheck, MailWarning } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

// Shows whether the email address is verified, with a button to send the
// verification email again
export function EmailVerificationCard({
  email,
  emailVerified,
}: {
  email: string;
  emailVerified: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function resend() {
    setMessage(null);
    startTransition(async () => {
      const result = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/dashboard",
      });
      setMessage(
        result.error
          ? getAuthErrorMessage(result.error)
          : "Verification email sent. Without an email provider set up, the link is printed in the server terminal."
      );
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {emailVerified ? "Email verified" : "Verify your email"}
        </CardTitle>
        <CardDescription>
          {emailVerified
            ? `${email} is confirmed.`
            : `We sent a link to ${email}. Open it to confirm the address.`}
        </CardDescription>
        <CardAction>
          {emailVerified ? (
            <Badge variant="secondary">
              <BadgeCheck data-icon="inline-start" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline">
              <MailWarning data-icon="inline-start" />
              Pending
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      {emailVerified ? null : (
        <CardContent className="flex flex-col items-start gap-3">
          <Button variant="outline" onClick={resend} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" />
                Sending
              </>
            ) : (
              "Send the email again"
            )}
          </Button>
          {message ? (
            <p className="text-sm text-muted-foreground">{message}</p>
          ) : null}
        </CardContent>
      )}
    </Card>
  );
}
