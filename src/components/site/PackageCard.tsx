import { Link } from "@tanstack/react-router";
import type { Package } from "@/types/content";
import { formatIDR } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function PackageCard({
  pkg,
  className,
  imageClassName,
}: {
  pkg: Package;
  className?: string;
  imageClassName?: string;
}) {
  const price = pkg.price_label ?? (pkg.price ? `from ${formatIDR(pkg.price)}` : null);

  return (
    <article className={cn("group flex flex-col", className)}>
      <Link
        to="/packages/$slug"
        params={{ slug: pkg.slug }}
        className="block overflow-hidden bg-secondary"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={pkg.featured_image ?? "/images/hero-phinisi.jpg"}
          alt=""
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]",
            imageClassName ?? "aspect-[4/5]",
          )}
        />
      </Link>

      <div className="flex flex-1 flex-col pt-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase">
          {pkg.duration ? <span>{pkg.duration}</span> : null}
          {pkg.location ? <span className="opacity-60">{pkg.location}</span> : null}
        </div>

        <h3 className="mt-3 font-serif text-[1.6rem] leading-tight">
          <Link to="/packages/$slug" params={{ slug: pkg.slug }} className="hover:opacity-70">
            {pkg.title}
          </Link>
        </h3>

        {pkg.short_description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {pkg.short_description}
          </p>
        ) : null}

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-4">
          <span className="text-sm">{price ?? "Price on request"}</span>
          <Link
            to="/packages/$slug"
            params={{ slug: pkg.slug }}
            className="text-[0.68rem] tracking-[0.18em] text-accent uppercase underline-offset-8 hover:underline"
          >
            Explore Journey
          </Link>
        </div>
      </div>
    </article>
  );
}