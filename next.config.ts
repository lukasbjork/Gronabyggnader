import type { NextConfig } from "next";

/*
 * ───────────────────────────────────────────────────────────────────────────
 *  Next.js-konfiguration
 * ───────────────────────────────────────────────────────────────────────────
 *  Sajten kördes tidigare som HELT STATISK export (`output: 'export'`). Den togs
 *  bort när offert-/signeringsflödet lades till, eftersom det kräver server­
 *  funktioner (Route Handlers, Supabase, Resend, PDF-generering). Sajten körs nu
 *  på Netlifys Next.js-runtime via @netlify/plugin-nextjs (se netlify.toml).
 *
 *  Marknadssidorna förrenderas/cachas fortfarande av runtimen → prestandan är i
 *  praktiken oförändrad, men /api-rutter och dynamiska sidor fungerar nu.
 * ───────────────────────────────────────────────────────────────────────────
 */
const nextConfig: NextConfig = {
  // Behåll ooptimerade bilder (vi använder inte next/image-pipelinen och slipper
  // därmed Image Optimization-kostnad/-konfiguration).
  images: { unoptimized: true },
  // Behåll mappbaserade URL:er med avslutande slash – matchar befintliga länkar,
  // sitemap och canonical-taggar så att inget bryts.
  trailingSlash: true,
};

export default nextConfig;
