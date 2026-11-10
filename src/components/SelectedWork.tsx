import { additionalWork, projects, type Project } from "@/data/portfolio";
import { Reveal } from "./Reveal";

const Art = ({ project, large = false }: { project: Project; large?: boolean }) => {
  const variant = Number(project.index) % 4;
  return (
    <div aria-hidden="true" className={`relative min-h-[170px] overflow-hidden border border-ink/15 ${large ? "md:min-h-[360px]" : ""}`}>
      <div className={`absolute inset-0 ${variant === 0 ? "bg-[rgb(var(--raised)/.75)]" : variant === 1 ? "bg-accent/15" : variant === 2 ? "bg-signal/20" : "bg-ink/10"}`} />
      {variant === 1 && <><span className="absolute left-[15%] top-[25%] h-9 w-9 rounded-full border-2 border-accent bg-base" /><span className="absolute left-[35%] top-[42%] h-px w-[42%] bg-accent" /><span className="absolute right-[13%] top-[30%] h-16 w-16 border-2 border-accent bg-base" /><span className="absolute bottom-[14%] left-[17%] font-mono text-[0.65rem] text-accent">REQUEST → DELIVERY</span></>}
      {variant === 2 && <><span className="absolute inset-x-0 top-1/2 h-px bg-ink/25" /><span className="absolute left-[16%] top-[17%] h-[66%] w-[23%] border border-ink/35" /><span className="absolute left-[47%] top-[28%] h-[43%] w-[37%] border border-ink/45 bg-base/35" /><span className="absolute left-[23%] top-[38%] h-3 w-3 rounded-full bg-accent" /><span className="absolute right-[21%] top-[45%] h-3 w-3 rounded-full bg-signal" /></>}
      {variant === 3 && <><span className="absolute left-[12%] top-[18%] h-20 w-20 rotate-45 border-2 border-ink/45" /><span className="absolute right-[18%] top-[23%] h-10 w-10 rounded-full border-2 border-accent" /><span className="absolute bottom-[19%] left-[36%] h-px w-[48%] rotate-[-23deg] bg-accent" /><span className="absolute bottom-[12%] right-[13%] font-mono text-[0.65rem] text-ink/60">ISOLATED LAB</span></>}
      {variant === 0 && <><span className="absolute inset-5 border border-ink/25" /><span className="absolute left-[25%] top-[27%] h-[46%] w-px bg-ink/30" /><span className="absolute left-[49%] top-[27%] h-[46%] w-px bg-ink/30" /><span className="absolute left-[73%] top-[27%] h-[46%] w-px bg-ink/30" /><span className="absolute left-[17%] top-[48%] h-px w-[66%] bg-ink/30" /><span className="absolute bottom-[13%] left-[12%] font-mono text-[0.65rem] text-ink/60">OFFLINE / 43 PATHS</span></>}
      <span className="absolute right-4 top-4 font-mono text-[0.65rem] text-ink/55">{project.year}</span>
    </div>
  );
};

const ProjectTile = ({ project, large = false, delay = 0 }: { project: Project; large?: boolean; delay?: number }) => (
  <Reveal as="article" delay={delay} className={large ? "md:col-span-2" : ""}>
    <a href={`/projects/${project.slug}`} className="group block focus-visible:outline-none">
      <Art project={project} large={large} />
      <div className={`relative ${large ? "-mt-20 ml-5 mr-5 bg-base p-5 md:-mt-28 md:ml-10 md:mr-10 md:p-8" : "pt-5"}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted"><span>{project.category}</span><span className="font-mono text-accent">{project.index}</span></div>
        {project.hackathon && <span className="mt-3 inline-flex rounded-full border border-accent/40 px-2.5 py-1 text-xs font-medium text-accent">Built for {project.hackathon}</span>}
        <h3 className={`${large ? "mt-4 text-[clamp(2rem,4vw,4rem)] leading-[.98]" : "mt-3 text-2xl leading-[1.05]"} font-semibold text-ink display-tight transition-colors group-hover:text-accent`}>{project.title}</h3>
        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted">{project.subtitle}</p>
        {large && <p className="mt-5 max-w-measure text-[0.95rem] leading-[1.7] text-muted">{project.summary}</p>}
        <span className="mt-5 inline-block text-sm font-medium text-accent">Open project ↗</span>
      </div>
    </a>
  </Reveal>
);

export const SelectedWork = () => {
  const flagship = projects.find((project) => project.tier === "flagship");
  const remainder = projects.filter((project) => project.tier !== "flagship");
  return (
    <section id="work" className="scroll-mt-24 border-t border-line" aria-labelledby="work-heading">
      <div className="shell py-20 md:py-28 lg:py-36">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-[1fr_1.55fr] md:items-end md:gap-12">
            <div><p className="text-sm font-medium text-accent">Selected work</p></div>
            <div><h2 id="work-heading" className="max-w-[13ch] text-[clamp(2.6rem,5vw,5.5rem)] font-semibold leading-[.93] text-ink display-tight">Things I built and how they behave.</h2><p className="mt-5 max-w-[52ch] text-[0.975rem] leading-[1.7] text-muted">A small archive of systems, experiments and tools. Each piece starts from a different problem, so each gets a different shape.</p></div>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-x-7 gap-y-14 md:grid-cols-2 md:gap-y-20">
          {flagship && <ProjectTile project={flagship} large />}
          {remainder.map((project, index) => <ProjectTile key={project.slug} project={project} delay={index * 55} />)}
        </div>
        <Reveal className="mt-20 border-t border-line pt-8">
          <p className="text-sm font-medium text-muted">Final year project</p>
          <div className="mt-5 grid gap-7 md:grid-cols-2">{additionalWork.map((item) => <div key={item.title}><h3 className="text-lg font-medium text-ink">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{item.note}</p><div className="mt-3 flex gap-4 text-sm"><a className="text-accent underline-offset-4 hover:underline" href={item.paper} target="_blank" rel="noreferrer">Read the paper ↗</a><a className="text-accent underline-offset-4 hover:underline" href={item.github} target="_blank" rel="noreferrer">View source ↗</a></div></div>)}</div>
        </Reveal>
      </div>
    </section>
  );
};
