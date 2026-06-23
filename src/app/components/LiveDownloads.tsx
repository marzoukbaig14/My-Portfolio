'use client';

// Live Hugging Face download counters for the Committed model + dataset. Reads
// our own cached /api/hf-stats route (which fronts the HF public API) and
// re-polls every couple of minutes, with a "live" pulse so a recruiter can see
// the numbers are real and updating. Two layouts: a compact one-liner for the
// home hero, and a small card strip for the /committed page.

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Count = { downloads: number; downloadsAllTime: number } | null;
type Stats = { model: Count; dataset: Count } | null;

const POLL_MS = 120_000; // match the route's revalidate window (~2 min)

// Warm red for the live pulse: the cyan accent blends into the neural-net
// background, so the "live" indicators use a contrasting color instead.
const LIVE_COLOR = '#ff5c5c';

function fmt(n: number | undefined | null) {
  return typeof n === 'number' ? n.toLocaleString('en-US') : '—';
}

// Prefer the cumulative all-time count; fall back to the 30-day figure.
function pick(c: Count) {
  if (!c) return null;
  return c.downloadsAllTime || c.downloads || 0;
}

function useHfStats() {
  const [stats, setStats] = useState<Stats>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/hf-stats');
        if (!res.ok) return;
        const data = (await res.json()) as Stats;
        if (active && data) {
          setStats(data);
          setLive(true);
        }
      } catch {
        /* keep the last good values */
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return { stats, live };
}

function LiveDot({ active }: { active: boolean }) {
  return (
    <span
      className={active ? 'live-dl-dot' : undefined}
      aria-hidden
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: active ? LIVE_COLOR : 'var(--text-muted)',
        boxShadow: active ? `0 0 8px ${LIVE_COLOR}` : 'none',
        flexShrink: 0,
      }}
    />
  );
}

const dotStyle = `
  @keyframes liveDlPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  @media (prefers-reduced-motion: no-preference) {
    .live-dl-dot { animation: liveDlPulse 1.8s ease-in-out infinite; }
  }
`;

const mono = 'var(--font-geist-mono), monospace';

export default function LiveDownloads({
  variant = 'inline',
  href,
}: {
  variant?: 'inline' | 'cards';
  href?: string;
}) {
  const { stats, live } = useHfStats();
  const model = pick(stats?.model ?? null);
  const dataset = pick(stats?.dataset ?? null);

  if (variant === 'cards') {
    const cards = [
      { value: model, label: 'model downloads', sub: 'Hugging Face' },
      { value: dataset, label: 'dataset downloads', sub: 'Hugging Face' },
    ];
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <LiveDot active={live} />
          <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: live ? LIVE_COLOR : 'var(--text-muted)' }}>
            live{live ? '' : ' · connecting'}
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {cards.map((c) => (
            <div key={c.label} style={{ flex: '1 1 160px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
              <div style={{ fontFamily: mono, fontSize: 'clamp(17px, 2.4vw, 24px)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.15 }}>{fmt(c.value)}</div>
              <div style={{ fontFamily: mono, fontSize: '12px', color: 'var(--text-primary)', marginTop: '8px' }}>{c.label}</div>
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{c.sub}</div>
            </div>
          ))}
        </div>
        <style>{dotStyle}</style>
      </div>
    );
  }

  // inline (home hero): a compact, linkable one-liner.
  const inner = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontFamily: mono, fontSize: 'clamp(12px, 1.4vw, 13px)', color: 'var(--text-secondary)' }}>
      <LiveDot active={live} />
      <span style={{ color: live ? LIVE_COLOR : 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '11px' }}>live</span>
      <span><strong style={{ color: 'var(--text-primary)' }}>{fmt(model)}</strong> model downloads</span>
      <span style={{ color: 'var(--text-muted)' }}>·</span>
      <span><strong style={{ color: 'var(--text-primary)' }}>{fmt(dataset)}</strong> dataset downloads</span>
    </span>
  );

  return (
    <div>
      {href ? (
        <Link href={href} style={{ textDecoration: 'none' }} aria-label="Live Hugging Face downloads, open the Committed demo">
          {inner}
        </Link>
      ) : (
        inner
      )}
      <style>{dotStyle}</style>
    </div>
  );
}
