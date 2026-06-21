'use client';
import { useEffect, useState } from 'react';
import { profile } from '@/data/profile';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const openPalette = () => window.dispatchEvent(new CustomEvent('open-command-palette'));

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50,
      background: scrolled ? 'rgba(13,13,18,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2.5rem)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <a href="#hero" style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          marzouk<span style={{ color: 'var(--accent)' }}>.</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >{link.label}</a>
          ))}

          <button onClick={openPalette} aria-label="Open command palette" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-muted)' }}>⌘K</span>
          </button>

          <a href={profile.resume} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', fontWeight: 600, color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '6px', padding: '6px 16px', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)'; }}
          >Resume</a>
        </div>

        <button className="show-mobile" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation menu" aria-expanded={menuOpen} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px' }}>
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--text-primary)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--text-primary)', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--text-primary)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: 'rgba(13,13,18,0.98)', borderTop: '1px solid var(--border)', padding: '1rem clamp(1rem, 4vw, 2.5rem) 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}>{link.label}</a>
          ))}
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px', color: 'var(--accent)', textDecoration: 'none' }}>Resume ↗</a>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </nav>
  );
}