'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { profile } from '@/data/profile';
import LiveDownloads from './LiveDownloads';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
const ROLE = 'ML Engineer & Applied Researcher';

// Matches the build gate on the Committed route/card; the hero CTA only links
// to the demo when it is actually live.
const committedEnabled = process.env.NEXT_PUBLIC_COMMITTED_ENABLED === 'true';

export default function Hero() {
  const [displayName, setDisplayName] = useState('');
  const [displayRole, setDisplayRole] = useState('');
  const [displayHeadline, setDisplayHeadline] = useState('');
  const [nameTyped, setNameTyped] = useState(false);
  const [roleTyped, setRoleTyped] = useState(false);
  const [headlineTyped, setHeadlineTyped] = useState(false);
  const [showCtas, setShowCtas] = useState(false);
  const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // All three hero lines type in parallel (not sequentially) at one snappy
    // speed, so the whole hero lands in ~1.5s instead of drawn-out line-by-line
    // typing. The longest line (headline) finishes last and gates the CTAs +
    // the live-downloads line via showCtas.
    const SPEED = 10; // ms per character
    const timers: ReturnType<typeof setInterval>[] = [];
    let ctaTimer: ReturnType<typeof setTimeout>;

    const start = setTimeout(() => {
      const type = (text: string, setText: (s: string) => void, onDone: () => void) => {
        let i = 0;
        const id = setInterval(() => {
          i += 1;
          setText(text.slice(0, i));
          if (i >= text.length) {
            clearInterval(id);
            onDone();
          }
        }, SPEED);
        timers.push(id);
      };

      type(profile.name, setDisplayName, () => setNameTyped(true));
      type(ROLE, setDisplayRole, () => setRoleTyped(true));
      type(profile.headline, setDisplayHeadline, () => {
        setHeadlineTyped(true);
        ctaTimer = setTimeout(() => setShowCtas(true), 250);
      });
    }, 100);

    return () => {
      clearTimeout(start);
      clearTimeout(ctaTimer);
      timers.forEach(clearInterval);
    };
  }, []);

  const handleScramble = () => {
    if (!nameTyped) return;
    let iter = 0;
    if (scrambleRef.current) clearInterval(scrambleRef.current);
    scrambleRef.current = setInterval(() => {
      setDisplayName(
        profile.name.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < iter) return profile.name[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('')
      );
      iter += 0.5;
      if (iter >= profile.name.length) {
        if (scrambleRef.current) clearInterval(scrambleRef.current);
        setDisplayName(profile.name);
      }
    }, 30);
  };

  const cursor = (visible: boolean) => visible ? (
    <span style={{ display: 'inline-block', width: '11px', height: '1em', background: '#fef8f8fe', marginLeft: '3px', verticalAlign: 'text-top', animation: 'blink 0.8s infinite' }} />
  ) : null;

  return (
    <section id="hero" className="surface-a" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '70vw', maxWidth: '900px', height: '35vh', background: 'radial-gradient(ellipse, rgba(124,111,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '860px', width: '100%', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(13px, 1.8vw, 16px)', color: '#22c55e' }}>
              ~/marzouk $
            </span>
            {/* Availability, surfaced up top so recruiters see fit immediately. */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(11px, 1.4vw, 13px)', color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px', padding: '4px 12px' }}>
              <span className="hero-available-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              Open to co-ops &amp; internships from December 2026
            </span>
          </div>

          <h1
            onMouseEnter={handleScramble}
            onTouchStart={handleScramble}
            style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '0.75rem', cursor: 'default', userSelect: 'none', minHeight: '1.2em' }}
          >
            {displayName}
            {!nameTyped && cursor(true)}
          </h1>

          <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(14px, 2vw, 20px)', color: 'var(--accent)', marginBottom: '1.75rem', minHeight: '1.4em' }}>
            {displayRole}
            {!roleTyped && cursor(true)}
          </p>

          <p style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '620px', marginBottom: '2.5rem', minHeight: '3em' }}>
            {displayHeadline}
            {cursor(true)}
          </p>

          {showCtas && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <a href="#projects"
                style={{ background: 'var(--accent)', color: '#fff', fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 600, padding: '11px 26px', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
              >View Projects</a>
              {committedEnabled && (
                <Link href="/committed"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 600, padding: '11px 22px', borderRadius: '8px', color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb), 0.5)', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-muted)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.5)'; }}
                >
                  <span className="hero-live-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5c5c', boxShadow: '0 0 8px #ff5c5c' }} />
                  Try Committed, my live commit-message model →
                </Link>
              )}
              <a href="#contact"
                style={{ color: 'var(--text-secondary)', fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >Contact Me →</a>
              <a href={profile.resume} target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >Resume ↗</a>
            </motion.div>
          )}

          {/* Live proof: a one-line description of what the demo is, plus real
              Hugging Face download counts for the Committed model + dataset. */}
          {showCtas && committedEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{ marginTop: '1.5rem' }}
            >
              <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(12px, 1.4vw, 13px)', color: 'var(--text-secondary)', margin: '0 0 8px', maxWidth: '620px', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--accent)' }}>Committed</span>: a fine-tuned model that writes Conventional Commit messages from your code diffs, running locally on CPU.
              </p>
              <LiveDownloads variant="inline" href="/committed" />
            </motion.div>
          )}

        </motion.div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes heroPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (prefers-reduced-motion: no-preference) {
          .hero-live-dot, .hero-available-dot { animation: heroPulse 1.8s ease-in-out infinite; }
        }
      `}</style>
    </section>
  );
}