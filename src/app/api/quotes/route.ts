import type { NextRequest } from "next/server";
import { json, getAdminUser } from "@/lib/api";
import { createQuoteSchema } from "@/lib/validation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { calculateTotals } from "@/lib/quote-config";
import { renderQuotePdf } from "@/lib/pdf/quote-pdf";
import { uploadBuffer, createSignedDownloadUrl } from "@/lib/storage";
import { PLACEHOLDER_TERMS, TERMS_VERSION } from "@/lib/constants";

export const runtime = "nodejs";

/** Admin skapar/uppdaterar en offert, genererar PDF och returnerar en förhandsvisnings-URL. */
export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return json({ error: "Ej behörig." }, 401);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Ogiltig förfrågan." }, 400);
  }
  const parsed = createQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0]?.message ?? "Kontrollera offerten." }, 400);
  }
  const d = parsed.data;
  const admin = supabaseAdmin();

  const { data: request } = await admin
    .from("quote_requests")
    .select("*")
    .eq("id", d.quoteRequestId)
    .maybeSingle();
  if (!request) return json({ error: "Förfrågan hittades inte." }, 404);

  const totals = calculateTotals(d.lineItems, d.rotPersons);
  const termsText = d.termsText?.trim() ? d.termsText : PLACEHOLDER_TERMS;

  const payload = {
    quote_request_id: d.quoteRequestId,
    line_items: d.lineItems,
    labor_cost: totals.laborCost,
    material_cost: totals.materialCost,
    vat_amount: totals.vatAmount,
    rot_deduction: totals.rotDeduction,
    rot_persons: totals.rotPersons,
    total_incl_vat: totals.totalInclVat,
    total_to_pay: totals.totalToPay,
    valid_until: d.validUntil || null,
    terms_version: TERMS_VERSION,
    terms_text: termsText,
    created_by: user.email ?? null,
  };

  // Upsert: uppdatera befintlig offert (en per förfrågan) eller skapa ny.
  const { data: existing } = await admin
    .from("quotes")
    .select("id")
    .eq("quote_request_id", d.quoteRequestId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let quoteId: string;
  if (existing) {
    const { error } = await admin.from("quotes").update(payload).eq("id", existing.id);
    if (error) return json({ error: "Kunde inte spara offerten." }, 500);
    quoteId = existing.id as string;
  } else {
    const { data: ins, error } = await admin.from("quotes").insert(payload).select("id").single();
    if (error || !ins) return json({ error: "Kunde inte spara offerten." }, 500);
    quoteId = ins.id as string;
  }

  // Generera + spara PDF
  const pdf = await renderQuotePdf({
    quoteId,
    createdAt: new Date().toISOString(),
    customerName: request.customer_name,
    email: request.email,
    phone: request.phone,
    propertyAddress: request.property_address,
    serviceType: request.service_type,
    lineItems: d.lineItems,
    totals,
    validUntil: d.validUntil || null,
    termsText,
    termsVersion: TERMS_VERSION,
  });
  const pdfPath = `quotes/${d.quoteRequestId}/offert-${quoteId}.pdf`;
  await uploadBuffer(pdfPath, pdf, "application/pdf");
  await admin.from("quotes").update({ pdf_path: pdfPath }).eq("id", quoteId);

  if (request.status === "submitted") {
    await admin.from("quote_requests").update({ status: "quoted" }).eq("id", d.quoteRequestId);
  }

  const previewUrl = await createSignedDownloadUrl(pdfPath, 1800);
  return json({ quoteId, previewUrl });
}
