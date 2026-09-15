import { contact, profile } from "@/data/portfolio";
import { Reveal } from "./Reveal";

export const Contact = () => (
  <section id="contact" className="scroll-mt-24 border-t border-line" aria-labelledby="contact-heading">
    <div className="shell py-20 md:py-28 lg:py-36">
      <Reveal>
        <p className="meta flex items-center gap-2 text-dim">
          <span className="text-accent">06</span>
          <span aria-hidden="true" className="text-line-strong">
            /
          </span>
          <span>Contact</span>
        </p>
      </Reveal>

      <Reveal delay={60}>
        <h2
          id="contact-heading"
          className="mt-10 max-w-[16ch] text-display-sm font-medium text-ink display-tight"
        >
          {contact.heading}
        </h2>
      </Reveal>

      <Reveal delay={120}>
        <p className="mt-8 max-w-measure text-[0.975rem] leading-[1.8] text-muted md:text-base">
          {contact.body}
        </p>
      </Reveal>

      <Reveal delay={180}>
        <ul className="mt-14 divide-y divide-line border-y border-line">
          {contact.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-6 transition-colors duration-200"
              >
                <span className="meta text-dim transition-colors group-hover:text-accent">
                  {link.label}
                </span>
                <span className="flex items-center gap-4 text-[0.975rem] text-ink transition-colors group-hover:text-accent md:text-lg">
                  {link.value}
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 ease-editorial group-hover:translate-x-0 group-hover:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M4 12L12 4M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={240}>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 inline-flex items-center gap-2.5 border border-line-strong px-5 py-3 text-sm text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          Download résumé
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M8 3v8M4.5 7.5L8 11l3.5-3.5M3 13h10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </Reveal>
    </div>
  </section>
);
