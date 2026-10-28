import { profile } from "@/data/portfolio";
import { heroFrames } from "@/data/flowLab/heroFrames";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { Reveal } from "./Reveal";
import { Topology } from "./Topology";

interface HeroProps {
  onFrameChange?: (scenarioId: string) => void;
  onExplore?: () => void;
}

export const Hero = ({ onFrameChange, onExplore }: HeroProps) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(() => typeof document !== "undefined" && !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const visualRef = useRef<HTMLDivElement>(null);
  const frame = reducedMotion ? heroFrames[0] : heroFrames[frameIndex];
  const paused = hovered || focused || !inView || !documentVisible || reducedMotion;

  useEffect(() => onFrameChange?.(frame.scenarioId), [frame.scenarioId, onFrameChange]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    if (visualRef.current) observer.observe(visualRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setFrameIndex((index) => (index + 1) % heroFrames.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) setFocused(false);
  };

  return (
  <section className="relative overflow-hidden pt-28 md:pt-36 lg:pt-40" aria-labelledby="hero-heading">
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
              className="mt-6 max-w-[12ch] text-[clamp(2.8rem,7vw,5.25rem)] font-medium leading-[0.98] text-ink display-tight md:mt-8"
            >
              Cloud
              <br />
              infrastructure.
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-measure text-lg leading-[1.6] text-ink md:mt-7 md:text-xl md:leading-[1.55]">
              {profile.positioning}
            </p>
            <p className="mt-4 max-w-measure text-[0.975rem] leading-[1.7] text-muted">
              {profile.elaboration}
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-8">
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

        </div>

        {/* ---- Right: the technical visual ---- */}
        <Reveal delay={380} className="lg:pl-4">
          <div
            ref={visualRef}
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={onBlur}
          >
            <Topology frame={frame} paused={paused} reducedMotion={reducedMotion} className="h-auto w-full max-w-[460px] lg:max-w-none" />

          <dl className="mt-8 border-t border-line pt-5">
            <div className="flex items-center justify-between gap-3">
              <dt className="meta text-dim">Current focus</dt>
              <dd className="meta border border-line-strong px-2 py-1 text-dim">Simulated</dd>
            </div>
            <dd className="mt-2.5 text-[0.975rem] leading-relaxed text-ink">{frame.focusTitle}</dd>
            <dd className="mt-1.5 font-mono text-xs leading-relaxed text-muted">{frame.focusText}</dd>
            <dd className="mt-5 flex items-center justify-between gap-4">
              <a
                href="#flow-lab"
                onClick={onExplore}
                className="link-draw inline-flex min-h-11 items-center text-sm text-accent"
              >
                Explore the architecture
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">currently showing {frame.scenarioId}</span>
              </a>
              <span aria-hidden="true" className="inline-flex items-center gap-2">
                {heroFrames.map((item, index) => <span key={item.scenarioId} className={`h-1 w-1 rounded-full ${index === frameIndex ? "bg-muted" : "bg-line-strong"}`} />)}
              </span>
            </dd>
          </dl>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
  );
};
