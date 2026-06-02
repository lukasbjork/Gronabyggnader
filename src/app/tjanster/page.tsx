import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/CTASection";
import { site } from "@/config/site";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tjänster – energieffektivisering & ROT-renovering",
  description:
    `Våra tjänster i ${site.city}: energieffektivisering, tilläggsisolering, fönsterbyte, fasad- och takrenovering, värmepump och ROT-renovering. Lägre driftkostnad med ROT-avdrag.`,
  alternates: { canonical: "/tjanster/" },
};

export default function TjansterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tjänster"
        title="Energieffektiv renovering – från idé till mätbart resultat"
        intro="Vi tar ett samlat grepp om din fastighet. Här är tjänsterna vi erbjuder – ofta lönar det sig mest att kombinera flera i samma projekt, med ROT-avdraget inräknat."
        crumbs={[
          { label: "Hem", href: "/" },
          { label: "Tjänster" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.slug}
              className="card-hover flex h-full flex-col rounded-card border border-border bg-surface p-7 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-3xl text-brand-deep"
                >
                  {service.icon}
                </span>
                <h2 className="text-xl font-semibold text-brand-deep">{service.title}</h2>
              </div>
              <p className="mt-4 text-muted">{service.tagline}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted">
                {service.includes.slice(0, 3).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-0.5 text-brand-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/tjanster/${service.slug}/`}
                className="mt-6 inline-flex items-center font-semibold text-brand-2 underline-offset-4 hover:underline"
              >
                Läs mer om {service.shortTitle.toLowerCase()} →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-card border border-border bg-brand-soft p-8 text-center">
          <h2 className="text-xl font-semibold text-brand-deep">Osäker på var du ska börja?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted">
            Det vanligaste – och klokaste – första steget är en energikartläggning. Då ser vi
            var energin försvinner och vilka åtgärder som ger mest tillbaka per krona.
          </p>
          <Link
            href="/kontakt/"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-deep focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-deep"
          >
            Boka kostnadsfri bedömning
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
