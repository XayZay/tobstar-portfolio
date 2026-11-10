import { useState } from "react";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { FlowLabSection } from "@/components/FlowLabSection";
import { Learning } from "@/components/Learning";
import { NowAndNext } from "@/components/NowAndNext";
import { SelectedWork } from "@/components/SelectedWork";
import { Stack } from "@/components/Stack";
import { projects } from "@/data/portfolio";

export const WorkPage = () => <SelectedWork />;

export const LabPage = () => {
  const [requestedScenarioId, setRequestedScenarioId] = useState<string | null>(null);
  return <FlowLabSection requestedScenarioId={requestedScenarioId} onScenarioOpened={() => setRequestedScenarioId(null)} />;
};

export const FieldNotesPage = () => <><Learning /><NowAndNext /><Stack /></>;

export const AboutPage = () => <><About /><Experience /><Contact /></>;

export const HackathonsPage = () => {
  const hackathonProjects = projects.filter((project) => project.hackathon);
  return (
    <section className="shell pt-32 md:pt-40" aria-labelledby="hackathons-heading">
      <p className="text-sm font-medium text-accent">Hackathons</p>
      <h1 id="hackathons-heading" className="mt-5 max-w-[10ch] text-[clamp(3rem,7vw,7rem)] font-semibold leading-[.9] text-ink display-tight">Built under a deadline.</h1>
      <p className="mt-7 max-w-[58ch] text-[1.05rem] leading-[1.7] text-muted">These projects began as hackathon work. They also live in the main project archive, where each has its own case study.</p>
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {hackathonProjects.map((project) => (
          <a key={project.slug} href={`/projects/${project.slug}`} className="group border border-line-strong p-7 transition-colors hover:border-accent md:p-10">
            <p className="text-sm font-medium text-accent">{project.hackathon}</p>
            <h2 className="mt-12 text-[clamp(2.2rem,4vw,4.2rem)] font-semibold leading-[.95] text-ink display-tight transition-colors group-hover:text-accent">{project.title}</h2>
            <p className="mt-4 max-w-[40ch] text-sm leading-[1.7] text-muted">{project.summary}</p>
            <span className="mt-8 inline-block text-sm font-medium text-accent">Read project ↗</span>
          </a>
        ))}
      </div>
    </section>
  );
};
