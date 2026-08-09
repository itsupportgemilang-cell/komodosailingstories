import { createFileRoute, Link } from "@tanstack/react-router";
import {
  getFeaturedPackages,
  getDestinations,
  getLatestArticles,
  getTestimonials,
} from "@/lib/services/content.functions";
import { pageMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PackageCard } from "@/components/site/PackageCard";
import { DestinationCard } from "@/components/site/DestinationCard";
import { ArticleCard } from "@/components/site/ArticleCard";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { CTASection } from "@/components/site/CTASection";
import { EmptyState, ErrorState } from "@/components/site/EmptyState";

const TITLE = "Komodo Tropical Cruise — Luxury Phinisi Sailing in Komodo National Park";
const DESCRIPTION =
  "Intimate sailing journeys and private Phinisi charters through the wild islands, hidden beaches and extraordinary waters of Komodo National Park.";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [packages, destinations, articles, testimonials] = await Promise.all([
      getFeaturedPackages(),
      getDestinations(),
      getLatestArticles(),
      getTestimonials(),
    ]);
    return { packages, destinations, articles, testimonials };
  },
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, url: "/" }),
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "Komodo Tropical Cruise",
          description: DESCRIPTION,
          areaServed: "Komodo National Park, Indonesia",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Labuan Bajo",
            addressCountry: "ID",
          },
        }),
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="px-6 py-40">
      <ErrorState message={error.message} />
    </div>
  ),
  notFoundComponent: () => <EmptyState message="Nothing here yet." />,
  component: HomePage,
});

const EXPERIENCES = [
  "Sailing",
  "Snorkelling",
  "Diving",
  "Wildlife",
  "Island Hopping",
  "Sunset",
  "Local Culture",
];

const BENEFITS = [
  { title: "Authentic Sailing", text: "Traditional Phinisi boats, sailed the way they always were." },
  { title: "Personalised Service", text: "Small groups, and a crew who learn your name on day one." },
  { title: "Curated Routes", text: "Anchorages chosen for light, tide and quiet — not for queues." },
  { title: "Experienced Local Crew", text: "Born to these waters, and generous with what they know." },
];

