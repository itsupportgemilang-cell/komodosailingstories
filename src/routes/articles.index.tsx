import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getPublishedArticles } from "@/lib/services/content.functions";
import { pageMeta } from "@/lib/seo";
import type { Article } from "@/types/content";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Reveal } from "@/components/site/Reveal";
import { EmptyState, ErrorState } from "@/components/site/EmptyState";
import { CTASection } from "@/components/site/CTASection";
import { cn } from "@/lib/utils";

const TITLE = "Journal | Komodo Tropical Cruise";
const DESCRIPTION =
  "Stories, guides and notes from the Komodo archipelago — written by the crew who sail it.";
const PAGE_SIZE = 6;

export const Route = createFileRoute("/articles/")({
  loader: async (): Promise<Article[]> => getPublishedArticles(),
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, url: "/articles" }),
    links: [{ rel: "canonical", href: "/articles" }],
  }),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-40">
      <ErrorState message={error.message} />
    </div>
  ),
  notFoundComponent: () => <EmptyState message="No stories yet." />,
  component: JournalPage,
});

function JournalPage() {
  const articles = Route.useLoaderData() as Article[];
  const [category, setCategory] = useState<string>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const categories = [
    "All",
    ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean) as string[])),
  ];
  const filtered =
    category === "All" ? articles : articles.filter((a) => a.category === category);
  const [featured, ...rest] = filtered;

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-6 pt-32 pb-16 lg:px-10 lg:pt-44">
        <Reveal>
          <p className="eyebrow text-accent">From the Journal</p>
          <h1 className="display mt-6 max-w-3xl text-[clamp(2.4rem,5.5vw,4.5rem)]">
            Stories from the archipelago.
          </h1>
        </Reveal>
      </section>

      {articles.length === 0 ? (
        <div className="mx-auto max-w-3xl px-6 pb-32">
          <EmptyState message="No stories published yet." />
        </div>
      ) : (
        <>
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="flex flex-wrap gap-6 border-b border-border pb-5">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    setVisible(PAGE_SIZE);
                  }}
                  className={cn(
                    "text-[0.7rem] tracking-[0.18em] uppercase transition-opacity",
                    category === item ? "text-accent" : "text-muted-foreground hover:opacity-70",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
            {featured ? (
              <Reveal className="mb-20">
                <ArticleCard article={featured} size="large" imageClassName="aspect-[21/9]" />
              </Reveal>
            ) : null}

            {rest.length ? (
              <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {rest.slice(0, visible).map((article, i) => (
                  <Reveal key={article.id} delay={(i % 3) * 80}>
                    <ArticleCard article={article} />
                  </Reveal>
                ))}
              </div>
            ) : null}

            {rest.length > visible ? (
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="btn-outline mt-16"
              >
                Load More
              </button>
            ) : null}
          </section>
        </>
      )}

      <CTASection title="Reading is one thing. Sailing is another." />
    </>
  );
}