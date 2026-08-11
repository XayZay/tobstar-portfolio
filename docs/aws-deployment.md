# AWS Deployment

This project is a static Vite app. The simplest AWS path is AWS Amplify Hosting, with S3 + CloudFront as a lower-level alternative.

## Option A: AWS Amplify Hosting

1. Push the repository to GitHub.
2. In AWS Amplify, create a new app from GitHub and select this repository.
3. Choose the production branch, usually `main`.
4. Use the included `amplify.yml` build settings.
5. Deploy. Amplify will run `npm ci` and `npm run build`, then publish `dist`.
6. Verify the Amplify preview URL.
7. Add a custom domain in Amplify if needed.

## Amplify Redirect Rule For Client-Side Routes

The portfolio uses client-side routes such as `/work`, `/projects`, `/uses`, and `/contact`. Add this redirect/rewrite rule in Amplify Hosting so direct visits and refreshes on those paths load the app instead of returning 404:

| Source address | Target address | Type |
| --- | --- | --- |
| `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|pdf)$)([^.]+$)/>` | `/index.html` | `200 (Rewrite)` |

## Pre-Deployment Checklist

- `npm run lint` passes.
- `npm run build` passes.
- `npm audit` reports no vulnerabilities.
- `src/data/portfolio.ts` has confirmed content, not inferred placeholder content.
- Direct contact links, email link, GitHub link, LinkedIn link, and resume link are correct.
- Final favicon and social preview image are in place, or placeholders are accepted for the first deployment.

## Option B: S3 + CloudFront

1. Build locally with `npm ci` and `npm run build`.
2. Create a private S3 bucket for the site artifacts.
3. Upload the contents of `dist` to the bucket.
4. Create a CloudFront distribution with the bucket as origin.
5. Configure CloudFront error responses so `/index.html` handles client-side routes:
   - 403 -> `/index.html`, status 200
   - 404 -> `/index.html`, status 200
6. Add an ACM certificate in `us-east-1` and connect your custom domain through Route 53.

## Local Verification

```bash
npm ci
npm run build
npm run preview
```

## Post-Deployment Checklist

- Live site loads over HTTPS.
- Mobile and desktop layouts are readable.
- Email, GitHub, LinkedIn, and resume links open correctly.
- GitHub, LinkedIn, project, and resume links open correctly.
- Custom domain points to Amplify and has a valid certificate.
