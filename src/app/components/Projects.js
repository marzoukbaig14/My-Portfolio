'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { projects } from '@/data/projects';

function TiltCard({ children, style }) {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
    ref.current.style.transition = 'transform 0.1s ease';
  };

  const onMouseLeave = () => {
    ref.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    ref.current.style.transition = 'transform 0.4s ease';
  };

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ transformStyle: 'preserve-3d', ...style }}>
      {children}
    </div>
  );
}

const featured = projects.find(p => p.tier === 'featured');
const tier1 = projects.filter(p => p.tier === 'tier1');
const tier2 = projects.filter(p => p.tier === 'tier2');

export default function Projects() {
  return (
    <section id="projects" style={{ background: 'var(--bg-primary)', padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 4rem)', position: 'relative'}}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <h2 style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--accent)' }}>//</span> projects
        </h2>

        {featured && (
          <TiltCard style={{ marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: 'clamp(1.5rem, 3vw, 2.5rem)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124,111,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
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
                  <span key={tag} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid rgba(124,111,255,0.2)' }}>{tag}</span>
                ))}
              </div>
            </div>
          </TiltCard>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {tier1.map(project => (
            <TiltCard key={project.id}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', height: '100%' }}>
                {project.image && (
                  <div style={{ position: 'relative', width: '100%', height: '160px' }}>
                    <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover', opacity: 0.7 }} />
                  </div>
                )}
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{project.title}</h3>
                  <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>{project.subtitle}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>{project.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                    {project.tags.map(tag => (
                      <span key={tag} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', background: 'var(--accent-muted)', color: 'var(--accent)' }}>{tag}</span>
                    ))}
                  </div>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>View on GitHub →</a>
                  )}
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