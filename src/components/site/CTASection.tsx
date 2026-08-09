import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

export function CTASection({
  title,
  ctaLabel = "Plan Your Journey",
}: {
  title: React.ReactNode;
  ctaLabel?: string;
}) {
  return (
    <section className="bg-[var(--sand-deep)]">
      <div className="mx-auto max-w-[1400px] px-6 py-28 text-center lg:px-10 lg:py-40">
        <Reveal>
          <h2 className="display mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4rem)]">{title}</h2>
          <Link
            to="/private-charter"
            hash="inquiry"
            className="mt-12 inline-block border border-foreground px-10 py-4 text-[0.7rem] tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background"
          >
            {ctaLabel}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}