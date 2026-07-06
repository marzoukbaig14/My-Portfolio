import { NextResponse } from 'next/server';

// Live download counts for the Committed model + dataset, read from Hugging
// Face's public API (no key needed). The model count is summed across BOTH GGUF
// repos (1.7B + 0.6B) so it reflects total model adoption. Repo ids are
// env-overridable but default to the live repos so the counter works with no
// extra config.
const MODEL_ID_17B = process.env.HF_MODEL_ID || 'marzoukbaig14/committed-gguf';
const MODEL_ID_06B = process.env.HF_MODEL_ID_06B || 'marzoukbaig14/committed-gguf-0.6b';
const DATASET_ID = process.env.HF_DATASET_ID || 'marzoukbaig14/committed-train';

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

// Render at request time (never prerendered at build), so a build-time HF
// hiccup can't bake a stale/null count into the static output. The CDN caches
// the response for ~1 minute (s-maxage below), so HF is still hit at most once
// per window across all visitors.
export const dynamic = 'force-dynamic';

export async function GET() {
  // The all-time figure is only returned when explicitly requested via expand.
  const expand = 'expand[]=downloads&expand[]=downloadsAllTime';
  const [model17b, model06b, dataset] = await Promise.all([
    fetchCount(`https://huggingface.co/api/models/${MODEL_ID_17B}?${expand}`),
    fetchCount(`https://huggingface.co/api/models/${MODEL_ID_06B}?${expand}`),
    fetchCount(`https://huggingface.co/api/datasets/${DATASET_ID}?${expand}`),
  ]);

  // Sum the two model repos, but only present a total when BOTH succeeded. A
  // partial sum would understate adoption and read as a wrong "total", so on
  // partial failure we return null for the model count and let the client keep
  // its last good value (or show the loading/neutral state) instead.
  const model: Count | null =
    model17b && model06b
      ? {
          downloads: model17b.downloads + model06b.downloads,
          downloadsAllTime: model17b.downloadsAllTime + model06b.downloadsAllTime,
        }
      : null;

  return NextResponse.json(
    { model, dataset, fetchedAt: Date.now() },
    {
      headers: {
        // Cache only at the shared CDN layer (s-maxage), so Hugging Face is hit
        // at most once a minute across all visitors. max-age=0 + must-revalidate
        // stops the *browser* from holding its own stale copy, which is what made
        // a returning visitor see a frozen number while a fresh browser saw the
        // real one.
        'Cache-Control':
          'public, max-age=0, must-revalidate, s-maxage=60, stale-while-revalidate=120',
      },
    },
  );
}
