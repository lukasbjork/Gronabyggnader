import Link from "next/link";
import Button from "@/components/Button";
import { services } from "@/lib/content";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-2">404</p>
      <h1 className="mt-3 text-3xl font-bold text-brand-deep sm:text-4xl">
        Sidan kunde inte hittas
      </h1>
      <p className="mt-4 text-lg text-muted">
        Sidan du letar efter finns inte eller har flyttat. Kanske hittar du rätt via länkarna
        nedan, eller så hör du av dig till oss direkt.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href="/">Till startsidan</Button>
        <Button href="/kontakt/" variant="secondary">
          Kontakta oss
        </Button>
      </div>

      <div className="mt-12 w-full">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Populära sidor</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/tjanster/" className="rounded-xl border border-border bg-surface p-4 font-medium text-brand-deep hover:bg-brand-soft">
            Tjänster
          </Link>
          <Link href="/rot-avdrag/" className="rounded-xl border border-border bg-surface p-4 font-medium text-brand-deep hover:bg-brand-soft">
            ROT-avdrag
          </Link>
          {services.slice(0, 2).map((s) => (
            <Link
              key={s.slug}
              href={`/tjanster/${s.slug}/`}
              className="rounded-xl border border-border bg-surface p-4 font-medium text-brand-deep hover:bg-brand-soft"
            >
              {s.shortTitle}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
