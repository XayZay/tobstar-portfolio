import type { Config } from "tailwindcss";

/**
 * Semantic tokens only. Colors resolve to the CSS custom properties defined in
 * src/index.css, written as `rgb(var(--x) / <alpha-value>)` so Tailwind opacity
 * modifiers (e.g. `border-line/60`) keep working.
 */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--base) / <alpha-value>)",
        raised: "rgb(var(--raised) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        "line-strong": "rgb(var(--line-strong) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        dim: "rgb(var(--dim) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        // Fluid display sizes so the hero never needs breakpoint juggling.
        display: ["clamp(2.75rem, 9vw, 7rem)", { lineHeight: "0.92", letterSpacing: "-0.035em" }],
        "display-sm": ["clamp(2rem, 5.5vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        section: ["clamp(1.75rem, 3.6vw, 2.75rem)", { lineHeight: "1.12", letterSpacing: "-0.025em" }],
      },
      maxWidth: {
        shell: "1240px",
        measure: "68ch",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
