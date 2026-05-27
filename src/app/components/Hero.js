'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/data/profile';
import NeuralBackground from '@/app/components/NeuralBackground';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
const ROLE = 'ML Engineer & Applied Researcher';

export default function Hero() {
  const [displayName, setDisplayName] = useState('');
  const [displayRole, setDisplayRole] = useState('');
  const [displayHeadline, setDisplayHeadline] = useState('');
  const [nameTyped, setNameTyped] = useState(false);
  const [roleTyped, setRoleTyped] = useState(false);
  const [headlineTyped, setHeadlineTyped] = useState(false);
  const [showCtas, setShowCtas] = useState(false);
  const scrambleRef = useRef(null);

  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const nameInterval = setInterval(() => {
        setDisplayName(profile.name.slice(0, i + 1));
        i++;
        if (i >= profile.name.length) {
          clearInterval(nameInterval);
          setNameTyped(true);
          setTimeout(() => {
            let j = 0;
            const roleInterval = setInterval(() => {
              setDisplayRole(ROLE.slice(0, j + 1));
              j++;
              if (j >= ROLE.length) {
                clearInterval(roleInterval);
                setRoleTyped(true);
                setTimeout(() => {
                  let k = 0;
                  const headlineInterval = setInterval(() => {
                    setDisplayHeadline(profile.headline.slice(0, k + 1));
                    k++;
                    if (k >= profile.headline.length) {
                      clearInterval(headlineInterval);
                      setHeadlineTyped(true);
                      setTimeout(() => setShowCtas(true), 400);
                    }
                  }, 12); // headline typing speed
                }, 300);
              }
            }, 18); // role typing speed
          }, 400);
        }
      }, 50); // name typing speed
    }, 100);
    return () => clearTimeout(start);
  }, []);

  const handleScramble = () => {
    if (!nameTyped) return;
    let iter = 0;
    clearInterval(scrambleRef.current);
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
        clearInterval(scrambleRef.current);
        setDisplayName(profile.name);
      }
    }, 30);
  };

  const cursor = (visible) => visible ? (
    <span style={{ display: 'inline-block', width: '11px', height: '1em', background: '#fef8f8fe', marginLeft: '3px', verticalAlign: 'text-top', animation: 'blink 0.8s infinite' }} />
  ) : null;

  return (
    <section id="hero" style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}>

      <NeuralBackground />

      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '70vw', maxWidth: '900px', height: '35vh', background: 'radial-gradient(ellipse, rgba(124,111,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '860px', width: '100%', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(13px, 1.8vw, 16px)', color: '#22c55e', marginBottom: '1.5rem' }}>
            ~/marzouk $
          </div>

          <h1
            onMouseEnter={handleScramble}
            style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '0.75rem', cursor: 'default', userSelect: 'none', minHeight: '1.2em' }}
          >
            {displayName}
            {!nameTyped && cursor(true)}
          </h1>

          <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(14px, 2vw, 20px)', color: 'var(--accent)', marginBottom: '1.75rem', minHeight: '1.4em' }}>
            {displayRole}
            {nameTyped && !roleTyped && cursor(true)}
          </p>

          <p style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '620px', marginBottom: '2.5rem', minHeight: '3em' }}>
            {displayHeadline}
            {roleTyped && cursor(true)}
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

        </motion.div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </section>
  );
}