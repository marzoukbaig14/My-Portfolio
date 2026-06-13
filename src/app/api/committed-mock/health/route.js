// Local mock for GET /health. Stands in for the model Space so the demo
// works before the backend is live. The real health check lives in the
// serving repo; do not treat this as the contract, only a same-shape stub.

export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ status: 'ok' }, { status: 200 });
}
