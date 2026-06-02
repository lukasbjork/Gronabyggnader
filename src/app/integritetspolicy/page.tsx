import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { fullAddress, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description:
    `Så behandlar ${site.name} dina personuppgifter enligt GDPR – vilka uppgifter vi samlar in via kontaktformuläret, varför, hur länge och dina rättigheter.`,
  alternates: { canonical: "/integritetspolicy/" },
};

export default function IntegritetspolicyPage() {
  return (
    <>
      <PageHeader
        title="Integritetspolicy"
        intro="Din integritet är viktig för oss. Här förklarar vi hur vi hanterar dina personuppgifter."
        crumbs={[
          { label: "Hem", href: "/" },
          { label: "Integritetspolicy" },
        ]}
      />

      <article className="prose-brand prose mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p>
          Denna integritetspolicy beskriver hur {site.name} (org.nr {site.orgNumber}) behandlar
          personuppgifter i enlighet med dataskyddsförordningen (GDPR). Policyn är en allmän mall
          – <strong>låt en jurist granska och anpassa den</strong> innan publicering.
        </p>

        <h2>Personuppgiftsansvarig</h2>
        <p>
          {site.name}, {fullAddress()}. Du når oss på{" "}
          <a href={site.phoneHref}>{site.phone}</a> eller{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2>Vilka uppgifter vi samlar in</h2>
        <p>
          När du fyller i vårt kontakt-/offertformulär samlar vi in de uppgifter du anger: namn,
          e-postadress, telefonnummer, fastighetstyp och det meddelande du skriver. Vi samlar
          endast in uppgifter som du själv lämnar till oss.
        </p>

        <h2>Varför vi behandlar uppgifterna</h2>
        <ul>
          <li>För att besvara din förfrågan och lämna offert.</li>
          <li>För att kunna planera och genomföra ett eventuellt uppdrag.</li>
          <li>För att uppfylla rättsliga skyldigheter, t.ex. bokföring.</li>
        </ul>
        <p>
          Den rättsliga grunden är vårt berättigade intresse av att besvara din förfrågan samt,
          vid uppdrag, att fullgöra avtal.
        </p>

        <h2>Hur länge vi sparar uppgifterna</h2>
        <p>
          Vi sparar dina uppgifter så länge det behövs för ändamålet – för en förfrågan som inte
          leder till uppdrag normalt en begränsad tid, och för genomförda uppdrag så länge lagen
          (t.ex. bokföringslagen) kräver. [Ange era faktiska lagringstider här.]
        </p>

        <h2>Hur uppgifterna lagras och delas</h2>
        <p>
          Formulärinskick hanteras via vår webbplatsleverantörs formulärtjänst (Netlify Forms)
          och vår e-post. Vi säljer aldrig dina uppgifter. Uppgifter kan delas med
          underleverantörer som hjälper oss att leverera tjänsten, och då endast i den
          utsträckning det behövs. [Anpassa om ni använder andra system, t.ex. CRM.]
        </p>

        <h2>Cookies</h2>
        <p>
          Webbplatsen använder inga cookies för spårning eller marknadsföring som standard.
          Nödvändiga, tekniska funktioner kan förekomma. Om vi i framtiden lägger till
          analys- eller marknadsföringsverktyg uppdaterar vi denna policy och inhämtar
          samtycke där det krävs.
        </p>

        <h2>Dina rättigheter</h2>
        <p>
          Du har rätt att begära tillgång till, rättelse eller radering av dina personuppgifter,
          att invända mot eller begränsa behandlingen samt rätt till dataportabilitet. Kontakta
          oss på <a href={`mailto:${site.email}`}>{site.email}</a> så hjälper vi dig. Du har även
          rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY).
        </p>

        <h2>Ändringar i denna policy</h2>
        <p>
          Vi kan komma att uppdatera policyn. Den senaste versionen finns alltid publicerad på
          denna sida.
        </p>

        <p className="text-sm">
          <em>Senast uppdaterad: [DATUM]. Detta är en mall – anpassa innehållet till er
          verksamhet och låt en jurist granska den.</em>
        </p>
      </article>
    </>
  );
}
