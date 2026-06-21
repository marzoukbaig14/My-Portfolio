'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { CommandLine } from './CodeHighlight';

function ProjectImage({ command = '$ python train.py' }: { command?: string }) {
  return (
    <div style={{ width: '100%', height: '160px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '6px' }}>
        {['#e05252','#e0b752','#52e07a'].map(c => (
          <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CommandLine text={command} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px' }} />
      </div>
    </div>
  );
}

function TiltCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
    ref.current.style.transition = 'transform 0.1s ease';
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    ref.current.style.transition = 'transform 0.4s ease';
  };

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ transformStyle: 'preserve-3d', ...style }}>
      {children}
    </div>
  );
}

// Hard launch gate: the Committed card only shows when NEXT_PUBLIC_COMMITTED_ENABLED
// is "true" (Preview on, Production off). The flag is inlined at build time,
// so production builds simply never include the card.
const committedEnabled = process.env.NEXT_PUBLIC_COMMITTED_ENABLED === 'true';
const visibleProjects = projects.filter(p => p.id !== 'committed' || committedEnabled);

const featured = visibleProjects.find(p => p.tier === 'featured');
// Committed is the interactive centerpiece, pulled out of the tier1 grid and
// rendered as its own elevated, whole-card-clickable demo card below.
const committed = visibleProjects.find(p => p.id === 'committed');
const tier1 = visibleProjects.filter(p => p.tier === 'tier1' && p.id !== 'committed');
const tier2 = visibleProjects.filter(p => p.tier === 'tier2');

export default function Projects() {
  return (
    <section id="projects" style={{ background: 'rgba(13,13,18,0.65)', padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <h2 style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--accent)' }}>//</span>{' projects'}
        </h2>

        {featured && (
          <TiltCard style={{ marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: 'clamp(1.5rem, 3vw, 2.5rem)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Featured Research</span>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 22px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{featured.title}</h3>
                  <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-muted)' }}>{featured.subtitle}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                  {featured.github && (
                    <a href={featured.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', fontWeight: 600, padding: '8px 18px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none', transition: 'border-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >GitHub</a>
                  )}
                  {featured.paper && (
                    <a href={featured.paper} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', fontWeight: 600, padding: '8px 18px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', textDecoration: 'none', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
                    >Paper PDF</a>
                  )}
                </div>
              </div>
              <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '720px' }}>{featured.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {featured.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb), 0.2)' }}>{tag}</span>
                ))}
              </div>
            </div>
          </TiltCard>
        )}

        {/* Committed: elevated centerpiece. Whole card links to the live demo;
            the GitHub link sits above the overlay so it stays independently clickable. */}
        {committed && (
          <TiltCard style={{ marginBottom: '2rem' }}>
            <div style={{ position: 'relative', background: 'var(--bg-card)', border: '1px solid rgba(var(--accent-rgb), 0.5)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(var(--accent-rgb), 0.15), 0 16px 50px rgba(var(--accent-rgb), 0.12)' }}>
              <ProjectImage command={committed.command} />
              <div style={{ padding: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <span className="committed-live-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
                    live demo
                  </span>
                </div>
                <h3 style={{ fontSize: 'clamp(16px, 2vw, 22px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{committed.title}</h3>
                <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>{committed.subtitle}</p>
                <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1rem', maxWidth: '640px' }}>{committed.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
                  {committed.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb), 0.2)' }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Primary CTA: sits below the overlay, so clicking it follows the whole-card link to the demo. */}
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>Try the live demo →</span>
                  {committed.github && (
                    <a href={committed.github} target="_blank" rel="noopener noreferrer" style={{ position: 'relative', zIndex: 2, fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >View on GitHub →</a>
                  )}
                </div>
              </div>
              {/* Stretched link: makes the entire card a link to the demo. */}
              <Link href={committed.demo ?? '/committed'} aria-label={`${committed.title}: open the live demo`} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
            </div>
            <style>{`
              @media (prefers-reduced-motion: no-preference) {
                .committed-live-dot { animation: committedPulse 1.8s ease-in-out infinite; }
              }
              @keyframes committedPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
            `}</style>
          </TiltCard>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {tier1.map(project => (
            <TiltCard key={project.id}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', height: '100%' }}>
                <ProjectImage command={project.command} />
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{project.title}</h3>
                  <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>{project.subtitle}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>{project.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                    {project.tags.map(tag => (
                      <span key={tag} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', background: 'var(--accent-muted)', color: 'var(--accent)' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>View on GitHub →</a>
                    )}
                    {project.demo && (
                      <Link href={project.demo} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>Try the live demo →</Link>
                    )}
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {tier2.map(project => (
            <TiltCard key={project.id}>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', height: '100%' }}>
                <h3 style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{project.title}</h3>
                <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>{project.subtitle}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>{project.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                  {project.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{tag}</span>
                  ))}
                </div>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>View on GitHub →</a>
                )}
              </div>
            </TiltCard>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="https://github.com/marzoukbaig14" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >more projects on GitHub →</a>
        </div>

      </div>
    </section>
  );
}