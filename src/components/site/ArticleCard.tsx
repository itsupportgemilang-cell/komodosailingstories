import { Link } from "@tanstack/react-router";
import type { Article } from "@/types/content";
import { formatDate } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function ArticleCard({
  article,
  className,
  imageClassName,
  size = "default",
}: {
  article: Article;
  className?: string | undefined;
  imageClassName?: string | undefined;
  size?: "default" | "large" | undefined;
}) {
  return (
    <article className={cn("group flex flex-col", className)}>
      <Link
        to="/articles/$slug"
        params={{ slug: article.slug }}
        aria-hidden="true"
        tabIndex={-1}
        className="block overflow-hidden bg-secondary"
      >
        <img
          src={article.featured_image ?? "/images/padar.jpg"}
          alt=""
          loading="lazy"
          className={cn(
            "w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]",
            imageClassName ?? (size === "large" ? "aspect-[16/10]" : "aspect-[3/2]"),
          )}
        />
      </Link>
      <div className="pt-6">
        <div className="flex items-center gap-4 text-[0.66rem] tracking-[0.18em] text-muted-foreground uppercase">
          {article.category ? <span className="text-accent">{article.category}</span> : null}
          <span>{formatDate(article.published_at)}</span>
        </div>
        <h3
          className={cn(
            "mt-3 font-serif leading-tight",
            size === "large" ? "text-[2.1rem]" : "text-[1.45rem]",
          )}
        >
          <Link to="/articles/$slug" params={{ slug: article.slug }} className="hover:opacity-70">
            {article.title}
          </Link>
        </h3>
        {article.excerpt ? (
          <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        ) : null}
        <Link
          to="/articles/$slug"
          params={{ slug: article.slug }}
          className="mt-5 inline-block text-[0.68rem] tracking-[0.18em] uppercase underline-offset-8 hover:underline"
        >
          Read Story
        </Link>
      </div>
    </article>
  );
}