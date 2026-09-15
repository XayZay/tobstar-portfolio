import { certifications, skillGroups } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export const Stack = () => (
  <Section
    id="stack"
    index="04"
    label="Stack"
    title="What I work with."
    intro="Grouped by domain. No proficiency scores — they don't mean anything, and the projects above show the actual depth."
  >
    <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {skillGroups.map((group, i) => (
        <Reveal key={group.label} delay={i * 50}>
          <div className="border-t border-line pt-5">
            <h3 className="meta text-accent">{group.label}</h3>
            <ul className="mt-5 space-y-2">
              {group.items.map((item) => (
                <li key={item} className="font-mono text-[0.8125rem] leading-relaxed text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>

    {/* ---- Certifications ---- */}
    <div className="mt-24 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <Reveal>
        <div className="border-t border-line-strong pt-7">
          <p className="meta text-dim">Certifications</p>
          <ul className="mt-6 divide-y divide-line">
            {certifications.earned.map((cert) => (
              <li
                key={`${cert.name}-${cert.issuer}`}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5"
              >
                <span className="text-[0.925rem] text-ink">{cert.name}</span>
                <span className="meta text-dim">{cert.issuer}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="border-t border-line pt-7">
          <p className="meta text-dim">
            In progress
            <span className="ml-2 text-line-strong" aria-hidden="true">
              /
            </span>
            <span className="ml-2 normal-case tracking-normal text-dim">not yet earned</span>
          </p>

          <ul className="mt-6 space-y-4">
            {certifications.inView.map((cert) => (
              <li
                key={cert.name}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border border-dashed border-line-strong px-4 py-3.5"
              >
                <span className="text-[0.925rem] text-muted">{cert.name}</span>
                <span className="meta text-dim">{cert.issuer}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-xs leading-relaxed text-dim">
            Listed as targets I'm currently studying toward, not as credentials held.
          </p>
        </div>
      </Reveal>
    </div>
  </Section>
);
