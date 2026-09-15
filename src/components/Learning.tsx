import { education, learning } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export const Learning = () => (
  <Section
    id="learning"
    index="03"
    label="Learning"
    title="Actively building toward cloud engineering."
    intro="This section is study, not experience — and it's deliberately separate from the work above. It's what I'm working through now to get from a networking and security foundation to cloud infrastructure."
  >
    <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      {/* ---- Programme + education ---- */}
      <div className="space-y-12">
        <Reveal>
          <div className="border-t border-line-strong pt-7">
            <p className="meta text-dim">Professional development</p>
            <h3 className="mt-4 text-xl font-medium text-ink">{learning.program.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {learning.program.facilitator}
            </p>

            <ul className="mt-6 space-y-2.5">
              {learning.program.tracks.map((track) => (
                <li
                  key={track.name}
                  className={`flex items-center gap-3 text-sm ${
                    track.emphasis ? "text-ink" : "text-muted"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-px w-4 shrink-0 ${
                      track.emphasis ? "bg-accent" : "bg-line-strong"
                    }`}
                  />
                  {track.name}
                  {track.emphasis && (
                    <span className="meta text-accent/80">primary</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="border-t border-line pt-7">
            <p className="meta text-dim">Education</p>
            {education.map((item) => (
              <div key={item.school} className="mt-4">
                <h3 className="text-xl font-medium text-ink">{item.school}</h3>
                <p className="mt-2 text-sm text-muted">{item.degree}</p>
                <p className="meta mt-2.5 text-dim">
                  {item.location} · {item.end}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ---- Self-directed study ---- */}
      <Reveal delay={140}>
        <div className="border-t border-line-strong pt-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p className="meta text-accent">{learning.selfDirected.label}</p>
            <p className="meta text-dim">Self-directed</p>
          </div>

          <p className="mt-4 max-w-measure text-sm leading-relaxed text-muted">
            {learning.selfDirected.intro}
          </p>

          <div className="mt-9 space-y-8">
            {learning.selfDirected.groups.map((group) => (
              <div key={group.label} className="border-t border-line pt-4">
                <p className="meta text-dim">{group.label}</p>
                <ul className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="font-mono text-[0.8125rem] text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </Section>
);
