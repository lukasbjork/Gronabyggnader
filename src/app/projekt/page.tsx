import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import CTASection from "@/components/CTASection";
import { site } from "@/config/site";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projekt & referenser",
  description:
    `Referensprojekt från ${site.city}: energieffektivisering, isolering, fönsterbyte, fasad, tak och värmepump. Problem, åtgärd och resultat – med mätbar besparing.`,
  alternates: { canonical: "/projekt/" },
};

export default function ProjektPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projekt"
        title="Referensprojekt med mätbart resultat"
        intro="Ett urval av projekt vi genomfört. Vi visar utmaningen, vad vi gjorde och vilket resultat det gav – för det är effekten som räknas, inte bara hantverket."
        crumbs={[
          { label: "Hem", href: "/" },
          { label: "Projekt" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          Projekten ovan är platshållare. Byt ut texter och bilder i
          <code className="mx-1 rounded bg-brand-soft px-1.5 py-0.5 text-brand-deep">src/lib/content.ts</code>
          mot era riktiga referensprojekt.
        </p>
      </section>

      <CTASection
        title="Vill du att din fastighet blir nästa referensprojekt?"
        text="Berätta om dina utmaningar så föreslår vi rätt åtgärder – och visar vilken besparing du kan förvänta dig."
      />
    </>
  );
}
