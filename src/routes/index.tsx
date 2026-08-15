import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import {
  getFeaturedPackages,
  getDestinations,
  getLatestArticles,
  getTestimonials,
} from "@/lib/services/content.functions";
import { pageMeta } from "@/lib/seo";
import type { Article, Destination, Package, Testimonial } from "@/types/content";
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
  loader: async (): Promise<{
    packages: Package[];
    destinations: Destination[];
    articles: Article[];
    testimonials: Testimonial[];
  }> => {
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
  const { packages, destinations, articles, testimonials } = Route.useLoaderData() as {
    packages: Package[];
    destinations: Destination[];
    articles: Article[];
    testimonials: Testimonial[];
  };

  return (
    <>
      {/* HERO */}
      <section className="px-3 pt-24 sm:px-5 lg:pt-28">
        <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] lg:rounded-[3rem]">
          <img
            src="/images/hero-phinisi.jpg"
            alt="A traditional Phinisi sailing boat anchored among the islands of Komodo National Park"
            width={1920}
            height={1280}
            className="hero-img-in h-[86svh] min-h-[560px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003050]/85 via-[#003050]/25 to-[#003050]/35" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
            <div className="hero-in max-w-4xl">
              <span className="pill-glass">Komodo National Park · Indonesia</span>
              <h1 className="display mt-7 text-[clamp(2.4rem,6.2vw,5.2rem)] text-white">
                Discover Komodo,
                <br />
                Beyond the Ordinary.
              </h1>
              <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-white/85">
                An intimate sailing experience through wild islands, hidden beaches, and
                extraordinary waters.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/packages" className="btn-primary">
                  Explore Journeys
                  <ArrowUpRight className="size-4" />
                </Link>
                <Link to="/private-charter" className="btn-glass">
                  Private Charter
                </Link>
              </div>
            </div>
          </div>

          <div className="hero-in absolute top-24 right-6 hidden w-[230px] rounded-[1.75rem] border border-white/25 bg-white/12 p-5 text-white backdrop-blur-xl lg:block">
            <p className="text-[0.7rem] font-semibold tracking-[0.16em] uppercase opacity-80">
              Small groups
            </p>
            <p className="mt-2 text-sm leading-relaxed opacity-85">
              Traditional Phinisi boats, sailed with a Labuan Bajo crew.
            </p>
          </div>
        </div>
      </section>

      {/* EDITORIAL INTRO */}
      <section className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-40">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="relative lg:col-span-7">
            <img
              src="/images/padar.jpg"
              alt="Aerial view of Padar Island's curved bays"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[2.5rem] object-cover sm:aspect-[5/4]"
            />
            <img
              src="/images/pink-beach.jpg"
              alt="Pink sand meeting clear shallow water"
              loading="lazy"
              className="absolute -right-6 -bottom-12 hidden aspect-square w-[38%] rounded-[2rem] border-4 border-background object-cover shadow-[0_30px_70px_-45px_rgba(0,48,80,0.9)] sm:block lg:-right-16"
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
      <section className="mx-auto max-w-[1600px] rounded-[2.5rem] bg-[var(--sand-deep)] sm:mx-5 lg:rounded-[3rem]">
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
                className="btn-outline !py-3 !text-[0.8rem]"
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
            className="btn-outline !py-3 !text-[0.8rem]"
          >
            All Destinations
          </Link>
        </Reveal>
      </section>

      {/* FULL WIDTH STORY */}
      <section className="relative mx-auto h-[70vh] min-h-[420px] max-w-[1600px] overflow-hidden rounded-[2.5rem] px-0 sm:mx-5 lg:rounded-[3rem]">
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
            <ul className="flex flex-wrap gap-3">
              {EXPERIENCES.map((item, i) => (
                <Reveal as="li" key={item} delay={i * 50}>
                  <div className="group flex items-center gap-4 rounded-full border border-border bg-card px-6 py-4 transition-all duration-400 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_45px_-38px_rgba(0,48,80,0.9)]">
                    <span className="text-[0.66rem] font-semibold tracking-[0.16em] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[clamp(1.05rem,2vw,1.5rem)] font-medium">{item}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="mx-auto max-w-[1600px] rounded-[2.5rem] bg-[var(--sand-deep)] sm:mx-5 lg:rounded-[3rem]">
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
                <div className="float-card h-full p-7">
                  <span className="grid size-11 place-items-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {benefit.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVATE CHARTER */}
      <section className="relative mx-auto min-h-[80vh] max-w-[1600px] overflow-hidden rounded-[2.5rem] sm:mx-5 lg:rounded-[3rem]">
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
              className="btn-glass mt-10"
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
      <section className="mx-auto max-w-[1600px] rounded-[2.5rem] bg-[var(--sand-deep)] sm:mx-5 lg:rounded-[3rem]">
        <div className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-36">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading eyebrow="From the Journal" title="Stories From the Archipelago" />
            <Reveal>
              <Link
                to="/articles"
                className="btn-outline !py-3 !text-[0.8rem]"
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
