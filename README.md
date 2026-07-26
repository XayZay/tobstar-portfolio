# Oluwatobiloba Oyeyemi Portfolio

A refreshed personal portfolio for cybersecurity, networking, systems engineering, automation, and cloud-ready IT work.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Local Development

```bash
npm install
npm run dev
```

The Vite dev server is configured for port `8080`.

## Content Updates

Most portfolio copy lives in:

```text
src/data/portfolio.ts
```

Update that file for profile details, projects, skills, metrics, and contact links.

Use `docs/content-intake.md` to collect accurate content before the final themed revamp.

## Progression Notes

The current UI is temporary. Durable cleanup and deployment work should be preserved, but the final visual revamp should wait until a theme is provided.

See `docs/portfolio-progression.md` for the order of progression and what should be treated as temporary versus durable.

Use `docs/gap-register.md` to track missing content, product gaps, deployment gaps, and theme-hold items.

## Contact

The site uses direct contact links only: email, LinkedIn, GitHub, and resume PDF. No form service or environment variables are required.

## Resume

The public resume PDF is served from:

```text
public/documents/Oyeyemi_Oluwatobiloba_CV.pdf
```

## AWS Deployment

AWS Amplify Hosting configuration is included in `amplify.yml`.

See `docs/aws-deployment.md` for Amplify and S3 + CloudFront deployment notes.
