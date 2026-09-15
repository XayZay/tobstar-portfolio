# Oyeyemi Oluwatobiloba — Portfolio

Personal portfolio for cloud engineering, infrastructure, networking and security work.

Live: https://tobstarportfolio.netlify.app

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS (semantic design tokens, no component library)
- No router dependency — a small history-based router lives in `src/App.tsx`

## Local development

```bash
npm install
npm run dev     # http://localhost:8080
npm run build
npm run lint
```

## Architecture

```text
src/
  App.tsx              routing, document metadata, terminal easter egg
  data/portfolio.ts    ALL content — single source of truth
  pages/
    Index.tsx          homepage section composition
    ProjectDetail.tsx  case-study template, driven by data
    NotFound.tsx
  components/
    Section.tsx        shared section frame (number / label / heading)
    Reveal.tsx         scroll reveal, degrades to visible without JS or motion
    FlowDiagram.tsx    CSS architecture diagram (reflows on mobile)
    Topology.tsx       hero SVG visual
    ...                one component per homepage section
```

### Design tokens

Colors, spacing and type scale are defined once as CSS custom properties in
`src/index.css` and exposed to Tailwind as semantic names in `tailwind.config.ts`
(`base`, `raised`, `line`, `line-strong`, `ink`, `muted`, `dim`, `accent`).

Change the palette in `src/index.css` — not in component classes.

## Content

All copy, projects, experience, skills and certifications live in
`src/data/portfolio.ts`. Components are presentation only.

**Content rules encoded in that file — please keep them:**

- No invented metrics, scale, users, uptime or client work.
- Labs stay labeled as labs; learning stays separate from experience.
- "In view" certifications are rendered distinctly from earned ones and must
  never be presented as held.
- TeSA Foundations is professional development facilitated by Univaciti — not
  employment.

### Adding a project

Add an entry to `projects` in `src/data/portfolio.ts`. Include a `caseStudy`
object and the route `/projects/<slug>` renders a full case-study page
automatically. Omit `caseStudy` and it renders as an index row only.

## Deployment

Netlify hosts the live site. `amplify.yml` retains the AWS Amplify build config;
see `docs/aws-deployment.md`.

Because routing is client-side, the host must rewrite unknown paths to
`index.html` so `/projects/<slug>` resolves on a hard refresh. `public/_redirects`
does this on Netlify.

## Resume

Served from `public/documents/Oyeyemi_Oluwatobiloba_CV.pdf`.
