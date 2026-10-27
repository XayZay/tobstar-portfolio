# Flow Lab baseline

Recorded on 2026-10-27 from the clean `main` revision (`c9eaa10`) before Flow Lab implementation.

## Hero layout

- `Hero` is rendered from `src/components/Hero.tsx`; its technical visual is `Topology` in `src/components/Topology.tsx`.
- The visual is a static 420 × 300 SVG viewBox with a CSS-animated dashed packet path (`flow` keyframes, 2.6 seconds, linear, infinite). `prefers-reduced-motion` disables the animation.
- At both 1440 × 900 and 1920 × 955, the hero uses the same centered 1240 px shell, because both viewports exceed the shell maximum. With 64 px gutters, the content area is 1112 px. At the `lg` grid gap of 48 px, the 1.15 / 0.85 columns are about 612 px and 452 px wide.
- The `Topology` visual is therefore about 452 × 323 px at both sizes. It sits in the right column above the Current Focus caption. The profile label, headline, discipline strip, intro, elaboration, two links and availability sit in the left column. The hero begins at 208 px top padding at the `lg` breakpoint (`pt-52`).
- At 1440 × 900 the centered shell begins at x=100 px and its content at x=164 px; the right column begins around x=824 px. At 1920 × 955 those positions are x=340 px, x=404 px and x=1064 px respectively. These are CSS-derived positions; the source typography is fluid and text positions can vary with font rendering.

## Design system

Colors are CSS RGB-channel tokens in `src/index.css`: base `10 10 11`, raised `17 17 19`, line `31 31 35`, strong line `48 48 54`, ink `237 237 239`, muted `138 138 147`, dim `125 125 135`, accent `91 143 240`. The page uses Inter for body text and JetBrains Mono for metadata. Sections share the `shell`, `Section`, and `Reveal` patterns. The current palette has no success, warning, or error token.

## Build and audit baseline

Production build on the clean revision:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| JavaScript | 208.95 kB | 65.18 kB |
| CSS | 25.17 kB | 5.53 kB |

Lighthouse 13.5.0, using Headless Chrome 155.0.0.0 against `vite preview`:

| Mode | Performance | Accessibility | LCP | CLS | TBT | FCP | Speed Index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 70 | 100 | 6.2 s | 0 | 0 ms | 3.1 s | 4.5 s |
| Desktop | 95 | 100 | 1.4 s | 0.001 | 0 ms | 0.8 s | 0.8 s |

Reports were generated locally and not committed. Commands used:

```powershell
npm run build
npm run preview -- --host 127.0.0.1
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm exec -- lighthouse http://127.0.0.1:4173 --chrome-flags='--headless=new' --output=json --output-path=<mobile-report.json> --quiet
npm exec -- lighthouse http://127.0.0.1:4173 --preset=desktop --chrome-flags='--headless=new' --output=json --output-path=<desktop-report.json> --quiet
```

`npm run build` and `npm run lint` pass. The repo has no test runner or type-check script. A direct `tsc --noEmit -p tsconfig.app.json` baseline check reports unresolved `clsx` and `tailwind-merge` imports in the existing, otherwise unused `src/lib/utils.ts`. `npm audit --omit=dev` reports no production vulnerabilities. Full audit reports five development-tree advisories (one moderate, four high), including the existing Vite 8.1.5 dependency; these are outside the production dependency tree.

## Proposed feature layout

- `src/data/flowLab/heroFrames.ts`: compact labels, route roles, and focus copy for the hero teaser only.
- `src/data/flowLab/scenarios/`: one typed data module per scenario, registered in a small index module that is imported by the lazy player.
- `src/components/flowLab/`: canvas, controls, narration, log, waterfall, and node explainer UI.
- `src/lib/flowLab/`: types and pure flow compilation/playback logic, independent of React.
- `src/components/FlowLabLoader.tsx`: near-viewport lazy loading and reserved section space.

For packet movement, sample each SVG edge path with `getPointAtLength` and update a small packet transform in `requestAnimationFrame`. That preserves the existing SVG line style and avoids recalculating document layout; cancel animation work when playback stops, the section leaves view, or the page is hidden.

The animation and scenario data stay static and local. The first-load bundle should import only the small hero frame module; the complete scenario modules and player should be loaded when the Flow Lab approaches the viewport.
