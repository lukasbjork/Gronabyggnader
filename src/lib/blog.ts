import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  BLOGG — "content collection" för Next.js statisk export
 * ───────────────────────────────────────────────────────────────────────────
 *  Varje artikel är en Markdown-fil i src/content/blog/<slug>.md med typad
 *  frontmatter. Lägg till ett nytt inlägg = lägg till en ny .md-fil. Lästid
 *  beräknas automatiskt utifrån antal ord. Allt läses vid build (SSG) – ingen
 *  JavaScript skickas till webbläsaren för att rendera artiklarna.
 * ───────────────────────────────────────────────────────────────────────────
 */

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

export type PostFrontmatter = {
  title: string;
  description: string;
  /** ISO-datum, t.ex. "2026-05-11". */
  date: string;
  category: string;
  author: string;
  /** Omslagsbild i /public/blog/ (platshållare ok). */
  cover: string;
  coverAlt: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: number; // minuter
  /** Datum formaterat på svenska, t.ex. "11 maj 2026". */
  dateFormatted: string;
};

export type Post = PostMeta & {
  /** Renderad HTML från Markdown-brödtexten. */
  html: string;
};

const MONTHS_SV = [
  "januari", "februari", "mars", "april", "maj", "juni",
  "juli", "augusti", "september", "oktober", "november", "december",
];

/** Formatera ISO-datum till svenskt format, t.ex. "11 maj 2026". */
export function formatDateSv(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS_SV[d.getMonth()]} ${d.getFullYear()}`;
}

/** Uppskatta lästid: ~200 ord/min, alltid minst 1 minut. */
function readingTimeFromText(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function readRaw(slug: string): { data: PostFrontmatter; content: string } {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  return { data: data as PostFrontmatter, content };
}

/** Alla slugs (filnamn utan .md). */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** Metadata för ett inlägg (utan renderad HTML). */
export function getPostMeta(slug: string): PostMeta {
  const { data, content } = readRaw(slug);
  return {
    ...data,
    slug,
    readingTime: readingTimeFromText(content),
    dateFormatted: formatDateSv(data.date),
  };
}

/** Komplett inlägg inkl. renderad HTML. */
export function getPost(slug: string): Post {
  const { data, content } = readRaw(slug);
  const html = marked.parse(content, { async: false }) as string;
  return {
    ...data,
    slug,
    readingTime: readingTimeFromText(content),
    dateFormatted: formatDateSv(data.date),
    html,
  };
}

/** Alla inlägg, nyast först (för bloggindex). */
export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map(getPostMeta)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

/** Relaterade inlägg: samma kategori först, fyll på med senaste. */
export function getRelatedPosts(slug: string, limit = 2): PostMeta[] {
  const all = getAllPosts().filter((p) => p.slug !== slug);
  const current = getPostMeta(slug);
  const sameCategory = all.filter((p) => p.category === current.category);
  const rest = all.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
