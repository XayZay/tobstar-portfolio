import { BigUnit, Flag, FypUnit, Label, ProjectUnit, RepoTag, stackLine } from "@/components/bits";
import { hackathonProjects, orderedProjects, routes } from "@/lib/site";

export const Work = () => (
  <section className="wrap">
    <header className="page-head">
      <Label>Work</Label>
      <h1>Things I built, and how they run.</h1>
      <p className="lede">
        {orderedProjects.length} projects, in the order I'd walk you through them. Each one has a full write-up. Two started at hackathons, so they're also on the{" "}
        <a href={routes.hackathons}>hackathons page</a>.
      </p>
    </header>
    <div className="block" style={{ paddingTop: 44 }}>
      <div className="rack">
        <BigUnit p={orderedProjects[0]} />
        {orderedProjects.slice(1).map((p) => (
          <ProjectUnit key={p.slug} p={p} />
        ))}
        <FypUnit />
      </div>
    </div>
  </section>
);

export const Hackathons = () => (
  <section className="wrap">
    <header className="page-head">
      <Label>Hackathons</Label>
      <h1>Built on a deadline.</h1>
      <p className="lede">
        These started at hackathons. They also sit in <a href={routes.work}>Work</a> with everything else, each with its full write-up.
      </p>
    </header>
    <div className="block" style={{ paddingTop: 44 }}>
      <div className="rack">
        {hackathonProjects.map((p) => (
          <a key={p.slug} className="ru" href={routes.project(p.slug)}>
            <div className="ru-id">
              <Label>{p.n}</Label>
              <span className="mono muted">
                {p.year} · {p.category}
              </span>
              <RepoTag p={p} />
            </div>
            <h3 style={{ fontSize: "2rem" }}>{p.title}</h3>
            <p className="sub">{p.subtitle}</p>
            <p style={{ maxWidth: "70ch" }}>{p.summary}</p>
            <p className="mono stack">{stackLine(p.stack)}</p>
            <span className="ru-go">Read the write-up →</span>
            <Flag>{p.hackathon}</Flag>
          </a>
        ))}
      </div>
    </div>
  </section>
);
