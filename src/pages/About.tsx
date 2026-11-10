import { about, education, experience, profile } from "@/data/portfolio";
import { ContactPlate, Label, Photo, Run } from "@/components/bits";
import { routes } from "@/lib/site";

const About = () => (
  <section className="wrap">
    <header className="page-head">
      <Label>About</Label>
      <h1>Hi, I'm {profile.short}.</h1>
      <p className="lede">
        {profile.name}. {profile.positioning}
      </p>
    </header>
    <div className={profile.photo ? "about-top" : "about-top solo"}>
      <div className="letter">
        {about.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="sign">— {profile.short}</p>
      </div>
      {profile.photo && (
        <div>
          <Photo tag={profile.short} />
        </div>
      )}
    </div>

    <section className="block" aria-labelledby="tr-h">
      <div className="sec-head">
        <div>
          <Label>The route</Label>
          <h2 id="tr-h">Networking, security, backend, cloud</h2>
        </div>
      </div>
      <Run />
    </section>

    <section className="block" aria-labelledby="exp-h">
      <div className="sec-head">
        <div>
          <Label>Experience</Label>
          <h2 id="exp-h">Hands on physical infrastructure</h2>
        </div>
      </div>
      {experience.map((x) => (
        <div className="plate ears" key={x.company} style={{ padding: "28px 38px" }}>
          <p className="mono muted">
            {x.start} – {x.end} · {x.location}
          </p>
          <h3 style={{ fontSize: "1.6rem", marginTop: 10 }}>{x.role}</h3>
          <p style={{ fontWeight: 650, color: "var(--muted)" }}>{x.company}</p>
          <p style={{ maxWidth: "66ch", marginTop: 10 }}>{x.intro}</p>
          <div className="groups">
            {x.groups.map((g) => (
              <div key={g.label}>
                <Label>{g.label}</Label>
                <ul>
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>

    <section className="block" aria-labelledby="edu-h">
      <div className="sec-head">
        <div>
          <Label>Education</Label>
          <h2 id="edu-h">School</h2>
        </div>
      </div>
      {education.map((e) => (
        <div className="plate ears" key={e.school} style={{ maxWidth: 780, padding: "24px 38px" }}>
          <p className="mono muted">{e.end}</p>
          <h3 style={{ marginTop: 8 }}>{e.degree}</h3>
          <p className="muted">
            {e.school} · {e.location}
          </p>
          <p style={{ marginTop: 8 }}>
            My final year project is in <a href={routes.work}>Work</a>.
          </p>
        </div>
      ))}
    </section>

    <div className="block">
      <ContactPlate />
    </div>
  </section>
);

export default About;
