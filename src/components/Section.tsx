import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  /** Two-digit sequence number, e.g. "01". */
  index: string;
  label: string;
  title?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Standard section frame: a hairline rule, a monospace `01 / LABEL` marker,
 * an optional editorial heading, then content.
 */
export const Section = ({
  id,
  index,
  label,
  title,
  intro,
  children,
  className = "",
}: SectionProps) => (
  <section id={id} className={`scroll-mt-24 border-t border-line ${className}`} aria-labelledby={`${id}-heading`}>
    <div className="shell py-20 md:py-28 lg:py-36">
      <Reveal>
        <p className="meta flex items-center gap-2 text-dim">
          <span className="text-accent">{index}</span>
          <span aria-hidden="true" className="text-line-strong">
            /
          </span>
          <span>{label}</span>
        </p>
      </Reveal>

      {title ? (
        <Reveal delay={60}>
          <h2
            id={`${id}-heading`}
            className="mt-8 max-w-[22ch] text-section font-medium text-ink md:mt-10"
          >
            {title}
          </h2>
        </Reveal>
      ) : (
        <h2 id={`${id}-heading`} className="sr-only">
          {label}
        </h2>
      )}

      {intro ? (
        <Reveal delay={120}>
          <div className="mt-6 max-w-measure text-[0.975rem] leading-[1.75] text-muted md:text-base">
            {intro}
          </div>
        </Reveal>
      ) : null}

      <div className="mt-14 md:mt-20">{children}</div>
    </div>
  </section>
);
