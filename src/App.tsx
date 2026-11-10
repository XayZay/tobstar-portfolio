import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Terminal } from "./components/Terminal";
import { profile, projects, upcomingProjects } from "./data/portfolio";
import { scenarios } from "./data/flowLab";
import About from "./pages/About";
import Home from "./pages/Home";
import Lab from "./pages/Lab";
import NotFound from "./pages/NotFound";
import { IdeaDetail, Notes } from "./pages/Notes";
import ProjectDetail from "./pages/ProjectDetail";
import { Hackathons, Work } from "./pages/Work";
import { sectionOf } from "./lib/site";

const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

const SITE_DESCRIPTION =
  "Engineer focused on cloud engineering and architecture. Projects across cloud infrastructure, networking, backend systems and security.";

type Route = { element: ReactNode; title: string; description: string };

/** Resolve a pathname to a page, document title and description. */
const resolve = (path: string): Route => {
  const page = (element: ReactNode, name: string, description = SITE_DESCRIPTION): Route => ({ element, title: `${name} — ${profile.name}`, description });

  switch (path) {
    case "/":
      return { element: <Home />, title: `${profile.name} — Cloud Engineering & Architecture`, description: SITE_DESCRIPTION };
    case "/work":
      return page(<Work />, "Work", "Projects and systems built by Oyeyemi Oluwatobiloba, each with a full write-up.");
    case "/hackathons":
      return page(<Hackathons />, "Hackathons", "Projects Oyeyemi Oluwatobiloba first built at hackathons.");
    case "/notes":
    case "/field-notes":
      return page(<Notes />, "Notes", "What Oyeyemi Oluwatobiloba is studying, the tools he uses, and ideas not built yet.");
    case "/about":
      return page(<About />, "About", "Background, experience, education and contact details for Oyeyemi Oluwatobiloba.");
    case "/lab":
      return page(<Lab key={scenarios[0].id} scenario={scenarios[0]} />, "Flow Lab", "Step through cloud lab architectures one hop at a time.");
  }

  const lab = path.match(/^\/lab\/([\w-]+)$/);
  const scenario = lab && scenarios.find((s) => s.id === lab[1]);
  if (scenario) return page(<Lab key={scenario.id} scenario={scenario} />, `${scenario.title} · Flow Lab`, scenario.summary);

  const proj = path.match(/^\/projects\/([\w-]+)$/);
  const project = proj && projects.find((p) => p.slug === proj[1] && p.caseStudy);
  if (project) return page(<ProjectDetail slug={project.slug} />, project.title, project.summary.slice(0, 180));

  const ideaMatch = path.match(/^\/ideas\/([\w-]+)$/);
  const idea = ideaMatch && upcomingProjects.find((i) => i.id === ideaMatch[1]);
  if (idea) return page(<IdeaDetail idea={idea} />, `${idea.title} · Notes`, idea.problem.slice(0, 180));

  return page(<NotFound />, "Not found", "This page does not exist.");
};

const setMeta = (selector: string, content: string) => {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
};

const App = () => {
  const [path, setPath] = useState(() => normalize(window.location.pathname));
  const [terminalOpen, setTerminalOpen] = useState(false);
  const first = useRef(true);

  const { element, title, description } = resolve(path);

  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }, [title, description]);

  // After a navigation: back to the top, and move focus to the new page's heading.
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    const h1 = document.querySelector<HTMLElement>("main h1");
    if (h1) {
      h1.tabIndex = -1;
      h1.focus({ preventScroll: true });
    }
  }, [path]);

  const navigate = useCallback((next: string) => {
    window.history.pushState({}, "", next);
    setPath(normalize(new URL(next, window.location.origin).pathname));
  }, []);

  useEffect(() => {
    const onPopState = () => setPath(normalize(window.location.pathname));

    // Keep same-site page links client-side.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      // Files such as the CV and the report open normally.
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
      if (url.hash && normalize(url.pathname) === path) return;
      event.preventDefault();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    };

    // The ` key opens the terminal, unless someone is typing.
    const onKey = (event: KeyboardEvent) => {
      const typing = /^(input|textarea|select)$/i.test((event.target as HTMLElement)?.tagName ?? "");
      if (event.key === "`" && !typing) {
        event.preventDefault();
        setTerminalOpen((o) => !o);
      }
      if (event.key === "Escape") setTerminalOpen(false);
    };

    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [navigate, path]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header section={sectionOf(path)} />
      <main id="main">{element}</main>
      <Footer onOpenTerminal={() => setTerminalOpen(true)} />
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} onNavigate={navigate} />
    </>
  );
};

export default App;
