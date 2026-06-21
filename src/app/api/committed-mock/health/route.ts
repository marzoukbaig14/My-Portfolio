// Local mock for GET /health. Stands in for the model Space so the demo
// works before the backend is live. The real health check lives in the
// serving repo; do not treat this as the contract, only a same-shape stub.

export const dynamic = 'force-dynamic';

export function GET() {
  // Same launch gate as the page: dark in production unless explicitly enabled.
  if (process.env.NEXT_PUBLIC_COMMITTED_ENABLED !== 'true') {
    return new Response('Not Found', { status: 404 });
  }
  // The mock is always in-process and instant, so it is always "loaded".
  // Mirrors the real Space's shape: { status, model_loaded }.
  return Response.json({ status: 'ok', model_loaded: true }, { status: 200 });
}
