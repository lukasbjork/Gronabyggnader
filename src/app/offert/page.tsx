import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import OfferStepper from "./OfferStepper";
import Step1Form from "./Step1Form";
import ReviewSign from "./ReviewSign";
import { loadQuoteByToken } from "./data";
import { site } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Offert & digital signering",
  description: `Skicka in dina handlingar till ${site.name} och få en offert som du kan granska och signera digitalt – allt på samma sida.`,
  alternates: { canonical: "/offert/" },
  robots: { index: true, follow: true },
};

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl rounded-card border border-border bg-surface p-8 text-center shadow-sm">
      <h2 className="text-2xl font-bold text-brand-deep">{title}</h2>
      <div className="mt-3 text-muted">{children}</div>
    </div>
  );
}

export default async function OffertPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  // ── Steg 1: inget token → kunden skickar in handlingar ──────────────────────
  if (!token) {
    return (
      <>
        <PageHeader
          eyebrow="Offert"
          title="Begär offert & signera digitalt"
          intro="Skicka in dina handlingar nedan. Vi tar fram en offert som du sedan granskar och signerar – på samma sida, helt digitalt."
          crumbs={[{ label: "Hem", href: "/" }, { label: "Offert" }]}
        />
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="mb-10">
            <OfferStepper current={1} />
          </div>
          <Step1Form />
        </section>
      </>
    );
  }

  // ── Steg 3/4: token finns → hämta offerten server-side ──────────────────────
  const result = await loadQuoteByToken(token);

  return (
    <>
      <PageHeader
        eyebrow="Offert"
        title="Din offert"
        crumbs={[{ label: "Hem", href: "/" }, { label: "Offert" }]}
      />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <OfferStepper
            current={result.state === "signed" ? 4 : result.state === "ready" ? 3 : 2}
          />
        </div>

        {result.state === "invalid" && (
          <InfoCard title="Länken kunde inte hittas">
            <p>
              Länken är ogiltig. Kontrollera att du använde hela länken från mejlet, eller{" "}
              <a className="font-medium text-brand-2 underline underline-offset-2" href="/kontakt/">
                kontakta oss
              </a>
              .
            </p>
          </InfoCard>
        )}

        {result.state === "expired" && (
          <InfoCard title="Länken har gått ut">
            <p>
              Din signeringslänk har gått ut.{" "}
              <a className="font-medium text-brand-2 underline underline-offset-2" href="/kontakt/">
                Hör av dig
              </a>{" "}
              så skickar vi en ny.
            </p>
          </InfoCard>
        )}

        {result.state === "not_ready" && (
          <InfoCard title="Vi arbetar med din offert">
            <p>
              Tack {result.request.customer_name}! Vi tar fram din offert och mejlar dig en länk så
              snart den är klar att granska och signera.
            </p>
          </InfoCard>
        )}

        {result.state === "signed" && (
          <InfoCard title="Avtalet är signerat – tack!">
            <p>
              Vi kontaktar dig för att boka in arbetet. En kopia av det signerade avtalet har
              skickats till din e-post.
            </p>
            {result.signedPdfUrl && (
              <a
                href={result.signedPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block font-medium text-brand-2 underline underline-offset-2 hover:text-brand-deep"
              >
                Ladda ner signerat avtal (PDF)
              </a>
            )}
          </InfoCard>
        )}

        {result.state === "ready" && (
          <ReviewSign
            quoteId={result.quote.id}
            token={token}
            customerName={result.request.customer_name}
            email={result.request.email}
            pdfUrl={result.pdfUrl}
            validUntil={result.quote.valid_until}
            totals={{
              laborCost: Number(result.quote.labor_cost),
              materialCost: Number(result.quote.material_cost),
              vatAmount: Number(result.quote.vat_amount),
              totalInclVat: Number(result.quote.total_incl_vat),
              rotDeduction: Number(result.quote.rot_deduction),
              totalToPay: Number(result.quote.total_to_pay),
            }}
          />
        )}
      </section>
    </>
  );
}
