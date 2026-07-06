'use client';

// Live Hugging Face download counter for the whole Committed project. Reads our
// own /api/hf-stats route (which fronts the HF public API and sums every project
// artifact — both GGUF builds, both LoRA adapters, and the dataset) into one
// honest total, re-polling every minute with a "live" pulse. Two layouts: a
// compact one-liner for the home hero, and a small card for the /committed page.
// The per-repo breakdown stays visible on each Hub card.

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Count = { downloads: number; downloadsAllTime: number } | null;
type Stats = { total: Count } | null;

const POLL_MS = 60_000; // match the route's revalidate window (~1 min)

// Amber for the live pulse: the cyan accent blends into the neural-net
// background, so the "live" indicators use a contrasting color. Amber reads as
// "active/attention" without the alarm connotation of a red dot.
const LIVE_COLOR = '#f5a623';

// The honest umbrella label — the figure spans models, adapters, and the dataset.
const TOTAL_LABEL = "across the project's artifacts — models, adapters & dataset";

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

    // No stale seed: on mount we show a loading state (— / "connecting") and
    // only display a real number once a live fetch returns, so a returning
    // visitor never sees a frozen figure.
    const load = async () => {
      try {
        // no-store: always ask the edge for the freshest figure rather than
        // letting the browser serve its own (potentially frozen) cached copy.
        const res = await fetch('/api/hf-stats', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Stats;
        if (!active || !data) return;
        // Keep the last real total if a cycle returns null (partial failure)
        // instead of wiping the number back to a dash.
        setStats((prev) => ({ total: data.total ?? prev?.total ?? null }));
        setLive(true);
      } catch {
        /* keep the last good value */
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
  const total = pick(stats?.total ?? null);

  if (variant === 'cards') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <LiveDot active={live} />
          <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: live ? LIVE_COLOR : 'var(--text-muted)' }}>
            live{live ? '' : ' · connecting'}
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ flex: '1 1 260px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
            <div style={{ fontFamily: mono, fontSize: 'clamp(17px, 2.4vw, 24px)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.15 }}>{fmt(total)}</div>
            <div style={{ fontFamily: mono, fontSize: '12px', color: 'var(--text-primary)', marginTop: '8px' }}>total downloads</div>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{TOTAL_LABEL}</div>
          </div>
        </div>
        <style>{dotStyle}</style>
      </div>
    );
  }

  // inline (home hero): the live pulse leads as the attention signal; the total
  // trails as quiet supporting detail rather than a bold headline number.
  const inner = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontFamily: mono, fontSize: 'clamp(12px, 1.4vw, 13px)', color: 'var(--text-muted)' }}>
      <LiveDot active={live} />
      <span style={{ color: live ? LIVE_COLOR : 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '11px' }}>live</span>
      <span style={{ color: 'var(--text-muted)' }}>·</span>
      <span>
        {fmt(total)} total downloads {TOTAL_LABEL}
      </span>
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
