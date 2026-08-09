import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/Reveal";
import { BookingForm } from "@/components/site/BookingForm";

const TITLE = "Private Phinisi Charter in Komodo | Komodo Tropical Cruise";
const DESCRIPTION =
  "Charter the whole boat. A private Phinisi, a crew of eleven, and an itinerary written around you and no one else.";

const STEPS = [
  { n: "01", t: "Tell us your dates", d: "Share when you'd like to sail and who's coming aboard." },
  { n: "02", t: "We draft the route", d: "A proposed itinerary shaped around tide, light and appetite." },
  { n: "03", t: "Refine together", d: "Swap islands, add a dive day, slow the whole thing down." },
  { n: "04", t: "Come aboard", d: "We handle permits, transfers, provisioning and the rest." },
];

export const Route = createFileRoute("/private-charter")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, url: "/private-charter" }),
    links: [{ rel: "canonical", href: "/private-charter" }],
  }),
  component: PrivateCharter,
});

function PrivateCharter() {
  return (
    <>
      <section className="relative h-[92vh] min-h-[540px] overflow-hidden">
        <img
          src="/images/charter-sunset.jpg"
          alt="A traditional Phinisi anchored at sunset in Komodo"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-20 lg:px-10 lg:pb-28">
          <p className="eyebrow text-[var(--sand)]/70">Private Charter</p>
          <h1 className="display mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.6rem)] text-[var(--sand)]">
            The whole boat. Your own weather.
          </h1>
          <p className="mt-8 max-w-lg text-sm leading-[1.9] text-[var(--sand)]/80">
            No fixed departure, no shared deck. Just a Phinisi, a crew who know these waters, and
            an itinerary that belongs to you.
          </p>
          <a
            href="#inquiry"
            className="mt-10 inline-block w-fit border border-[var(--sand)]/70 px-10 py-4 text-[0.7rem] tracking-[0.2em] text-[var(--sand)] uppercase transition-colors hover:bg-[var(--sand)] hover:text-foreground"
          >
            Start The Conversation
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-14 px-6 py-24 lg:grid-cols-12 lg:px-10 lg:py-36">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow text-accent">Why Charter</p>
        </Reveal>
        <Reveal className="lg:col-span-7" delay={80}>
          <p className="font-serif text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.35]">
            A charter is less about exclusivity and more about pace. You wake when you wake, swim
            when the light is right, and stay a second night at the anchorage nobody wants to leave.
          </p>
          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            {[
              ["Your own itinerary", "Every island, every hour, negotiable."],
              ["A crew of eleven", "Captain, chef, dive guides, deckhands."],
              ["Families & groups", "Up to sixteen guests across eight cabins."],
              ["Celebrations", "Birthdays, proposals, quiet anniversaries."],
            ].map(([t, d]) => (
              <div key={t} className="border-t border-border pt-5">
                <h3 className="font-serif text-xl">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-[var(--sand-deep)]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
          <p className="eyebrow text-accent">How It Works</p>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 90}>
                <p className="font-serif text-4xl text-accent">{step.n}</p>
                <h3 className="mt-5 font-serif text-2xl">{step.t}</h3>
                <p className="mt-3 text-sm leading-[1.8] text-muted-foreground">{step.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="inquiry" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:py-36">
          <Reveal>
            <p className="eyebrow text-accent">Enquire</p>
            <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)]">
              Tell us what you have in mind.
            </h2>
            <p className="mt-5 text-sm leading-[1.9] text-muted-foreground">
              We reply personally, usually within a day.
            </p>
            <div className="mt-14">
              <BookingForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}