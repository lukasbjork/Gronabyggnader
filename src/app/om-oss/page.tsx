import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/CTASection";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/config/site";
import { team, certifications } from "@/lib/content";

export const metadata: Metadata = {
  title: "Om oss – byggföretaget med energi i fokus",
  description:
    `${site.name} är byggföretaget i ${site.city} som förlänger fastigheters livslängd och sänker energiförbrukningen. Läs om vår vision, vårt team och våra garantier.`,
  alternates: { canonical: "/om-oss/" },
};

export default function OmOssPage() {
  return (
    <>
      <PageHeader
        eyebrow="Om oss"
        title="Byggföretaget med energi i fokus"
        intro={`${site.name} startades med en enkel övertygelse: en renovering ska inte bara vara snygg, den ska göra fastigheten bättre att äga – år efter år.`}
        crumbs={[
          { label: "Hem", href: "/" },
          { label: "Om oss" },
        ]}
      />

      {/* Vision / historia */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-deep">Vår vision: förläng fastigheternas livslängd</h2>
        <div className="mt-4 space-y-4 text-muted">
          <p>
            Byggmarknaden är full av ROT- och byggfirmor. Vi valde en annan väg. Vi ser oss inte
            som ännu en entreprenör som byter ytskikt, utan som en partner som hjälper
            fastighetsägare att sänka sina driftkostnader, höja värdet och minska klimatavtrycket.
          </p>
          <p>
            Varje byggnad har en livslängd – och rätt underhåll förlänger den. När vi renoverar
            tänker vi därför alltid ett steg längre: hur kan den här insatsen också göra
            byggnaden tätare, varmare och billigare att värma? Det är skillnaden mellan att laga
            ett symptom och att investera i fastighetens framtid.
          </p>
          <p>
            Vi tror på expertis och trovärdighet framför att vara billigast. Premium, men
            jordnära. Tydliga kalkyler, ärliga råd om vad som lönar sig – och hantverk som håller.
          </p>
        </div>

        {/* Värderingar */}
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { icon: "🌱", title: "Långsiktighet", text: "Vi bygger för åren som kommer, inte bara för stunden." },
            { icon: "🔍", title: "Transparens", text: "Tydliga offerter och ärliga råd – även när svaret är ‘vänta’." },
            { icon: "🛡️", title: "Kvalitet", text: "Fackmässigt arbete, försäkringar och garantier i botten." },
          ].map((v) => (
            <div key={v.title} className="rounded-card border border-border bg-surface p-6">
              <span aria-hidden="true" className="text-2xl">{v.icon}</span>
              <h3 className="mt-3 font-semibold text-brand-deep">{v.title}</h3>
              <p className="mt-1 text-sm text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-brand-soft">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Teamet"
            title="Människorna bakom Gröna Byggnader"
            intro="Vi är hantverkare och rådgivare som brinner för att göra fastigheter bättre att äga. (Platshållare – fyll i riktiga namn och presentationer.)"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.role} className="rounded-card border border-border bg-surface p-6 text-center">
                <div
                  aria-hidden="true"
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white"
                >
                  {member.name.replace(/[[\]]/g, "").trim().charAt(0) || "·"}
                </div>
                <h3 className="mt-4 font-semibold text-brand-deep">{member.name}</h3>
                <p className="text-sm font-medium text-brand-2">{member.role}</p>
                <p className="mt-2 text-sm text-muted">{member.bio}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Lägg gärna in foton på teamet i <code className="rounded bg-white px-1.5 py-0.5">/public/images/</code> för ökad trovärdighet.
          </p>
        </div>
      </section>

      {/* Certifieringar & garantier */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Trygghet"
          title="Certifieringar, garantier & försäkringar"
          intro="Platshållare – byt mot era riktiga behörigheter, medlemskap och försäkringar."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((c) => (
            <div key={c.title} className="rounded-card border border-border bg-surface p-6">
              <span aria-hidden="true" className="text-2xl">{c.icon}</span>
              <h3 className="mt-3 font-semibold text-brand-deep">{c.title}</h3>
              <p className="mt-1 text-sm text-muted">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        title="Vill du veta hur vi kan hjälpa just din fastighet?"
        text="Boka ett förutsättningslöst möte. Vi lyssnar, tittar på fastigheten och ger ärliga råd om vad som lönar sig."
      />
    </>
  );
}
