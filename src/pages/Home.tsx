import type { CSSProperties } from "react";
import { currentFocus, profile, upcomingProjects } from "@/data/portfolio";
import { scenarios } from "@/data/flowLab";
import { BigUnit, ContactPlate, Label, Led, Photo, ProjectUnit, Run } from "@/components/bits";
import { hackathonProjects, orderedProjects, routes } from "@/lib/site";

const door = (cord: string) => ({ "--cord": `var(--cord-${cord})` }) as CSSProperties;

const Home = () => (
  <>
    <section className="wrap hero" aria-label="Introduction">
      <div>
        <Label>{profile.location}</Label>
        <h1 className="name">
          {profile.name.split(" ").map((part, i) => (
            <span key={part}>
              {i > 0 && <br />}
              {part}
            </span>
          ))}
        </h1>
        <p className="pos">{profile.positioning}</p>
        <p className="lede">{profile.elaboration}</p>
        <div className="actions">
          <a className="btn" href={routes.work}>
            <Led on />
            Read the case studies
          </a>
          <a className="textlink" href={routes.about}>
            How to reach me →
          </a>
          <a className="textlink" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
            CV (PDF) ↗
          </a>
        </div>
      </div>
      <div className="hero-side">
        <Photo tag={profile.short} />
        <div className="plate now ears" aria-label={currentFocus.label}>
          <span className="row">
            <Led on />
            <Label>Now</Label>
          </span>
          <strong>{currentFocus.value}</strong>
          <p>{currentFocus.detail}</p>
          <a className="textlink" href={routes.notes} style={{ fontSize: ".95rem" }}>
            What I'm studying →
          </a>
        </div>
      </div>
    </section>

    <section className="wrap block" aria-labelledby="path-h">
      <div className="sec-head">
        <div>
          <Label>The route here</Label>
          <h2 id="path-h">Cabling first, cloud now.</h2>
        </div>
        <a className="textlink" href={routes.about}>
          The longer version →
        </a>
      </div>
      <Run />
    </section>

    <section className="wrap block" aria-labelledby="work-h">
      <div className="sec-head">
        <div>
          <Label>Selected work</Label>
          <h2 id="work-h">Things I built, and how they run.</h2>
        </div>
        <p className="muted" style={{ maxWidth: "40ch" }}>
          Start with 01. It's where the infrastructure thinking is.
        </p>
      </div>
      <div className="rack">
        <BigUnit p={orderedProjects[0]} />
        {orderedProjects.slice(1, 4).map((p) => (
          <ProjectUnit key={p.slug} p={p} />
        ))}
      </div>
      <p style={{ marginTop: 22 }}>
        <a className="textlink" href={routes.work}>
          All {orderedProjects.length} projects, plus my final year project →
        </a>
      </p>
    </section>

    <section className="wrap block" aria-labelledby="more-h">
      <div className="sec-head">
        <div>
          <Label>Patch into</Label>
          <h2 id="more-h">The rest of the site</h2>
        </div>
      </div>
      <div className="doors">
        <a className="plate door" href={routes.lab()} style={door("lab")}>
          <span className="plug" aria-hidden="true" />
          <h3>Flow Lab</h3>
          <p>Step through {scenarios.length} architectures from my hands-on cloud labs, one hop at a time.</p>
          <span className="go">Open the lab →</span>
        </a>
        <a className="plate door" href={routes.notes} style={door("notes")}>
          <span className="plug" aria-hidden="true" />
          <h3>Notes</h3>
          <p>What I'm studying, the tools I actually use, and {upcomingProjects.length} ideas I haven't built yet.</p>
          <span className="go">Read the notes →</span>
        </a>
        <a className="plate door" href={routes.hackathons} style={door("work")}>
          <span className="plug" aria-hidden="true" />
          <h3>Hackathons</h3>
          <p>{hackathonProjects.map((p) => p.title).join(" and ")}, and the events they started at.</p>
          <span className="go">See them →</span>
        </a>
        <a className="plate door" href={routes.about} style={door("about")}>
          <span className="plug" aria-hidden="true" />
          <h3>About</h3>
          <p>From cabling to cloud, where I've worked, and how to reach me.</p>
          <span className="go">Say hello →</span>
        </a>
      </div>
    </section>

    <div className="wrap block">
      <ContactPlate />
    </div>
  </>
);

export default Home;
