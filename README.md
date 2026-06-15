# Gröna Byggnader – hemsida + offert-/signeringsflöde

Produktionsfärdig, SEO-optimerad hemsida för byggföretaget **Gröna Byggnader**
(energieffektivisering & ROT-renovering i Stockholm). Byggd med **Next.js 16
(App Router)** + **Tailwind CSS v4**. Snabb, mobilanpassad och tillgänglig (WCAG 2.1 AA).

Sajten innehåller ett komplett **offert- och signeringsflöde** i fyra steg:

1. **Kund** skickar in handlingar (formulär + filuppladdning) på `/offert`.
2. **Admin** går igenom handlingarna och skapar en offert med ROT-beräkning → genererar PDF.
3. **Kund** får ett mejl med en hemlig signeringslänk tillbaka till `/offert`.
4. **Kund** granskar och signerar → signerad PDF + audit trail sparas, båda parter får mejl,
   status sätts till "bokningsbar".

> **Arkitekturändring:** sajten kördes tidigare som ren statisk export (`output: 'export'`).
> Det är **avstängt** eftersom flödet kräver serverfunktioner. Sajten körs nu på **Netlifys
> Next.js-runtime** (`@netlify/plugin-nextjs`). Marknadssidorna förrenderas/cachas fortfarande,
> så prestandan är i praktiken oförändrad.

## Teknik

| | |
| --- | --- |
| Ramverk | Next.js 16 (App Router, Netlify Next.js-runtime) |
| Databas | Supabase Postgres (RLS på, åtkomst via serverkod) |
| Fillagring | Supabase Storage (privat bucket, signerade URL:er) |
| Admin-auth | Supabase Auth (e-post/lösenord) |
| E-post | Resend |
| PDF | `@react-pdf/renderer` (offert) + `pdf-lib` (audit-sida på signerad PDF) |
| Signering | Enkel elektronisk signering via `signature_pad`, bakom en `SignatureProvider`-abstraktion (BankID kan kopplas in senare) |
| Validering | Zod (v4) |
| Styling | Tailwind CSS v4, Sora + Inter (self-hosted via `next/font`) |

## Kom igång lokalt

```bash
npm install
cp .env.example .env.local   # fyll i nycklarna nedan
npm run dev                  # http://localhost:3000
```

```bash
npm run build                # produktionsbygge
npm run start                # kör produktionsbygget lokalt
npm run lint                 # ESLint
```

## 1. Supabase-uppsättning

