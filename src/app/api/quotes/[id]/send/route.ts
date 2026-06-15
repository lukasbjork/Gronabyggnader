import type { NextRequest } from "next/server";
import { json, getAdminUser } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { quoteReadyEmail } from "@/lib/email/templates";

export const runtime = "nodejs";

/** Admin skickar offerten → status=sent + mejl med signeringslänk till kunden. */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return json({ error: "Ej behörig." }, 401);

  const { id } = await params;
  const admin = supabaseAdmin();

  const { data: quote } = await admin.from("quotes").select("*").eq("id", id).maybeSingle();
  if (!quote) return json({ error: "Offert hittades inte." }, 404);
  if (!quote.pdf_path) return json({ error: "Offerten saknar PDF. Spara den först." }, 400);

  const { data: request } = await admin
    .from("quote_requests")
    .select("*")
    .eq("id", quote.quote_request_id)
    .maybeSingle();
  if (!request) return json({ error: "Förfrågan hittades inte." }, 404);

  await admin.from("quote_requests").update({ status: "sent" }).eq("id", request.id);

  const signUrl = `${process.env.APP_BASE_URL ?? ""}/offert?token=${request.access_token}`;
  const result = await sendEmail({
    to: request.email,
    replyTo: process.env.ADMIN_NOTIFY_EMAIL,
    ...quoteReadyEmail({
      name: request.customer_name,
      signUrl,
      validUntil: quote.valid_until,
      totalToPay: Number(quote.total_to_pay),
    }),
  });

  return json({ ok: true, emailSkipped: result.skipped ?? false, signUrl });
}
