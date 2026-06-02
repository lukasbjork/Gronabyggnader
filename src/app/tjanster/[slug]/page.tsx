import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import Faq from "@/components/Faq";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { site } from "@/config/site";
import { services, getService } from "@/lib/content";

// Genererar en statisk sida per tjänst vid build.
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    // absolute = hoppa över layoutens "%s | Gröna Byggnader"-mall, eftersom
    // metaTitle redan innehåller varumärket (annars dubbleras det).
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    alternates: { canonical: `/tjanster/${service.slug}/` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `/tjanster/${service.slug}/`,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.related
    .map((slug) => getService(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.shortTitle,
    description: service.metaDescription,
    url: `${site.url}/tjanster/${service.slug}/`,
    areaServed: site.serviceArea,
    provider: {
      "@type": "GeneralContractor",
      name: site.name,
      url: site.url,
      telephone: site.phone,
    },
  };

  return (
    <>
      {/* Hero */}
      <header className="border-b border-border bg-gradient-to-b from-brand-soft to-background">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs
            items={[
              { label: "Hem", href: "/" },
              { label: "Tjänster", href: "/tjanster/" },
              { label: service.shortTitle },
            ]}
          />
          <div className="mt-6 flex items-start gap-4">
            <span
              aria-hidden="true"
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface text-3xl text-brand-deep shadow-sm"
            >
              {service.icon}
            </span>
            <div>
              <h1 className="text-3xl font-bold text-brand-deep sm:text-4xl">{service.title}</h1>
              <p className="mt-3 text-lg text-muted">{service.tagline}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/kontakt/">Få offert</Button>
            <Button href="/rot-avdrag/" variant="secondary">
              Läs om ROT-avdraget
            </Button>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        {/* Intro */}
        <p className="text-lg text-foreground">{service.intro}</p>

        {/* Problem */}
        <div className="mt-10 rounded-card border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-brand-deep">Utmaningen vi löser</h2>
          <p className="mt-3 text-muted">{service.problem}</p>
        </div>

        {/* Nyttor (siffror) */}
        <h2 className="mt-12 text-2xl font-bold text-brand-deep">Vad du får ut av det</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {service.benefits.map((b) => (
            <div key={b.label} className="rounded-card border border-border bg-brand-soft p-6">
              <p className="text-2xl font-bold text-brand">{b.stat}</p>
              <p className="mt-1 font-semibold text-brand-deep">{b.label}</p>
              <p className="mt-2 text-sm text-muted">{b.description}</p>
            </div>
          ))}
        </div>

        {/* Så jobbar vi */}
        <h2 className="mt-12 text-2xl font-bold text-brand-deep">Så jobbar vi</h2>
        <ol className="mt-6 space-y-4">
          {service.approach.map((step, i) => (
            <li key={step} className="flex items-start gap-4 rounded-card border border-border bg-surface p-5">
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
              >
                {i + 1}
              </span>
              <span className="text-foreground">{step}</span>
            </li>
          ))}
        </ol>

        {/* Vad som ingår */}
        <h2 className="mt-12 text-2xl font-bold text-brand-deep">Det här ingår</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {service.includes.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl bg-brand-soft p-4">
              <span aria-hidden="true" className="mt-0.5 text-brand-2">✓</span>
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>

        {/* ROT-notis */}
        <div className="mt-12 rounded-card border border-accent/40 bg-brand-soft p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-brand-deep">ROT-avdrag på {service.shortTitle.toLowerCase()}</h2>
          <p className="mt-3 text-muted">
            Arbetskostnaden för den här typen av åtgärd är normalt ROT-berättigad. Vi drar av
            30 % direkt på fakturan och sköter administrationen mot Skatteverket.{" "}
            <Link href="/rot-avdrag/" className="font-medium text-brand-2 underline underline-offset-2">
              Läs mer om hur ROT-avdraget fungerar hos oss
            </Link>
            .
          </p>
        </div>

        {/* Tjänstespecifik FAQ */}
        {service.faqs.length > 0 && (
          <>
            <h2 className="mt-12 text-2xl font-bold text-brand-deep">Vanliga frågor</h2>
            <div className="mt-6">
              <Faq items={service.faqs} />
            </div>
          </>
        )}

        {/* Relaterade tjänster */}
        {related.length > 0 && (
          <>
            <h2 className="mt-12 text-2xl font-bold text-brand-deep">Relaterade tjänster</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/tjanster/${r.slug}/`}
                  className="card-hover flex items-center gap-3 rounded-card border border-border bg-surface p-4 shadow-sm hover:shadow-md"
                >
                  <span aria-hidden="true" className="text-2xl">{r.icon}</span>
                  <span className="font-semibold text-brand-deep">{r.shortTitle}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </article>

      <CTASection
        title={`Redo att komma igång med ${service.shortTitle.toLowerCase()}?`}
        text="Boka en kostnadsfri bedömning så går vi igenom dina förutsättningar och tar fram en tydlig offert – med ROT-avdraget inräknat."
      />

      <JsonLd data={serviceLd} />
    </>
  );
}
