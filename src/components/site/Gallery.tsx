import { cn } from "@/lib/utils";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  if (!images.length) return null;
  return (
    <div className="grid auto-rows-[minmax(180px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((src, i) => (
        <figure
          key={`${src}-${i}`}
          className={cn(
            "group overflow-hidden bg-secondary",
            i % 5 === 0
              ? "rounded-[2.5rem] sm:col-span-2 sm:row-span-2"
              : i % 3 === 1
                ? "rounded-[2rem]"
                : "rounded-[1.5rem]",
          )}
        >
          <img
            src={src}
            alt={`${title} — photograph ${i + 1}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          />
        </figure>
      ))}
    </div>
  );
}
