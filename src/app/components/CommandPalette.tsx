'use client';
import { useState, useEffect, useRef } from 'react';
import { profile } from '@/data/profile';

const commands = [
  { label: '→ Home', href: '#hero', external: false },
  { label: '→ About', href: '#about', external: false },
  { label: '→ Experience', href: '#experience', external: false },
  { label: '→ Projects', href: '#projects', external: false },
  { label: '→ Contact', href: '#contact', external: false },
  { label: 'Open GitHub ↗', href: profile.socials.github, external: true },
  { label: 'View Resume ↗', href: profile.resume, external: true },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
        }
        if (e.key === 'Escape') setOpen(false);
    };
    const openHandler = () => setOpen(prev => !prev);
    window.addEventListener('keydown', handler);
    window.addEventListener('open-command-palette', openHandler);
    return () => {
        window.removeEventListener('keydown', handler);
        window.removeEventListener('open-command-palette', openHandler);
  };
}, []);

  useEffect(() => {
    if (open) {
      // Remember what had focus so we can hand it back when the palette closes.
      restoreRef.current = document.activeElement as HTMLElement | null;
      inputRef.current?.focus();
      setQuery('');
      setActiveIndex(0);
    } else if (restoreRef.current) {
      restoreRef.current.focus?.();
      restoreRef.current = null;
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    else if (e.key === 'ArrowUp') setActiveIndex(i => Math.max(i - 1, 0));
    else if (e.key === 'Enter' && filtered[activeIndex]) handleSelect(filtered[activeIndex]);
  };

  const handleSelect = (item: (typeof commands)[number]) => {
    setOpen(false);
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Command menu"
      onClick={(e) => { if (e.target === overlayRef.current) setOpen(false); }}
      onKeyDown={(e) => { if (e.key === 'Tab') { e.preventDefault(); inputRef.current?.focus(); } }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 'clamp(80px, 15vh, 180px)' }}
    >
      <div style={{ width: '100%', maxWidth: '540px', margin: '0 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search or navigate..."
            aria-label="Search commands and navigation"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '15px', fontFamily: 'var(--font-geist-mono), monospace' }}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 8px', fontFamily: 'monospace' }}>esc</span>
        </div>

        <div style={{ padding: '8px' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'monospace' }}>No results</div>
          )}
          {filtered.map((item, idx) => (
            <div
              key={item.label}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setActiveIndex(idx)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', background: idx === activeIndex ? 'var(--accent-muted)' : 'transparent', transition: 'background 0.15s' }}
            >
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px', color: idx === activeIndex ? 'var(--accent)' : 'var(--text-secondary)' }}>{item.label}</span>
              {item.external && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>external</span>}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}