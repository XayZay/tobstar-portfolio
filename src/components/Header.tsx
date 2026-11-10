import type { CSSProperties } from "react";
import { navItems, profile } from "@/data/portfolio";
import { toggleTheme } from "@/lib/site";
import { Label } from "./bits";

/** Each section has its own patch-cord colour. */
const cord: Record<string, string> = {
  work: "var(--cord-work)",
  lab: "var(--cord-lab)",
  notes: "var(--cord-notes)",
  about: "var(--cord-about)",
};

/** The switch-port strip: the current page has a cord plugged in and its link LED lit. */
export const Header = ({ section }: { section: string }) => (
  <header className="head">
    <a className="brand" href="/" aria-label="Tobstar, home">
      <Label>{profile.brand}</Label>
    </a>
    <nav className="strip" aria-label="Main">
      {navItems.map((item) => (
        <a
          key={item.id}
          className="port"
          href={item.href}
          aria-current={section === item.id ? "page" : undefined}
          style={{ "--cord": cord[item.id] } as CSSProperties}
        >
          <Label>{item.label}</Label>
          <span className="jack" aria-hidden="true">
            <i className="led" />
          </span>
        </a>
      ))}
      <a className="port" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
        <Label>CV ↗</Label>
        <span className="jack" aria-hidden="true">
          <i className="led" />
        </span>
      </a>
    </nav>
    <button type="button" className="rocker" onClick={toggleTheme} aria-label="Lights: switch between light and dark">
      <span className="rk" aria-hidden="true">
        <i>I</i>
        <i>O</i>
      </span>
      Lights
    </button>
  </header>
);
