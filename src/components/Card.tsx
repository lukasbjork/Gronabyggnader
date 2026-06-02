import type { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
  /** Valfri ikon/emoji eller liten markör ovanför titeln. */
  icon?: ReactNode;
  className?: string;
};

/**
 * Återanvändbart innehållskort – används för USP:er, tjänster m.m.
 */
export default function Card({ title, children, icon, className = "" }: CardProps) {
  return (
    <article
      className={`card-hover flex h-full flex-col rounded-card border border-border bg-surface p-6 shadow-sm hover:shadow-md ${className}`.trim()}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-2xl text-brand-deep"
        >
          {icon}
        </span>
      )}
      <h3 className="text-lg font-semibold text-brand-deep">{title}</h3>
      <div className="mt-2 text-muted">{children}</div>
    </article>
  );
}
