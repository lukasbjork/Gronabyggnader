import type { Stat } from "@/lib/content";

/** Trust-siffror i ett band. Värdena är platshållare – byt i src/lib/content.ts. */
export default function Stats({ items }: { items: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border lg:grid-cols-4">
      {items.map((stat) => (
        <div key={stat.label} className="bg-surface p-6 text-center">
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <span className="block text-2xl font-bold text-brand sm:text-3xl">{stat.value}</span>
            <span className="mt-1 block text-sm text-muted">{stat.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
