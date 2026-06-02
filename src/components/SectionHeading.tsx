import type { ReactNode } from "react";

type SectionHeadingProps = {
  /** Liten etikett ovanför rubriken. */
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  /** Centrera texten (för CTA-/fokussektioner). */
  centered?: boolean;
  className?: string;
};

/** Återanvändbar sektionsrubrik (eyebrow + H2 + ingress). */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  centered = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`.trim()}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold text-brand-deep sm:text-3xl">{title}</h2>
      {intro && <p className="mt-3 text-muted">{intro}</p>}
    </div>
  );
}
