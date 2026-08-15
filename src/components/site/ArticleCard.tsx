import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
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
        className="relative block overflow-hidden rounded-[2rem] bg-secondary shadow-[0_24px_55px_-45px_rgba(0,48,80,0.9)] transition-transform duration-500 ease-out group-hover:-translate-y-1"
      >
        <img
          src={article.featured_image ?? "/images/padar.jpg"}
          alt=""
          loading="lazy"
          className={cn(
            "w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.05]",
            imageClassName ?? (size === "large" ? "aspect-[16/10]" : "aspect-[3/2]"),
          )}
        />
        {article.category ? (
          <span className="pill-glass absolute top-4 left-4">{article.category}</span>
        ) : null}
      </Link>
      <div className="flex items-start justify-between gap-5 pt-6">
        <div className="min-w-0">
          <span className="text-[0.66rem] tracking-[0.16em] text-muted-foreground uppercase">
            {formatDate(article.published_at)}
          </span>
          <h3
            className={cn(
              "mt-3 leading-tight font-medium",
              size === "large" ? "text-[2rem]" : "text-[1.35rem]",
            )}
          >
            <Link
              to="/articles/$slug"
              params={{ slug: article.slug }}
              className="transition-colors hover:text-accent"
            >
              {article.title}
            </Link>
          </h3>
          {article.excerpt ? (
            <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          ) : null}
        </div>
        <Link
          to="/articles/$slug"
          params={{ slug: article.slug }}
          aria-label={`Read ${article.title}`}
          className="circle-btn mt-1 size-10 shrink-0"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
