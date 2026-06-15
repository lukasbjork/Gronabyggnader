import type { NextRequest } from "next/server";
import { json } from "@/lib/api";
import { signSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isExpired } from "@/lib/tokens";
import { downloadBuffer, uploadBuffer, createSignedDownloadUrl } from "@/lib/storage";
import { sha256Hex } from "@/lib/pdf/hash";
import { appendAuditPage } from "@/lib/pdf/sign-pdf";
import { getSignatureProvider } from "@/lib/signing/provider";
import { sendEmail } from "@/lib/email/send";
import { signedConfirmationEmail } from "@/lib/email/templates";

export const runtime = "nodejs";

/** Kunden signerar (token-gatad). Sparar audit trail, genererar signerad PDF, mejlar båda parter. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`sign-act:${ip}`, 10, 60_000).ok) {
    return json({ error: "För många försök. Vänta en stund." }, 429);
  }

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Ogiltig förfrågan." }, 400);
  }
  const parsed = signSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0]?.message ?? "Kontrollera uppgifterna." }, 400);
  }
  const d = parsed.data;
  const admin = supabaseAdmin();

  const { data: quote } = await admin.from("quotes").select("*").eq("id", id).maybeSingle();
  if (!quote) return json({ error: "Offert hittades inte." }, 404);

  const { data: request } = await admin
    .from("quote_requests")
    .select("*")
    .eq("id", quote.quote_request_id)
    .maybeSingle();
  if (!request) return json({ error: "Förfrågan hittades inte." }, 404);

  // Token-verifiering + status
  if (request.access_token !== d.token) return json({ error: "Ogiltig länk." }, 403);
  if (isExpired(request.token_expires_at)) return json({ error: "Länken har gått ut." }, 410);
  if (request.status === "signed" || request.status === "booked") {
    return json({ error: "Avtalet är redan signerat." }, 409);
  }
  if (!quote.pdf_path) return json({ error: "Offerten saknar PDF." }, 400);

  // SHA-256 av exakt den PDF som signeras
  const original = await downloadBuffer(quote.pdf_path);
  const documentSha256 = sha256Hex(original);

  // Valfri ritad signatur
  let signaturePng: Uint8Array | undefined;
  let signatureImagePath: string | null = null;
  if (d.signatureImage?.startsWith("data:image/png;base64,")) {
    const b64 = d.signatureImage.split(",")[1] ?? "";
    signaturePng = new Uint8Array(Buffer.from(b64, "base64"));
    signatureImagePath = `signatures/${id}.png`;
    try {
      await uploadBuffer(signatureImagePath, Buffer.from(signaturePng), "image/png");
    } catch {
      signatureImagePath = null;
    }
  }

  const ua = req.headers.get("user-agent") ?? "";
  const provider = getSignatureProvider("simple");
  const result = await provider.sign({
    signerName: d.signerName,
    signerEmail: d.signerEmail,
    ipAddress: ip,
    userAgent: ua,
    documentSha256,
    signatureImageDataUrl: d.signatureImage,
  });

  // Signerad PDF med audit-sida sist
  const signedBytes = await appendAuditPage(original, {
    quoteId: id,
    signerName: d.signerName,
    signerEmail: d.signerEmail,
    signedAt: result.signedAt,
    ipAddress: ip,
    userAgent: ua,
    documentSha256,
    method: result.method,
    signatureImagePng: signaturePng,
  });
  const signedBuffer = Buffer.from(signedBytes);
  const signedPath = `signed/${id}/avtal-signerat-${id}.pdf`;
  await uploadBuffer(signedPath, signedBuffer, "application/pdf");

  await admin.from("signatures").insert({
    quote_id: id,
    signed_at: result.signedAt,
    signer_name: d.signerName,
    signer_email: d.signerEmail,
    ip_address: ip,
    user_agent: ua,
    document_sha256: documentSha256,
    signed_pdf_path: signedPath,
    signature_image_path: signatureImagePath,
    method: result.method,
    bankid_order_ref: result.bankidOrderRef ?? null,
  });
  await admin.from("quote_requests").update({ status: "signed" }).eq("id", request.id);

  // Mejla signerat avtal till kund + admin
  const attachments = [
    { filename: `avtal-signerat-${id.slice(0, 8)}.pdf`, content: signedBuffer },
  ];
  await Promise.allSettled([
    sendEmail({ to: request.email, attachments, ...signedConfirmationEmail({ name: d.signerName }) }),
    process.env.ADMIN_NOTIFY_EMAIL
      ? sendEmail({
          to: process.env.ADMIN_NOTIFY_EMAIL,
          attachments,
          ...signedConfirmationEmail({ name: d.signerName, forAdmin: true }),
        })
      : Promise.resolve(),
  ]);

  const signedPdfUrl = await createSignedDownloadUrl(signedPath, 3600);
  return json({ ok: true, signedPdfUrl });
}
