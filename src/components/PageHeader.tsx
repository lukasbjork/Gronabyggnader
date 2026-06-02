import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";

type PageHeaderProps = {
  title: string;
  intro?: ReactNode;
  /** Liten etikett ovanför rubriken (t.ex. "Tjänst" eller kategori). */
  eyebrow?: string;
  /** Brödsmulor som visas ovanför rubriken. */
  crumbs?: Crumb[];
};

/** Återanvändbar sidrubrik för undersidor (rubrik + ingress på mjuk grön bakgrund). */
export default function PageHeader({ title, intro, eyebrow, crumbs }: PageHeaderProps) {
  return (
    <header className="border-b border-border bg-gradient-to-b from-brand-soft to-background">
      <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
        {crumbs && (
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-2">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold text-brand-deep sm:text-4xl">{title}</h1>
        {intro && <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{intro}</p>}
      </div>
    </header>
  );
}
