'use client';
import { motion } from 'framer-motion';

// Story sections beneath the tool. Everything here is PLACEHOLDER scaffolding:
// the layout and structure are real and on-theme, but the human owns the
// narrative, the real metrics, the curated sample outputs, and the final
// links. Anywhere you see [placeholder] or an em-dash stat, that is a slot to
// fill — no real numbers are invented here.

const sectionStyle = {
  background: 'rgba(13,13,18,0.65)',
  padding: 'clamp(3.5rem, 7vh, 6rem) clamp(1.5rem, 5vw, 4rem)',
  position: 'relative',
  overflow: 'hidden',
};
const innerStyle = { maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 };

function SectionHeading({ children }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(20px, 2.6vw, 28px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.75rem' }}
    >
      <span style={{ color: 'var(--accent)' }}>//</span> {children}
    </motion.h2>
  );
}

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay: 0.1 },
};

const cardStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' };
const placeholderTag = { fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 8px' };

export default function StorySections() {
  return (
    <>
      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>how it works</SectionHeading>
          <motion.div {...reveal}>
            <p style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '640px', marginBottom: '1.75rem' }}>
              [placeholder] Committed is a small model fine-tuned to turn a code diff into a single
              Conventional Commit subject line. Describe the data, the base model, and the training setup
              here — the human writes this section.
            </p>
            {/* Pipeline motif, on-theme and content-agnostic. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px' }}>
              {['git diff', 'committed', 'feat(scope): subject'].map((step, i, arr) => (
                <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ padding: '8px 14px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: i === arr.length - 1 ? 'var(--accent)' : 'var(--text-secondary)' }}>{step}</span>
                  {i < arr.length - 1 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Results (floated high, per the spec) ─────────────────── */}
      <section id="results" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>results</SectionHeading>
          <motion.div {...reveal}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <span style={placeholderTag}>placeholder metrics</span>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-muted)' }}>real numbers from the eval go here</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'well-formed rate', hint: 'syntax-valid outputs' },
                { label: 'type accuracy', hint: 'vs. reference type' },
                { label: 'eval set size', hint: 'held-out diffs' },
                { label: 'base model', hint: 'params / family' },
              ].map(stat => (
                <div key={stat.label} style={{ ...cardStyle, padding: '1.25rem' }}>
                  <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>—</div>
                  <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-primary)', marginTop: '10px' }}>{stat.label}</div>
                  <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.hint}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Sample outputs ───────────────────────────────────────── */}
      <section id="sample-outputs" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>sample outputs</SectionHeading>
          <motion.div {...reveal} style={{ display: 'grid', gap: '1rem' }}>
            <span style={{ ...placeholderTag, alignSelf: 'flex-start' }}>placeholder pairs</span>
            {[
              { file: 'src/auth/session.ts', msg: 'feat(auth): expire idle sessions after 30m' },
              { file: 'lib/parser.py', msg: 'fix(parser): handle empty input without raising' },
            ].map(pair => (
              <div key={pair.file} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {pair.file}
                </div>
                <div style={{ padding: '16px', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>$ </span>{pair.msg}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Run it locally ───────────────────────────────────────── */}
      <section id="run-locally" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>run it locally</SectionHeading>
          <motion.div {...reveal}>
            <p style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '640px', marginBottom: '1.5rem' }}>
              [placeholder] The model is small enough to run on your own machine — no diff leaves your laptop.
              The human fills in the real install and usage steps.
            </p>
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '6px', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                {['#e05252', '#e0b752', '#52e07a'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.7 }} />)}
              </div>
              <pre style={{ margin: 0, padding: '16px', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)', overflowX: 'auto' }}>
{`# [placeholder commands]
$ pip install committed        # or the real distribution
$ git diff | committed         # prints a Conventional Commit subject`}
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Built with & links ───────────────────────────────────── */}
      <section id="built-with" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>built with</SectionHeading>
          <motion.div {...reveal}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.75rem' }}>
              {/* [placeholder] representative stack — the human confirms the real list. */}
              {['PyTorch', 'Transformers', 'LoRA / PEFT', 'Hugging Face', 'FastAPI', 'Next.js'].map(tag => (
                <span key={tag} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb), 0.2)' }}>{tag}</span>
              ))}
            </div>
            {/* Inert placeholder links — rendered as chips, not anchors, so no
                fabricated URLs ship. The human swaps these for real hrefs. */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['GitHub repo', 'Model card', 'Write-up'].map(label => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
                  {label} <span style={{ fontSize: '10px' }}>(link TBD)</span>
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
