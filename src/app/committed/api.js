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

export function getEndpoints() {
  return endpoints;
}

// Pre-warm / liveness check. Returns true on a 200, false otherwise. Never
// throws — a cold or unreachable Space is an expected, handled state.
export async function pingHealth(signal) {
  try {
    const res = await fetch(endpoints.health, { method: 'GET', signal });
    return res.ok;
  } catch {
    return false;
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
    throw new Error(`Backend responded ${res.status}`);
  }

  const data = await res.json();
  if (typeof data?.message !== 'string') {
    throw new Error('Malformed response: expected { message: string }');
  }
  return data.message;
}
