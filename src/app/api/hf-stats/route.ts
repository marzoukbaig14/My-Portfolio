import { NextResponse } from 'next/server';

// Live, project-wide download total, read from Hugging Face's public API (no key
// needed). We sum every published Committed artifact — both GGUF builds, both
// LoRA adapters, and the training dataset — into one honest figure. The per-repo
// breakdown stays visible on each Hub card.
const MODEL_REPOS = [
  'marzoukbaig14/committed-gguf', // 1.7B GGUF
  'marzoukbaig14/committed-gguf-0.6b', // 0.6B GGUF
  'marzoukbaig14/committed-qwen3-1.7b-lora', // 1.7B LoRA adapter
  'marzoukbaig14/committed-qwen3-0.6b-lora', // 0.6B LoRA adapter
];
const DATASET_REPOS = [
  'marzoukbaig14/committed-train', // training dataset
];

type Count = { downloads: number; downloadsAllTime: number };

async function fetchCount(url: string): Promise<Count | null> {
  try {
    // Fetch live (no-store) rather than baking a value into the static build —
    // a build-time fetch failure would otherwise freeze a null. Cross-visitor
    // hammering is prevented by the CDN s-maxage header on the response below.
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
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

// Render at request time (never prerendered at build), so a build-time HF hiccup
// can't bake a stale/null count into the static output. The CDN caches the
// response for ~1 minute (s-maxage below), so HF is hit at most once per window.
export const dynamic = 'force-dynamic';

export async function GET() {
  // The all-time figure is only returned when explicitly requested via expand.
  const expand = 'expand[]=downloads&expand[]=downloadsAllTime';
  const counts = await Promise.all([
    ...MODEL_REPOS.map((id) => fetchCount(`https://huggingface.co/api/models/${id}?${expand}`)),
    ...DATASET_REPOS.map((id) => fetchCount(`https://huggingface.co/api/datasets/${id}?${expand}`)),
  ]);

  // All-or-nothing: a partial sum would understate the figure and read as a
  // wrong "total", so if ANY repo fetch failed we return null and let the client
  // keep its last good value (or show the loading/neutral state) instead.
  const allOk = counts.every((c) => c !== null);
  const total: Count | null = allOk
    ? counts.reduce<Count>(
        (acc, c) => ({
          downloads: acc.downloads + (c as Count).downloads,
          downloadsAllTime: acc.downloadsAllTime + (c as Count).downloadsAllTime,
        }),
        { downloads: 0, downloadsAllTime: 0 },
      )
    : null;

  return NextResponse.json(
    { total, fetchedAt: Date.now() },
    {
      headers: {
        // Cache only at the shared CDN layer (s-maxage), so Hugging Face is hit
        // at most once a minute across all visitors. max-age=0 + must-revalidate
        // stops the *browser* from holding its own stale copy.
        'Cache-Control':
          'public, max-age=0, must-revalidate, s-maxage=60, stale-while-revalidate=120',
      },
    },
  );
}
