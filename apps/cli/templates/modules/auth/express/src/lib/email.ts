import { env } from "../env";

interface Email {
  to: string;
  subject: string;
  text: string;
}

if (!env.RESEND_API_KEY && process.env.NODE_ENV === "production") {
  console.warn(
    "RESEND_API_KEY is not set: emails are printed to the log instead of sent"
  );
}

// Sends through Resend when RESEND_API_KEY is set. Without it the email is
// printed, so verification and reset links can be copied from the terminal
export async function sendEmail({ to, subject, text }: Email): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.log(`\n--- Email to ${to}: ${subject}\n${text}\n---\n`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.EMAIL_FROM, to, subject, text }),
  });

  if (!response.ok) {
    throw new Error(
      `Resend rejected the email (${response.status}): ${await response.text()}`
    );
  }
}
