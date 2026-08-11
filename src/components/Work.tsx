import { experience, experienceHighlights } from "@/data/portfolio";

export const Work = () => {
  return (
    <section id="work" className="mx-auto max-w-[980px] px-5 py-24">
      <div className="border-t border-[#d8d3c5] pt-7">
        <div className="mb-12 grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#77736a]">Work</p>
          <div>
            <h1 className="font-serif text-4xl leading-tight text-[#1f1f1d] md:text-5xl">
              Experience building and supporting real infrastructure.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#605c54]">
              Current work is centered on network commissioning, infrastructure support, firewall configuration,
              asset management, and practical documentation.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#d8d3c5] border-y border-[#d8d3c5]">
          {experience.map((item) => (
            <article key={item.company} className="grid gap-6 py-8 md:grid-cols-[120px_1fr]">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#77736a]">
                {item.start} - {item.end}
              </div>

              <div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline">
                  <h2 className="font-serif text-3xl leading-tight text-[#1f1f1d]">{item.company}</h2>
                  <p className="text-sm text-[#77736a]">{item.role}</p>
                </div>

                <p className="mt-2 font-mono text-sm text-[#77736a]">{item.location}</p>

                <ul className="mt-5 space-y-3">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="text-sm leading-7 text-[#4c4a45]">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {experienceHighlights.map((item) => (
            <p key={item} className="border-t border-[#d8d3c5] pt-4 text-sm leading-7 text-[#4c4a45]">
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
