/**
 * ───────────────────────────────────────────────────────────────────────────
 *  CENTRALA FÖRETAGSUPPGIFTER — FYLL I HÄR
 * ───────────────────────────────────────────────────────────────────────────
 *  Detta är ENDA stället du behöver redigera för att uppdatera namn, ort, adress,
 *  telefon, e-post, org.nr, öppettider och domän. Allt på sajten (header, footer,
 *  kontaktsida, SEO-taggar, sitemap och structured data) hämtar sina värden härifrån.
 *
 *  👉 Sök efter "[" för att hitta alla platshållare som ska ersättas med riktiga uppgifter.
 * ───────────────────────────────────────────────────────────────────────────
 */

export const site = {
  // Företagsnamn — visas i header, footer, titlar och SEO.
  name: "Gröna Byggnader",

  // Kort slogan/undertitel — visas bl.a. i hero och footer.
  tagline: "Vi förlänger fastigheters livslängd och sänker energiförbrukningen",

  // Ort / primärt serviceområde — används i SEO-titlar och rubriker
  // (t.ex. "Byggföretag i Stockholm"). Enkelt att byta om ni expanderar.
  city: "Stockholm",

  // Vidare geografiskt område ni betjänar (visas i texter och structured data).
  serviceArea: "Stockholm med omnejd",

  // Produktions-URL — används för SEO/canonical, OpenGraph och sitemap.
  // ⚠️ Måste vara en giltig URL. Byt till er riktiga domän när den är klar.
  url: "https://gronabyggnader.se",

  // Kontaktuppgifter
  phone: "[TELEFONNUMMER]", // t.ex. "08-123 45 67"
  phoneHref: "tel:+46812345678", // ⚠️ internationellt format för klickbar länk
  email: "[E-POST]", // t.ex. "info@gronabyggnader.se"

  // Besöksadress
  address: {
    street: "[GATUADRESS]", // t.ex. "Fastighetsvägen 12"
    zip: "[POSTNUMMER]", // t.ex. "111 22"
    city: "Stockholm",
  },

  // Geokoordinater för LocalBusiness-schema (hjälper lokal SEO / kartor).
  // Hämta via Google Maps → högerklicka på adressen → kopiera lat,long.
  geo: {
    lat: "[LATITUD]", // t.ex. "59.3293"
    lng: "[LONGITUD]", // t.ex. "18.0686"
  },

  // Organisationsnummer (visas i footer/integritetspolicy och structured data)
  orgNumber: "[ORG.NR]",

  // Prisklass (visas i LocalBusiness-schema). "$$" = mellanklass, "$$$" = premium.
  priceRange: "$$$",

  // Google Maps-inbäddning för kontaktsidan.
  // Hämta din egen via Google Maps → Dela → Bädda in en karta → kopiera src-URL:en.
  mapEmbedSrc: "",

  // Öppettider
  hours: {
    weekdays: "Mån–Fre 07–17",
    saturday: "Lör – stängt (besök efter överenskommelse)",
    note: "Akut? Ring oss så återkommer vi snarast under kontorstid.",
  },

  // Öppettider i schema.org-format (för LocalBusiness JSON-LD). Justera om era tider ändras.
  openingHoursSchema: ["Mo-Fr 07:00-17:00"],

  // Sociala länkar (lämna tomt "" om de inte används – då döljs de automatiskt)
  social: {
    linkedin: "", // t.ex. "https://linkedin.com/company/gronabyggnader"
    instagram: "",
    facebook: "",
  },

  // Google Företagsprofil — länk till er profil när den är skapad (visas på kontaktsidan).
  googleBusinessProfile: "", // t.ex. "https://g.page/gronabyggnader"
} as const;

/** Huvudnavigation — används av Header och Footer. */
export const nav = [
  { href: "/", label: "Hem" },
  { href: "/tjanster/", label: "Tjänster" },
  { href: "/rot-avdrag/", label: "ROT-avdrag" },
  { href: "/projekt/", label: "Projekt" },
  { href: "/om-oss/", label: "Om oss" },
  { href: "/blogg/", label: "Blogg" },
  { href: "/vanliga-fragor/", label: "Vanliga frågor" },
  { href: "/kontakt/", label: "Kontakt" },
] as const;

/** Hjälp: hela adressen som en rad. */
export function fullAddress() {
  const { street, zip, city } = site.address;
  return `${street}, ${zip} ${city}`;
}

/** Hjälp: lista över ifyllda sociala länkar (filtrerar bort tomma). */
export function socialLinks() {
  return Object.entries(site.social)
    .filter(([, url]) => url)
    .map(([platform, url]) => ({ platform, url }));
}
