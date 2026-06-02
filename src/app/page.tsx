import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Stats from "@/components/Stats";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { fullAddress, site } from "@/config/site";
import { services, usps, stats, projects } from "@/lib/content";

// Lokal SEO: GeneralContractor (en typ av LocalBusiness) på startsidan.
const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": `${site.url}/#organization`,
  name: site.name,
  description: site.tagline,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  image: `${site.url}/images/og-default.png`,
  logo: `${site.url}/images/logo.svg`,
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
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "07:00",
    closes: "17:00",
  },
  makesOffer: services.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.title, url: `${site.url}/tjanster/${s.slug}/` },
  })),
};

// PLATSHÅLLARE – byt mot riktiga, verifierbara kundomdömen (gärna med tillstånd).
const testimonials = [
  {
    quote:
      "De såg helheten i stället för att bara byta det vi frågade om. Resultatet blev lägre värmekostnad och ett betydligt behagligare hus.",
    name: "[Kundnamn]",
    role: "Villaägare, [Ort]",
  },
  {
    quote:
      "Tydlig offert med ROT inräknat från start och inga överraskningar på vägen. Proffsigt från första mötet till slutbesiktning.",
    name: "[Kundnamn]",
    role: "Styrelseordförande, BRF [Namn]",
  },
  {
    quote:
      "Äntligen en byggfirma som kan prata energi och ekonomi i samma mening. Vi höjde energiklassen och sänkte driften.",
    name: "[Kundnamn]",
    role: "Fastighetsägare, [Ort]",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-soft to-background">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-sm font-semibold text-brand-2 shadow-sm">
              <span aria-hidden="true">🌱</span> Byggföretag i {site.city} med fokus på energi
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-brand-deep sm:text-5xl">
              Vi förlänger fastigheters livslängd – och sänker energiförbrukningen
            </h1>
            <p className="mt-5 text-lg text-muted">
              {site.name} är inte bara ett byggbolag. Vi är din partner för energieffektiv
              ROT-renovering i {site.city}: lägre driftkostnad, högre fastighetsvärde och ett
              bättre inomhusklimat – med ROT-avdraget inräknat.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/kontakt/">Få kostnadsfri offert</Button>
              <Button href="/tjanster/" variant="secondary">
                Se våra tjänster
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted">
              30 % ROT-avdrag på arbetskostnaden · Kostnadsfri första bedömning ·
              Verksamma i {site.serviceArea}
            </p>
          </div>

          {/* Highlight-kort */}
          <div className="rounded-card border border-border bg-surface p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-brand-deep">
              Därför lönar sig energirenovering
            </h2>
            <ul className="mt-5 space-y-4">
              {[
                { icon: "💰", title: "Lägre driftkostnad", text: "Mindre köpt energi år efter år – pengar tillbaka i fickan." },
                { icon: "📈", title: "Högre fastighetsvärde", text: "Bättre energiklass och skick gör fastigheten mer värd." },
                { icon: "🌡️", title: "Bättre inomhusklimat", text: "Jämnare värme, mindre drag och friskare luft." },
                { icon: "🌍", title: "Minskat klimatavtryck", text: "Lägre energiförbrukning är bra för både plånbok och planet." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span aria-hidden="true" className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Varför välja oss */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Varför välja oss"
          title="En partner för fastighetens hela livslängd"
          intro="Vi kombinerar gediget hantverk med energikunnande. Det betyder att din investering inte bara blir snygg – den fortsätter ge värde i form av lägre kostnader och bättre komfort i många år."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {usps.map((usp) => (
            <Card key={usp.title} title={usp.title} icon={usp.icon}>
              {usp.description}
            </Card>
          ))}
        </div>
      </section>

      {/* Tjänster */}
      <section className="bg-brand-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Tjänster"
              title="Vad vi hjälper dig med"
              intro="Från enskilda energiåtgärder till totalrenovering – ofta lönar det sig att kombinera flera insatser i samma projekt."
            />
            <Link
              href="/tjanster/"
              className="font-semibold text-brand-2 underline underline-offset-4 hover:text-brand-deep"
            >
              Se alla tjänster →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/tjanster/${service.slug}/`}
                className="card-hover group flex h-full flex-col rounded-card border border-border bg-surface p-6 shadow-sm hover:shadow-md focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-2"
              >
                <span
                  aria-hidden="true"
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-2xl text-brand-deep"
                >
                  {service.icon}
                </span>
                <h3 className="text-lg font-semibold text-brand-deep group-hover:text-brand-2">
                  {service.shortTitle}
                </h3>
                <p className="mt-2 flex-1 text-muted">{service.tagline}</p>
                <span className="mt-4 font-semibold text-brand-2">Läs mer →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust-siffror */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Stats items={stats} />
        <p className="mt-3 text-center text-xs text-muted">
          * Besparing varierar med fastighetens utgångsläge och valda åtgärder. Siffror är typiska spann, inte garantier.
        </p>
      </section>

      {/* Utvalda projekt */}
      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Projekt"
            title="Utvalda referensprojekt"
            intro="Verkliga exempel på hur rätt åtgärd löste ett problem och gav mätbart resultat."
          />
          <Link
            href="/projekt/"
            className="font-semibold text-brand-2 underline underline-offset-4 hover:text-brand-deep"
          >
            Se alla projekt →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* ROT-avsnitt */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 rounded-card border border-border bg-surface p-8 shadow-sm sm:p-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-2">ROT-avdrag</p>
            <h2 className="mt-3 text-2xl font-bold text-brand-deep sm:text-3xl">
              Du betalar bara 70 % av arbetskostnaden
            </h2>
            <p className="mt-4 text-muted">
              ROT-avdraget ger 30 % skattereduktion på arbetskostnaden vid renovering och
              ombyggnad – upp till 50 000 kr per person och år. Vi drar av ROT direkt på
              fakturan, så att du slipper ligga ute med pengarna och hantera Skatteverket själv.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button href="/rot-avdrag/">Så fungerar ROT-avdraget</Button>
              <Button href="/kontakt/" variant="ghost">
                Få en offert med ROT inräknat
              </Button>
            </div>
          </div>
          <ul className="space-y-4">
            {[
              "30 % avdrag på arbetskostnaden – direkt på fakturan",
              "Upp till 50 000 kr per person och år",
              "Gäller energiåtgärder som isolering, fönsterbyte och värmepump",
              "Vi sköter all administration mot Skatteverket",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 rounded-xl bg-brand-soft p-4">
                <span aria-hidden="true" className="mt-0.5 text-brand-2">✓</span>
                <span className="text-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading
            eyebrow="Vad kunderna säger"
            title="Förtroende byggt projekt för projekt"
            centered
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name + t.role}
                className="flex h-full flex-col rounded-card border border-border bg-surface p-6 shadow-sm"
              >
                <span aria-hidden="true" className="text-3xl text-accent">“</span>
                <blockquote className="flex-1 text-foreground">{t.quote}</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-brand-deep">{t.name}</span>
                  <span className="block text-muted">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted">
            Platshållare – byt till riktiga kundomdömen. {fullAddress()}.
          </p>
        </div>
      </section>

      <CTASection />
      <JsonLd data={localBusinessLd} />
    </>
  );
}
