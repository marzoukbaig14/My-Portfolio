This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Committed demo (`/committed`)

`/committed` is a live, in-browser demo of **Committed**, a small fine-tuned
model that writes Conventional Commit messages from code diffs. The page is the
presentation layer only; it talks to a separate model service over HTTP:

- `POST {API_URL}/generate` with `{ "diff": "..." }` → `{ "message": "..." }`
- `GET {API_URL}/health` → `200` once the model is loaded (pinged on mount to pre-warm)

Set the backend URL via the `NEXT_PUBLIC_COMMITTED_API_URL` environment variable
(see `.env.example`). When it is **unset**, the demo falls back to a bundled
local mock at `/api/committed-mock` that returns the same shape, so the page
runs with no backend configured.

> Not public yet: the page is `noindex` and is not linked from production. The
> Committed projects card lives on this branch/preview only — do not merge to
> production until the fine-tuned model is ready.
