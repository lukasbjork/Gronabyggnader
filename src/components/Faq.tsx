import type { Faq as FaqItem } from "@/lib/content";

type FaqProps = {
  items: FaqItem[];
};

/**
 * Tillgänglig FAQ-lista byggd på <details>/<summary> – fungerar med
 * tangentbord och skärmläsare helt utan JavaScript.
 */
export default function Faq({ items }: FaqProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-card border border-border bg-surface px-5 py-4 shadow-sm open:shadow-md"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-deep focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-2">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-2xl leading-none text-brand-2 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
