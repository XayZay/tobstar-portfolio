import { useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/data/portfolio";
import { orderedProjects, routes } from "@/lib/site";

type Line = { id: number; node: ReactNode; dim?: boolean };

const ext = (href: string, text = href) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
);

const HELP = `commands
  whoami         who this is
  ls             list projects
  open <n|name>  open a project (e.g. open 1, open ghost-pay)
  work · lab · notes · about · hackathons · home
  cv             résumé
  contact        email, github, linkedin
  clear · exit`;

/** A small optional terminal. Opens from the footer or with the ` key. */
export const Terminal = ({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: (path: string) => void }) => {
  const [lines, setLines] = useState<Line[]>([{ id: 0, node: HELP }]);
  const [value, setValue] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const out = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    out.current?.scrollTo({ top: out.current.scrollHeight });
  }, [lines]);

  const print = (...nodes: ReactNode[]) => setLines((prev) => [...prev, ...nodes.map((node) => ({ id: nextId.current++, node }))]);

  const go = (path: string, label: string) => {
    onNavigate(path);
    print(`→ ${label}`);
  };

  const run = (raw: string) => {
    const [cmd = "", ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ");
    if (!cmd) return;
    setLines((prev) => [...prev, { id: nextId.current++, node: `$ ${raw.trim()}`, dim: true }]);
    switch (cmd.toLowerCase()) {
      case "help":
        return print(HELP);
      case "whoami":
        return print(`${profile.name} (${profile.short})\n${profile.positioning}\n${profile.location}`);
      case "ls":
      case "projects":
        return print(orderedProjects.map((p) => `${p.n}  ${p.slug.padEnd(20)} ${p.title}`).join("\n"));
      case "open": {
        const p = orderedProjects.find((x) => x.slug === arg || x.n === arg.padStart(2, "0"));
        return p ? go(routes.project(p.slug), p.title) : print(`no project "${arg}". Try ls`);
      }
      case "cv":
        return print(ext(profile.resumeUrl, "Oyeyemi_Oluwatobiloba_CV.pdf"));
      case "contact":
      case "email":
        return print(
          <>
            {`email     ${profile.email}\ngithub    `}
            {ext(profile.github)}
            {"\nlinkedin  "}
            {ext(profile.linkedin)}
          </>,
        );
      case "clear":
        return setLines([]);
      case "exit":
        return onClose();
      case "home":
        return go("/", "home");
      case "work":
      case "lab":
      case "notes":
      case "about":
      case "hackathons":
        return go(`/${cmd.toLowerCase()}`, cmd.toLowerCase());
      default:
        return print(`command not found: ${cmd}. Try help`);
    }
  };

  if (!open) return null;
  return (
    <div className="term" role="dialog" aria-label="Terminal">
      <header>
        <span>tobi@portfolio ~</span>
        <button type="button" onClick={onClose} aria-label="Close terminal">
          close
        </button>
      </header>
      <div className="out" ref={out} aria-live="polite">
        {lines.map((l) => (
          <div key={l.id} className={l.dim ? "dim" : undefined}>
            {l.node}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
          setValue("");
        }}
      >
        <span aria-hidden="true">$</span>
        <label className="sr-only" htmlFor="term-input">
          Command
        </label>
        <input id="term-input" ref={input} value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" spellCheck={false} placeholder="type help" />
      </form>
    </div>
  );
};