1. Skapa ett gratis projekt på [supabase.com](https://supabase.com).
2. Öppna **SQL Editor**, klistra in hela `supabase/migrations/0001_init.sql` och kör. Det skapar
   tabeller, enums, RLS (aktiverad utan publika policyer) och den privata bucketen
   `quote-documents`.
3. Hämta nycklarna under **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (hemlig!) → `SUPABASE_SERVICE_ROLE_KEY`
4. Skapa adminanvändaren under **Authentication → Users → Add user** (e-post + lösenord). Det är
   det kontot du loggar in med på `/admin`.

## 2. Resend-uppsättning (e-post)

1. Skapa konto på [resend.com](https://resend.com), hämta en **API-nyckel** → `RESEND_API_KEY`.
2. För utskick till **externa** mottagare måste du verifiera en domän i Resend och sätta
   `RESEND_FROM` till en adress på den domänen (t.ex. `offert@gronabyggnader.se`).
3. Utan verifierad domän kan du testa med `RESEND_FROM="Gröna Byggnader <onboarding@resend.dev>"`
   (når då bara din egen Resend-kontoadress). **Utan `RESEND_API_KEY` hoppas mejl över tyst** – hela
   flödet fungerar ändå (admin får signeringslänken på skärmen för test).

## 3. Miljövariabler

Sätts i `.env.local` lokalt och i **Netlify → Site settings → Environment variables** i produktion.

| Variabel | Beskrivning |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL (publik) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon-nyckel (publik, skyddad av RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Hemlig.** service_role-nyckel. Endast serverkod. |
| `RESEND_API_KEY` | Resend API-nyckel (hemlig) |
| `RESEND_FROM` | Avsändaradress, t.ex. `"Gröna Byggnader <offert@gronabyggnader.se>"` |
| `ADMIN_NOTIFY_EMAIL` | Intern adress som får notis om nya förfrågningar |
| `APP_BASE_URL` | Publik bas-URL för länkar i mejl (lokalt `http://localhost:3000`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | (Valfritt, förberett) Cloudflare Turnstile |

## Deploy till Netlify

1. **Add new site → Import an existing project → GitHub** → välj repot. `netlify.toml` sätter
   build-kommando (`npm run build`), publish (`.next`) och `@netlify/plugin-nextjs`.
2. Lägg in **alla** miljövariabler ovan under *Site settings → Environment variables*.
3. Sätt `APP_BASE_URL` till sajtens publika URL (t.ex.
   `https://gronabyggnader-stockholm.netlify.app`).
4. Varje `git push` till `main` bygger om automatiskt.

## Säkerhet & GDPR

- **RLS** är aktiverad på alla tabeller utan publika policyer → webbläsaren kan aldrig läsa
  databasen direkt. All åtkomst sker i serverkod: kundens via en oguessningsbar, tidsbegränsad
  `access_token`; admins via Supabase Auth + `src/proxy.ts` (skyddar `/admin`).
- **Filer** ligger i en **privat** bucket och nås bara via tidsbegränsade signerade URL:er.
  Uppladdning sker direkt från klienten via signerade upload-URL:er (förbi serverns storleksgräns);
  filtyp/-storlek valideras både i klient och server.
- **Tokens** går ut efter `TOKEN_TTL_DAYS` (default 30 dagar, se `src/lib/constants.ts`).
- **Audit trail** vid signering: namn, e-post, tidpunkt, IP, user-agent, signeringsmetod och
  SHA-256-hash av exakt den PDF som signerades. Sparas i `signatures` och som audit-sida i den
  signerade PDF:en.
- **Spamskydd:** honeypot-fält + enkel rate limiting. Cloudflare Turnstile är förberett i env.
- **Datalagring/gallring (GDPR):** offertförfrågningar, dokument och signaturer lagras i Supabase
  tills de gallras manuellt. Bestäm och dokumentera en gallringsrutin (t.ex. radera ej vunna
  offerter efter X månader) och uppdatera `src/app/integritetspolicy/page.tsx` med faktiska
  lagringstider. Samtyckes-checkbox med länk till integritetspolicyn finns i kund- och
  kontaktformulären.

## ⚠️ Att granska innan skarp användning

- **Avtalsvillkor:** `PLACEHOLDER_TERMS` i `src/lib/constants.ts` är ett **utkast** – låt någon
  juridiskt kunnig ta fram/granska de riktiga villkoren (t.ex. mot Hantverkarformuläret 17 / ABS 18).
- **ROT/moms:** satser och tak ligger som konstanter i `src/lib/quote-config.ts`
  (`VAT_RATE`, `ROT_RATE`, `ROT_CAP_PER_PERSON`). Stäm av mot Skatteverkets aktuella regler.
- **Företagsuppgifter:** fyll i platshållarna i `src/config/site.ts` (org.nr, adress, telefon m.m.)
  – de visas i offert-PDF:en.

## Var du fyller i egna uppgifter

- **`src/config/site.ts`** – företagsnamn, ort, adress, telefon, e-post, org.nr, geo, öppettider,
  domän-URL, karta, sociala länkar. **Sök efter `[`** för platshållare.
- **`src/lib/content.ts`** – tjänster, USP:er, trust-siffror, referensprojekt, FAQ, team.
- **`src/content/blog/*.md`** – bloggartiklar (Markdown med frontmatter).
- **`public/`** – byt ut platshållarbilderna.

## Projektstruktur (nytt för flödet)

```
supabase/migrations/0001_init.sql   # DB-schema, RLS, bucket
src/
  proxy.ts                          # skyddar /admin (Supabase Auth)
  app/
    offert/                         # kundflödet (stepper, formulär, granska/signera)
    admin/                          # login, lista, detalj + offertformulär
    api/                            # quote-requests, uploads/sign, quotes, send, sign, book
    kontakt/                        # migrerad till Supabase-backenden (source="kontakt")
  lib/
    supabase/                       # admin- (service role), server- och browser-klienter
    pdf/                            # offert-PDF + signerad PDF (audit-sida) + hash
    email/                          # Resend-klient + svenska mallar
    signing/provider.ts            # SignatureProvider (enkel nu, BankID senare)
    quote-config.ts                 # ROT/moms-konstanter + beräkning
    validation.ts                   # Zod-scheman
  components/form/Fields.tsx        # delade fältkomponenter
```

## Sidor & SEO

**Sidor:** Hem · Tjänster (översikt + 7 tjänstesidor) · ROT-avdrag · Projekt · Om oss · Blogg ·
Vanliga frågor · Kontakt · **Offert (nytt)** · **Admin (skyddad, nytt)** · Integritetspolicy.

**SEO:** unika title/description, Open Graph/Twitter, canonical, `sitemap.xml`/`robots.txt`,
JSON-LD (`Organization`, `GeneralContractor`, `Service`, `FAQPage`, `BlogPosting`,
`BreadcrumbList`). `/admin` och `/offert?token=` är `noindex`.
