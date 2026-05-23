'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import { profile } from '@/data/profile';
import SectionBackground from '@/app/components/SectionBackground';

export default function Contact() {
  const [state, handleSubmit] = useForm("mkgwgova");
  const [focused, setFocused] = useState(null);

  const inputStyle = (name) => ({
    width: '100%',
    background: 'var(--bg-card)',
    border: `1px solid ${focused === name ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'var(--font-geist-sans)',
    outline: 'none',
    transition: 'border-color 0.2s',
    resize: 'none',
  });

  return (
    <section id="experience" style={{ background: 'rgba(13,13,18,0.65)', padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}>
      <SectionBackground />
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}
        >
          <span style={{ color: 'var(--accent)' }}>//</span>{' contact'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px' }}
        >
          Open to research collaborations, internships, and full-time ML engineering roles. Feel free to reach out.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(2rem, 5vw, 4rem)' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {state.succeeded ? (
              <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '1rem' }}>✓</div>
                <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px', color: '#22c55e' }}>Message sent. {"I'll get back to you soon."}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    style={inputStyle('name')}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                <div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    required
                    style={inputStyle('email')}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} style={{ fontSize: '12px', color: '#f87171', marginTop: '4px' }} />
                </div>
                <div>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your message"
                    required
                    rows={5}
                    style={inputStyle('message')}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} style={{ fontSize: '12px', color: '#f87171', marginTop: '4px' }} />
                </div>
                <button
                  type="submit"
                  disabled={state.submitting}
                  style={{ background: state.submitting ? 'var(--bg-card)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-geist-mono), monospace', cursor: state.submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s', alignSelf: 'flex-start' }}
                  onMouseEnter={e => { if (!state.submitting) e.currentTarget.style.background = 'var(--accent-hover)'; }}
                  onMouseLeave={e => { if (!state.submitting) e.currentTarget.style.background = 'var(--accent)'; }}
                >
                  {state.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {[
              { label: 'email', value: profile.socials.email, href: `mailto:${profile.socials.email}` },
              { label: 'github', value: 'github.com/marzoukbaig14', href: profile.socials.github },
              { label: 'linkedin', value: 'linkedin.com/in/muhammadmarzoukbaig', href: profile.socials.linkedin },
            ].map(item => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', textDecoration: 'none', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,111,255,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</span>
                <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', color: 'var(--text-secondary)' }}>{item.value}</span>
              </a>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}