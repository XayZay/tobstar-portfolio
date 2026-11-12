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
  <section className="hero-field relative overflow-hidden border-b border-line pt-24 md:pt-28 lg:pt-32" aria-labelledby="hero-heading">
    <div className="shell pb-14 md:pb-20">
      <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div className="lg:pt-10">
          <Reveal>
            <p className="text-sm font-medium text-muted">
              {profile.name} <span aria-hidden="true" className="mx-2 text-accent">/</span> {profile.location}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1
              id="hero-heading"
              className="mt-6 max-w-[12ch] text-[clamp(3.25rem,8vw,6.8rem)] font-semibold leading-[0.91] text-ink display-tight md:mt-8"
            >
              building
              <br />
              systems,
              <br />
              from the
              <br />
              group up :)
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-7 max-w-[34rem] text-xl font-medium leading-[1.45] text-ink md:text-2xl">
              {profile.positioning}
            </p>
            <p className="mt-4 max-w-[35rem] text-[0.975rem] leading-[1.7] text-muted">
              {profile.elaboration}
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href="/lab"
                className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-ink"
              >
                Enter Flow Lab
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <a
                href="/#work"
                className="link-draw text-sm text-muted transition-colors duration-200 hover:text-ink"
              >
                See selected work
              </a>
            </div>
          </Reveal>

        </div>

        <Reveal delay={280} className="lg:pl-2">
          <div
            ref={visualRef}
            className="map-frame relative overflow-hidden border border-line-strong p-5 md:p-8 lg:min-h-[580px]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={onBlur}
          >
            <div aria-hidden="true" className="absolute left-[14%] top-[-14%] h-[52%] w-[62%] rounded-[50%] border border-accent/25" />
            <div aria-hidden="true" className="absolute bottom-[-25%] right-[-12%] h-[64%] w-[80%] rounded-[50%] border border-signal/40" />
            <div className="relative flex items-center justify-between gap-4 border-b border-line pb-4">
              <p className="font-mono text-xs text-accent">TOBSTAR / SYSTEM MAP</p>
              <span className="inline-flex items-center gap-2 text-xs text-muted"><span className="waypoint h-2 w-2 rounded-full" />live sketch</span>
            </div>
            <Topology frame={frame} paused={paused} reducedMotion={reducedMotion} className="relative mt-6 h-auto w-full max-w-[460px] lg:max-w-none" />

          <dl className="relative mt-5 border-t border-line pt-5">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-sm font-medium text-muted">On this route</dt>
              <dd className="rounded-full border border-line-strong px-3 py-1 text-xs text-muted">Simulated</dd>
            </div>
            <dd className="mt-2.5 text-lg font-medium leading-relaxed text-ink">{frame.focusTitle}</dd>
            <dd className="mt-1.5 text-sm leading-relaxed text-muted">{frame.focusText}</dd>
            <dd className="mt-5 flex items-center justify-between gap-4">
              <a
                href="#flow-lab"
                onClick={onExplore}
                className="link-draw inline-flex min-h-11 items-center text-sm font-medium text-accent"
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
