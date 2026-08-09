import type { Testimonial } from "@/types/content";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col justify-between border-t border-border pt-8">
      <blockquote className="font-serif text-[1.35rem] leading-[1.5]">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-8 text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase">
        {testimonial.customer_name}
        {testimonial.customer_country ? ` · ${testimonial.customer_country}` : ""}
        <span className="ml-3 text-accent" aria-label={`${testimonial.rating} out of 5`}>
          {"★".repeat(testimonial.rating)}
        </span>
      </figcaption>
    </figure>
  );
}