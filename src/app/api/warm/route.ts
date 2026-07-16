import { NextResponse } from 'next/server';

// Keep-warm ping for the Committed inference Space. Free Hugging Face Spaces
// sleep after ~48h idle, and a slept Space reloads its model weights on the
// next request (a 30-60s wait for the first visitor). Hitting this route pings
// the Space's /health to reset the idle timer, then fires a tiny generation at
// BOTH model sizes so each stays resident in the inference path.
//
// The scheduled, no-agent trigger is the GitHub Actions workflow
// (.github/workflows/warm-space.yml), which runs every 6h and has no timeout
// pressure. This route is the equivalent front-end path: safe to hit manually
// (open it in a browser) or to wire to a Vercel Cron — note Vercel's Hobby plan
// caps cron at once/day, so a 6h cadence needs the GitHub Action or a Pro plan.
//
// Reuses the same backend URL the demo client uses.
const RAW = process.env.NEXT_PUBLIC_COMMITTED_API_URL || '';
const BASE = RAW.replace(/\/+$/, '');

// The two fine-tunes to keep hot; mirrors the demo's ModelId union.
const MODELS = ['1.7b', '0.6b'] as const;

// A minimal well-formed diff — just enough to run a real generation.
const WARM_DIFF = '@@ -1,3 +1,4 @@\n def add(a, b):\n-    return a + b\n+    return a + b  # keep-warm ping\n';

// Per-call ceiling so the serverless function returns promptly. When the Space
// is already warm each generate is quick; on a fully cold Space these calls hit
// the ceiling (best-effort) — the GitHub Action, which has no such limit, is
// what guarantees a cold Space finishes warming.
const CALL_TIMEOUT_MS = 9000;

// Never cache: this is a side-effecting ping, not data. Node runtime so it
// works regardless of the configured backend host; maxDuration gives the
// function headroom for two bounded model calls.
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  if (!BASE) {
    return NextResponse.json({ warmed: false, reason: 'no backend configured' });
  }

  const started = Date.now();

  // Health first: cheap, and it alone resets the Space's idle timer.
  let health: { ok: boolean; status?: number } = { ok: false };
  try {
    health = await withTimeout(async (signal) => {
      const res = await fetch(`${BASE}/health`, { cache: 'no-store', signal });
      return { ok: res.ok, status: res.status };
    });
  } catch {
    /* leave health.ok = false; a cold/asleep Space is an expected state */
  }

  // Warm both models in parallel, best-effort. A failure/timeout on a cold
  // Space is expected and non-fatal — the request still nudged it awake.
  const models = await Promise.all(
    MODELS.map(async (model) => {
      try {
        const ok = await withTimeout(async (signal) => {
          const res = await fetch(`${BASE}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ diff: WARM_DIFF, model }),
            cache: 'no-store',
            signal,
          });
          return res.ok;
        });
        return { model, ok };
      } catch {
        return { model, ok: false };
      }
    }),
  );

  const warmedModels = models.filter((m) => m.ok).length;
  return NextResponse.json({
    warmed: health.ok || warmedModels > 0,
    health,
    models,
    ms: Date.now() - started,
  });
}
