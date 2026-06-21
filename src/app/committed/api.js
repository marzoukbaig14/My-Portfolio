// Client-side API contract for the Committed demo.
//
// We consume the model service at two endpoints (owned by a separate repo):
//   POST /generate  { diff }     -> { message }
//   GET  /health                 -> 200 once the model is loaded
//
// The base URL is configuration, never hardcoded. Set
// NEXT_PUBLIC_COMMITTED_API_URL to the deployed Space; when it is unset we
// fall back to a same-origin mock (src/app/api/committed-mock) that returns
// the same shape, so the whole page works before the backend is live.
//
// The variable must be NEXT_PUBLIC_* because these calls run in the browser.

const RAW_BASE = process.env.NEXT_PUBLIC_COMMITTED_API_URL || '';
const BASE = RAW_BASE.replace(/\/+$/, '');

// When no backend URL is configured we talk to the local mock route handlers.
export const usingMock = BASE === '';

const endpoints = usingMock
  ? { generate: '/api/committed-mock/generate', health: '/api/committed-mock/health' }
  : { generate: `${BASE}/generate`, health: `${BASE}/health` };

// Readiness check. Returns { ok, modelLoaded }:
//   ok          : the Space answered 200 (liveness, unchanged contract).
//   modelLoaded : the model is actually in the container's memory (readiness).
// Never throws: a cold, asleep, or unreachable Space is an expected state and
// surfaces as { ok: false, modelLoaded: false } (including on an aborted/timed-
// out signal), which the UI reads as "cold".
export async function pingHealth(signal) {
  try {
    const res = await fetch(endpoints.health, { method: 'GET', signal });
    if (!res.ok) return { ok: false, modelLoaded: false };
    const data = await res.json().catch(() => ({}));
    return { ok: true, modelLoaded: data?.model_loaded === true };
  } catch {
    return { ok: false, modelLoaded: false };
  }
}

// Ask the model for a commit message. Resolves to the subject string.
// Throws on network/CORS failure or a non-2xx response so the caller can
// render a friendly error state.
export async function generateMessage(diff, signal) {
  const res = await fetch(endpoints.generate, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ diff }),
    signal,
  });

  if (!res.ok) {
    // The Space (FastAPI) returns errors as { detail: string }; surface that
    // real message (e.g. "That doesn't look like a code diff…") so a handled
    // 400 reads differently from a true network/CORS failure.
    let detail;
    try {
      const body = await res.json();
      detail = body?.detail;
    } catch {
      detail = null;
    }
    const error = new Error(detail || `Backend responded ${res.status}`);
    error.status = res.status; // lets the UI distinguish a 4xx input rejection from a network failure
    throw error;
  }

  const data = await res.json();
  if (typeof data?.message !== 'string') {
    throw new Error('Malformed response: expected { message: string }');
  }
  return data.message;
}
