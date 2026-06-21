# Committed — full system map

This document maps the whole system end to end, from the portfolio frontend to
the model API to the ML pipeline that produced the model. It is meant to be read
alongside the code, so file references link to the actual files.

There are **three separate systems**. Only the first lives in this repo.

```
┌─────────────────────────┐    HTTPS         ┌──────────────────────────┐
│ 1. PORTFOLIO FRONTEND    │  POST /generate  │ 2. MODEL API (Space)     │
│    (this repo, Next.js)  │ ───────────────▶ │   FastAPI + llama.cpp    │
│    on Vercel             │  GET  /health    │   on Hugging Face        │
└─────────────────────────┘ ◀─────────────── └──────────────────────────┘
                                                          ▲
                                                          │ produced by
                                                 ┌──────────────────────┐
                                                 │ 3. ML PIPELINE        │
                                                 │   data→train→eval→GGUF│
                                                 │   (separate repo)     │
                                                 └──────────────────────┘
```

The boundary that matters: **this repo only knows the API _contract_** (two
endpoints, two JSON shapes). It never imports backend code. That decoupling is
what lets the frontend run against a local mock when the Space is asleep or not
yet deployed.

---

## 1. The frontend repo (what lives here)

```
my-portfolio/
├─ src/app/
│  ├─ layout.js              Root layout: fonts, <html>, global metadata
│  ├─ globals.css            Design tokens (CSS vars: --accent, --bg-*, etc.)
│  ├─ page.js                HOME PAGE — composes the sections below
│  │
│  ├─ components/            Home-page building blocks (all 'use client')
│  │  ├─ Hero.js             Typewriter intro
│  │  ├─ About.js            ┐ read their text from src/data/* (not hardcoded)
│  │  ├─ Experience.js       │
│  │  ├─ Projects.js         ┘ renders project cards (incl. the Committed card)
│  │  ├─ Contact.js          Formspree form
│  │  ├─ Navbar.js           Fixed nav + Cmd-K trigger
│  │  ├─ CommandPalette.js   Cmd-K overlay
│  │  ├─ NeuralBackground.js Canvas node-graph (shared by home + /committed)
│  │  ├─ SmoothScroll.js     Lenis wrapper (resets scroll to top on route mount)
│  │  ├─ ScrollProgress.js   Top progress bar
│  │  ├─ CodeHighlight.js    [*] Renders highlighted code (maps tokens to colors)
│  │  └─ highlightTokens.js  [*] PURE tokenizer (no React) — unit-tested
│  │
│  ├─ committed/             THE /committed ROUTE (the demo)
│  │  ├─ page.js             Route entry + 404 gate + intro copy
│  │  ├─ CommittedHeader.js  Sub-page nav
│  │  ├─ CommittedDemo.js    [*] The interactive tool (state machine)
│  │  ├─ CommittedBackground.js  Lazy-loads NeuralBackground
│  │  ├─ StorySections.js    How-it-works / results / samples / run-locally
│  │  ├─ examples.js         The example diffs loaded by the chips
│  │  ├─ api.js              [*] CLIENT-SIDE API WRAPPER (talks to system #2)
│  │  └─ cc.js               [*] Conventional-Commit helpers — unit-tested
│  │
│  └─ api/committed-mock/    LOCAL FALLBACK BACKEND (same shapes as the Space)
│     ├─ generate/route.js   POST mock: heuristic commit message
│     └─ health/route.js     GET mock: always {status:'ok', model_loaded:true}
│
├─ src/data/                 CONTENT (data, not code — easy to edit)
│  ├─ profile.js   projects.js   experience.js
│
├─ tests/                    Vitest (Node) + components (jsdom)
├─ .env.production           NEXT_PUBLIC_COMMITTED_* (committed; public-only)
└─ next.config / eslint / vitest configs
```

`[*]` marks the files most worth reading to understand the demo:
[CodeHighlight.js](src/app/components/CodeHighlight.js),
[highlightTokens.js](src/app/components/highlightTokens.js),
[CommittedDemo.js](src/app/committed/CommittedDemo.js),
[api.js](src/app/committed/api.js),
[cc.js](src/app/committed/cc.js).

---

## 2. Request lifecycle: paste a diff and hit Generate

```
You type in the diff box
   │  (CommittedDemo.js holds `diff` in React state; the box is
   │   HighlightedDiffInput — a transparent textarea over a highlighted <pre>)
   ▼
Click "Generate"  → handleGenerate()                         [CommittedDemo.js]
   │  sets status='generating', starts a 90s AbortController timeout
   ▼
generateMessage(diff, signal)                                [committed/api.js]
   │  fetch(endpoints.generate, { POST, body: {diff} })
   │
   │  endpoints is decided ONCE at module load:
   │    NEXT_PUBLIC_COMMITTED_API_URL set?  ──▶ `${URL}/generate`  (real Space)
   │    unset?                              ──▶ `/api/committed-mock/generate`
   ▼
┌── Real Space (system #2) ───────────┐  OR  ┌── Local mock (in this repo) ───┐
│ FastAPI receives {diff}             │      │ route.js: buildMessage(diff)    │
│ llama.cpp runs Qwen3-1.7B (GGUF)    │      │ a heuristic (ext→type, signals  │
│ GBNF grammar forces valid CC syntax │      │ →subject). Not a model.         │
│ returns { message: "feat: ..." }    │      │ returns { message }             │
└─────────────────────────────────────┘      └─────────────────────────────────┘
   ▼
Back in CommittedDemo.js:
   • success → status='result', runTypewriter() reveals it char by char,
               renderHighlighted() colors type/scope, isWellFormed() badge   [cc.js]
   • 4xx     → shows the backend's own detail message + "try an example"
   • timeout/network → friendly "still waking up" message
```

