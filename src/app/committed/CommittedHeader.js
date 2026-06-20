'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// A slim, sub-page header. It mirrors the site Navbar's look (fixed, mono
// brand, blur-on-scroll) but is NOT the home Navbar — that one's links point
// at home-page anchors (#about, #projects) which don't exist here. These
// links resolve on this route: the brand returns to the portfolio, and the
// section links target sections that exist on this page.
const sectionLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Results', href: '#results' },
  { label: 'Samples', href: '#sample-outputs' },
  { label: 'Run locally', href: '#run-locally' },
  { label: 'Built with', href: '#built-with' },
];

export default function CommittedHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50,
      background: scrolled ? 'rgba(13,13,18,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2.5rem)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <Link href="/" style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          marzouk<span style={{ color: 'var(--accent)' }}>.</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 3vw, 2rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="committed-nav-links">
            {sectionLinks.map(link => (
              <a key={link.href} href={link.href} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >{link.label}</a>
            ))}
          </div>

          <Link href="/#projects" style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', fontWeight: 600, color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '6px', padding: '6px 16px', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)'; }}
          >← Portfolio</Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .committed-nav-links { display: none !important; } }
      `}</style>
    </nav>
  );
}
