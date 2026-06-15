import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSignedDownloadUrl } from "@/lib/storage";
import { formatKr } from "@/lib/quote-config";
import { PLACEHOLDER_TERMS } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";
import QuoteForm from "./QuoteForm";
import BookingActions from "./BookingActions";
import type { DocumentRow, Quote, QuoteRequest, Signature } from "@/lib/types";

export const dynamic = "force-dynamic";

async function safeUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  try {
    return await createSignedDownloadUrl(path, 1800);
  } catch {
    return null;
  }
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-muted">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

export default async function AdminDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = supabaseAdmin();

  const { data: requestData } = await admin
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!requestData) notFound();
  const request = requestData as QuoteRequest;

  const { data: documentsData } = await admin
    .from("documents")
    .select("*")
    .eq("quote_request_id", id)
    .order("uploaded_at", { ascending: true });
  const documents = await Promise.all(
    ((documentsData ?? []) as DocumentRow[]).map(async (doc) => ({
      ...doc,
      url: await safeUrl(doc.storage_path),
    })),
  );

  const { data: quoteData } = await admin
    .from("quotes")
    .select("*")
    .eq("quote_request_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const quote = (quoteData as Quote | null) ?? null;

  let signature: Signature | null = null;
  let signedPdfUrl: string | null = null;
  let quotePdfUrl: string | null = null;
  if (quote) {
    quotePdfUrl = await safeUrl(quote.pdf_path);
    const { data: sigData } = await admin
      .from("signatures")
      .select("*")
      .eq("quote_id", quote.id)
      .order("signed_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    signature = (sigData as Signature | null) ?? null;
    signedPdfUrl = await safeUrl(signature?.signed_pdf_path ?? null);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin" className="text-sm text-brand-2 hover:underline">
          ← Tillbaka till listan
        </Link>
        <StatusBadge status={request.status} />
      </div>

      <h1 className="text-2xl font-bold text-brand-deep">{request.customer_name}</h1>
      <p className="text-muted">
        Inkom {new Date(request.created_at).toLocaleString("sv-SE")} · Källa: {request.source}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        {/* Vänster: kunduppgifter + handlingar */}
        <div className="space-y-6">
          <section className="rounded-card border border-border bg-surface p-5">
            <h2 className="text-lg font-bold text-brand-deep">Kunduppgifter</h2>
            <dl className="mt-3 space-y-3">
              <Detail label="E-post" value={request.email} />
              <Detail label="Telefon" value={request.phone} />
              <Detail label="Fastighetsadress" value={request.property_address} />
              <Detail label="Fastighetstyp" value={request.property_type} />
              <Detail label="Typ av arbete" value={request.service_type} />
              <Detail label="Meddelande" value={request.message} />
            </dl>
          </section>

          <section className="rounded-card border border-border bg-surface p-5">
            <h2 className="text-lg font-bold text-brand-deep">Handlingar ({documents.length})</h2>
            {documents.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Inga uppladdade filer.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">{doc.filename}</span>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 font-medium text-brand-2 underline underline-offset-2"
                      >
                        Öppna
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {signature && (
            <section className="rounded-card border border-border bg-brand-soft p-5">
              <h2 className="text-lg font-bold text-brand-deep">Signering</h2>
              <dl className="mt-3 space-y-3 text-sm">
                <Detail label="Signerad av" value={signature.signer_name} />
                <Detail label="E-post" value={signature.signer_email} />
                <Detail
                  label="Tidpunkt"
                  value={new Date(signature.signed_at).toLocaleString("sv-SE")}
                />
                <Detail label="IP-adress" value={signature.ip_address} />
                <Detail label="Metod" value={signature.method} />
                <Detail label="Dokument-hash" value={signature.document_sha256} />
              </dl>
              {signedPdfUrl && (
                <a
                  href={signedPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block font-medium text-brand-2 underline underline-offset-2"
                >
                  Ladda ner signerat avtal (PDF)
                </a>
              )}
              <div className="mt-4">
                <BookingActions quoteId={quote!.id} booked={request.status === "booked"} />
              </div>
            </section>
          )}
        </div>

        {/* Höger: skapa/skicka offert */}
        <div>
          <QuoteForm
            quoteRequestId={id}
            requestStatus={request.status}
            existingQuoteId={quote?.id ?? null}
            hasPdf={Boolean(quote?.pdf_path)}
            initialItems={
              quote?.line_items?.length
                ? quote.line_items
                : [{ description: "", quantity: 1, unitPrice: 0, kind: "arbete" as const }]
            }
            initialRotPersons={quote?.rot_persons ?? 1}
            initialValidUntil={quote?.valid_until ?? ""}
            initialTerms={quote?.terms_text ?? PLACEHOLDER_TERMS}
          />
          {quote && quotePdfUrl && (
            <p className="mt-3 text-sm text-muted">
              Nuvarande sparad PDF:{" "}
              <a
                href={quotePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-2 underline underline-offset-2"
              >
                öppna
              </a>{" "}
              · Belopp att betala: {formatKr(Number(quote.total_to_pay))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
