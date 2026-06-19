// Local mock for GET /health. Stands in for the model Space so the demo
// works before the backend is live. The real health check lives in the
// serving repo; do not treat this as the contract, only a same-shape stub.

export const dynamic = 'force-dynamic';

export function GET() {
  // Same launch gate as the page: dark in production unless explicitly enabled.
  if (process.env.NEXT_PUBLIC_COMMITTED_ENABLED !== 'true') {
    return new Response('Not Found', { status: 404 });
  }
  return Response.json({ status: 'ok' }, { status: 200 });
}
