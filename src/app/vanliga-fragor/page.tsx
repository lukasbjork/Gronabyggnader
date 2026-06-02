import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Faq from "@/components/Faq";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vanliga frågor om energirenovering & ROT",
  description:
    "Svar på vanliga frågor om energieffektivisering, ROT-avdrag, besparing, offert, garantier och vilka områden vi arbetar i. Hittar du inte svaret? Kontakta oss.",
  alternates: { canonical: "/vanliga-fragor/" },
};

// FAQPage structured data – hjälper sidan att synas som rich result i Google.
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function VanligaFragorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Vanliga frågor"
        title="Vanliga frågor"
        intro="Här svarar vi på det vi får höra oftast – om energiåtgärder, ROT-avdrag, besparing och hur vi jobbar. Saknar du något? Hör av dig så hjälper vi dig."
        crumbs={[
          { label: "Hem", href: "/" },
          { label: "Vanliga frågor" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Faq items={faqs} />
      </section>

      <CTASection
        title="Hittade du inte svaret du sökte?"
        text="Ställ din fråga direkt – vi svarar gärna och hjälper dig att förstå vad som lönar sig för just din fastighet."
        secondaryHref="/rot-avdrag/"
        secondaryLabel="Läs om ROT-avdrag"
      />

      <JsonLd data={faqLd} />
    </>
  );
}
