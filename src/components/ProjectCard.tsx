import Image from "next/image";
import type { Project } from "@/lib/content";

/**
 * Projektkort: problem → åtgärd → resultat. Bilden ligger i /public/projekt/
 * (platshållare ok – byt mot riktiga foton och uppdatera alt-texten i content.ts).
 */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card-hover flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-sm hover:shadow-md">
      <div className="relative aspect-[3/2] w-full bg-brand-soft">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand-deep/90 px-3 py-1 text-xs font-semibold text-white">
          {project.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-2">{project.meta}</p>
        <h3 className="mt-1 text-lg font-semibold text-brand-deep">{project.title}</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-foreground">Utmaning</dt>
            <dd className="text-muted">{project.problem}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Åtgärd</dt>
            <dd className="text-muted">{project.action}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Resultat</dt>
            <dd className="text-muted">{project.result}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
