import type { NextRequest } from "next/server";
import { json, getAdminUser } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/** Admin markerar ett signerat avtal som bokat (skapar booking + status=booked). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return json({ error: "Ej behörig." }, 401);

  const { id } = await params;
  let body: { scheduledStart?: string; scheduledEnd?: string; notes?: string } = {};
  try {
    body = (await req.json()) ?? {};
  } catch {
    // tomt body är ok – bara markera som bokad
  }

  const admin = supabaseAdmin();
  const { data: quote } = await admin
    .from("quotes")
    .select("id, quote_request_id")
    .eq("id", id)
    .maybeSingle();
  if (!quote) return json({ error: "Offert hittades inte." }, 404);

  await admin.from("bookings").insert({
    quote_id: id,
    scheduled_start: body.scheduledStart || null,
    scheduled_end: body.scheduledEnd || null,
    notes: body.notes || null,
  });
  await admin.from("quote_requests").update({ status: "booked" }).eq("id", quote.quote_request_id);

  return json({ ok: true });
}
