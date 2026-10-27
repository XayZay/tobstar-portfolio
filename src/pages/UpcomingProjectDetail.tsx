import { upcomingProjects, type UpcomingProject } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";

const UpcomingProjectDetail = ({ project }: { project: UpcomingProject }) => {
  const currentIndex = upcomingProjects.findIndex((item) => item.id === project.id);
  const next = upcomingProjects[(currentIndex + 1) % upcomingProjects.length];

  return (
    <article className="pt-32 md:pt-40">
      <header className="shell">
        <Reveal>
          <a
            href="/#now-and-next"
            className="group meta inline-flex items-center gap-2 text-dim transition-colors hover:text-accent"
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3 transition-transform duration-300 ease-editorial group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M13 8H3M7 4L3 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All ideas
          </a>
        </Reveal>

        <Reveal delay={60}>
          <p className="meta mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-dim">
            <span className="text-accent">Now & Next</span>
            <span aria-hidden="true" className="text-line-strong">/</span>
            <span>Idea · not built</span>
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mt-7 max-w-[22ch] text-display-sm font-medium text-ink display-tight">
            {project.title}
          </h1>
          <span className="meta mt-6 inline-flex border border-line-strong px-3 py-2 text-muted">
            Idea
          </span>
        </Reveal>

        <div className="mt-12 grid gap-10 border-t border-line-strong pt-8 md:grid-cols-[1fr_260px] md:gap-16">
          <Reveal>
            <div>
              <p className="meta text-dim">Problem</p>
              <p className="mt-4 max-w-measure text-[0.975rem] leading-[1.8] text-ink md:text-base">
                {project.problem}
              </p>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <p className="max-w-[32ch] text-sm leading-[1.8] text-muted">
              An idea under consideration. This page describes a possible direction, not a completed or available project.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="shell mt-24 md:mt-32">
        <Reveal>
          <p className="meta border-t border-line pt-5 text-dim">Proposed approach</p>
          <p className="mt-5 max-w-measure text-[0.975rem] leading-[1.8] text-ink">
            {project.approach}
          </p>
        </Reveal>

        <div className="mt-14 space-y-8 border-t border-line pt-8 md:mt-20 md:space-y-10">
          {project.detail.map((paragraph, i) => (
            <Reveal key={paragraph} delay={i * 60}>
              <p className="max-w-measure text-[0.975rem] leading-[1.8] text-muted">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        {project.openQuestions && project.openQuestions.length > 0 && (
          <Reveal className="mt-20 md:mt-28">
            <p className="meta border-t border-line pt-5 text-dim">Open questions</p>
            <ul className="mt-7 space-y-5">
              {project.openQuestions.map((question) => (
                <li key={question} className="flex max-w-measure gap-4 text-[0.975rem] leading-[1.75] text-ink">
                  <span aria-hidden="true" className="mt-[0.7rem] h-px w-5 shrink-0 bg-accent/60" />
                  {question}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>

      <div className="shell mt-28 md:mt-36">
        <a
          href={`/ideas/${next.id}`}
          className="group block border-t border-line pt-8 transition-colors duration-300 hover:border-accent"
        >
          <p className="meta text-dim">Next idea</p>
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <h2 className="text-2xl font-medium text-ink transition-colors duration-200 group-hover:text-accent md:text-3xl">
              {next.title}
            </h2>
            <span className="meta text-dim">Idea</span>
          </div>
        </a>
      </div>
    </article>
  );
};

export default UpcomingProjectDetail;
