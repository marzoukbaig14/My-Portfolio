'use client';
// Model-aware hero stat trio. The figures flip with the shared toggle; the
// surrounding hero copy stays fixed (the flagship arc doesn't rewrite itself).
import { useModel } from './ModelContext';
import { HERO } from './results';

const mono = 'var(--font-geist-mono), monospace';

export function HeroStats() {
  const { model } = useModel();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1.75rem' }}>
      {HERO[model].map(stat => (
        <div key={stat.label} style={{ flex: '1 1 160px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
          <div style={{ fontFamily: mono, fontSize: 'clamp(17px, 2.4vw, 24px)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.15 }}>{stat.value}</div>
          <div style={{ fontFamily: mono, fontSize: '12px', color: 'var(--text-primary)', marginTop: '8px' }}>{stat.label}</div>
          <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{stat.hint}</div>
        </div>
      ))}
    </div>
  );
}
