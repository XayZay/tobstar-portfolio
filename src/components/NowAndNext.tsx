import { upcomingProjects } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

const STATUS_LABELS = {
  idea: "Idea",
  designing: "Designing",
  building: "Building",
} as const;

export const NowAndNext = () => (
  <Section
    id="now-and-next"
    index="05"
    label="Now & Next"
    title="Ideas I’m exploring."
  >
    <div className="grid gap-x-12 gap-y-12 md:grid-cols-2 md:gap-y-16">
      {upcomingProjects.map((project, i) => (
        <Reveal key={project.id} delay={(i % 2) * 70}>
          <article className="h-full">
            <a
              href={`/ideas/${project.id}`}
              className="group block h-full border-t border-line-strong pt-6 transition-colors hover:border-accent focus-visible:outline-none md:pt-7"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="max-w-[30ch] text-xl font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                  {project.title}
                </h3>
              <span className="meta shrink-0 border border-line-strong px-2.5 py-1.5 text-muted">
                {STATUS_LABELS[project.status]}
              </span>
              </div>

            <div className="mt-7 space-y-5">
              <div>
                <p className="meta text-dim">Problem</p>
                <p className="mt-2.5 max-w-measure text-sm leading-[1.75] text-muted">
                  {project.problem}
                </p>
              </div>
              <div>
                <p className="meta text-dim">Approach</p>
                <p className="mt-2.5 max-w-measure text-sm leading-[1.75] text-ink">
                  {project.approach}
                </p>
              </div>
              {project.openQuestions && project.openQuestions.length > 0 && (
                <div>
                  <p className="meta text-dim">Open question</p>
                  <ul className="mt-2.5 space-y-2.5">
                    {project.openQuestions.map((question) => (
                      <li
                        key={question}
                        className="flex gap-3 text-sm leading-[1.75] text-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.7rem] h-px w-3 shrink-0 bg-line-strong"
                        />
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
              <span className="link-draw meta mt-7 text-accent">
                Explore idea
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </article>
        </Reveal>
      ))}
    </div>
  </Section>
);
