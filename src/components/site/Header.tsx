import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
  const overlay = pathname === "/" || pathname === "/private-charter";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || !overlay;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-[0_1px_30px_-20px_rgba(0,0,0,0.5)]"
          : "bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1400px] items-center justify-between px-6 transition-all duration-500 lg:px-10",
          solid ? "h-16" : "h-24",
        )}
      >
        <Link
          to="/"
          aria-label="Komodo Tropical Cruise home"
          className={cn(
            "leading-[1.05] transition-colors duration-500",
            solid ? "text-foreground" : "text-background",
          )}
        >
          <span className="block text-[0.8rem] font-semibold tracking-[0.32em]">KOMODO</span>
          <span className="block text-[0.55rem] tracking-[0.42em] opacity-70">
            TROPICAL CRUISE
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-[0.78rem] tracking-[0.08em] transition-colors duration-300 hover:opacity-60",
                solid ? "text-foreground" : "text-background",
              )}
              activeProps={{ className: "underline underline-offset-8 decoration-1" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/private-charter"
            hash="inquiry"
            className={cn(
              "hidden border px-6 py-3 text-[0.7rem] tracking-[0.18em] uppercase transition-colors duration-300 lg:inline-block",
              solid
                ? "border-foreground text-foreground hover:bg-foreground hover:text-background"
                : "border-background/70 text-background hover:bg-background hover:text-foreground",
            )}
          >
            Book Your Journey
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cn(
              "-mr-2 p-2 transition-colors lg:hidden",
              solid || open ? "text-foreground" : "text-background",
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-[max-height,opacity] duration-500 lg:hidden",
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col px-6 py-6">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="border-b border-border/60 py-4 font-serif text-2xl"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/private-charter"
            hash="inquiry"
            className="mt-6 bg-foreground px-6 py-4 text-center text-[0.7rem] tracking-[0.18em] text-background uppercase"
          >
            Book Your Journey
          </Link>
        </nav>
      </div>
    </header>
  );
}