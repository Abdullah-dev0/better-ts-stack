import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { authClient } from "~/lib/auth-client";
import {
  changePasswordSchema,
  getAuthErrorMessage,
  type ChangePasswordValues,
} from "~/lib/auth-schema";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);

    startTransition(async () => {
      // Other devices are signed out; this one stays signed in
      const result = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        setMessage({ text: getAuthErrorMessage(result.error), isError: true });
        return;
      }

      form.reset();
      setMessage({ text: "Password changed.", isError: false });
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          Other devices are signed out after the change.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <Field
              data-invalid={Boolean(form.formState.errors.currentPassword)}
            >
              <FieldLabel htmlFor="currentPassword">Current password</FieldLabel>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(form.formState.errors.currentPassword)}
                {...form.register("currentPassword")}
              />
              <FieldError errors={[form.formState.errors.currentPassword]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.newPassword)}>
              <FieldLabel htmlFor="newPassword">New password</FieldLabel>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(form.formState.errors.newPassword)}
                {...form.register("newPassword")}
              />
              <FieldError errors={[form.formState.errors.newPassword]} />
            </Field>

            {message ? (
              <Alert variant={message.isError ? "destructive" : "default"}>
                {message.isError ? <CircleAlert /> : <CircleCheck />}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            ) : null}

            <Field orientation="horizontal">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Saving
                  </>
                ) : (
                  "Change password"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
