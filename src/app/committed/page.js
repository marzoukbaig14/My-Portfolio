import CommittedBackground from './CommittedBackground.js';
import CommittedHeader from './CommittedHeader.js';
import CommittedDemo from './CommittedDemo.js';
import StorySections from './StorySections.js';
import SmoothScroll from '../components/SmoothScroll.js';
import Cursor from '../components/Cursor.js';
import ScrollProgress from '../components/ScrollProgress.js';

// noindex: this page is not public yet. The contract says don't publicize
// until the fine-tune is ready, so we keep it out of search indexes even on
// the Vercel preview. Remove this when the human is ready to launch.
export const metadata = {
  title: 'Committed — live demo',
  description: 'A small fine-tuned model that writes Conventional Commit messages from code diffs.',
  robots: { index: false, follow: false },
};

export default function CommittedPage() {
  return (
    <>
      <CommittedBackground />
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <CommittedHeader />

      <main style={{ marginTop: '64px' }}>
        {/* Intro */}
        <section style={{ background: 'rgba(13,13,18,0.65)', padding: 'clamp(3rem, 7vh, 5.5rem) clamp(1.5rem, 5vw, 4rem) clamp(2rem, 4vh, 3rem)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(13px, 1.6vw, 15px)', color: '#22c55e', marginBottom: '1.25rem' }}>
              ~/projects/committed $ generate
            </div>
            <h1 style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              committed<span style={{ color: 'var(--accent)' }}>.</span>
            </h1>
            {/* Factual one-liner (the project's own description, not invented copy). */}
            <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: 'var(--accent)', fontFamily: 'var(--font-geist-mono), monospace', marginBottom: '1rem' }}>
              Conventional Commit messages from your code diffs.
            </p>
            <p style={{ fontSize: 'clamp(14px, 1.7vw, 16px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '620px' }}>
              {/* [placeholder] one or two lines of framing — the human's words. */}
              [placeholder] A short line of framing goes here. Paste a diff below, or try one of the
              examples, and Committed writes the commit subject for you.
            </p>
          </div>
        </section>

        {/* The tool */}
        <section style={{ background: 'rgba(13,13,18,0.65)', padding: '0 clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vh, 5rem)', position: 'relative', overflow: 'hidden' }}>
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
