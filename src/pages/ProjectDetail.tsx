import { FlowDiagram } from "@/components/FlowDiagram";
import { Reveal } from "@/components/Reveal";
import { projects, type Project } from "@/data/portfolio";

const Rule = ({ label }: { label: string }) => (
  <p className="meta border-t border-line pt-5 text-dim">{label}</p>
);

const ProjectDetail = ({ project }: { project: Project }) => {
  const cs = project.caseStudy;

  // Cycle through the projects that actually have a case-study page.
  const withPages = projects.filter((p) => p.caseStudy);
  const currentIndex = withPages.findIndex((p) => p.slug === project.slug);
  const next = withPages.length > 1 ? withPages[(currentIndex + 1) % withPages.length] : null;

  return (
    <article className="pt-32 md:pt-40">
      {/* ---- Header ---- */}
      <header className="shell">
        <Reveal>
          <a
            href="/#work"
            className="group meta inline-flex items-center gap-2 text-dim transition-colors hover:text-accent"
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3 transition-transform duration-300 ease-editorial group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M13 8H3M7 4L3 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All work
          </a>
        </Reveal>

        <Reveal delay={60}>
          <p className="meta mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-dim">
            <span className="text-accent">{project.index}</span>
            <span aria-hidden="true" className="text-line-strong">/</span>
            <span>{project.category}</span>
            <span aria-hidden="true" className="text-line-strong">/</span>
            <span>{project.year}</span>
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mt-7 max-w-[18ch] text-display-sm font-medium text-ink display-tight">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-muted md:text-xl">{project.subtitle}</p>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-12 grid gap-10 border-t border-line-strong pt-8 md:grid-cols-[1fr_260px] md:gap-16">
            <p className="max-w-measure text-[0.975rem] leading-[1.8] text-muted md:text-base">
              {project.summary}
            </p>

            <div>
              <p className="meta text-dim">Stack</p>
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                {project.stack.map((t) => (
                  <li key={t} className="font-mono text-xs text-ink">
                    {t}
                  </li>
                ))}
              </ul>

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw mt-7 inline-flex text-sm text-accent"
                >
                  Repository
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M4 12L12 4M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </header>

      {cs && (
        <div className="shell mt-24 md:mt-32">
          {/* Responsible-use framing, where it applies. */}
          {cs.disclosure && (
            <Reveal>
              <aside className="mb-20 border-l-2 border-accent/60 bg-raised/40 py-5 pl-6 pr-5">
                <p className="meta text-accent">Scope & disclosure</p>
                <p className="mt-3 max-w-measure text-sm leading-[1.75] text-muted">
                  {cs.disclosure}
                </p>
              </aside>
            </Reveal>
          )}

          {/* ---- Problem / Approach ---- */}
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <Rule label="Problem" />
              <p className="mt-5 text-[0.975rem] leading-[1.8] text-ink">{cs.problem}</p>
            </Reveal>
            <Reveal delay={70}>
              <Rule label="Approach" />
              <p className="mt-5 text-[0.975rem] leading-[1.8] text-ink">{cs.approach}</p>
            </Reveal>
          </div>

          {/* ---- Architecture ---- */}
          {cs.diagram && (
            <Reveal className="mt-24 md:mt-32">
              <Rule label="Architecture" />
              <div className="mt-8">
                <FlowDiagram {...cs.diagram} />
              </div>
            </Reveal>
          )}

          {/* ---- Implementation ---- */}
          <Reveal className="mt-24 md:mt-32">
            <Rule label="Implementation" />
          </Reveal>

          <div className="mt-10 space-y-px bg-line">
            {cs.sections.map((section, i) => (
              <Reveal key={section.label} delay={i * 50}>
                <div className="grid gap-4 bg-base py-8 md:grid-cols-[200px_1fr] md:gap-12">
                  <h2 className="meta text-accent">{section.label}</h2>
                  <p className="max-w-measure text-[0.95rem] leading-[1.8] text-muted">
                    {section.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ---- Decisions ---- */}
          {cs.decisions.length > 0 && (
            <>
              <Reveal className="mt-24 md:mt-32">
                <Rule label="Engineering decisions" />
              </Reveal>

              <div className="mt-10 grid gap-x-16 gap-y-12 md:grid-cols-2">
                {cs.decisions.map((d, i) => (
                  <Reveal key={d.question} delay={i * 50}>
                    <h2 className="max-w-[34ch] text-[1.0625rem] font-medium leading-snug text-ink">
                      {d.question}
                    </h2>
                    <p className="mt-4 max-w-measure text-[0.925rem] leading-[1.8] text-muted">
                      {d.answer}
                    </p>
                  </Reveal>
                ))}
              </div>
            </>
          )}

          {/* ---- Learned ---- */}
          <Reveal className="mt-24 md:mt-32">
            <Rule label="What I took from it" />
            <ul className="mt-8 space-y-5">
              {cs.learned.map((item) => (
                <li key={item} className="flex max-w-measure gap-4 text-[0.975rem] leading-[1.75] text-ink">
                  <span aria-hidden="true" className="mt-[0.7rem] h-px w-5 shrink-0 bg-accent/60" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      )}

      {/* ---- Next project ---- */}
      {next && (
        <div className="shell mt-28 md:mt-36">
          <a
            href={`/projects/${next.slug}`}
            className="group block border-t border-line pt-8 transition-colors duration-300 hover:border-accent"
          >
            <p className="meta text-dim">Next project</p>
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <h2 className="text-2xl font-medium text-ink transition-colors duration-200 group-hover:text-accent md:text-3xl">
                {next.title}
              </h2>
              <span className="meta flex items-center gap-2 text-dim transition-colors group-hover:text-accent">
                {next.category}
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </a>
        </div>
      )}
    </article>
  );
};

export default ProjectDetail;
