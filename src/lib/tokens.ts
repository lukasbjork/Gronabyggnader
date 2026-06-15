import { randomBytes } from "node:crypto";
import { TOKEN_TTL_DAYS } from "./constants";

/** Oguessningsbar access_token för kundens signeringslänk. */
export function generateAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

/** ISO-tidsstämpel för när en token går ut. */
export function tokenExpiry(days: number = TOKEN_TTL_DAYS): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

/** True om tidsstämpeln saknas eller redan passerat. */
export function isExpired(iso: string | null | undefined): boolean {
  if (!iso) return true;
  return new Date(iso).getTime() < Date.now();
}
