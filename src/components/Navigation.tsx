import { useEffect, useRef, useState } from "react";
import { navItems, profile } from "@/data/portfolio";

export const Navigation = ({ onOpenTerminal }: { onOpenTerminal?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel on Escape, returning focus to the toggle.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !toggleRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-line bg-base/85 backdrop-blur-md supports-[backdrop-filter]:bg-base/70"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="shell flex items-center justify-between py-5" aria-label="Primary">
        <a
          href="/"
          className="group inline-flex items-baseline gap-2"
          aria-label={`${profile.brand} — home`}
        >
          <span className="font-mono text-sm font-semibold tracking-[0.2em] text-ink">
            {profile.brand}
          </span>
          <span
            aria-hidden="true"
            className="h-1 w-1 translate-y-[-2px] rounded-full bg-accent transition-transform duration-300 group-hover:scale-150"
          />
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="link-draw meta text-muted transition-colors duration-200 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="meta border border-line-strong px-3 py-2 text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            Résumé
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 p-2 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 7h14" strokeLinecap="round" />
                <path d="M3 13h14" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-line bg-base md:hidden"
      >
        <ul className="shell flex flex-col py-2">
          {navItems.map((item) => (
            <li key={item.label} className="border-b border-line/70 last:border-0">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="meta block py-4 text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="pb-4 pt-4">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="meta inline-block border border-line-strong px-3 py-2 text-ink"
            >
              Résumé
            </a>
            {onOpenTerminal && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenTerminal();
                }}
                className="meta ml-3 border border-line px-3 py-2 text-dim transition-colors hover:border-accent hover:text-accent"
              >
                Terminal
              </button>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};
