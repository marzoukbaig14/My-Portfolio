'use client';
import { motion } from 'framer-motion';
import { experience } from '@/data/experience';

export default function Experience() {
  return (
    <section id="experience" className="section-glow" style={{ background: 'rgba(13,13,18,0.65)', padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3rem' }}
        >
          <span style={{ color: 'var(--accent)' }}>//</span>{' experience'}
        </motion.h2>

        <div style={{ position: 'relative', paddingLeft: 'clamp(1.5rem, 3vw, 2.5rem)', borderLeft: '1px solid var(--border)' }}>
          {experience.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ position: 'relative', marginBottom: i < experience.length - 1 ? '3rem' : 0 }}
            >
              <div style={{ position: 'absolute', left: 'clamp(-1.9rem, -2.7vw, -2.9rem)', top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg-primary)', boxShadow: '0 0 0 3px rgba(var(--accent-rgb), 0.2)' }} />

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: 'clamp(1.25rem, 2.5vw, 1.75rem)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{job.role}</h3>
                    <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(12px, 1.4vw, 14px)', color: 'var(--accent)' }}>{job.company}{job.location ? ` · ${job.location}` : ''}</p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 12px', whiteSpace: 'nowrap' }}>{job.period}</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {job.bullets.map((bullet, j) => (
                    <li key={j} style={{ display: 'flex', gap: '10px', fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>›</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}