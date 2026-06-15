import type { NextRequest } from "next/server";
import { json } from "@/lib/api";
import { quoteRequestSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateAccessToken, tokenExpiry } from "@/lib/tokens";
import { listFolder } from "@/lib/storage";
import { sendEmail } from "@/lib/email/send";
import { customerConfirmationEmail, adminNotificationEmail } from "@/lib/email/templates";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`qr:${ip}`, 6, 60_000).ok) {
    return json({ error: "För många förfrågningar. Försök igen om en stund." }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Ogiltig förfrågan." }, 400);
  }

  // Honeypot ifyllt → låtsas lyckas utan att spara.
  if (body.company) return json({ ok: true });

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0]?.message ?? "Kontrollera dina uppgifter." }, 400);
  }
  const d = parsed.data;
  const admin = supabaseAdmin();

  const { data: inserted, error } = await admin
    .from("quote_requests")
    .insert({
      source: d.source,
      customer_name: d.customerName,
      email: d.email,
      phone: d.phone || null,
      property_address: d.propertyAddress || null,
      property_type: d.propertyType || null,
      service_type: d.serviceType || null,
      message: d.message || null,
      status: "submitted",
      access_token: generateAccessToken(),
      token_expires_at: tokenExpiry(),
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return json({ error: "Kunde inte spara förfrågan." }, 500);
  }
  const requestId = inserted.id as string;

  // Verifiera och spara dokumentreferenser (filerna laddas upp direkt till Storage).
  let fileCount = 0;
  if (d.files.length && d.submissionId) {
    const prefix = `submissions/${d.submissionId}`;
    const existing = new Map<string, number | null>();
    try {
      const list = await listFolder(prefix);
      for (const o of list) {
        const meta = o.metadata as { size?: number } | null;
        existing.set(`${prefix}/${o.name}`, meta?.size ?? null);
      }
    } catch {
      // Om listningen misslyckas hoppar vi över dokumenten men sparar förfrågan.
    }
    const rows = d.files
      .filter((f) => f.storagePath.startsWith(`${prefix}/`) && existing.has(f.storagePath))
      .map((f) => ({
        quote_request_id: requestId,
        storage_path: f.storagePath,
        filename: f.filename,
        content_type: f.contentType ?? null,
        size_bytes: f.sizeBytes ?? existing.get(f.storagePath) ?? null,
      }));
    if (rows.length) {
      await admin.from("documents").insert(rows);
      fileCount = rows.length;
    }
  }

  // Bekräftelse till kund + notis till admin (hoppas över tyst om Resend saknas).
  const adminUrl = `${process.env.APP_BASE_URL ?? ""}/admin/${requestId}`;
  await Promise.allSettled([
    sendEmail({
      to: d.email,
      replyTo: process.env.ADMIN_NOTIFY_EMAIL,
      ...customerConfirmationEmail({ name: d.customerName }),
    }),
    process.env.ADMIN_NOTIFY_EMAIL
      ? sendEmail({
          to: process.env.ADMIN_NOTIFY_EMAIL,
          replyTo: d.email,
          ...adminNotificationEmail({
            request: {
              customer_name: d.customerName,
              email: d.email,
              phone: d.phone || null,
              property_address: d.propertyAddress || null,
              property_type: d.propertyType || null,
              service_type: d.serviceType || null,
              message: d.message || null,
              source: d.source,
            },
            fileCount,
            adminUrl,
          }),
        })
      : Promise.resolve(),
  ]);

  return json({ ok: true });
}
