import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  /** Two-digit sequence number, e.g. "01". */
  index: string;
  label: string;
  title?: ReactNode;
  intro?: ReactNode;
  introClassName?: string;
  children: ReactNode;
  className?: string;
}

/**
 * A quiet section frame. The parts of this portfolio are destinations, so their
 * labels identify the place instead of pretending the page is a step-by-step flow.
 */
export const Section = ({
  id,
  index,
  label,
  title,
  intro,
  introClassName = "",
  children,
  className = "",
}: SectionProps) => (
  <section id={id} data-section={id} className={`scroll-mt-24 border-t border-line ${className}`} aria-labelledby={`${id}-heading`}>
    <div className="shell py-20 md:py-28 lg:py-36">
      <Reveal>
        <p className="text-sm font-medium text-accent">
          {label}
        </p>
      </Reveal>

      {title ? (
        <Reveal delay={60}>
          <h2
            id={`${id}-heading`}
            className="mt-5 max-w-[20ch] text-section font-semibold text-ink md:mt-6"
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
          <div className={`mt-5 max-w-measure text-[0.975rem] leading-[1.75] text-muted md:text-base ${introClassName}`}>
            {intro}
          </div>
        </Reveal>
      ) : null}

      <div className="mt-12 md:mt-16">{children}</div>
    </div>
  </section>
);
