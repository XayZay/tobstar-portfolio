import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Navigation } from "./components/Navigation";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Work } from "./components/Work";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const normalizePath = (path: string) => {
  const normalized = path.replace(/\/+$/, "");
  return normalized || "/";
};

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/now": "Now",
  "/work": "Work",
  "/projects": "Projects",
  "/uses": "Uses",
  "/contact": "Contact",
};

const RoutedPage = ({ path }: { path: string }) => {
  if (path === "/") return <Index />;

  const title = pageTitles[path] ?? "Not Found";

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1f1f1d]">
      <Navigation />
      <main className="pt-28">
        {path === "/now" && <About />}
        {path === "/work" && <Work />}
        {path === "/projects" && <Projects />}
        {path === "/uses" && <Skills />}
        {path === "/contact" && <Contact />}
        {!pageTitles[path] && (
          <section className="mx-auto max-w-[980px] px-5 py-24">
            <div className="border-t border-[#d8d3c5] pt-7">
              <p className="mb-6 font-mono text-xs uppercase tracking-[0.32em] text-[#77736a]">
                {title}
              </p>
              <h1 className="font-serif text-5xl leading-tight text-[#1f1f1d]">
                This page does not exist.
              </h1>
              <a
                href="/"
                className="mt-8 inline-flex border-b border-[#1f1f1d] text-sm text-[#1f1f1d]"
              >
                Back home
              </a>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

const AppShell = () => {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0 });
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as Element | null)?.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute("download")) {
        return;
      }

      const url = new URL(link.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname && url.hash) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
      handlePopState();
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleDocumentClick);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return <RoutedPage path={path} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppShell />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
