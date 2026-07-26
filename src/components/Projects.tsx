import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/portfolio';

export const Projects = () => {
  return (
    <section id="projects" className="mx-auto max-w-[980px] px-5 py-24">
      <div className="border-t border-[#d8d3c5] pt-7">
        <div className="mb-12 grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#77736a]">Work / Projects</p>
          <div>
            <h2 className="font-serif text-4xl leading-tight text-[#1f1f1d] md:text-5xl">
              Cloud deployments, network labs, and tools that show the operating details.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#605c54]">
              Text-first because most of the strongest work here is infrastructure and backend logic, not screens.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#d8d3c5] border-y border-[#d8d3c5]">
          {projects.map((project, index) => (
            <article key={project.title} className="grid gap-6 py-8 md:grid-cols-[120px_1fr]">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#77736a]">
                {String(index + 1).padStart(2, '0')} · {project.status}
              </div>

              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="font-serif text-3xl leading-tight text-[#1f1f1d]">{project.title}</h3>
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 text-sm text-[#0f766e] transition hover:text-[#1f1f1d]"
                    >
                      Repository <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <span className="text-sm text-[#77736a]">Case study available on request</span>
                  )}
                </div>

                <p className="mt-4 max-w-3xl leading-8 text-[#4c4a45]">{project.description}</p>

                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="font-mono text-xs text-[#77736a]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
