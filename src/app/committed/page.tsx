import CommittedBackground from './CommittedBackground';
import CommittedHeader from './CommittedHeader';
import CommittedDemo from './CommittedDemo';
import StorySections from './StorySections';
import SmoothScroll from '../components/SmoothScroll';
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
      <SmoothScroll />
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
              An end-to-end ML project, from data curation through fine-tuning, evaluation, and
              serving, that turns a code diff into a clean Conventional Commit message. It runs
              locally on a quantized 1.7B model, so your diffs never leave your machine. That was the
              point: most tools like this ship your code off to an API, and I wanted one small enough
              that nothing has to. Paste a diff below, or try an example, and Committed writes the
              subject line for you.
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
