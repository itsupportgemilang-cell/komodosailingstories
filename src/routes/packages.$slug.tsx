import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPackageBySlug } from "@/lib/services/content.functions";
import { formatIDR, pageMeta, breadcrumbLd } from "@/lib/seo";
import type { Package } from "@/types/content";
import { Reveal } from "@/components/site/Reveal";
import { PackageCard } from "@/components/site/PackageCard";
import { ItineraryTimeline } from "@/components/site/ItineraryTimeline";
import { FaqList } from "@/components/site/FaqList";
import { Gallery } from "@/components/site/Gallery";
import { BookingForm } from "@/components/site/BookingForm";
import { EmptyState, ErrorState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/packages/$slug")({
  loader: async ({ params }): Promise<{ pkg: Package; related: Package[] }> => {
    const result = await getPackageBySlug({ data: { slug: params.slug } });
    if (!result.pkg) throw notFound();
    return result as { pkg: Package; related: Package[] };
  },
  head: ({ params, loaderData }) => {
    const pkg = (loaderData as { pkg: Package } | undefined)?.pkg;
    if (!pkg) {
      return {
        meta: [{ title: "Journey not found" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: pageMeta({
        title: pkg.seo_title ?? `${pkg.title} | Komodo Tropical Cruise`,
        description: pkg.seo_description ?? pkg.short_description ?? "",
        url: `/packages/${params.slug}`,
        image: pkg.og_image ?? pkg.featured_image,
        type: "product",
      }),
      links: [{ rel: "canonical", href: `/packages/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: pkg.title,
            description: pkg.short_description ?? undefined,
            touristType: "Sailing",
            itinerary: {
              "@type": "ItemList",
              itemListElement: pkg.itinerary.map((day, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: day.title,
              })),
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "Home", item: "/" },
              { name: "Packages", item: "/packages" },
              { name: pkg.title, item: `/packages/${params.slug}` },
            ]),
          ),
        },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-40">
      <ErrorState message={error.message} />
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-40 text-center">
      <EmptyState message="This journey is no longer available." />
      <Link to="/packages" className="mt-8 inline-block text-sm underline underline-offset-8">
        View all journeys
      </Link>
    </div>
  ),
  component: PackageDetail,
});

function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="border-t border-border py-16">
      <h2 className="eyebrow mb-8 text-accent">{title}</h2>
      {children}
    </section>
  );
}

function PackageDetail() {
  const { pkg, related } = Route.useLoaderData() as { pkg: Package; related: Package[] };
  const price = pkg.price_label ?? (pkg.price ? `from ${formatIDR(pkg.price)}` : "On request");

  return (
    <>
      <section className="px-3 pt-20 sm:px-5">
        <div className="relative mx-auto h-[78vh] min-h-[460px] max-w-[1600px] overflow-hidden rounded-[2.5rem] lg:rounded-[3rem]">
        <img
          src={pkg.featured_image ?? "/images/hero-phinisi.jpg"}
          alt={pkg.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-16 lg:px-10 lg:pb-20">
          <p className="eyebrow text-[var(--sand)]/70">{pkg.location}</p>
          <h1 className="display mt-6 max-w-3xl text-[clamp(2.2rem,5.5vw,4.5rem)] text-[var(--sand)]">
            {pkg.title}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3 text-[0.72rem] tracking-[0.16em] text-[var(--sand)]/80 uppercase">
            {pkg.duration ? <span>{pkg.duration}</span> : null}
            <span>{price}</span>
            <a
              href="#enquire"
              className="border border-[var(--sand)]/60 px-7 py-3 transition-colors hover:bg-[var(--sand)] hover:text-foreground"
            >
              Book This Journey
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 py-20 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-8">
          {pkg.description ? (
            <Reveal>
              <p className="font-serif text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.45]">
                {pkg.short_description}
              </p>
              <p className="mt-8 text-sm leading-[1.95] text-muted-foreground">{pkg.description}</p>
            </Reveal>
          ) : null}

          {pkg.highlights.length ? (
            <Section title="Highlights">
              <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {pkg.highlights.map((item) => (
                  <li key={item} className="border-b border-border pb-4 font-serif text-xl">
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {pkg.itinerary.length ? (
            <Section title="Itinerary">
              <ItineraryTimeline days={pkg.itinerary} />
            </Section>
          ) : null}

          {pkg.included.length || pkg.excluded.length ? (
            <Section title="What's Included">
              <div className="grid gap-12 sm:grid-cols-2">
                <div>
                  <h3 className="mb-4 font-serif text-xl">Included</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {pkg.included.map((item) => (
                      <li key={item}>— {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 font-serif text-xl">Not included</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {pkg.excluded.map((item) => (
                      <li key={item}>— {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>
          ) : null}

          {pkg.gallery.length ? (
            <Section title="Gallery">
              <Gallery images={pkg.gallery} title={pkg.title} />
            </Section>
          ) : null}

          {pkg.faq.length ? (
            <Section title="Questions">
              <FaqList items={pkg.faq} />
            </Section>
          ) : null}
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 border border-border p-8">
            <p className="eyebrow text-muted-foreground">Starting from</p>
            <p className="mt-3 font-serif text-3xl">{price}</p>
            <dl className="mt-8 space-y-3 text-sm text-muted-foreground">
              {pkg.duration ? (
                <div className="flex justify-between gap-4">
                  <dt>Duration</dt>
                  <dd className="text-foreground">{pkg.duration}</dd>
                </div>
              ) : null}
              {pkg.location ? (
                <div className="flex justify-between gap-4">
                  <dt>Location</dt>
                  <dd className="text-foreground">{pkg.location}</dd>
                </div>
              ) : null}
            </dl>
            <a
              href="#enquire"
              className="mt-8 block border border-foreground px-6 py-4 text-center text-[0.7rem] tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              Enquire Now
            </a>
          </div>
        </aside>
      </div>

      <section id="enquire" className="bg-[var(--sand-deep)] scroll-mt-24">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:py-32">
          <h2 className="display text-[clamp(2rem,4vw,3rem)]">Enquire about this journey</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Tell us your dates and we&apos;ll come back with availability.
          </p>
          <div className="mt-12">
            <BookingForm packageSlug={pkg.slug} />
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
          <h2 className="eyebrow mb-12 text-accent">Other Journeys</h2>
          <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <PackageCard pkg={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}