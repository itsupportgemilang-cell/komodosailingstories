import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/Reveal";
import { CTASection } from "@/components/site/CTASection";

const TITLE = "About Komodo Tropical Cruise | Phinisi Sailing Crew";
const DESCRIPTION =
  "We are a small Labuan Bajo crew running traditional Phinisi journeys through Komodo National Park — slowly, and with care for the water.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, url: "/about" }),
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-6 pt-32 pb-16 lg:px-10 lg:pt-44">
        <Reveal>
          <p className="eyebrow text-accent">Who We Are</p>
          <h1 className="display mt-6 max-w-4xl text-[clamp(2.4rem,6vw,5rem)]">
            A small crew, one wooden boat, and the same stretch of water for twelve years.
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10">
        <Reveal>
          <img
            src="/images/charter-sunset.jpg"
            alt="The Phinisi at anchor in Komodo National Park"
            className="aspect-[21/9] w-full object-cover"
            loading="lazy"
          />
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-14 px-6 pb-24 lg:grid-cols-12 lg:px-10 lg:pb-36">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow text-accent">Our Story</p>
        </Reveal>
        <Reveal className="lg:col-span-7" delay={80}>
          <p className="font-serif text-[clamp(1.5rem,2.8vw,2.2rem)] leading-[1.4]">
            Komodo Tropical Cruise began with one restored Phinisi and a stubborn belief that these
            islands are best met slowly.
          </p>
          <p className="mt-8 text-sm leading-[1.95] text-muted-foreground">
            Our captain grew up on the water between Flores and Sumbawa. Our chef cooks what the
            morning market gives him. Our dive guides know which side of the channel the mantas
            favour on a spring tide. We keep the group small because a full deck changes the feeling
            of a place, and we keep the pace unhurried because the archipelago rewards patience.
          </p>
          <p className="mt-6 text-sm leading-[1.95] text-muted-foreground">
            We work inside the rules of Komodo National Park, anchor only on sand, carry our waste
            back to Labuan Bajo, and hire almost entirely from the villages we sail past. It is not
            a marketing position — it is simply how a boat should be run here.
          </p>

          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            {[
              ["12", "Years sailing"],
              ["16", "Guests maximum"],
              ["11", "Crew aboard"],
            ].map(([n, l]) => (
              <div key={l} className="border-t border-border pt-5">
                <p className="font-serif text-4xl">{n}</p>
                <p className="mt-2 text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <CTASection title="Sail with the people who live here." />
    </>
  );
}