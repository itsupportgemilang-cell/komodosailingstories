import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Packages", to: "/packages" },
  { label: "Private Charter", to: "/private-charter" },
  { label: "Destinations", to: "/destinations" },
  { label: "Journal", to: "/articles" },
  { label: "About", to: "/about" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <div
        className={cn(
          "mx-auto flex max-w-[1320px] items-center justify-between gap-4 rounded-full border px-3 py-2.5 transition-all duration-500 sm:px-4",
          scrolled || open
            ? "border-border/70 bg-white/85 shadow-[0_18px_50px_-40px_rgba(0,48,80,0.8)] backdrop-blur-xl"
            : "border-white/25 bg-white/10 backdrop-blur-md",
        )}
      >
        <Link
          to="/"
          aria-label="Komodo Tropical Cruise home"
          className={cn(
            "pl-3 leading-[1.05] transition-colors duration-500",
            scrolled || open ? "text-foreground" : "text-white",
          )}
        >
          <span className="block text-[0.82rem] font-semibold tracking-[0.26em]">KOMODO</span>
          <span className="block text-[0.53rem] tracking-[0.34em] opacity-70">
            TROPICAL CRUISE
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-4 py-2 text-[0.82rem] font-medium transition-all duration-300",
                  scrolled || open ? "text-foreground" : "text-white",
                  active
                    ? scrolled
                      ? "border border-accent/40 bg-accent/8 text-accent"
                      : "border border-white/60 bg-white/15"
                    : "border border-transparent hover:bg-white/15",
                  scrolled && !active ? "hover:bg-accent/8 hover:text-accent" : "",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/private-charter"
            hash="inquiry"
            className="btn-primary hidden !px-6 !py-2.5 !text-[0.82rem] lg:inline-flex"
          >
            Book Your Journey
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cn(
              "grid size-11 place-items-center rounded-full border transition-colors lg:hidden",
              scrolled || open
                ? "border-border text-foreground"
                : "border-white/40 bg-white/10 text-white",
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "mx-auto mt-2 max-w-[1320px] overflow-hidden rounded-[2rem] border border-border/70 bg-white/95 shadow-[0_24px_60px_-45px_rgba(0,48,80,0.9)] backdrop-blur-xl transition-all duration-500 lg:hidden",
          open ? "max-h-[560px] opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col p-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-5 py-3.5 text-lg font-medium transition-colors hover:bg-accent/8 hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/private-charter" hash="inquiry" className="btn-primary mt-3 w-full">
            Book Your Journey
            <ArrowUpRight className="size-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
