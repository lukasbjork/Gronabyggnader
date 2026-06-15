import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import { fullAddress, site } from "@/config/site";
import KontaktForm from "./KontaktForm";

export const metadata: Metadata = {
  title: "Kontakt & kostnadsfri offert",
  description:
    `Kontakta ${site.name} i ${site.city} för en kostnadsfri offert. Fyll i formuläret med din fastighetstyp så återkommer vi med en plan för lägre driftkostnad.`,
  alternates: { canonical: "/kontakt/" },
};

/*
 * ───────────────────────────────────────────────────────────────────────────
 *  OM FORMULÄRET
 * ───────────────────────────────────────────────────────────────────────────
 *  Formuläret postar till /api/quote-requests (source="kontakt") och hamnar i
 *  samma admin-inkorg som offertförfrågningar (/admin). Kunden får ett
 *  bekräftelsemejl och admin en notis (via Resend). Vill du i stället begära en
 *  offert med filuppladdning och digital signering – se /offert.
 * ───────────────────────────────────────────────────────────────────────────
 */

const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: site.name,
  url: `${site.url}/kontakt/`,
  telephone: site.phone,
  email: site.email,
  priceRange: site.priceRange,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.zip,
    addressLocality: site.address.city,
    addressCountry: "SE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  areaServed: site.serviceArea,
  openingHours: site.openingHoursSchema,
};

export default function KontaktPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kontakt"
        title="Få en kostnadsfri offert"
        intro="Berätta om din fastighet och dina mål så återkommer vi för att boka ett besök. Du är förstås även välkommen att ringa eller mejla oss direkt."
        crumbs={[
          { label: "Hem", href: "/" },
          { label: "Kontakt" },
        ]}
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        {/* Formulär (postar till /api/quote-requests, source="kontakt") */}
        <div>
          <h2 className="text-2xl font-bold text-brand-deep">Skicka en förfrågan</h2>
          <p className="mt-2 text-muted">
            Fält markerade med <span aria-hidden="true">*</span> är obligatoriska. Vill du bifoga
            ritningar och signera digitalt?{" "}
            <a className="font-medium text-brand-2 underline underline-offset-2" href="/offert/">
              Begär offert här
            </a>
            .
          </p>

          <KontaktForm />
        </div>

        {/* Kontaktuppgifter + karta */}
        <div>
          <h2 className="text-2xl font-bold text-brand-deep">Hitta hit & kontaktuppgifter</h2>
          <dl className="mt-6 space-y-4">
            <div>
              <dt className="font-medium text-brand-deep">Adress</dt>
              <dd className="text-muted">{fullAddress()}</dd>
            </div>
            <div>
              <dt className="font-medium text-brand-deep">Telefon</dt>
              <dd>
                <a className="text-brand-2 underline underline-offset-2" href={site.phoneHref}>
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-brand-deep">E-post</dt>
              <dd>
                <a className="text-brand-2 underline underline-offset-2" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-brand-deep">Öppettider</dt>
              <dd className="text-muted">{site.hours.weekdays}</dd>
              <dd className="text-muted">{site.hours.saturday}</dd>
              <dd className="text-sm text-muted">{site.hours.note}</dd>
            </div>
            <div>
              <dt className="font-medium text-brand-deep">Område</dt>
              <dd className="text-muted">Vi är verksamma i {site.serviceArea}.</dd>
            </div>
          </dl>

          {site.googleBusinessProfile && (
            <p className="mt-4 text-sm text-muted">
              Hitta oss på{" "}
              <a
                className="font-medium text-brand-2 underline underline-offset-2"
                href={site.googleBusinessProfile}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Företagsprofil
              </a>{" "}
              – lämna gärna ett omdöme!
            </p>
          )}

          {/* Karta – bädda in via site.mapEmbedSrc */}
          <div className="mt-8 overflow-hidden rounded-card border border-border">
            {site.mapEmbedSrc ? (
              <iframe
                src={site.mapEmbedSrc}
                title={`Karta till ${site.name}`}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            ) : (
              <div className="flex h-80 items-center justify-center bg-brand-soft p-6 text-center text-sm text-muted">
                Karta visas här när <code className="mx-1">site.mapEmbedSrc</code> fyllts i
                (Google Maps → Dela → Bädda in en karta).
              </div>
            )}
          </div>
        </div>
      </section>

      <JsonLd data={localBusinessLd} />
    </>
  );
}
