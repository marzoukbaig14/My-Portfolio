import { NextResponse } from 'next/server';

// Keep-warm ping for the Committed inference Space. Hugging Face Spaces sleep
// after a stretch of inactivity, which gives the first visitor a 30-60s cold
// start. A scheduled hit on this route pings the Space's /health so it stays
// awake between visits. Triggered by the Vercel Cron in vercel.json; also safe
// to call manually. Reuses the same backend URL the demo client uses.
const RAW = process.env.NEXT_PUBLIC_COMMITTED_API_URL || '';
const BASE = RAW.replace(/\/+$/, '');

// Never cache: this is a side-effecting ping, not data.
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!BASE) {
    return NextResponse.json({ warmed: false, reason: 'no backend configured' });
  }
  try {
    const started = Date.now();
    const res = await fetch(`${BASE}/health`, { cache: 'no-store' });
    return NextResponse.json({ warmed: res.ok, status: res.status, ms: Date.now() - started });
  } catch (err) {
    return NextResponse.json({ warmed: false, error: String(err) }, { status: 200 });
  }
}
