import { Link } from "@tanstack/react-router";
import type { Destination } from "@/types/content";
import { cn } from "@/lib/utils";

export function DestinationCard({
  destination,
  className,
  imageClassName,
  index,
}: {
  destination: Destination;
  className?: string;
  imageClassName?: string;
  index?: number;
}) {
  return (
    <article className={cn("group", className)}>
      <Link to="/destinations/$slug" params={{ slug: destination.slug }} className="block">
        <div className="overflow-hidden bg-secondary">
          <img
            src={destination.featured_image ?? "/images/padar.jpg"}
            alt={destination.name}
            loading="lazy"
            className={cn(
              "w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]",
              imageClassName ?? "aspect-[3/4]",
            )}
          />
        </div>
        <div className="flex items-baseline gap-3 pt-5">
          {typeof index === "number" ? (
            <span className="text-[0.66rem] tracking-[0.2em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
          <h3 className="font-serif text-2xl leading-tight group-hover:opacity-70">
            {destination.name}
          </h3>
        </div>
        {destination.short_description ? (
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {destination.short_description}
          </p>
        ) : null}
      </Link>
    </article>
  );
}