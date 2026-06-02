import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import { fullAddress, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Kontakt & kostnadsfri offert",
  description:
    `Kontakta ${site.name} i ${site.city} för en kostnadsfri offert. Fyll i formuläret med din fastighetstyp så återkommer vi med en plan för lägre driftkostnad.`,
  alternates: { canonical: "/kontakt/" },
};

/*
 * ───────────────────────────────────────────────────────────────────────────
 *  OM FORMULÄRET (Netlify Forms)
 * ───────────────────────────────────────────────────────────────────────────
 *  Formuläret använder Netlify Forms och skickar inskick till Netlify-dashboarden
 *  + e-post (ingen egen backend krävs). Det är en OFFERTFÖRFRÅGAN – ni återkommer
 *  manuellt. Forms aktiveras automatiskt tack vare data-netlify-attributet.
 *  Ställ in e-postavisering under "Forms" i Netlify-dashboarden.
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

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-2";

const propertyTypes = [
  "Villa / radhus",
  "Bostadsrätt",
  "Bostadsrättsförening (BRF)",
  "Flerbostadshus / hyresfastighet",
  "Kommersiell fastighet",
  "Annat / vet inte",
];

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
        {/* Formulär (Netlify Forms) */}
        <div>
          <h2 className="text-2xl font-bold text-brand-deep">Skicka en förfrågan</h2>
          <p className="mt-2 text-muted">
            Fält markerade med <span aria-hidden="true">*</span> är obligatoriska.
          </p>

          <form
            name="offert"
            method="POST"
            action="/tack/"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="mt-6 space-y-5"
          >
            {/* Krävs av Netlify Forms för att koppla inskick till rätt formulär */}
            <input type="hidden" name="form-name" value="offert" />
            {/* Honeypot – dolt för människor, fångar bottar */}
            <p className="hidden">
              <label>
                Fyll inte i detta fält: <input name="bot-field" />
              </label>
            </p>

            <div>
              <label htmlFor="namn" className="block font-medium text-brand-deep">
                Namn <span aria-hidden="true">*</span>
              </label>
              <input id="namn" name="namn" type="text" required autoComplete="name" className={inputClass} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="epost" className="block font-medium text-brand-deep">
                  E-post <span aria-hidden="true">*</span>
                </label>
                <input id="epost" name="epost" type="email" required autoComplete="email" className={inputClass} />
              </div>
              <div>
                <label htmlFor="telefon" className="block font-medium text-brand-deep">
                  Telefon <span aria-hidden="true">*</span>
                </label>
                <input id="telefon" name="telefon" type="tel" required autoComplete="tel" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="fastighetstyp" className="block font-medium text-brand-deep">
                Fastighetstyp <span aria-hidden="true">*</span>
              </label>
              <select id="fastighetstyp" name="fastighetstyp" required defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Välj fastighetstyp …
                </option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="meddelande" className="block font-medium text-brand-deep">
                Berätta om ditt projekt <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="meddelande"
                name="meddelande"
                rows={5}
                required
                placeholder="T.ex. höga uppvärmningskostnader, drag från fönster, gammal panna eller en fasad som behöver ses över."
                className={inputClass}
              />
            </div>

            <p className="text-sm text-muted">
              Genom att skicka godkänner du att vi behandlar dina uppgifter enligt vår{" "}
              <a className="font-medium text-brand-2 underline underline-offset-2" href="/integritetspolicy/">
                integritetspolicy
              </a>
              .
            </p>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-deep focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-deep"
            >
              Skicka förfrågan
            </button>
          </form>
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
