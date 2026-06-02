import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Faq from "@/components/Faq";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { site } from "@/config/site";
import type { Faq as FaqItem } from "@/lib/content";

export const metadata: Metadata = {
  title: "ROT-avdrag – så fungerar det vid renovering",
  description:
    "Allt om ROT-avdraget: 30 % skattereduktion på arbetskostnaden, tak på 50 000 kr per person och år, vad som krävs och hur vi drar av ROT direkt på fakturan.",
  alternates: { canonical: "/rot-avdrag/" },
};

// ⚠️ ROT-reglerna kan ändras mellan år. Kontrollera aktuella belopp och procentsatser
// hos Skatteverket inför lansering och vid årsskiften.
const rotFaqs: FaqItem[] = [
  {
    question: "Hur mycket är ROT-avdraget?",
    answer:
      "ROT-avdraget är 30 % av arbetskostnaden, upp till 50 000 kr per person och år. Det gäller bara själva arbetet – inte material, resor eller utrustning.",
  },
  {
    question: "Vem kan få ROT-avdrag?",
    answer:
      "Du måste äga bostaden (villa, bostadsrätt eller fritidshus) där arbetet utförs, vara minst delvis skattskyldig i Sverige och ha tillräckligt med skatt att räkna av avdraget mot. Bor flera ägare i bostaden kan ni dela på avdraget och därmed på taket.",
  },
  {
    question: "Vilka arbeten ger ROT-avdrag?",
    answer:
      "Renovering, ombyggnad och tillbyggnad av befintlig bostad. Det inkluderar många energiåtgärder vi utför, som tilläggsisolering, fönsterbyte, fasad- och takrenovering samt installation av värmepump. Nybyggnation och rena underhållsavtal omfattas inte på samma sätt.",
  },
  {
    question: "Gäller ROT-avdrag för material?",
    answer:
      "Nej. ROT-avdraget gäller endast arbetskostnaden. Material, maskiner och resor ingår inte. Därför specificerar vi alltid arbetskostnaden tydligt i offerten så att du ser underlaget för avdraget.",
  },
  {
    question: "Hur drar ni av ROT-avdraget?",
    answer:
      "Vi använder den så kallade fakturamodellen: du betalar bara 70 % av arbetskostnaden direkt, och vi begär resten från Skatteverket. Du behöver alltså inte ligga ute med pengarna eller ansöka själv.",
  },
  {
    question: "Kan ROT- och grönt avdrag kombineras?",
    answer:
      "ROT-avdrag och det gröna avdraget (t.ex. för solceller) är olika avdrag med olika regler och kan inte tas ut två gånger för samma arbete. Vi hjälper dig att lägga upp projektet så att du utnyttjar rätt avdrag för rätt åtgärd.",
  },
];

const rotFaqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: rotFaqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const steps = [
  {
    title: "Vi tar fram en offert",
    text: "Du får en tydlig offert där arbetskostnaden är specificerad och ROT-avdraget redan är inräknat.",
  },
  {
    title: "Du betalar bara 70 %",
    text: "På fakturan dras 30 % av arbetskostnaden av direkt. Du betalar nettobeloppet.",
  },
  {
    title: "Vi sköter Skatteverket",
    text: "Vi begär resterande del från Skatteverket via fakturamodellen – ingen administration för dig.",
  },
  {
    title: "Du ser avdraget i deklarationen",
    text: "Det utnyttjade ROT-avdraget syns på ditt skattekonto och i din deklaration.",
  },
];

export default function RotAvdragPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kundnytta"
        title="ROT-avdraget – så fungerar det"
        intro="ROT-avdraget gör energirenovering märkbart billigare. Här förklarar vi vad det är, hur mycket du kan få och hur vi drar av det direkt på fakturan."
        crumbs={[
          { label: "Hem", href: "/" },
          { label: "ROT-avdrag" },
        ]}
      />

      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        {/* Nyckeltal */}
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { value: "30 %", label: "av arbetskostnaden" },
            { value: "50 000 kr", label: "max per person och år" },
            { value: "0 kr", label: "administration för dig" },
          ].map((item) => (
            <div key={item.label} className="rounded-card border border-border bg-brand-soft p-6 text-center">
              <p className="text-3xl font-bold text-brand">{item.value}</p>
              <p className="mt-1 text-sm text-muted">{item.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold text-brand-deep">Vad är ROT-avdraget?</h2>
        <p className="mt-3 text-muted">
          ROT står för Renovering, Ombyggnad och Tillbyggnad. Avdraget är en skattereduktion
          som gör att du som äger din bostad bara betalar en del av arbetskostnaden när du
          anlitar en hantverkare. Avdraget är 30 % av arbetskostnaden, upp till 50 000 kr per
          person och år. Syftet är att göra det enklare och billigare att underhålla och
          förbättra Sveriges bostäder – och många av de energiåtgärder vi utför är just
          ROT-berättigade.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-brand-deep">Så går det till hos oss</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-card border border-border bg-surface p-6">
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
              >
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold text-brand-deep">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 text-2xl font-bold text-brand-deep">
          Energiåtgärder som ofta ger ROT-avdrag
        </h2>
        <p className="mt-3 text-muted">
          Arbetskostnaden för flera av våra mest efterfrågade tjänster är normalt
          ROT-berättigad. Exempel:
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/tjanster/tillaggsisolering/", label: "Tilläggsisolering" },
            { href: "/tjanster/fonsterbyte/", label: "Fönsterbyte" },
            { href: "/tjanster/fasadrenovering/", label: "Fasadrenovering" },
            { href: "/tjanster/takrenovering/", label: "Takrenovering" },
            { href: "/tjanster/varmesystem-och-varmepump/", label: "Installation av värmepump" },
            { href: "/tjanster/rot-renovering/", label: "ROT-renovering generellt" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-brand-soft px-4 py-3 font-medium text-brand-deep hover:bg-white"
              >
                {item.label}
                <span aria-hidden="true" className="text-brand-2">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-card border border-border bg-surface p-6 text-sm text-muted">
          <strong className="text-foreground">Bra att veta:</strong> ROT-reglerna (procentsats
          och tak) kan ändras mellan olika år och beslutas av riksdagen. Vi utgår alltid från de
          regler som gäller när arbetet utförs och hänvisar till Skatteverket för de senaste
          beloppen. Den här sidan är allmän information, inte skatterådgivning.
        </div>

        <h2 className="mt-12 text-2xl font-bold text-brand-deep">Vanliga frågor om ROT-avdrag</h2>
        <div className="mt-6">
          <Faq items={rotFaqs} />
        </div>
      </article>

      <CTASection
        title="Vill du veta vad ditt projekt kostar med ROT?"
        text={`Hör av dig så tar vi fram en offert för din fastighet i ${site.city} – med arbetskostnad och ROT-avdrag tydligt specificerat.`}
        secondaryHref="/tjanster/"
        secondaryLabel="Se våra tjänster"
      />

      <JsonLd data={rotFaqLd} />
    </>
  );
}
