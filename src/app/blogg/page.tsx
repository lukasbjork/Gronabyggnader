import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import CTASection from "@/components/CTASection";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blogg om energieffektivisering & renovering",
  description:
    "Guider och råd om energieffektivisering, ROT-avdrag, tilläggsisolering, fönsterbyte och energideklaration – så sänker du driftkostnaden och höjer fastighetens värde.",
  alternates: { canonical: "/blogg/" },
};

export default function BloggPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blogg"
        title="Kunskap för en energismartare fastighet"
        intro="Konkreta guider och råd om energieffektivisering, ROT-avdrag och renovering – skrivna för dig som vill sänka driftkostnaden och förlänga fastighetens livslängd."
        crumbs={[
          { label: "Hem", href: "/" },
          { label: "Blogg" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {posts.length === 0 ? (
          <p className="text-center text-muted">Inga artiklar publicerade ännu.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      <CTASection />
    </>
  );
}
