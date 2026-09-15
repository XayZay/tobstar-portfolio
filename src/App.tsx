import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { Terminal } from "./components/Terminal";
import { projects, profile } from "./data/portfolio";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";

const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

/** Resolve a pathname to a page + document title. */
const resolve = (path: string) => {
  if (path === "/") {
    return {
      element: <Index />,
      title: `${profile.name} — Cloud Engineering, Infrastructure & Security`,
      description:
        "Junior engineer working across cloud infrastructure, networking, backend systems and security. Networking and cybersecurity foundations, extending into AWS and infrastructure engineering.",
    };
  }

  const match = path.match(/^\/projects\/([\w-]+)$/);
  if (match) {
    const project = projects.find((p) => p.slug === match[1] && p.caseStudy);
    if (project) {
      return {
        element: <ProjectDetail project={project} />,
        title: `${project.title} — ${profile.name}`,
        description: project.summary.slice(0, 180),
      };
    }
  }

  return {
    element: <NotFound />,
    title: `Not found — ${profile.name}`,
    description: "This page does not exist.",
  };
};

const setMeta = (selector: string, content: string) => {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
};

const AppShell = () => {
  const [path, setPath] = useState(() => normalize(window.location.pathname));
  const [terminalOpen, setTerminalOpen] = useState(false);
  /** Anchor to scroll to once the next route has actually rendered. */
  const pendingHash = useRef<string | null>(null);

  const { element, title, description } = resolve(path);

  // Keep the document title + description in sync with the route.
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }, [title, description]);

  // Runs after the new route has committed, so anchor targets exist.
  useLayoutEffect(() => {
    const hash = pendingHash.current;
    pendingHash.current = null;

    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [path]);

  const navigate = useCallback((nextPath: string, hash: string) => {
    pendingHash.current = hash || null;
    setPath(normalize(nextPath));
  }, []);

  useEffect(() => {
    const onPopState = () => {
      navigate(window.location.pathname, window.location.hash);
    };

    // Intercept same-origin links so navigation stays client-side.
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element | null)?.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute("download")) {
        return;
      }

      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;

      // Let the browser handle non-page assets (e.g. the résumé PDF).
      if (/\.[a-z0-9]+$/i.test(url.pathname) && !url.pathname.endsWith(".html")) return;

      event.preventDefault();

      const samePage = normalize(url.pathname) === path;
      if (samePage && url.hash) {
        document.querySelector(url.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState({}, "", `${url.pathname}${url.hash}`);
        return;
      }

      window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
      navigate(url.pathname, url.hash);
    };

    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick);
    };
  }, [navigate, path]);

  // On first load, honour an incoming hash (e.g. a shared /#work link).
  useEffect(() => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ block: "start" });
    }
    // Runs once, on mount only.
  }, []);

  // Easter egg: backtick opens the terminal, unless the user is typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);

      if (e.key === "`" && !typing) {
        e.preventDefault();
        setTerminalOpen((v) => !v);
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openTerminal = useCallback(() => setTerminalOpen(true), []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-accent focus:bg-base focus:px-4 focus:py-2.5 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>

      <Navigation onOpenTerminal={openTerminal} />
      <main id="main">{element}</main>
      <Footer onOpenTerminal={openTerminal} />
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </>
  );
};

const App = () => <AppShell />;

export default App;
