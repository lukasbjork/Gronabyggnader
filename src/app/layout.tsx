import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import JsonLd from "@/components/JsonLd";
import { site, socialLinks } from "@/config/site";

// Self-hosted typsnitt via next/font (laddas ned vid build) – inga externa
// requests, automatisk font-display: swap och preload av de vikter vi använder.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – Energieffektivisering & ROT-renovering i ${site.city}`,
    template: `%s | ${site.name}`,
  },
  description:
    `${site.name} är byggföretaget i ${site.city} som förlänger fastigheters livslängd och sänker energiförbrukningen. Energieffektivisering, tilläggsisolering, fönsterbyte, fasad, tak och värmepump – med ROT-avdrag.`,
  keywords: [
    `byggföretag ${site.city}`,
    "energieffektivisering",
    "energirenovering",
    "ROT-avdrag",
    "tilläggsisolering",
    "fönsterbyte",
    "fasadrenovering",
    "takrenovering",
    "värmepump",
    "energideklaration",
    "hållbart byggande",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "sv_SE",
    siteName: site.name,
    title: `${site.name} – Energieffektivisering & ROT-renovering i ${site.city}`,
    description:
      `Vi förlänger fastigheters livslängd och sänker energiförbrukningen. Energieffektiv ROT-renovering i ${site.city} – med ROT-avdrag.`,
    images: [{ url: "/images/og-default.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} – Energieffektivisering & ROT-renovering i ${site.city}`,
    description:
      `Vi förlänger fastigheters livslängd och sänker energiförbrukningen. Energieffektiv ROT-renovering i ${site.city}.`,
    images: ["/images/og-default.png"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

/**
 * Global Organization-data (visas på alla sidor). LocalBusiness/GeneralContractor
 * med adress och geo ligger på startsidan och kontaktsidan.
 */
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/images/logo.svg`,
  description: site.tagline,
  email: site.email,
  telephone: site.phone,
  areaServed: site.serviceArea,
  sameAs: socialLinks().map((s) => s.url),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv-SE" className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a href="#innehall" className="skip-link">
          Hoppa till innehåll
        </a>
        <Header />
        <main id="innehall" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <JsonLd data={organizationLd} />
      </body>
    </html>
  );
}
