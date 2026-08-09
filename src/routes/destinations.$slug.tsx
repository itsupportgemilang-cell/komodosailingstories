import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getDestinationBySlug } from "@/lib/services/content.functions";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import type { Destination } from "@/types/content";
import { Gallery } from "@/components/site/Gallery";
import { DestinationCard } from "@/components/site/DestinationCard";
import { Reveal } from "@/components/site/Reveal";
import { EmptyState, ErrorState } from "@/components/site/EmptyState";
import { CTASection } from "@/components/site/CTASection";

type LoaderData = { destination: Destination; others: Destination[] };

export const Route = createFileRoute("/destinations/$slug")({
  loader: async ({ params }): Promise<LoaderData> => {
    const result = await getDestinationBySlug({ data: { slug: params.slug } });
    if (!result.destination) throw notFound();
    return result as LoaderData;
  },
  head: ({ params, loaderData }) => {
    const destination = (loaderData as LoaderData | undefined)?.destination;
    if (!destination) {
      return { meta: [{ title: "Destination not found" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: pageMeta({
        title: destination.seo_title ?? `${destination.name} | Komodo Tropical Cruise`,
        description: destination.seo_description ?? destination.short_description ?? "",
        url: `/destinations/${params.slug}`,
        image: destination.og_image ?? destination.featured_image,
        type: "article",
      }),
      links: [{ rel: "canonical", href: `/destinations/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristAttraction",
            name: destination.name,
            description: destination.short_description ?? undefined,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "Home", item: "/" },
              { name: "Destinations", item: "/destinations" },
              { name: destination.name, item: `/destinations/${params.slug}` },
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
      <EmptyState message="This destination isn't published." />
      <Link to="/destinations" className="mt-8 inline-block text-sm underline underline-offset-8">
        All destinations
      </Link>
    </div>
  ),
  component: DestinationDetail,
});

function DestinationDetail() {
  const { destination, others } = Route.useLoaderData() as LoaderData;

  return (
    <>
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        <img
          src={destination.featured_image ?? "/images/padar.jpg"}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-black/15" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-16 lg:px-10">
          <p className="eyebrow text-[var(--sand)]/70">Komodo National Park</p>
          <h1 className="display mt-5 text-[clamp(2.4rem,6vw,4.8rem)] text-[var(--sand)]">
            {destination.name}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 lg:py-32">
        <Reveal>
          {destination.short_description ? (
            <p className="font-serif text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.45]">
              {destination.short_description}
            </p>
          ) : null}
          {destination.description ? (
            <p className="mt-8 text-sm leading-[1.95] text-muted-foreground">
              {destination.description}
            </p>
          ) : null}
        </Reveal>
      </section>

      {destination.gallery.length ? (
        <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10">
          <Gallery images={destination.gallery} title={destination.name} />
        </section>
      ) : null}

      {others.length ? (
        <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
          <h2 className="eyebrow mb-12 text-accent">Nearby</h2>
          <div className="grid gap-x-10 gap-y-16 sm:grid-cols-3">
            {others.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <DestinationCard destination={item} imageClassName="aspect-[4/5]" />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <CTASection title="Add this island to your route." />
    </>
  );
}