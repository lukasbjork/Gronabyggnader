import { getResend } from "./client";

export type EmailAttachment = { filename: string; content: Buffer };

export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
};

export type SendEmailResult = { ok: boolean; skipped?: boolean; error?: string };

/**
 * Skickar e-post via Resend. Saknas RESEND_API_KEY (t.ex. lokalt utan nycklar)
 * loggas och hoppas över utan att fälla resten av flödet – så att submit/sign
 * fortfarande kan testas. Sätt nycklarna för riktiga utskick.
 */
export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  const from = process.env.RESEND_FROM || "Gröna Byggnader <onboarding@resend.dev>";

  if (!process.env.RESEND_API_KEY) {
    console.warn(`[email] RESEND_API_KEY saknas – hoppar över utskick: "${opts.subject}"`);
    return { ok: false, skipped: true };
  }

  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
      attachments: opts.attachments,
    });
    if (error) return { ok: false, error: error.message ?? String(error) };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
