# Bilder & assets (public/)

Alla filer här serveras som de är från webbplatsens rot (t.ex. `public/images/logo.svg`
nås på `/images/logo.svg`). Bilderna nedan är **platshållare** – byt ut dem mot riktiga
foton/grafik och behåll filnamnen, så funkar allt utan kodändringar.

## Vad som ligger här

| Fil | Används | Byt till |
| --- | --- | --- |
| `images/og-default.svg` | Social delning (Open Graph/Twitter) | **JPG/PNG 1200×630** med er logga/bild. Många plattformar visar inte SVG som delningsbild. |
| `images/logo.svg` | Logotyp i structured data | Er riktiga logotyp (SVG eller PNG). |
| `projekt/projekt-1.svg` … `projekt-6.svg` | Bilder på projektsidan (3:2) | Riktiga projektfoton. Uppdatera `image` + `imageAlt` i `src/lib/content.ts`. |
| `blog/*.svg` | Omslagsbilder för bloggartiklar (16:9) | Riktiga bilder. Sätt `cover` + `coverAlt` i artikelns frontmatter. |

> Favicon ligger som `src/app/icon.svg` (Next.js plockar upp den automatiskt).

## Tips för bra bilder

- **Format:** spara foton som **WebP** eller **AVIF** för snabb laddning (exporten kör
  `images.unoptimized`, så optimera filerna innan du lägger in dem).
- **Storlek:** håll filerna små (sikta på < 200 kB för omslagsbilder).
- **Alt-text:** beskriv alltid bilden – det är både SEO och tillgänglighet.
- **Mått:** behåll bildförhållandet (3:2 för projekt, 16:9 för blogg, 1200×630 för OG)
  så att inget hoppar (CLS).
