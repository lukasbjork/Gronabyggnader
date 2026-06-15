import { supabaseAdmin } from "@/lib/supabase/admin";
import { isExpired } from "@/lib/tokens";
import { createSignedDownloadUrl } from "@/lib/storage";
import type { Quote, QuoteRequest, Signature } from "@/lib/types";

export type LoadResult =
  | { state: "invalid" }
  | { state: "expired" }
  | { state: "not_ready"; request: QuoteRequest }
  | { state: "ready"; request: QuoteRequest; quote: Quote; pdfUrl: string }
  | {
      state: "signed";
      request: QuoteRequest;
      signature: Signature | null;
      signedPdfUrl: string | null;
    };

/**
 * Hämtar offerten via kundens hemliga token (server-side). Sätter status=viewed
 * första gången en skickad offert öppnas.
 */
export async function loadQuoteByToken(token: string): Promise<LoadResult> {
  const admin = supabaseAdmin();

  const { data: request } = await admin
    .from("quote_requests")
    .select("*")
    .eq("access_token", token)
    .maybeSingle();

  if (!request) return { state: "invalid" };
  if (isExpired(request.token_expires_at)) return { state: "expired" };

  const { data: quote } = await admin
    .from("quotes")
    .select("*")
    .eq("quote_request_id", request.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (request.status === "signed" || request.status === "booked") {
    let signature: Signature | null = null;
    let signedPdfUrl: string | null = null;
    if (quote) {
      const { data: sig } = await admin
        .from("signatures")
        .select("*")
        .eq("quote_id", quote.id)
        .order("signed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      signature = (sig as Signature) ?? null;
      if (sig?.signed_pdf_path) {
        try {
          signedPdfUrl = await createSignedDownloadUrl(sig.signed_pdf_path, 3600);
        } catch {
          signedPdfUrl = null;
        }
      }
    }
    return { state: "signed", request: request as QuoteRequest, signature, signedPdfUrl };
  }

  if (!quote || request.status === "submitted" || request.status === "quoted") {
    return { state: "not_ready", request: request as QuoteRequest };
  }

  // Skickad offert öppnas första gången → markera som granskad.
  if (request.status === "sent") {
    await admin.from("quote_requests").update({ status: "viewed" }).eq("id", request.id);
    request.status = "viewed";
  }

  let pdfUrl = "";
  if (quote.pdf_path) {
    try {
      pdfUrl = await createSignedDownloadUrl(quote.pdf_path, 3600);
    } catch {
      pdfUrl = "";
    }
  }

  return { state: "ready", request: request as QuoteRequest, quote: quote as Quote, pdfUrl };
}
