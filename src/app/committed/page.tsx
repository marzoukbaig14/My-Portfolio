import CommittedBackground from './CommittedBackground';
import CommittedHeader from './CommittedHeader';
import CommittedDemo from './CommittedDemo';
import CommittedArchitecture from './CommittedArchitecture';
import LiveDownloads from '../components/LiveDownloads';
import StorySections from './StorySections';
import ScrollProgress from '../components/ScrollProgress';
import { notFound } from 'next/navigation';

// Indexable: the fine-tune is launched and the page content is final, so we
// let search engines crawl it. (The route is still build-gated by
// NEXT_PUBLIC_COMMITTED_ENABLED, which is separate from this robots metadata.)
export const metadata = {
  title: 'Committed: live demo',
  description: 'A small fine-tuned model that writes Conventional Commit messages from code diffs.',
  robots: { index: true, follow: true },
};

export default function CommittedPage() {
  // Hard launch gate: the route is only reachable when NEXT_PUBLIC_COMMITTED_ENABLED
  // is "true" (set on in the Vercel Preview env, off in Production). With it
  // off, this returns 404 so the page is dark in production even if merged.
  if (process.env.NEXT_PUBLIC_COMMITTED_ENABLED !== 'true') {
    notFound();
  }

  return (
    <>
      <CommittedBackground />
      <ScrollProgress />
      <CommittedHeader />

      <main style={{ marginTop: '64px' }}>
        {/* Intro */}
        <section className="surface-a" style={{ padding: 'clamp(3rem, 7vh, 5.5rem) clamp(1.5rem, 5vw, 4rem) clamp(2rem, 4vh, 3rem)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(13px, 1.6vw, 15px)', color: '#22c55e', marginBottom: '1.25rem' }}>
              ~/projects/committed $ generate
            </div>
            <h1 style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              committed<span style={{ color: 'var(--accent)' }}>.</span>
            </h1>
            {/* Factual one-liner (the project's own description, not invented copy). */}
            <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: 'var(--accent)', fontFamily: 'var(--font-geist-mono), monospace', marginBottom: '1.5rem' }}>
              Conventional Commit messages from your code diffs.
            </p>

            {/* Headline numbers up top, so the result is the first thing a
                recruiter sees. The full eval (table, caveats) is in #results below. */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1.75rem' }}>
              {[
                { value: '0.13 → 0.64', label: 'commit-type accuracy', hint: 'vs. base, reweighted' },
                { value: '0.43 → 0.86', label: 'faithfulness', hint: 'vs. base model' },
                { value: '~1 GB', label: 'runs locally on CPU', hint: 'quantized GGUF' },
              ].map(stat => (
                <div key={stat.label} style={{ flex: '1 1 160px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                  <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(17px, 2.4vw, 24px)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.15 }}>{stat.value}</div>
                  <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-primary)', marginTop: '8px' }}>{stat.label}</div>
                  <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{stat.hint}</div>
                </div>
              ))}
            </div>

            {/* Live adoption signal: real Hugging Face download counts. */}
            <div style={{ marginBottom: '1.75rem' }}>
              <LiveDownloads variant="cards" />
            </div>

            <p style={{ fontSize: 'clamp(14px, 1.7vw, 16px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '620px' }}>
              Fine-tuning a 1.7B model (Qwen3, QLoRA) on ~58k real commits taught it to turn a code
              diff into a clean Conventional Commit subject line. On a 442-diff held-out eval, that
              lifted commit-type accuracy from 0.13 to 0.64 and faithfulness from 0.43 to 0.86 over
              the base model. It serves as a ~1 GB quantized GGUF on llama.cpp, CPU-only, so your
              diffs never leave your machine: most tools like this ship your code off to an API, and
              the point was to build one small enough that nothing has to. A GBNF grammar constrains
              decoding, so every output is a valid commit by construction. Paste a diff below, or try
              an example.
            </p>

            {/* Primary CTA, mirroring the home hero: jump straight to the tool. */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1.75rem' }}>
              <a
                href="#demo"
                className="committed-hero-cta"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 600, padding: '11px 26px', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }}
              >
                Try the demo ↓
              </a>
              <style>{`.committed-hero-cta:hover { background: var(--accent-hover) !important; }`}</style>
            </div>

            {/* System diagram, near the top so the shape of the project reads at a glance. */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: 'clamp(1.25rem, 2.5vw, 1.75rem)', marginTop: '2.25rem', overflowX: 'auto' }}>
              <CommittedArchitecture />
            </div>
          </div>
        </section>

        {/* The tool */}
        <section id="demo" className="surface-a section-divider" style={{ padding: 'clamp(2.5rem, 5vh, 4rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vh, 5rem)', position: 'relative', overflow: 'hidden', scrollMarginTop: '80px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <CommittedDemo />
          </div>
        </section>

        {/* Story */}
        <StorySections />
      </main>
    </>
  );
}
