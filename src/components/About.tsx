import { education, experience, experienceHighlights, focusAreas } from '@/data/portfolio';

export const About = () => {
  return (
    <section id="about" className="mx-auto max-w-[980px] px-5 py-24">
      <div className="border-t border-[#d8d3c5] pt-7">
        <p className="mb-10 font-mono text-xs uppercase tracking-[0.32em] text-[#77736a]">Now</p>

        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-serif text-4xl leading-tight text-[#1f1f1d] md:text-5xl">
              Building cloud and network engineering depth before graduation.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#605c54]">
              My current focus is infrastructure that has a real operating surface: AWS deployments, network commissioning, firewall labs, backend services, and documentation that makes systems easier to support.
            </p>
          </div>

          <div className="space-y-7">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-[#77736a]">Education</p>
              {education.map((item) => (
                <div key={item.school} className="border-l border-[#d8d3c5] pl-5">
                  <h3 className="font-serif text-2xl text-[#1f1f1d]">{item.school}</h3>
                  <p className="mt-1 text-[#605c54]">{item.degree}</p>
                  <p className="mt-1 font-mono text-sm text-[#77736a]">{item.start} - {item.end} · {item.location}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-[#77736a]">Current Work</p>
              {experience.map((item) => (
                <div key={item.company} className="border-l border-[#d8d3c5] pl-5">
                  <h3 className="font-serif text-2xl text-[#1f1f1d]">{item.role}</h3>
                  <p className="mt-1 text-[#605c54]">{item.company} · {item.location}</p>
                  <p className="mt-1 font-mono text-sm text-[#77736a]">{item.start} - {item.end}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {experienceHighlights.map((item) => (
            <p key={item} className="border-t border-[#d8d3c5] pt-4 text-sm leading-7 text-[#4c4a45]">
              {item}
            </p>
          ))}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {focusAreas.map((feature) => (
            <div key={feature.title} className="border-t border-[#d8d3c5] pt-5">
              <h3 className="font-serif text-2xl text-[#1f1f1d]">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#605c54]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
