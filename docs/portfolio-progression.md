# Portfolio Progression

This repo is in a stabilized temporary state. The current UI can remain usable, but it is not the final themed revamp.

## Current Phase

Phase: stabilization and gap closure.

Keep these durable changes:

- npm-only dependency flow with `package-lock.json`
- clean lint/build/audit baseline
- direct contact links without a form-service dependency
- AWS Amplify deployment config
- centralized portfolio content in `src/data/portfolio.ts`
- baseline SEO metadata in `index.html`

Treat these as temporary until the real theme is provided:

- hero layout
- section styling
- Unsplash imagery
- rewritten visual language and copy tone

## Progression Order

1. Stabilize the repo and keep checks clean.
2. Replace inferred content with accurate portfolio content.
3. Fill product gaps: resume, real assets, SEO image, favicon, contact flow.
4. Prepare AWS Amplify deployment.
5. Wait for the final design theme.
6. Replace the temporary UI with the themed revamp while keeping durable infrastructure.

## Required Checks

Run these after stabilization or content edits:

```bash
npm run lint
npm run build
npm audit
```

## Theme Hold

Do not do another visual redesign until the theme is supplied. Future design work should replace the temporary visual layer without undoing the durable cleanup.
