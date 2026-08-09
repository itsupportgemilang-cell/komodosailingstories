import { createFileRoute } from "@tanstack/react-router";
import { getDestinations } from "@/lib/services/content.functions";
import { pageMeta } from "@/lib/seo";
import type { Destination } from "@/types/content";
import { DestinationCard } from "@/components/site/DestinationCard";
import { Reveal } from "@/components/site/Reveal";
import { EmptyState, ErrorState } from "@/components/site/EmptyState";
import { CTASection } from "@/components/site/CTASection";

const TITLE = "Destinations in Komodo National Park | Komodo Tropical Cruise";
const DESCRIPTION =
  "Padar, Pink Beach, Manta Point and the rest of the archipelago — the places our Phinisi journeys are built around.";

export const Route = createFileRoute("/destinations/")({
  loader: async (): Promise<Destination[]> => getDestinations(),
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, url: "/destinations" }),
    links: [{ rel: "canonical", href: "/destinations" }],
  }),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-40">
      <ErrorState message={error.message} />
    </div>
  ),
  notFoundComponent: () => <EmptyState message="No destinations yet." />,
  component: DestinationsPage,
});

function DestinationsPage() {
  const destinations = Route.useLoaderData() as Destination[];

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-6 pt-32 pb-16 lg:px-10 lg:pt-44">
        <Reveal>
          <p className="eyebrow text-accent">The Archipelago</p>
          <h1 className="display mt-6 max-w-3xl text-[clamp(2.4rem,5.5vw,4.5rem)]">
            Places worth sailing for.
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-28 lg:px-10 lg:pb-40">
        {destinations.length === 0 ? (
          <EmptyState message="No destinations published yet." />
        ) : (
          <div className="grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination, i) => (
              <Reveal
                key={destination.id}
                delay={(i % 3) * 90}
                className={i % 3 === 1 ? "lg:mt-20" : undefined}
              >
                <DestinationCard
                  destination={destination}
                  index={i}
                  imageClassName={i % 2 === 0 ? "aspect-[4/5]" : "aspect-square"}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <CTASection title="Sail these islands with us." />
    </>
  );
}