function HomePage() {
  const { packages, destinations, articles, testimonials } = Route.useLoaderData();

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <img
          src="/images/hero-phinisi.jpg"
          alt="A traditional Phinisi sailing boat anchored among the islands of Komodo National Park"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/35" />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
          <p className="eyebrow text-[var(--sand)]/80">Komodo National Park · Indonesia</p>
          <h1 className="display mt-8 max-w-4xl text-[clamp(2.6rem,6.5vw,5.5rem)] text-[var(--sand)]">
            Discover Komodo,
            <br />
            Beyond the Ordinary.
          </h1>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-[var(--sand)]/80">
            An intimate sailing experience through wild islands, hidden beaches, and extraordinary
            waters.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/packages"
              className="bg-[var(--sand)] px-9 py-4 text-[0.7rem] tracking-[0.2em] text-foreground uppercase transition-opacity hover:opacity-85"
            >
              Explore Journeys
            </Link>
            <Link
              to="/private-charter"
              className="border border-[var(--sand)]/60 px-9 py-4 text-[0.7rem] tracking-[0.2em] text-[var(--sand)] uppercase transition-colors hover:bg-[var(--sand)] hover:text-foreground"
            >
              Private Charter
            </Link>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 hidden h-14 w-px -translate-x-1/2 bg-[var(--sand)]/40 lg:block"
        />
      </section>

      {/* EDITORIAL INTRO */}
      <section className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-40">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="relative lg:col-span-7">
            <img
              src="/images/padar.jpg"
              alt="Aerial view of Padar Island's curved bays"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/4]"
            />
            <img
              src="/images/pink-beach.jpg"
              alt="Pink sand meeting clear shallow water"
              loading="lazy"
              className="absolute -bottom-10 -right-6 hidden w-[38%] object-cover shadow-2xl sm:block lg:-right-16"
            />
          </Reveal>
          <div className="lg:col-span-5 lg:pl-6">
            <SectionHeading
              eyebrow="The Journey"
              title={
                <>
                  Where the sea
                  <br />
                  becomes your journey.
                </>
              }
            />
            <Reveal delay={120}>
              <div className="mt-8 space-y-5 text-sm leading-[1.9] text-muted-foreground">
                <p>
                  Komodo Tropical Cruise began with a simple idea: that these islands deserve to be
                  travelled slowly. We sail traditional Phinisi boats from Labuan Bajo into the
                  quieter reaches of the national park, with small groups and a crew who grew up on
                  this water.
                </p>
                <p>
                  No schedules built around crowds. No rushing between viewpoints. Just long days
                  at sea, warm evenings at anchor, and the kind of stillness that only exists a few
                  hours from shore.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FEATURED PACKAGES */}
      <section className="bg-[var(--sand-deep)]">
        <div className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-36">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              eyebrow="Curated Journeys"
              title="Choose Your Journey"
              description="Thoughtfully crafted sailing experiences through the extraordinary landscapes of Komodo."
            />
            <Reveal>
              <Link
                to="/packages"
                className="text-[0.7rem] tracking-[0.2em] uppercase underline-offset-8 hover:underline"
              >
                View All Journeys
              </Link>
            </Reveal>
          </div>

          <div className="mt-16">
            {packages.length === 0 ? (
              <EmptyState message="No journeys available yet." />
            ) : (
              <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
                {packages.map((pkg, i) => (
                  <Reveal key={pkg.id} delay={i * 90}>
                    <PackageCard pkg={pkg} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-40">
        <SectionHeading eyebrow="The Archipelago" title="Places Worth Sailing For" />
        {destinations.length === 0 ? (
          <div className="mt-14">
            <EmptyState message="Destinations are being added." />
          </div>
        ) : (
          <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.slice(0, 6).map((destination, i) => (
              <Reveal
                key={destination.id}
                delay={(i % 3) * 90}
                className={i % 3 === 1 ? "lg:mt-24" : i % 3 === 2 ? "lg:mt-10" : undefined}
              >
                <DestinationCard
                  destination={destination}
                  index={i}
                  imageClassName={
                    i % 3 === 1 ? "aspect-[3/4]" : i % 3 === 2 ? "aspect-square" : "aspect-[4/5]"
                  }
                />
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="mt-16">
          <Link
            to="/destinations"
            className="text-[0.7rem] tracking-[0.2em] uppercase underline-offset-8 hover:underline"
          >
            All Destinations
          </Link>
        </Reveal>
      </section>

      {/* FULL WIDTH STORY */}
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        <img
          src="/images/charter-sunset.jpg"
          alt="A Phinisi boat silhouetted against a Komodo sunset"
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6 lg:px-10">
          <Reveal>
            <p className="eyebrow text-[var(--sand)]/70">The Komodo Experience</p>
            <h2 className="display mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.8rem)] text-[var(--sand)]">
              Some places are meant
              <br />
              to be discovered slowly.
            </h2>
          </Reveal>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="On Board & Ashore" title="Seven ways to meet the archipelago" />
            <Reveal delay={100}>
              <p className="mt-8 max-w-md text-sm leading-[1.9] text-muted-foreground">
                Every journey is built from the same elements, arranged differently depending on
                tide, weather and the people on board.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <ul className="border-t border-border">
              {EXPERIENCES.map((item, i) => (
                <Reveal as="li" key={item} delay={i * 50}>
                  <div className="flex items-baseline justify-between gap-6 border-b border-border py-6">
                    <span className="font-serif text-[clamp(1.6rem,3vw,2.4rem)]">{item}</span>
                    <span className="text-[0.66rem] tracking-[0.2em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-[var(--sand-deep)]">
        <div className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-36">
          <SectionHeading
            title={
              <>
                Made for the moments
                <br />
                you&apos;ll remember.
              </>
            }
          />
          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 80}>
                <h3 className="font-serif text-xl">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{benefit.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVATE CHARTER */}
      <section className="relative min-h-[80vh] overflow-hidden">
        <img
          src="/images/charter-sunset.jpg"
          alt="Luxury Phinisi boat at sunset"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[80vh] max-w-[1400px] items-center px-6 lg:px-10">
          <Reveal className="max-w-xl">
            <h2 className="display text-[clamp(2.2rem,5vw,4rem)] text-[var(--sand)]">
              Your Komodo.
              <br />
              Your Journey.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[var(--sand)]/80">
              Charter the entire boat and experience Komodo at your own pace.
            </p>
            <Link
              to="/private-charter"
              className="mt-10 inline-block border border-[var(--sand)]/70 px-9 py-4 text-[0.7rem] tracking-[0.2em] text-[var(--sand)] uppercase transition-colors hover:bg-[var(--sand)] hover:text-foreground"
            >
              Explore Private Charter
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-40">
        <SectionHeading eyebrow="Guests" title="In their words" />
        {testimonials.length === 0 ? (
          <div className="mt-14">
            <EmptyState message="No guest stories published yet." />
          </div>
        ) : (
          <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, i) => (
              <Reveal key={testimonial.id} delay={i * 90}>
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* JOURNAL */}
      <section className="bg-[var(--sand-deep)]">
        <div className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-36">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading eyebrow="From the Journal" title="Stories From the Archipelago" />
            <Reveal>
              <Link
                to="/articles"
                className="text-[0.7rem] tracking-[0.2em] uppercase underline-offset-8 hover:underline"
              >
                Explore Journal
              </Link>
            </Reveal>
          </div>
          {articles.length === 0 ? (
            <div className="mt-14">
              <EmptyState message="No stories published yet." />
            </div>
          ) : (
            <div className="mt-16 grid gap-x-10 gap-y-16 lg:grid-cols-12">
              {articles[0] ? (
                <Reveal className="lg:col-span-7">
                  <ArticleCard article={articles[0]} size="large" />
                </Reveal>
              ) : null}
              <div className="space-y-14 lg:col-span-5">
                {articles.slice(1, 3).map((article, i) => (
                  <Reveal key={article.id} delay={(i + 1) * 90}>
                    <ArticleCard article={article} imageClassName="aspect-[16/9]" />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTASection
        title={
          <>
            Ready to discover
            <br />
            Komodo differently?
          </>
        }
      />
    </>
  );
}
