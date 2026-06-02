import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { site } from "@/config/site";
import { getPost, getPostSlugs, getRelatedPosts } from "@/lib/blog";

// En statisk sida per artikel vid build.
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getPostSlugs().includes(slug)) return {};
  const post = getPost(slug);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blogg/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blogg/${post.slug}/`,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.cover, alt: post.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.cover],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getPostSlugs().includes(slug)) notFound();

  const post = getPost(slug);
  const related = getRelatedPosts(slug, 3);

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: `${site.url}${post.cover}`,
    articleSection: post.category,
    inLanguage: "sv-SE",
    author: { "@type": "Organization", name: post.author, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/images/logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/blogg/${post.slug}/` },
  };

  return (
    <>
      {/* Hero */}
      <header className="border-b border-border bg-gradient-to-b from-brand-soft to-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs
            items={[
              { label: "Hem", href: "/" },
              { label: "Blogg", href: "/blogg/" },
              { label: post.title },
            ]}
          />
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span className="rounded-full bg-surface px-3 py-1 font-semibold text-brand-deep shadow-sm">
              {post.category}
            </span>
            <time dateTime={post.date}>{post.dateFormatted}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min läsning</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-brand-deep sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg text-muted">{post.description}</p>
          <p className="mt-4 text-sm text-muted">Av {post.author}</p>
        </div>
      </header>

      {/* Omslagsbild */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-card border border-border bg-brand-soft">
          <Image
            src={post.cover}
            alt={post.coverAlt}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Brödtext */}
      <article
        className="prose-brand prose prose-lg mx-auto max-w-3xl px-4 py-12 sm:px-6"
        // HTML genereras vid build från vår egen Markdown (inte användarinput).
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {/* Relaterade artiklar */}
      {related.length > 0 && (
        <section className="border-t border-border bg-brand-soft">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold text-brand-deep">Relaterade artiklar</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {related.map((r) => (
                <ArticleCard key={r.slug} post={r} />
              ))}
            </div>
            <p className="mt-8">
              <Link href="/blogg/" className="font-semibold text-brand-2 underline underline-offset-4 hover:text-brand-deep">
                ← Till alla artiklar
              </Link>
            </p>
          </div>
        </section>
      )}

      <CTASection />
      <JsonLd data={blogPostingLd} />
    </>
  );
}
