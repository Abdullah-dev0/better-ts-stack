import * as React from "react";

import { cn } from "@/lib/utils";

function FieldGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-5", className)} {...props} />;
}

type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  "data-invalid"?: boolean;
};

function Field({
  className,
  "data-invalid": dataInvalid,
  ...props
}: FieldProps) {
  return (
    <div
      data-invalid={dataInvalid}
      className={cn("space-y-2", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium text-slate-900", className)}
      {...props}
    />
  );
}

function FieldDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-500", className)} {...props} />;
}

type FieldErrorProps = React.HTMLAttributes<HTMLParagraphElement> & {
  errors?: Array<{ message?: string } | undefined>;
};

function FieldError({ className, errors, ...props }: FieldErrorProps) {
  const message = errors?.find((error) => error?.message)?.message;

  if (!message) {
    return null;
  }

  return (
    <p className={cn("text-sm font-medium text-rose-600", className)} {...props}>
      {message}
    </p>
  );
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel };
