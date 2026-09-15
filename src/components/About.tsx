import { about } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export const About = () => (
  <Section id="about" index="05" label="About">
    <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
      <div>
        {about.paragraphs.map((paragraph, i) => (
          <Reveal key={i} delay={i * 70}>
            <p
              className={
                i === 0
                  ? "max-w-measure text-xl leading-[1.65] text-ink md:text-2xl md:leading-[1.6]"
                  : "mt-7 max-w-measure text-[0.975rem] leading-[1.8] text-muted"
              }
            >
              {paragraph}
            </p>
          </Reveal>
        ))}
      </div>

      {/* Trajectory — the story as a vertical progression. */}
      <Reveal delay={140}>
        <div className="border-t border-line pt-7 lg:mt-2">
          <p className="meta text-dim">Trajectory</p>

          <ol className="mt-7">
            {about.trajectory.map((step, i) => {
              const isCurrent = step.state === "current";
              const isLast = i === about.trajectory.length - 1;

              return (
                <li key={step.stage} className="relative flex gap-5 pb-7 last:pb-0">
                  {/* rail */}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[3.5px] top-3 h-full w-px bg-line-strong"
                    />
                  )}

                  <span className="relative mt-[7px] flex h-2 w-2 shrink-0">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isCurrent ? "bg-accent" : "border border-line-strong bg-base"
                      }`}
                    />
                    {isCurrent && (
                      <span className="status-dot absolute inset-0 rounded-full bg-accent" />
                    )}
                  </span>

                  <span>
                    <span
                      className={`block text-[0.95rem] ${isCurrent ? "text-ink" : "text-muted"}`}
                    >
                      {step.stage}
                    </span>
                    <span className="meta mt-1 block text-dim">
                      {isCurrent ? "current focus" : step.state}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </Reveal>
    </div>
  </Section>
);
