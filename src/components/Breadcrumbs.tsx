import Link from "next/link";
import JsonLd from "./JsonLd";
import { site } from "@/config/site";

export type Crumb = {
  label: string;
  /** Utelämna href för den aktuella (sista) sidan. */
  href?: string;
};

/**
 * Tillgänglig brödsmulenavigering + BreadcrumbList JSON-LD.
 * Den sista posten markeras som aktuell sida (aria-current) och länkas inte.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Brödsmulor" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-brand-2 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-foreground">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-border">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbLd} />
    </nav>
  );
}
