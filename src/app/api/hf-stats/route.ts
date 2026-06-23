import { NextResponse } from 'next/server';

// Live download counts for the Committed model + dataset, read from Hugging
// Face's public API (no key needed). The repo ids are env-overridable but
// default to the live repos so the counter works without extra config.
const MODEL_ID = process.env.HF_MODEL_ID || 'marzoukbaig14/committed-gguf';
const DATASET_ID = process.env.HF_DATASET_ID || 'marzoukbaig14/committed-train';

type Count = { downloads: number; downloadsAllTime: number };

async function fetchCount(url: string): Promise<Count | null> {
  try {
    // Revalidate at the data layer: Hugging Face is hit at most once per window
    // and the result is shared across all visitors, not fetched per request.
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { downloads?: number; downloadsAllTime?: number };
    const downloads = typeof j.downloads === 'number' ? j.downloads : 0;
    const downloadsAllTime = typeof j.downloadsAllTime === 'number' ? j.downloadsAllTime : downloads;
    return { downloads, downloadsAllTime };
  } catch {
    return null;
  }
}

// Revalidate the route response on the same ~1 minute cadence.
export const revalidate = 60;

export async function GET() {
  // The all-time figure is only returned when explicitly requested via expand.
  const expand = 'expand[]=downloads&expand[]=downloadsAllTime';
  const [model, dataset] = await Promise.all([
    fetchCount(`https://huggingface.co/api/models/${MODEL_ID}?${expand}`),
    fetchCount(`https://huggingface.co/api/datasets/${DATASET_ID}?${expand}`),
  ]);

  return NextResponse.json(
    { model, dataset, fetchedAt: Date.now() },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
  );
}
