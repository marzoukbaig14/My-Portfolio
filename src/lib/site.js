// The canonical site origin, used by metadata, the OG image, sitemap, and
// robots. Resolution order:
//   1. NEXT_PUBLIC_SITE_URL  — set this for a custom domain.
//   2. VERCEL_PROJECT_PRODUCTION_URL — auto-set by Vercel (the .vercel.app prod URL).
//   3. localhost — local development.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');
