import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSiteSettings } from "@/lib/services/content.functions";

const NAV = [
  { label: "Packages", to: "/packages" },
  { label: "Private Charter", to: "/private-charter" },
  { label: "Destinations", to: "/destinations" },
  { label: "Journal", to: "/articles" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function Footer() {
  const fetchSettings = useServerFn(getSiteSettings);
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => fetchSettings(),
    staleTime: 5 * 60 * 1000,
  });

  const waHref = settings?.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`
    : undefined;

  return (
    <footer className="bg-[var(--ink)] text-[var(--sand)]">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-3xl leading-tight">
              {settings?.company_name ?? "Komodo Tropical Cruise"}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-60">
              {settings?.address ?? "Labuan Bajo, Indonesia"}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow mb-6 opacity-50">Navigate</p>
            <ul className="space-y-3">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm opacity-80 hover:opacity-100">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-6 opacity-50">Contact</p>
            <ul className="space-y-3 text-sm opacity-80">
              {waHref ? (
                <li>
                  <a href={waHref} target="_blank" rel="noreferrer" className="hover:opacity-100">
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {settings?.email ? (
                <li>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              ) : null}
              {settings?.instagram ? (
                <li>
                  <a href={settings.instagram} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-[var(--sand)]/15 pt-8 text-xs opacity-50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings?.company_name ?? "Komodo Tropical Cruise"}
          </p>
          <div className="flex gap-6">
            <Link to="/contact">Privacy Policy</Link>
            <Link to="/contact">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}