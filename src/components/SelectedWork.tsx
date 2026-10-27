import { additionalWork, projects, type Project } from "@/data/portfolio";
import { FlowDiagram } from "./FlowDiagram";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 01 — full-width, with architecture diagram. The anchor of the section. */
const Flagship = ({ project }: { project: Project }) => (
  <Reveal as="article" className="group">
    <a href={`/projects/${project.slug}`} className="block focus-visible:outline-none">
      <div className="border-t border-line-strong pt-8 transition-colors duration-300 group-hover:border-accent md:pt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
          <p className="meta flex items-center gap-3 text-dim">
            <span className="text-accent">{project.index}</span>
            <span aria-hidden="true" className="text-line-strong">/</span>
            <span>{project.category}</span>
          </p>
          <p className="meta text-dim">{project.year}</p>
        </div>

        <h3 className="mt-7 text-display-sm font-medium text-ink display-tight">
          {project.title}
        </h3>
        <p className="mt-3 text-lg text-muted">{project.subtitle}</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="max-w-measure text-[0.975rem] leading-[1.75] text-muted">
              {project.summary}
            </p>

            <ul className="mt-8 space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3.5 text-sm leading-relaxed text-ink">
                  <span aria-hidden="true" className="mt-[0.5rem] h-px w-4 shrink-0 bg-accent/60" />
                  {h}
                </li>
              ))}
            </ul>

            <p className="mt-9 flex flex-wrap gap-x-4 gap-y-2">
              {project.stack.map((t) => (
                <span key={t} className="font-mono text-xs text-dim">
                  {t}
                </span>
              ))}
            </p>

            <span className="link-draw mt-9 inline-flex text-sm text-accent">
              Read the case study
              <Arrow className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:translate-x-1" />
            </span>
          </div>

          {project.caseStudy?.diagram && (
            <div className="lg:pt-1">
              <FlowDiagram {...project.caseStudy.diagram} />
            </div>
          )}
        </div>
      </div>
    </a>
  </Reveal>
);

/** 02+ — editorial rows. Metadata left, content right. */
const ProjectRow = ({ project, delay }: { project: Project; delay: number }) => {
  const hasPage = Boolean(project.caseStudy);

  const body = (
    <div className="grid gap-6 md:grid-cols-[140px_1fr] md:gap-10">
      <div className="md:pt-1">
        <p className="meta text-dim">
          <span className="text-accent/80">{project.index}</span>
        </p>
        <p className="meta mt-2.5 leading-relaxed text-dim">{project.category}</p>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="text-2xl font-medium text-ink transition-colors duration-200 group-hover:text-accent md:text-[1.75rem]">
            {project.title}
          </h3>
          <p className="meta text-dim">{project.year}</p>
        </div>

        <p className="mt-2 text-[0.95rem] text-muted">{project.subtitle}</p>

        <p className="mt-5 max-w-measure text-[0.925rem] leading-[1.75] text-muted">
          {project.summary}
        </p>

        <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
          {project.stack.map((t) => (
            <span key={t} className="font-mono text-xs text-dim">
              {t}
            </span>
          ))}
        </p>

        {hasPage && (
          <span className="link-draw mt-7 inline-flex text-sm text-muted transition-colors duration-200 group-hover:text-accent">
            View project
            <Arrow className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </div>
  );

  const shell = "block border-t border-line pt-8 transition-colors duration-300 md:pt-9";

  return (
    <Reveal as="article" delay={delay} className="group">
      {hasPage ? (
        <a href={`/projects/${project.slug}`} className={`${shell} group-hover:border-line-strong`}>
          {body}
        </a>
      ) : (
        <div className={shell}>{body}</div>
      )}
    </Reveal>
  );
};

export const SelectedWork = () => {
  const flagship = projects.find((p) => p.tier === "flagship");
  const featured = projects.filter((p) => p.tier === "featured");

  return (
    <Section
      id="work"
      index="01"
      label="Selected work"
      title="Things I built, and how they run."
      intro="Six projects, ordered deliberately. The first one is the one I'd want to talk about — it's where the infrastructure thinking is."
    >
      <div className="space-y-20 md:space-y-28">
        {flagship && <Flagship project={flagship} />}

        <div className="space-y-14 md:space-y-16">
          {featured.map((project, i) => (
            <ProjectRow key={project.slug} project={project} delay={i * 60} />
          ))}
        </div>

        {/* Additional work — compact, deliberately de-emphasised. */}
        <Reveal className="border-t border-line pt-9">
          <h3 className="meta text-dim">Additional work</h3>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 md:gap-10">
            {additionalWork.map((item) => (
              <li key={item.title}>
                <p className="meta text-dim">{item.context}</p>
                <h4 className="mt-3 text-[0.975rem] font-medium leading-snug text-ink">
                  {item.github ? (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw inline transition-colors hover:text-accent"
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h4>
                <p className="mt-2.5 max-w-measure text-sm leading-relaxed text-muted">
                  {item.note}
                </p>
                <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                  {item.stack.map((t) => (
                    <span key={t} className="font-mono text-xs text-dim">
                      {t}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
};
