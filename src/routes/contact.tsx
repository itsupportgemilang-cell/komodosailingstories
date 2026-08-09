import { createFileRoute } from "@tanstack/react-router";
import { getSiteSettings } from "@/lib/services/content.functions";
import { pageMeta } from "@/lib/seo";
import type { SiteSettings } from "@/types/content";
import { BookingForm } from "@/components/site/BookingForm";
import { Reveal } from "@/components/site/Reveal";
import { ErrorState } from "@/components/site/EmptyState";

const TITLE = "Contact | Komodo Tropical Cruise";
const DESCRIPTION =
  "Reach the crew in Labuan Bajo by WhatsApp or email, or send an enquiry and we'll reply within a day.";

export const Route = createFileRoute("/contact")({
  loader: async (): Promise<SiteSettings | null> => getSiteSettings(),
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, url: "/contact" }),
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-40">
      <ErrorState message={error.message} />
    </div>
  ),
  component: ContactPage,
});

function ContactPage() {
  const settings = Route.useLoaderData() as SiteSettings | null;

  return (
    <section className="mx-auto grid max-w-[1400px] gap-16 px-6 pt-32 pb-28 lg:grid-cols-12 lg:px-10 lg:pt-44 lg:pb-40">
      <Reveal className="lg:col-span-5">
        <p className="eyebrow text-accent">Contact</p>
        <h1 className="display mt-6 text-[clamp(2.2rem,4.6vw,3.8rem)]">Let&apos;s talk.</h1>
        <p className="mt-6 text-sm leading-[1.9] text-muted-foreground">
          Questions about dates, cabins, diving or a private charter — write to us and a person will
          reply.
        </p>

        <dl className="mt-14 space-y-6 text-sm">
          {settings?.whatsapp ? (
            <div>
              <dt className="eyebrow text-muted-foreground">WhatsApp</dt>
              <dd className="mt-2">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-8 hover:underline"
                >
                  {settings.whatsapp}
                </a>
              </dd>
            </div>
          ) : null}
          {settings?.email ? (
            <div>
              <dt className="eyebrow text-muted-foreground">Email</dt>
              <dd className="mt-2">
                <a href={`mailto:${settings.email}`} className="underline-offset-8 hover:underline">
                  {settings.email}
                </a>
              </dd>
            </div>
          ) : null}
          {settings?.address ? (
            <div>
              <dt className="eyebrow text-muted-foreground">Office</dt>
              <dd className="mt-2 text-muted-foreground">{settings.address}</dd>
            </div>
          ) : null}
        </dl>
      </Reveal>

      <Reveal className="lg:col-span-7" delay={90}>
        <BookingForm />
      </Reveal>
    </section>
  );
}