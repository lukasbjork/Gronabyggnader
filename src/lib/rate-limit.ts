/**
 * Enkel in-memory rate limiter (per serverless-instans). Räcker som ett första
 * lager mot missbruk tillsammans med honeypot-fältet. För robust skydd över flera
 * instanser: koppla in Upstash/Redis eller Cloudflare Turnstile (förberett i env).
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, retryAfter: 0 };
}

/** Bästa gissning av klientens IP bakom Netlifys proxy. */
export function clientIp(headers: Headers): string {
  const candidate =
    headers.get("x-nf-client-connection-ip") ||
    headers.get("x-forwarded-for") ||
    "";
  return candidate.split(",")[0]?.trim() || "unknown";
}
