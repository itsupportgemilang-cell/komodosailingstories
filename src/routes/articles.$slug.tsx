import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArticleBySlug } from "@/lib/services/content.functions";
import { pageMeta, breadcrumbLd, formatDate } from "@/lib/seo";
import type { Article } from "@/types/content";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Reveal } from "@/components/site/Reveal";
import { EmptyState, ErrorState } from "@/components/site/EmptyState";
import { CTASection } from "@/components/site/CTASection";

type LoaderData = { article: Article; related: Article[] };

export const Route = createFileRoute("/articles/$slug")({
  loader: async ({ params }): Promise<LoaderData> => {
    const result = await getArticleBySlug({ data: { slug: params.slug } });
    if (!result.article) throw notFound();
    return result as LoaderData;
  },
  head: ({ params, loaderData }) => {
    const article = (loaderData as LoaderData | undefined)?.article;
    if (!article) {
      return { meta: [{ title: "Story not found" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: pageMeta({
        title: article.seo_title ?? `${article.title} | Komodo Tropical Cruise`,
        description: article.seo_description ?? article.excerpt ?? "",
        url: `/articles/${params.slug}`,
        image: article.og_image ?? article.featured_image,
        type: "article",
      }),
      links: [{ rel: "canonical", href: `/articles/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt ?? undefined,
            datePublished: article.published_at ?? undefined,
            author: { "@type": "Organization", name: article.author ?? "Komodo Tropical Cruise" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "Home", item: "/" },
              { name: "Journal", item: "/articles" },
              { name: article.title, item: `/articles/${params.slug}` },
            ]),
          ),
        },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-40">
      <ErrorState message={error.message} />
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-40 text-center">
      <EmptyState message="This story isn't available." />
      <Link to="/articles" className="mt-8 inline-block text-sm underline underline-offset-8">
        Back to the Journal
      </Link>
    </div>
  ),
  component: ArticleDetail,
});

function ArticleDetail() {
  const { article, related } = Route.useLoaderData() as LoaderData;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <section className="px-3 pt-20 sm:px-5">
        <div className="relative mx-auto h-[62vh] min-h-[380px] max-w-[1600px] overflow-hidden rounded-[2.5rem] lg:rounded-[3rem]">
        <img
          src={article.featured_image ?? "/images/padar.jpg"}
          alt={article.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="relative mx-auto flex h-full max-w-3xl flex-col justify-end px-6 pb-14">
          <p className="eyebrow text-[var(--sand)]/70">{article.category}</p>
          <h1 className="display mt-5 text-[clamp(2rem,4.6vw,3.6rem)] text-[var(--sand)]">
            {article.title}
          </h1>
          <p className="mt-6 text-[0.7rem] tracking-[0.18em] text-[var(--sand)]/70 uppercase">
            {formatDate(article.published_at)}
            {article.author ? ` · ${article.author}` : ""}
          </p>
        </div>
        </div>
      </section>

      <article className="mx-auto max-w-2xl px-6 py-20 lg:py-28">
        {article.excerpt ? (
          <p className="text-[1.6rem] leading-[1.5] font-light">{article.excerpt}</p>
        ) : null}
        <div
          className="prose-editorial mt-10"
          dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
        />

        <div className="mt-16 flex flex-wrap items-center gap-6 border-t border-border pt-8 text-[0.7rem] tracking-[0.18em] uppercase">
          <span className="text-muted-foreground">Share</span>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${article.title} ${shareUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-8 hover:underline"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-8 hover:underline"
          >
            Facebook
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(shareUrl)}`}
            className="underline-offset-8 hover:underline"
          >
            Email
          </a>
        </div>
      </article>

      {related.length ? (
        <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
          <h2 className="eyebrow mb-12 text-accent">More Stories</h2>
          <div className="grid gap-x-10 gap-y-16 sm:grid-cols-3">
            {related.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <ArticleCard article={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <CTASection title="Come and see it for yourself." />
    </>
  );
}