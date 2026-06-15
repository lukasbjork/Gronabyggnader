import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { json } from "@/lib/api";
import { signUploadSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { createSignedUploadUrl } from "@/lib/storage";

export const runtime = "nodejs";

function sanitizeFilename(name: string): string {
  const dot = name.lastIndexOf(".");
  const rawBase = dot >= 0 ? name.slice(0, dot) : name;
  const rawExt = dot >= 0 ? name.slice(dot + 1) : "";
  const base = rawBase.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "fil";
  const ext = rawExt.replace(/[^a-zA-Z0-9]+/g, "").toLowerCase().slice(0, 8);
  return ext ? `${base}.${ext}` : base;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`sign:${ip}`, 40, 60_000).ok) {
    return json({ error: "För många förfrågningar. Försök igen om en stund." }, 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Ogiltig förfrågan." }, 400);
  }

  const parsed = signUploadSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0]?.message ?? "Ogiltiga uppgifter." }, 400);
  }

  const { submissionId, filename } = parsed.data;
  const path = `submissions/${submissionId}/${randomUUID()}-${sanitizeFilename(filename)}`;

  try {
    const signed = await createSignedUploadUrl(path);
    return json({ path: signed.path, token: signed.token });
  } catch {
    return json({ error: "Kunde inte förbereda uppladdning." }, 500);
  }
}
