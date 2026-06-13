# Handoff: Frontend Agent (portfolio /committed page)

You are building the `/committed` page: the polished, on-brand web surface where a visitor pastes a diff and gets a commit message, plus the case-study sections beneath it. Read `CLAUDE.md` first; it is your behavioral contract. Then read `STATUS.md` for project context.

You work in **the human's personal portfolio repo** (the Next.js site already deployed on Vercel), not the Committed repo. You build a new route inside the existing site and reuse its design system. You do not touch the serving code; you meet the backend at the HTTP contract below.

## Your job has a hard boundary

You build the `/committed` route and its content scaffolding, matching the existing portfolio theme. You do **not** invent a new look, you do **not** write final marketing copy, and you do **not** publicize the page. You are done when the route renders in the existing theme, the tool calls the backend and handles every state gracefully, and the page is reviewable on a Vercel preview branch, with nothing linked or merged to production.

Priority for this pass: **get it working and on-theme.** Design polish and final content come later. A working, theme-matched starting point is the goal.

## How you work (non-negotiable)

- One step, or one tight group of related steps, at a time.
- Before each step, say what it does and what success looks like.
- After each step, wait for the human to paste the actual output before moving on. Do not assume it worked.
- Diagnose from the actual error text, propose the smallest fix, and re-verify.
- Teach as you go. When you introduce a tool or library, say in a sentence what it is and why it is here.
- Stay in scope. If you think something should be added or changed, propose it and ask.

## The HTTP contract (what you build against)

The serving agent owns this; you consume it.

- `POST /generate` — `{ "diff": "..." }` returns `{ "message": "<commit subject line>" }`.
- `GET /health` — `200` once the model is loaded; ping it on mount to pre-warm the Space.
- The backend URL is a config/env value, so you can point at the deployed Space (running the base model for now) or a local mock that returns the same shape. You can build the entire page against the mock before the backend Space is live, which lets you run fully in parallel with the serving agent.

## Step sequence

1. **Read and set up.** Work on a new branch in the portfolio repo. Vercel auto-builds a preview URL for the branch; that is how the human reviews your work, with no extra config.

2. **Add the route.** Create `/committed` as a new route in the existing Next.js app (`app/committed/page.tsx`, or the Pages-Router equivalent if that is what the repo uses). The home page is untouched; this is a separate page. Reuse the existing components, fonts, colors, and tokens. Do **not** reinvent the design system; the page must look like it belongs to the site (terminal aesthetic).

3. **Build the tool** (top of the page):
   - Preloaded example chips across a few languages. Use **placeholder** example diffs for now; the human curates the real ones (pulled from the test split) later.
   - A monospace diff textarea, a Generate button, and an output area showing the commit line with the type and scope subtly highlighted, a copy button, and a small "well-formed" badge. The badge means the output is grammar-valid syntax, **not** that the type is guaranteed correct; never label it more than "well-formed."
   - The states: idle; cold-start ("waking the model, ~30–60s") on the first call after the Space has been idle; generating (a blinking terminal cursor fits the theme); result (the message types itself out, a typewriter reveal; Framer Motion is fine for this); and a friendly empty/oversized-input nudge (the model only saw single-file diffs under the token cap, so the input hint should say so). Ping `GET /health` on mount to pre-warm the Space.

4. **Privacy line.** Include an honest note: the hosted demo sends the diff to the Space, while the model itself runs fully offline; point to the "run it locally" section. This is a confirmed decision.

5. **Story sections** (below the tool): scaffold the sections with **placeholder** content. Order: how-it-works, **results** (floated high), sample outputs, run-it-locally, built-with-and-links. The human writes the real copy later.

6. **Background.** A subtle neural-net / node-graph background. Keep it cheap (a lightweight 2D canvas is enough; only reach for React Three Fiber if the human specifically wants depth) and quiet (low opacity so it never competes with text, slow motion, wired to `prefers-reduced-motion`, lazy-loaded so it never blocks the demo).

7. **Projects card.** Add a Committed card to the portfolio's projects section linking to `/committed`. Keep it **unlinked / unmerged to production** until the fine-tune is ready; build it on the branch and leave it on the preview only.

8. **Self-test.** Verify on the Vercel preview URL, pointing at the deployed backend Space (base model) or the mock.

You may consult the UI UX Pro Max skill (or Anthropic's `frontend-design` skill) for loading-state, focus, accessibility, and responsive patterns, but inherit the existing theme; do not let any skill pick a new look.

## Definition of done

- `/committed` renders in the existing portfolio theme on a Vercel preview branch.
- The tool calls the backend and handles idle, waking, generating, result, and error states gracefully.
- Example chips (placeholder), the privacy line, and the story-section scaffolding (placeholder copy) are all in place.
- The background is subtle and reduced-motion-safe.
- The Committed projects card exists but is not linked or merged to production.

## Explicit non-goals

Do not reinvent the design system; match the portfolio. Do not touch the serving or backend code; meet it at the HTTP contract. Do not write final copy or curate the real example diffs; those are the human's. Do not merge to production or publish a live link until the fine-tune is ready.

## If something breaks

Read the actual error. A blocked browser call is almost always CORS, which is fixed on the backend side, so flag it to the serving agent rather than working around it. Ask the human for the full output, propose the smallest fix, verify before continuing.
