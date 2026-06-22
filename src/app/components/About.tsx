'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { profile } from '@/data/profile';

export default function About() {
  const [glitching, setGlitching] = useState(false);

  const triggerGlitch = () => {
    if (glitching) return;
    setGlitching(true);
    setTimeout(() => setGlitching(false), 700);
  };

  return (
    <section id="about" className="section-glow" style={{ background: 'rgba(13,13,18,0.65)', padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3rem' }}
        >
          <span style={{ color: 'var(--accent)' }}>//</span>{' about'}
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'start' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {profile.about.map((text, i) => (
              <p key={i} style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                {text}
              </p>
            ))}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', border: '1px solid rgba(var(--accent-rgb), 0.3)', borderRadius: '6px', padding: '6px 16px', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-muted)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >GitHub ↗</a>
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', border: '1px solid rgba(var(--accent-rgb), 0.3)', borderRadius: '6px', padding: '6px 16px', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-muted)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >LinkedIn ↗</a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
          >
            <div
              onMouseEnter={triggerGlitch}
              onTouchStart={triggerGlitch}
              style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', width: '100%', maxWidth: '320px', cursor: 'pointer' }}
            >
              <Image
                src="/images/my-profile-picture.jpg"
                alt={profile.name}
                width={320}
                height={420}
                priority
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'brightness(0.9)',
                  animation: glitching ? 'glitch 0.7s steps(1) forwards' : 'none'
                }}
              />
              {glitching && (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)', pointerEvents: 'none', zIndex: 2 }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,18,0.6) 0%, transparent 50%)', pointerEvents: 'none' }} />
            </div>

            <div style={{ width: '100%', maxWidth: '320px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
              {[
                { label: 'currently', value: 'MS AI @ Northeastern' },
                { label: 'based in', value: 'Portland, ME' },
                { label: 'focus', value: 'ML Engineering + Research' },
                { label: 'email', value: profile.socials.email },
              ].map((item, i, arr) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-secondary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes glitch {
          0%   { transform: translate(0); filter: brightness(0.9); }
          8%   { transform: translate(-4px, 0); filter: hue-rotate(90deg) saturate(5) brightness(1.4); }
          16%  { transform: translate(4px, 0); filter: hue-rotate(-90deg) saturate(5) brightness(0.8); }
          24%  { transform: translate(0, -3px); filter: brightness(2) contrast(1.5); }
          32%  { transform: translate(-3px, 2px); filter: hue-rotate(180deg) saturate(3); }
          40%  { transform: translate(3px, -2px); filter: none; }
          48%  { transform: translate(0); filter: brightness(0.9); }
          56%  { transform: translate(-5px, 0); filter: hue-rotate(45deg) brightness(1.6) saturate(4); }
          64%  { transform: translate(5px, 1px); filter: hue-rotate(-45deg) brightness(0.7); }
          72%  { transform: translate(-2px, -1px); filter: brightness(1.8) contrast(2); }
          80%  { transform: translate(2px, 1px); filter: hue-rotate(120deg); }
          90%  { transform: translate(0); filter: brightness(1.2); }
          100% { transform: translate(0); filter: brightness(0.9); }
        }
      `}</style>
    </section>
  );
}