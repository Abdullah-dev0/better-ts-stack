// Sends through Resend when RESEND_API_KEY is set. Without it the email is
// printed to the server log, so verification and reset links can be copied
// from the terminal during development
export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`
--- Email to ${to}: ${subject}
${text}
---
`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Resend rejected the email (${response.status}): ${await response.text()}`
    );
  }
}
