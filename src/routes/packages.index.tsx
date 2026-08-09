import { createFileRoute } from "@tanstack/react-router";
import { getPublishedPackages } from "@/lib/services/content.functions";
import { pageMeta } from "@/lib/seo";
import type { Package } from "@/types/content";
import { PackageCard } from "@/components/site/PackageCard";
import { Reveal } from "@/components/site/Reveal";
import { EmptyState, ErrorState } from "@/components/site/EmptyState";
import { CTASection } from "@/components/site/CTASection";

const TITLE = "Sailing Journeys & Packages | Komodo Tropical Cruise";
const DESCRIPTION =
  "Browse every published Komodo sailing journey — from two day escapes to four day island explorations aboard a traditional Phinisi.";

export const Route = createFileRoute("/packages/")({
  loader: async (): Promise<Package[]> => getPublishedPackages(),
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, url: "/packages" }),
    links: [{ rel: "canonical", href: "/packages" }],
  }),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-40">
      <ErrorState message={error.message} />
    </div>
  ),
  notFoundComponent: () => <EmptyState message="No journeys available yet." />,
  component: PackagesPage,
});

function PackagesPage() {
  const packages = Route.useLoaderData() as Package[];

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-6 pt-32 pb-16 lg:px-10 lg:pt-44">
        <Reveal>
          <p className="eyebrow text-accent">Curated Journeys</p>
          <h1 className="display mt-6 max-w-3xl text-[clamp(2.4rem,5.5vw,4.5rem)]">
            Every journey we sail.
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-[1.9] text-muted-foreground">
            Each itinerary is shaped around tide, light and the pace of the people on board. Choose
            a departure, or let us build something entirely yours.
          </p>
          <p className="mt-10 text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
            {packages.length} {packages.length === 1 ? "Journey" : "Journeys"}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-28 lg:px-10 lg:pb-40">
        {packages.length === 0 ? (
          <EmptyState message="No journeys available yet." />
        ) : (
          <div className="grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={(i % 3) * 90}>
                <PackageCard pkg={pkg} imageClassName="aspect-[4/5]" />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <CTASection title="Not sure which journey suits you?" ctaLabel="Talk To Us" />
    </>
  );
}