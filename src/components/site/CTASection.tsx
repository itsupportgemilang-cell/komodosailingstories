import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function CTASection({
  title,
  ctaLabel = "Plan Your Journey",
}: {
  title: React.ReactNode;
  ctaLabel?: string;
}) {
  return (
    <section className="px-3 pb-16 sm:px-5">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[2.5rem] bg-[var(--ink)] px-6 py-24 text-center lg:rounded-[3rem] lg:py-32">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-16 size-[26rem] rounded-full bg-[var(--sea)]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-20 size-[24rem] rounded-full bg-[var(--aqua)]/20 blur-3xl"
        />
        <Reveal className="relative">
          <h2 className="display mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4rem)] text-white">
            {title}
          </h2>
          <Link to="/private-charter" hash="inquiry" className="btn-primary mt-10">
            {ctaLabel}
            <ArrowUpRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
