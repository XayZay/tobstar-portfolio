import { Ext, Flag, Label, Led, stackLine, Wiring } from "@/components/bits";
import { orderedProjects, routes } from "@/lib/site";

const ProjectDetail = ({ slug }: { slug: string }) => {
  const i = orderedProjects.findIndex((x) => x.slug === slug);
  const p = orderedProjects[i];
  const cs = p.caseStudy!;
  const prev = orderedProjects[i - 1];
  const next = orderedProjects[i + 1];

  return (
    <article className="wrap">
      <a className="back" href={routes.work}>
        ← All work
      </a>
      <header className="case-head">
        <p className="case-meta">
          <Label>{p.category}</Label>
          <span className="mono muted">
            {p.n} · {p.year}
          </span>
          {p.hackathon && <Flag>{p.hackathon}</Flag>}
        </p>
        <h1>{p.title}</h1>
        <p className="sub">{p.subtitle}</p>
        <p className="lede">{p.summary}</p>
        <p className="links">{p.github ? <Ext href={p.github}>Code on GitHub ↗</Ext> : <span className="muted">No public repo for this one. It was a lab.</span>}</p>
      </header>

      {cs.disclosure && (
        <aside className="plate warn" aria-label="Lab only">
          <p>
            <Label>Lab only</Label>
          </p>
          <p>{cs.disclosure}</p>
        </aside>
      )}

      <div className="pa-grid">
        <section className="plate">
          <div>
            <Label>The problem</Label>
          </div>
          <p>{cs.problem}</p>
        </section>
        <section className="plate">
          <div>
            <Label>How I approached it</Label>
          </div>
          <p>{cs.approach}</p>
        </section>
      </div>

      {cs.diagram && <Wiring caption={cs.diagram.caption} layers={cs.diagram.layers} />}

      <section className="block" aria-labelledby="parts-h">
        <h2 id="parts-h" style={{ marginBottom: 28 }}>
          How it's put together
        </h2>
        <dl className="sections">
          {cs.sections.map((s) => (
            <div key={s.label}>
              <dt>
                <Label>{s.label}</Label>
              </dt>
              <dd>{s.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="block glance" aria-labelledby="glance-h">
        <div>
          <h2 id="glance-h" style={{ marginBottom: 18 }}>
            At a glance
          </h2>
          <ul>
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <div>
          <p style={{ marginBottom: 12 }}>
            <Label>Built with</Label>
          </p>
          <p className="mono" style={{ fontSize: ".9rem", lineHeight: 1.8 }}>
            {stackLine(p.stack)}
          </p>
        </div>
      </section>

      <section className="block" aria-labelledby="dec-h">
        <h2 id="dec-h" style={{ marginBottom: 28 }}>
          Decisions, and why
        </h2>
        <div className="qa">
          {cs.decisions.map((d) => (
            <div key={d.question} className={cs.decisions.length === 1 ? "plate solo" : "plate"}>
              <h3>{d.question}</h3>
              <p>{d.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="learn-h">
        <h2 id="learn-h" style={{ marginBottom: 22 }}>
          What I took away
        </h2>
        <ul className="lit">
          {cs.learned.map((l) => (
            <li key={l}>
              <Led on />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </section>

      <nav className="pager" aria-label="More projects">
        {prev ? (
          <a href={routes.project(prev.slug)}>
            <span>← {prev.n}</span>
            {prev.title}
          </a>
        ) : (
          <a href={routes.work}>
            <span>←</span>All work
          </a>
        )}
        {next ? (
          <a className="next" href={routes.project(next.slug)}>
            <span>{next.n} →</span>
            {next.title}
          </a>
        ) : (
          <a className="next" href={routes.work}>
            <span>→</span>All work
          </a>
        )}
      </nav>
    </article>
  );
};

export default ProjectDetail;
