import { certifications, currentFocus, learning, skillGroups, upcomingProjects, type UpcomingProject } from "@/data/portfolio";
import { Flag, Label, Led, stackLine } from "@/components/bits";
import { ideaStatusLabel, routes } from "@/lib/site";

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export const Notes = () => (
  <section className="wrap">
    <header className="page-head">
      <Label>Notes</Label>
      <h1>What I'm learning, using and building toward.</h1>
      <p className="lede">The things that don't belong in the project list: what I'm studying, the tools I reach for, and ideas I haven't built yet.</p>
    </header>

    <section className="block now-grid" aria-labelledby="now-h" style={{ paddingTop: 48 }}>
      <div className="plate ears" style={{ padding: "24px 34px" }}>
        <p style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Led on />
          <Label>{currentFocus.label}</Label>
        </p>
        <h2 id="now-h" style={{ fontSize: "1.6rem" }}>
          {currentFocus.value}
        </h2>
        <p className="muted" style={{ marginTop: 8 }}>
          {currentFocus.detail}
        </p>
      </div>
      <div className="plate">
        <div>
          <Label>Programme</Label>
        </div>
        <h3>{learning.program.name}</h3>
        <p className="muted" style={{ marginTop: 6 }}>
          {learning.program.note}, {lowerFirst(learning.program.facilitator)}. This is professional development, not a job.
        </p>
        <ul className="tracks">
          {learning.program.tracks.map((t) => (
            <li key={t.name}>
              <Led on={t.emphasis} />
              {t.name}
              {t.emphasis && <Flag style={{ fontSize: ".95rem" }}>Main track</Flag>}
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="block" aria-labelledby="study-h">
      <div className="sec-head">
        <div>
          <Label>{learning.selfDirected.label}</Label>
          <h2 id="study-h">Studying right now</h2>
        </div>
        <p className="muted" style={{ maxWidth: "44ch" }}>
          {learning.selfDirected.intro}
        </p>
      </div>
      <div className="study">
        {learning.selfDirected.groups.map((g) => (
          <div className="plate" key={g.label}>
            <div>
              <Label>{g.label}</Label>
            </div>
            <ul className="inline-list">
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    <section className="block" aria-labelledby="ideas-h">
      <div className="sec-head">
        <div>
          <Label>Now &amp; next</Label>
          <h2 id="ideas-h">Ideas I keep coming back to</h2>
        </div>
        <p className="muted">None of these exist yet.</p>
      </div>
      <div className="study">
        {upcomingProjects.map((u) => (
          <a className="plate idea" key={u.id} href={routes.idea(u.id)}>
            <div>
              <Label>{ideaStatusLabel[u.status]}</Label>
            </div>
            <h3>{u.title}</h3>
            <dl>
              <dt>The problem</dt>
              <dd>{u.problem}</dd>
              <dt>The idea</dt>
              <dd>{u.approach}</dd>
            </dl>
            <span className="go">More on this →</span>
          </a>
        ))}
      </div>
    </section>

    <section className="block" aria-labelledby="tools-h">
      <div className="sec-head">
        <div>
          <Label>Tools</Label>
          <h2 id="tools-h">What I actually work with</h2>
        </div>
        <p className="muted">No skill bars. The projects show the depth.</p>
      </div>
      <div className="tools">
        {skillGroups.map((g) => (
          <div key={g.label}>
            <span>
              <Label>{g.label}</Label>
            </span>
            <ul className="inline-list">
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    <section className="block" aria-labelledby="certs-h">
      <div className="sec-head">
        <div>
          <Label>Certifications</Label>
          <h2 id="certs-h">Earned, and working toward</h2>
        </div>
      </div>
      <div className="certs">
        <div className="plate">
          <div>
            <Label>Earned</Label>
          </div>
          <ul className="certlist">
            {certifications.earned.map((c) => (
              <li key={`${c.name}-${c.issuer}`}>
                <Led on />
                <span>
                  {c.name}
                  <small>{c.issuer}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="plate">
          <div>
            <Label>Working toward</Label>
          </div>
          <p className="muted">Studying for these. I don't hold them yet.</p>
          <ul className="certlist">
            {certifications.inView.map((c) => (
              <li key={c.name}>
                <Led />
                <span>
                  {c.name}
                  <small>{c.issuer}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  </section>
);

export const IdeaDetail = ({ idea: u }: { idea: UpcomingProject }) => (
  <article className="wrap">
    <a className="back" href={routes.notes}>
      ← Notes
    </a>
    <header className="case-head">
      <p className="case-meta">
        <Label>Now &amp; next</Label>
        <Label>{ideaStatusLabel[u.status]}</Label>
      </p>
      <h1>{u.title}</h1>
      <p className="sub">An idea, not a project yet.</p>
    </header>
    <div className="pa-grid" style={{ marginTop: 36 }}>
      <section className="plate">
        <div>
          <Label>The problem</Label>
        </div>
        <p>{u.problem}</p>
      </section>
      <section className="plate">
        <div>
          <Label>The idea</Label>
        </div>
        <p>{u.approach}</p>
      </section>
    </div>
    <section className="block" style={{ maxWidth: 780, display: "grid", gap: 18, paddingTop: 44 }}>
      {u.detail.map((d) => (
        <p key={d} style={{ fontSize: "1.1rem" }}>
          {d}
        </p>
      ))}
    </section>
    {u.openQuestions && u.openQuestions.length > 0 && (
      <section className="block" style={{ paddingTop: 36 }}>
        <div className="plate" style={{ maxWidth: 700 }}>
          <div>
            <Label>Open questions</Label>
          </div>
          <ul style={{ paddingLeft: "1.1em", display: "grid", gap: 6 }}>
            {u.openQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      </section>
    )}
    {u.tags && u.tags.length > 0 && (
      <p className="mono muted" style={{ marginTop: 28 }}>
        {stackLine(u.tags)}
      </p>
    )}
    <nav className="pager" aria-label="More ideas">
      {upcomingProjects
        .filter((x) => x.id !== u.id)
        .map((x) => (
          <a key={x.id} href={routes.idea(x.id)}>
            <span>Idea</span>
            {x.title}
          </a>
        ))}
    </nav>
  </article>
);
