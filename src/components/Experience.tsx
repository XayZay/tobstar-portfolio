import { experience } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export const Experience = () => (
  <Section
    id="experience"
    index="02"
    label="Field experience"
    title="Hands on physical infrastructure."
    intro="An internship on paper — but the work was real network infrastructure: commissioning, configuration, migration and support in a live corporate environment. That's the part that matters."
  >
    <div className="space-y-16">
      {experience.map((role) => (
        <Reveal as="article" key={role.company}>
          <div className="grid gap-8 border-t border-line-strong pt-8 md:grid-cols-[200px_1fr] md:gap-12 md:pt-10">
            {/* Meta column */}
            <div className="md:pt-1">
              <p className="meta text-accent">
                {role.start} — {role.end}
              </p>
              <h3 className="mt-4 text-xl font-medium text-ink">{role.role}</h3>
              <p className="mt-1.5 text-[0.95rem] text-muted">{role.company}</p>
              <p className="meta mt-2 text-dim">{role.location}</p>
            </div>

            {/* Work column */}
            <div>
              <p className="max-w-measure text-[0.975rem] leading-[1.75] text-muted">
                {role.intro}
              </p>

              <div className="mt-9 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {role.groups.map((group) => (
                  <div key={group.label} className="border-t border-line pt-4">
                    <p className="meta text-dim">{group.label}</p>
                    <ul className="mt-3.5 space-y-2.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink">
                          <span aria-hidden="true" className="mt-[0.55rem] h-px w-3 shrink-0 bg-line-strong" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);
