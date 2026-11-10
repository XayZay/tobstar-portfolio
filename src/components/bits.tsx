import { useState, type ReactNode } from "react";
import { about, additionalWork, contact, profile, type CaseStudySection } from "@/data/portfolio";
import { routes, type NumberedProject } from "@/lib/site";

/** Label-maker label. */
export const Label = ({ children }: { children: ReactNode }) => <span className="label">{children}</span>;

/** Cable flag tag, written in marker. */
export const Flag = ({ children, style }: { children: ReactNode; style?: React.CSSProperties }) => (
  <span className="flag" style={style}>
    {children}
  </span>
);

export const Led = ({ on = false }: { on?: boolean }) => <i className={on ? "led on" : "led"} aria-hidden="true" />;

export const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export const stackLine = (items: readonly string[]) => items.join(" / ");

export const RepoTag = ({ p }: { p: NumberedProject }) => (
  <span className="repo">
    <Led on={!!p.github} />
    {p.github ? "Public repo" : "Lab, no repo"}
  </span>
);

/** Shown only once a photo is set in the content file. */
export const Photo = ({ tag }: { tag: string }) =>
  profile.photo ? (
    <figure className="photo">
      <img className="photo-box" src={profile.photo} alt={`Photo of ${profile.short}`} />
      <Flag>{tag}</Flag>
    </figure>
  ) : null;

/** The route from networking to cloud, drawn as a cable run. */
export const Run = () => (
  <ol className="run">
    {about.trajectory.map((t) => (
      <li key={t.stage}>
        <span className="jackmini" aria-hidden="true">
          <Led on={t.state === "current"} />
        </span>
        <span className="stage">{t.stage}</span>
        <span className="state">{t.state === "current" ? "Where I am now" : t.state === "building" ? "Still building" : "Foundation"}</span>
      </li>
    ))}
  </ol>
);

/** One project, mounted as a rack unit. */
export const ProjectUnit = ({ p }: { p: NumberedProject }) => (
  <a className="ru proj" href={routes.project(p.slug)}>
    <div className="ru-id">
      <Label>{p.n}</Label>
      <span className="mono muted">{p.year}</span>
      <RepoTag p={p} />
    </div>
    <div>
      <p className="mono cat">{p.category}</p>
      <h3>{p.title}</h3>
      <p className="sub">{p.subtitle}</p>
      <p className="mono stack">{stackLine(p.stack)}</p>
    </div>
    <ul className="ru-hl">
      {p.highlights.slice(0, 2).map((h) => (
        <li key={h}>{h}</li>
      ))}
    </ul>
    <span className="ru-go">Read the write-up →</span>
    {p.hackathon && <Flag>{p.hackathon}</Flag>}
  </a>
);

/** The flagship, as a 2U unit with its request path cabled alongside. */
export const BigUnit = ({ p }: { p: NumberedProject }) => {
  const d = p.caseStudy?.diagram;
  return (
    <a className="ru big" href={routes.project(p.slug)}>
      <div className="big-grid">
        <div className="big-text">
          <div className="ru-id">
            <Label>{p.n}</Label>
            <span className="mono muted">
              {p.year} · {p.category}
            </span>
            <RepoTag p={p} />
          </div>
          <h3>{p.title}</h3>
          <p className="sub">{p.subtitle}</p>
          <p className="sum">{p.summary}</p>
          <p className="mono stack">{stackLine(p.stack)}</p>
          <span className="ru-go">Read the write-up →</span>
        </div>
        {d && (
          <div>
            <ol className="cable" aria-label={d.caption}>
              {d.layers.map((l) => (
                <li key={l.label}>
                  <small>{l.label}</small>
                  <span>{l.nodes[0]}</span>
                </li>
              ))}
            </ol>
            <p className="cap">{d.caption}</p>
          </div>
        )}
      </div>
    </a>
  );
};

/** Final year project: kept compact, deliberately not a full case study. */
export const FypUnit = () => (
  <>
    {additionalWork.map((w) => (
      <div className="ru fyp" key={w.title} aria-label="Final year project">
        <div className="ru-id">
          <Label>Final year project</Label>
        </div>
        <div>
          <h3>{w.title}</h3>
          <p className="muted">
            {w.context}. {w.note}
          </p>
          <p className="mono stack">{stackLine(w.stack)}</p>
        </div>
        <p className="links" style={{ fontSize: ".95rem" }}>
          <Ext href={w.paper}>Report (PDF) ↗</Ext>
          <Ext href={w.github}>Code ↗</Ext>
        </p>
      </div>
    ))}
  </>
);

export const ContactPlate = () => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const el = document.getElementById("contact-email");
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  };
  return (
    <section className="plate contact ears" aria-labelledby="contact-h">
      <div>
        <Label>Reach me</Label>
      </div>
      <h2 id="contact-h">{contact.heading}</h2>
      <p className="muted" style={{ maxWidth: "60ch" }}>
        {contact.body}
      </p>
      <div className="email-row">
        <code id="contact-email">{profile.email}</code>
        <button type="button" className="key" onClick={copy}>
          {copied ? "Copied" : "Copy email"}
        </button>
        <a className="textlink" href={`mailto:${profile.email}`}>
          Email me
        </a>
      </div>
      <p className="links">
        <Ext href={profile.github}>GitHub ↗</Ext>
        <Ext href={profile.linkedin}>LinkedIn ↗</Ext>
        <Ext href={profile.resumeUrl}>CV (PDF) ↗</Ext>
      </p>
    </section>
  );
};

/** A case study's layered diagram, drawn as devices patched together. */
export const Wiring = ({ caption, layers }: { caption: string; layers: { label: string; nodes: string[] }[] }) => (
  <figure className="plate wiring">
    <div>
      <Label>Wiring</Label>
    </div>
    <div className="layers">
      {layers.map((l, i) => (
        <div key={l.label} style={{ display: "contents" }}>
          {i > 0 && <span className="link-v" aria-hidden="true" />}
          <div className="layer">
            <span className="layer-label">{l.label}</span>
            <div className="layer-nodes">
              {l.nodes.map((n) => (
                <span className="dev" key={n}>
                  <Led />
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    <figcaption className="cap">{caption}</figcaption>
  </figure>
);

export type { CaseStudySection };
