export function Gallery({ images, title }: { images: string[]; title: string }) {
  if (!images.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((src, i) => (
        <figure
          key={`${src}-${i}`}
          className={
            i % 5 === 0
              ? "overflow-hidden bg-secondary sm:col-span-2 sm:row-span-2"
              : "overflow-hidden bg-secondary"
          }
        >
          <img
            src={src}
            alt={`${title} — photograph ${i + 1}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.03]"
          />
        </figure>
      ))}
    </div>
  );
}