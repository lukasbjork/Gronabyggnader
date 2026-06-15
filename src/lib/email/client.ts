import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Saknar RESEND_API_KEY i miljön.");
  if (!cached) cached = new Resend(key);
  return cached;
}
