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
        "float-card group flex flex-col overflow-hidden",
        className,
      )}
    >
      <Link
        to="/packages/$slug"
        params={{ slug: pkg.slug }}
        className="block overflow-hidden rounded-[2rem] p-2 pb-0"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="overflow-hidden relative rounded-[1.6rem] bg-secondary">
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
        <div className="flex flex-wrap items-center gap-2">
          {pkg.duration ? <span className="pill !py-1 !text-[0.66rem] text-accent">{pkg.duration}</span> : null}
          {pkg.location ? <span className="pill !py-1 !text-[0.66rem] text-muted-foreground">{pkg.location}</span> : null}
        </div>

        <h3 className="mt-4 text-[1.25rem] leading-snug font-medium">
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
            className="circle-btn size-11 shrink-0 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground"
          >
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
