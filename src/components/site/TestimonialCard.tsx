import type { Testimonial } from "@/types/content";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="float-card flex h-full flex-col justify-between p-8">
      <blockquote className="text-[1.15rem] leading-[1.7] font-light">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-8 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold">
          {testimonial.customer_name}
          {testimonial.customer_country ? ` · ${testimonial.customer_country}` : ""}
        </span>
        <span
          className="pill !py-1 !text-[0.68rem] text-accent"
          aria-label={`${testimonial.rating} out of 5`}
        >
          ★ {testimonial.rating}.0
        </span>
      </figcaption>
    </figure>
  );
}
