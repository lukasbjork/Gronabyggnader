import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/blog";

/** Artikelkort för bloggindex: kategori, datum, titel, utdrag, lästid, läs-länk. */
export default function ArticleCard({ post }: { post: PostMeta }) {
  const href = `/blogg/${post.slug}/`;
  return (
    <article className="card-hover flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-sm hover:shadow-md">
      <Link href={href} className="relative block aspect-[16/9] w-full bg-brand-soft" tabIndex={-1} aria-hidden="true">
        <Image
          src={post.cover}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="rounded-full bg-brand-soft px-3 py-1 font-semibold text-brand-deep">
            {post.category}
          </span>
          <time dateTime={post.date}>{post.dateFormatted}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime} min läsning</span>
        </div>
        <h2 className="mt-3 text-xl font-semibold text-brand-deep">
          <Link href={href} className="hover:text-brand-2">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-muted">{post.description}</p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center font-semibold text-brand-2 underline-offset-4 hover:underline"
        >
          Läs artikeln →
        </Link>
      </div>
    </article>
  );
}
