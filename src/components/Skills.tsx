import { certifications, skillGroups } from '@/data/portfolio';

export const Skills = () => {
  return (
    <section id="skills" className="mx-auto max-w-[980px] px-5 py-24">
      <div className="border-t border-[#d8d3c5] pt-7">
        <div className="mb-12 grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#77736a]">Uses</p>
          <div>
            <h2 className="font-serif text-4xl leading-tight text-[#1f1f1d] md:text-5xl">
              Tools, platforms, and certifications.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#605c54]">
              A practical stack for cloud deployments, network support, security labs, and backend automation.
            </p>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-8">
            {skillGroups.map((category) => (
              <div key={category.title} className="border-t border-[#d8d3c5] pt-5">
                <h3 className="font-serif text-2xl text-[#1f1f1d]">{category.title}</h3>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {category.skills.map((skill) => (
                    <span key={skill} className="font-mono text-xs text-[#605c54]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#d8d3c5] pt-5">
            <h3 className="font-serif text-2xl text-[#1f1f1d]">Certifications</h3>
            <div className="mt-5 divide-y divide-[#d8d3c5]">
              {certifications.map((cert) => (
                <div key={`${cert.name}-${cert.issuer}`} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-sm font-medium text-[#1f1f1d]">{cert.name}</p>
                    <p className="mt-1 text-sm text-[#77736a]">{cert.issuer}</p>
                  </div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#0f766e]">{cert.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
