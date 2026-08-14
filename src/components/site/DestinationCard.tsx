import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Destination } from "@/types/content";
import { cn } from "@/lib/utils";

export function DestinationCard({
  destination,
  className,
  imageClassName,
  index,
}: {
  destination: Destination;
  className?: string | undefined;
  imageClassName?: string | undefined;
  index?: number | undefined;
}) {
  return (
    <article className={cn("group", className)}>
      <Link to="/destinations/$slug" params={{ slug: destination.slug }} className="block">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-secondary shadow-[0_24px_50px_-38px_rgba(0,48,80,0.6)] transition-transform duration-500 ease-out group-hover:-translate-y-1">
          <img
            src={destination.featured_image ?? "/images/padar.jpg"}
            alt={destination.name}
            loading="lazy"
            className={cn(
              "w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]",
              imageClassName ?? "aspect-[3/4]",
            )}
          />
          {typeof index === "number" ? (
            <span className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-1 text-[0.66rem] font-semibold tracking-[0.14em] text-foreground backdrop-blur">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
        </div>
        <div className="flex items-start justify-between gap-4 pt-5">
          <div className="min-w-0">
            <h3 className="text-xl leading-tight font-semibold transition-colors group-hover:text-accent">
              {destination.name}
            </h3>
            {destination.short_description ? (
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {destination.short_description}
              </p>
            ) : null}
          </div>
          <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-border text-accent transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
