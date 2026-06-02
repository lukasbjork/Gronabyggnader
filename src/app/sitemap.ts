import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { services } from "@/lib/content";
import { getAllPosts } from "@/lib/blog";

// Krävs för statisk export – genererar /sitemap.xml vid build.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Statiska sidor (utan /tack/ som inte ska indexeras).
  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/tjanster/", priority: 0.9, freq: "monthly" },
    { path: "/rot-avdrag/", priority: 0.9, freq: "monthly" },
    { path: "/projekt/", priority: 0.7, freq: "monthly" },
    { path: "/om-oss/", priority: 0.6, freq: "yearly" },
    { path: "/blogg/", priority: 0.8, freq: "weekly" },
    { path: "/vanliga-fragor/", priority: 0.6, freq: "monthly" },
    { path: "/kontakt/", priority: 0.7, freq: "yearly" },
    { path: "/integritetspolicy/", priority: 0.2, freq: "yearly" },
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  // Tjänstesidor.
  for (const service of services) {
    entries.push({
      url: `${site.url}/tjanster/${service.slug}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Bloggartiklar (lastModified = publiceringsdatum).
  for (const post of getAllPosts()) {
    entries.push({
      url: `${site.url}/blogg/${post.slug}/`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return entries;
}
