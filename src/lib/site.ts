import { projects, type Project } from "@/data/portfolio";
import type { FlowBasis, Outcome, SimNode } from "@/data/flowLab/types";

/** Projects in display order, numbered by that order (never by a stored id). */
export type NumberedProject = Project & { n: string };
export const orderedProjects: NumberedProject[] = projects.map((p, i) => ({ ...p, n: String(i + 1).padStart(2, "0") }));
export const hackathonProjects = orderedProjects.filter((p) => p.hackathon);

export const routes = {
  home: "/",
  work: "/work",
  hackathons: "/hackathons",
  notes: "/notes",
  about: "/about",
  lab: (id?: string) => (id ? `/lab/${id}` : "/lab"),
  project: (slug: string) => `/projects/${slug}`,
  idea: (id: string) => `/ideas/${id}`,
};

/** Outcome marks stay monochrome: shape and word, never a status colour. */
export const outcomeMark: Record<Outcome, { mark: string; word: string }> = {
  ok: { mark: "✓", word: "passes" },
  cached: { mark: "◎", word: "served from cache" },
  retry: { mark: "↻", word: "retried" },
  blocked: { mark: "✕", word: "blocked" },
  error: { mark: "!", word: "error" },
};

export const ideaStatusLabel = { idea: "Idea", designing: "Designing", building: "Building" } as const;

export const basisWord = (basis: FlowBasis) => (basis === "performed" ? "Performed in the lab" : "Illustrative");

export const nodeName = (n: SimNode) => n.service ?? n.label;

/** Which nav section a path belongs to. */
export const sectionOf = (path: string) => {
  if (path === "/work" || path === "/hackathons" || path.startsWith("/projects/")) return "work";
  if (path === "/lab" || path.startsWith("/lab/")) return "lab";
  if (path === "/notes" || path === "/field-notes" || path.startsWith("/ideas/")) return "notes";
  if (path === "/about") return "about";
  return "home";
};

/** Light/dark: an explicit choice is stored; otherwise the system setting applies. */
export const toggleTheme = () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try {
    localStorage.setItem("tob-theme", root.dataset.theme);
  } catch {
    /* storage unavailable: the choice lasts for this visit */
  }
};
