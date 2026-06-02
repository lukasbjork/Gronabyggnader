import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// Krävs för statisk export – genererar /robots.txt vid build.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Tacksidan ska inte indexeras (visas bara efter formulärinskick).
      disallow: ["/tack/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