In parallel, a second loop polls health:

```
useEffect → pingHealth(signal) every 5s (cold) / 20s (warm)   [committed/api.js]
   GET /health → { model_loaded } → drives the "connecting / ready" dot
   This is why a sleeping HF Space gets nudged awake and the UI knows.
```

Key design idea: **readiness (`/health`), not latency, decides the "waking up"
copy.** That is the `warm` / `coldStart` logic in `CommittedDemo.js`.

---

## 3. The launch gate (how the demo stays hideable)

One env var, `NEXT_PUBLIC_COMMITTED_ENABLED`, gates three things, all checking
`=== 'true'`:

```
page.js          → notFound() (404) if not enabled
api/.../route.js → 404 if not enabled
Projects.js      → hides the Committed card if not enabled
```

`NEXT_PUBLIC_` means it is inlined into the browser bundle at build time.
`.env.production` (committed to the repo) currently sets it `true` and points the
API URL at the Space, which is why `/committed` is live. These are public values
by design (anything `NEXT_PUBLIC_` ships to the browser), so committing them is
fine. A real secret must never go there.

---

## 4. The ML pipeline (system #3, external repo, documented on the site)

This is the educational core. The frontend's
[StorySections.js](src/app/committed/StorySections.js) documents it; the code
lives in the separate `Committed` repo.

```
CommitChronicle dataset (~10.7M real GitHub commits)
   │  FILTER (this is where the project is won or lost):
   │   • single-file diffs only
   │   • valid Conventional Commit syntax
   │   • drop merge/bot commits, "wip"/"update" noise
   │   • normalize to a consistent subject style
   ▼
Filtered dataset ───────────────────▶ published on Hugging Face (dataset card)
   │
   │  FINE-TUNE:  Qwen3-1.7B  +  QLoRA (PEFT)   → LoRA adapter (HF model card)
   ▼
   │  EVALUATE:  vs the un-tuned base, 442-example test split,
   │             LLM judge on 4 axes (type/faithfulness/completeness/specificity),
   │             judge validated against 50 hand-rated examples (Cohen's kappa)
   │             → type accuracy 0.131 → 0.637 (deployment-reweighted)
   ▼
   │  QUANTIZE:  merge adapter → GGUF, ~1GB  → published on HF (GGUF card)
   ▼
SERVE two ways (identical model):
   ├─ HF Space: Docker + FastAPI + llama.cpp + GBNF grammar  ← the web demo hits this
   └─ pip-installable CLI: `pip install git+…/Committed.git` then `git diff | committed`
      (runs fully offline on CPU — the "your code never leaves your machine" claim)
```

**Why the GBNF grammar matters:** llama.cpp with a grammar _constrains decoding_
so the model can only emit tokens that form a valid `type(scope): subject`. That
is how the demo guarantees well-formed output regardless of the model's
confidence. The frontend's "well-formed" badge ([cc.js](src/app/committed/cc.js))
is a client-side double-check of that same grammar.

Artifacts (all linked from the "built with" section of `StorySections.js`):
GitHub repo, LoRA adapter card, GGUF card, and dataset card on Hugging Face.

---

## 5. The test layer (what guards what)

```
tests/
├─ highlightTokens.test.js   pure tokenizer (node)      ─┐
├─ cc.test.js                CC helpers (node)            │ 30 logic tests
├─ mockGenerate.test.js      mock classifier (node)       │ (fast, no DOM)
├─ api.test.js               API wrapper, mocked fetch    ─┘
└─ components/               jsdom + Testing Library      ─┐ 7 render tests
   ├─ CodeHighlight.test.jsx render → colored spans        │
   └─ Projects.test.jsx      data → cards render          ─┘
```

Run with `npm test`. The split (pure logic in Node, components in jsdom) is what
keeps the suite fast. See [tests/](tests/) and
[vitest.config.mjs](vitest.config.mjs).

---

## Quick reference: the API contract

The only thing the frontend assumes about the backend:

```
POST {BASE}/generate
  request:  { "diff": "<unified diff text>" }
  200:      { "message": "feat(scope): subject" }
  4xx:      { "detail": "<human-readable reason>" }   (shown to the user)

GET {BASE}/health
  200:      { "status": "ok", "model_loaded": true }
```

`BASE` is `NEXT_PUBLIC_COMMITTED_API_URL`, or the same-origin
`/api/committed-mock` when that variable is unset. Contract logic lives in
[api.js](src/app/committed/api.js); the mock that mirrors it lives in
[api/committed-mock/](src/app/api/committed-mock/).
