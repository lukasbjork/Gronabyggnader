# Gröna Byggnader – hemsida

Produktionsfärdig, SEO-optimerad hemsida för byggföretaget **Gröna Byggnader**
(energieffektivisering & ROT-renovering i Stockholm). Byggd med **Next.js 16
(App Router)** som **statisk export** + **Tailwind CSS v4**. Snabb, mobilanpassad
och tillgänglig (WCAG 2.1 AA). Kontaktformuläret använder **Netlify Forms** – ingen
egen backend krävs.

## Kom igång

```bash
npm install
npm run dev      # http://localhost:3000
```

## Bygga & förhandsgranska

```bash
npm run build    # genererar statisk sajt i ./out
npm run preview  # serverar ./out lokalt med "serve"
npm run lint     # ESLint (ska vara grönt)
```

## ⚙️ Var du fyller i dina egna uppgifter

Sajten fungerar direkt, men byt ut platshållarna innan lansering. **Sök i koden
efter `[`** för att hitta alla platshållare.

- **`src/config/site.ts`** – ENDA stället för företagsnamn, ort, adress, telefon
  (`phone` + `phoneHref` i internationellt format), e-post, org.nr, geokoordinater,
  öppettider, domän-URL, Google Maps-inbäddning, sociala länkar och länk till
  Google Företagsprofil.
- **`src/lib/content.ts`** – tjänster, USP:er, trust-siffror (`stats`),
  referensprojekt, FAQ, certifieringar/garantier och team. Justera siffror och
  texter så att de stämmer för er verksamhet.
- **`src/content/blog/*.md`** – bloggartiklar (Markdown med frontmatter). Lägg till
  en ny `.md`-fil = nytt inlägg. Lästid räknas ut automatiskt.
- **`public/`** – byt ut platshållarbilderna (se `public/README.md`). Kom ihåg
  beskrivande alt-texter.

### Checklista innan lansering

- [ ] **`src/config/site.ts`** – namn, adress, telefon, e-post, org.nr, geo, org.nr.
- [ ] **`site.url`** – är satt till `https://gronabyggnader.se` (byt om domänen ändras;
      används för canonical, OpenGraph och sitemap).
- [ ] **`site.mapEmbedSrc`** – klistra in Google Maps-inbäddning (Maps → Dela → Bädda
      in en karta). Tills dess visas en platshållarruta på kontaktsidan.
- [ ] **`src/lib/content.ts`** – byt platshållare i `stats`, `projects`,
      `certifications` och `team` mot riktiga uppgifter.
- [ ] **`public/images/og-default.svg`** – ersätt med en riktig **1200×630 JPG/PNG**
      för social delning (SVG visas inte som delningsbild på alla plattformar).
- [ ] **`public/projekt/` & `public/blog/`** – byt platshållar-SVG:er mot riktiga foton.
- [ ] **`src/app/integritetspolicy/page.tsx`** – låt en jurist granska och fyll i
      lagringstider och datum.
- [ ] Kontrollera ROT-belopp/procentsats hos Skatteverket (kan ändras mellan år).
- [ ] Kör `npm run build` och `npm run lint` – ska vara grönt – och klicka igenom sidorna.

## Deploy till Netlify

Koden ligger på `https://github.com/lukasbjork/Gronabyggnader`.

1. I Netlify: **Add new site → Import an existing project → GitHub** → välj repot
   `lukasbjork/Gronabyggnader`. Build-kommandot (`npm run build`) och publish-mappen
   (`out`) läses automatiskt från `netlify.toml`. Klicka **Deploy**.
2. **Continuous deploy:** varje `git push` till `main` bygger om sajten automatiskt.
3. **Netlify Forms** aktiveras automatiskt tack vare `data-netlify`-attributet på
   kontaktformuläret. Inskick syns under *Forms* i Netlify-dashboarden – ställ in
   e-postavisering där.

> Statisk sajt utan hemligheter: ingen `.env` krävs för att köra eller deploya. Se
> `.env.example` om du senare lägger till t.ex. analytics.

## Sidor & SEO

**Sidor:** Hem · Tjänster (översikt + 7 tjänstesidor) · ROT-avdrag (pillar) · Projekt ·
Om oss · Blogg (+ 5 artiklar) · Vanliga frågor · Kontakt · Integritetspolicy
(+ tack-sida och egen 404).

**SEO som ingår:** semantisk HTML med en `<h1>` per sida · unika title/description
per sida · Open Graph + Twitter Cards · canonical · auto-genererad `sitemap.xml`
och `robots.txt` · `lang="sv-SE"` · rena URL:er med bindestreck · intern länkning ·
self-hosted typsnitt (Sora + Inter via `next/font`) · strukturerad data (JSON-LD):
`Organization`, `GeneralContractor` (LocalBusiness), `Service`, `FAQPage`,
`BlogPosting` och `BreadcrumbList`.

## Teknik

| | |
| --- | --- |
| Ramverk | Next.js 16 (App Router, `output: "export"`) |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` (blogg) |
| Typsnitt | Sora (rubriker) + Inter (brödtext), self-hosted via `next/font` |
| Blogg | Markdown i `src/content/blog/` (`gray-matter` + `marked`) |
| Formulär | Netlify Forms (honeypot mot spam) |
| Hosting | Netlify (statisk export i `out/`) |

## Projektstruktur

```
src/
  app/            # sidor (App Router), layout, sitemap, robots, ikon, 404
  components/     # återanvändbara komponenter (Header, Footer, Card, Faq …)
  config/site.ts  # ⚙️ alla företagsuppgifter
  lib/
    content.ts    # tjänster, USP, projekt, FAQ, team, certifieringar
    blog.ts       # läser/renderar bloggartiklar + lästid
  content/blog/   # bloggartiklar (.md)
public/           # bilder och statiska assets (platshållare)
```
