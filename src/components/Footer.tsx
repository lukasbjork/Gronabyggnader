import Link from "next/link";
import { fullAddress, site, socialLinks } from "@/config/site";
import { services } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = socialLinks();

  return (
    <footer className="mt-20 border-t border-border bg-brand-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Om / kontakt (NAP) */}
        <div>
          <h2 className="text-lg font-semibold">{site.name}</h2>
          <p className="mt-2 text-sm text-white/75">{site.tagline}.</p>
          <address className="mt-4 space-y-1 text-sm not-italic text-white/90">
            <p>{fullAddress()}</p>
            <p>
              <a className="underline-offset-2 hover:underline" href={site.phoneHref}>
                {site.phone}
              </a>
            </p>
            <p>
              <a className="underline-offset-2 hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
            <p className="text-white/70">Org.nr {site.orgNumber}</p>
          </address>
          {socials.length > 0 && (
            <ul className="mt-4 flex gap-3 text-sm">
              {socials.map((s) => (
                <li key={s.platform}>
                  <a
                    className="capitalize text-white/90 underline-offset-2 hover:underline"
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tjänster */}
        <div>
          <h2 className="text-lg font-semibold">Tjänster</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  className="text-white/90 underline-offset-2 hover:underline"
                  href={`/tjanster/${s.slug}/`}
                >
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Genvägar */}
        <div>
          <h2 className="text-lg font-semibold">Genvägar</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="text-white/90 underline-offset-2 hover:underline" href="/rot-avdrag/">ROT-avdrag</Link></li>
            <li><Link className="text-white/90 underline-offset-2 hover:underline" href="/projekt/">Projekt</Link></li>
            <li><Link className="text-white/90 underline-offset-2 hover:underline" href="/om-oss/">Om oss</Link></li>
            <li><Link className="text-white/90 underline-offset-2 hover:underline" href="/blogg/">Blogg</Link></li>
            <li><Link className="text-white/90 underline-offset-2 hover:underline" href="/vanliga-fragor/">Vanliga frågor</Link></li>
            <li><Link className="text-white/90 underline-offset-2 hover:underline" href="/kontakt/">Kontakt</Link></li>
          </ul>
        </div>

        {/* Öppettider */}
        <div>
          <h2 className="text-lg font-semibold">Öppettider</h2>
          <dl className="mt-4 space-y-1 text-sm text-white/90">
            <div className="flex justify-between gap-4">
              <dt>Vardagar</dt>
              <dd>{site.hours.weekdays}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Helg</dt>
              <dd className="text-right">Stängt</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-white/70">{site.hours.note}</p>
          <p className="mt-4 text-sm text-white/90">
            Verksamma i {site.serviceArea}.
          </p>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {site.name}. Org.nr {site.orgNumber}.
          </p>
          <p className="flex items-center gap-3">
            <Link className="underline-offset-2 hover:underline" href="/integritetspolicy/">
              Integritetspolicy
            </Link>
            <span aria-hidden="true">·</span>
            <span>Byggföretag i {site.city}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
