import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Package } from "@/types/content";
import { formatIDR } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function PackageCard({
  pkg,
  className,
  imageClassName,
}: {
  pkg: Package;
  className?: string | undefined;
  imageClassName?: string | undefined;
}) {
  const price = pkg.price_label ?? (pkg.price ? `from ${formatIDR(pkg.price)}` : null);

  return (
    <article
      className={cn(
        "card-surface group flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-[0_28px_60px_-38px_rgba(0,48,80,0.55)]",
        className,
      )}
    >
      <Link
        to="/packages/$slug"
        params={{ slug: pkg.slug }}
        className="block overflow-hidden rounded-[1.5rem] p-2 pb-0"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="overflow-hidden rounded-[1.1rem] bg-secondary">
          <img
            src={pkg.featured_image ?? "/images/hero-phinisi.jpg"}
            alt=""
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]",
              imageClassName ?? "aspect-[4/3]",
            )}
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {pkg.duration ? <span>{pkg.duration}</span> : null}
          {pkg.location ? <span className="opacity-60">{pkg.location}</span> : null}
        </div>

        <h3 className="mt-2 text-[1.25rem] leading-snug font-semibold">
          <Link
            to="/packages/$slug"
            params={{ slug: pkg.slug }}
            className="transition-colors hover:text-accent"
          >
            {pkg.title}
          </Link>
        </h3>

        {pkg.short_description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {pkg.short_description}
          </p>
        ) : null}

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-4">
          <span className="text-base font-semibold">{price ?? "Price on request"}</span>
          <Link
            to="/packages/$slug"
            params={{ slug: pkg.slug }}
            aria-label={`Explore ${pkg.title}`}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-accent transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground"
          >
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
