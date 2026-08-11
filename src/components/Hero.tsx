import { ArrowRight, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { education, metrics, profile } from '@/data/portfolio';

export const Hero = () => {
  const educationSummary = education[0]
    ? `${education[0].degree} @ ${education[0].school} · ${education[0].end}`
    : 'Cloud and network engineering portfolio';

  return (
    <section id="home" className="mx-auto min-h-[92vh] max-w-[980px] px-5 pb-24 pt-44 md:pt-56">
      <div className="max-w-3xl">
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.32em] text-[#77736a]">
          {profile.name}
        </p>

        <h1 className="font-serif text-6xl leading-[0.92] tracking-normal text-[#1f1f1d] md:text-8xl">
          Cloud Engineer
        </h1>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-[#77736a] md:text-5xl">
          Network Engineer
        </h2>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-[#605c54]">
          {educationSummary}. Based in {profile.location}. Building cloud-backed tools, commissioning networks, and documenting infrastructure from lab to production.
        </p>

        <p className="mt-6 font-mono text-sm leading-7 text-[#4c4a45]">
          $ focus: aws · networking · firewalls · docker · infrastructure · security-aware systems
        </p>

        <blockquote className="mt-8 border-l-2 border-[#0f766e] pl-5 font-serif text-lg italic text-[#1f1f1d]">
          I like infrastructure work that proves itself: deployed, monitored, documented, and understandable under pressure.
        </blockquote>

        <div className="mt-10 flex flex-wrap gap-6 text-sm">
          <a className="group inline-flex items-center gap-1 border-b border-[#1f1f1d] text-[#1f1f1d]" href="/now">
            Now <ArrowRight size={14} className="transition group-hover:translate-x-1" />
          </a>
          <a className="group inline-flex items-center gap-1 text-[#605c54] transition hover:text-[#1f1f1d]" href="/projects">
            Projects <ArrowRight size={14} className="transition group-hover:translate-x-1" />
          </a>
          <a className="group inline-flex items-center gap-1 text-[#605c54] transition hover:text-[#1f1f1d]" href="/uses">
            Uses <ArrowRight size={14} className="transition group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#d8d3c5] px-4 py-2 text-sm text-[#4c4a45] transition hover:border-[#1f1f1d] hover:text-[#1f1f1d]">
            <Github size={16} /> GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#d8d3c5] px-4 py-2 text-sm text-[#4c4a45] transition hover:border-[#1f1f1d] hover:text-[#1f1f1d]">
            <Linkedin size={16} /> LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-full border border-[#d8d3c5] px-4 py-2 text-sm text-[#4c4a45] transition hover:border-[#1f1f1d] hover:text-[#1f1f1d]">
            <Mail size={16} /> Email
          </a>
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#d8d3c5] px-4 py-2 text-sm text-[#4c4a45] transition hover:border-[#1f1f1d] hover:text-[#1f1f1d]">
            <FileText size={16} /> Resume
          </a>
        </div>
      </div>

      <div className="mt-28 border-t border-[#d8d3c5] pt-7">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.32em] text-[#77736a]">Signal</p>
        <div className="grid gap-5 md:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="font-serif text-4xl text-[#1f1f1d]">{metric.value}</div>
              <div className="mt-1 text-sm leading-6 text-[#605c54]">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
