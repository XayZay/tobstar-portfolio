import { currentFocus, profile } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { Topology } from "./Topology";

const DISCIPLINES = ["Cloud", "Infrastructure", "Networking", "Security", "Backend"];

export const Hero = () => (
  <section className="relative overflow-hidden pt-36 md:pt-44 lg:pt-52" aria-labelledby="hero-heading">
    <div className="shell">
      <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
        {/* ---- Left: the statement ---- */}
        <div>
          <Reveal>
            <p className="meta flex flex-wrap items-center gap-x-3 gap-y-2 text-dim">
              <span>{profile.name}</span>
              <span aria-hidden="true" className="text-line-strong">
                /
              </span>
              <span>{profile.location}</span>
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1
              id="hero-heading"
              className="mt-7 text-display font-medium text-ink display-tight"
            >
              The layer
              <br />
              underneath
              <br />
              <span className="text-muted">the product.</span>
            </h1>
          </Reveal>

          {/* Discipline strip — the scannable version of the headline. */}
          <Reveal delay={140}>
            <ul className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-line py-4">
              {DISCIPLINES.map((d, i) => (
                <li key={d} className="meta flex items-center gap-3 text-muted">
                  {d}
                  {i < DISCIPLINES.length - 1 && (
                    <span aria-hidden="true" className="text-line-strong">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-9 max-w-measure text-lg leading-[1.7] text-ink md:text-xl md:leading-[1.65]">
              {profile.positioning}
            </p>
            <p className="mt-5 max-w-measure text-[0.975rem] leading-[1.75] text-muted">
              {profile.elaboration}
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="/#work"
                className="group inline-flex items-center gap-2.5 border border-line-strong px-5 py-3 text-sm text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                Selected work
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <a
                href="/#contact"
                className="link-draw text-sm text-muted transition-colors duration-200 hover:text-ink"
              >
                Get in touch
              </a>
            </div>
          </Reveal>

          {/* Availability — present, but quiet. */}
          <Reveal delay={320}>
            <p className="meta mt-10 inline-flex items-center gap-2.5 text-muted">
              <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
                <span className="status-dot absolute inline-flex h-full w-full rounded-full bg-accent" />
              </span>
              {profile.availability}
            </p>
          </Reveal>
        </div>

        {/* ---- Right: the technical visual ---- */}
        <Reveal delay={380} className="lg:pl-4">
          <div className="relative">
            <Topology className="h-auto w-full max-w-[460px] lg:max-w-none" />
          </div>

          <dl className="mt-8 border-t border-line pt-5">
            <dt className="meta text-dim">{currentFocus.label}</dt>
            <dd className="mt-2.5 text-[0.975rem] leading-relaxed text-ink">
              {currentFocus.value}
            </dd>
            <dd className="mt-1.5 font-mono text-xs leading-relaxed text-muted">
              {currentFocus.detail}
            </dd>
          </dl>
        </Reveal>
      </div>
    </div>
  </section>
);
