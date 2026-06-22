'use client';
import { motion } from 'framer-motion';
import { CodeBlock } from '../components/CodeHighlight';

// Story sections beneath the tool: how it works, results (with the real eval
// numbers and the honest specificity regression), sample outputs, run-it-locally,
// and the built-with stack + links. Copy and metrics here are the project's real,
// final content.

const sectionStyle: React.CSSProperties = {
  background: 'rgba(13,13,18,0.65)',
  padding: 'clamp(3.5rem, 7vh, 6rem) clamp(1.5rem, 5vw, 4rem)',
  position: 'relative',
  overflow: 'hidden',
};
const innerStyle: React.CSSProperties = { maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 };

function SectionHeading({ children }: { children: React.ReactNode }) {
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

const cardStyle: React.CSSProperties = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' };
const inlineCode: React.CSSProperties = { fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.9em', color: 'var(--accent)', background: 'var(--accent-muted)', borderRadius: '4px', padding: '1px 6px' };

export default function StorySections() {
  return (
    <>
      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="section-glow" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>how it works</SectionHeading>
          <motion.div {...reveal}>
            <p style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px', marginBottom: '1.75rem' }}>
              Committed is a complete pipeline, not just a model. I started from CommitChronicle
              (roughly 10.7M real GitHub commits) and wrote a filter to extract clean, single-file diffs
              paired with well-formed Conventional Commit subjects, normalizing them into a consistent
              training target. I fine-tuned Qwen3-1.7B with QLoRA on the result, evaluated it against the
              un-tuned base model on a multi-metric harness with an LLM judge I validated against my own
              hand-ratings, then served it locally through llama.cpp with grammar-constrained decoding
              that guarantees every output is syntactically valid. Most of the work was the data, not the
              model, and all four stages (data, training, evaluation, serving) are here.
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
            <p style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px', marginBottom: '1.75rem' }}>
              I evaluated the fine-tune against the un-tuned Qwen3-1.7B base on a 442-example test
              sample, scored by an LLM judge on four orthogonal axes. The headline numbers are reweighted
              to the true commit-type distribution of the test split, so they reflect realistic
              deployment behavior.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { value: '0.637', label: 'type accuracy', hint: 'deployment-reweighted' },
                { value: '0.471', label: 'conjunctive pass-rate', hint: 'all four axes pass' },
                { value: '2.188', label: 'graded mean (0–3)', hint: 'LLM-judge score' },
                { value: 'Qwen3-1.7B', label: 'base model', hint: 'fine-tuned with QLoRA' },
              ].map(stat => (
                <div key={stat.label} style={{ ...cardStyle, padding: '1.25rem' }}>
                  <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(20px, 3.2vw, 30px)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.1, wordBreak: 'break-word' }}>{stat.value}</div>
                  <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-primary)', marginTop: '10px' }}>{stat.label}</div>
                  <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.hint}</div>
                </div>
              ))}
            </div>

            {/* Before/after: un-tuned base → fine-tune, on the LLM-judge axes. */}
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <span>metric</span>
                <span style={{ textAlign: 'right' }}>base</span>
                <span style={{ textAlign: 'right' }}>fine-tuned</span>
              </div>
              {[
                { metric: 'Type correctness', base: '0.33', tuned: '0.81' },
                { metric: 'Faithfulness', base: '0.43', tuned: '0.86' },
                { metric: 'Completeness', base: '0.52', tuned: '0.73' },
                { metric: 'Specificity', base: '0.81', tuned: '0.71' },
                { metric: 'Type accuracy (deployment-reweighted)', base: '0.131', tuned: '0.637' },
                { metric: 'Conjunctive pass-rate', base: '0.181', tuned: '0.471' },
                { metric: 'Graded mean (0–3)', base: '1.207', tuned: '2.188' },
              ].map((row, i, arr) => (
                <div key={row.metric} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', padding: '10px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{row.metric}</span>
                  <span style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{row.base}</span>
                  <span style={{ textAlign: 'right', color: 'var(--accent)', fontWeight: 600 }}>{row.tuned}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px', marginBottom: '1.25rem' }}>
              The base model&apos;s dominant failure mode was &ldquo;feat-collapse&rdquo;: it labeled
              roughly 95% of all diffs as <code style={inlineCode}>feat</code>, regardless of what the
              change actually did. Because <code style={inlineCode}>fix</code> commits alone make up about
              49% of real-world commits, a model that almost never predicts{' '}
              <code style={inlineCode}>fix</code> scores worse on type than a trivial
              always-guess-<code style={inlineCode}>fix</code> baseline (0.489), and the un-tuned base,
              at 0.131, did exactly that. Fine-tuning broke the collapse and lifted type accuracy well
              above the trivial floor.
            </p>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '700px', marginBottom: '1.25rem' }}>
              One axis regressed, which I didn&apos;t expect: specificity dropped from 0.81 to 0.71. The fine-tune learned the terse,
              normalized subject style of the training targets so well that it sometimes produces messages
              slightly more generic than the base model&apos;s wordier output. It&apos;s a real trade-off,
              traceable to a normalization choice in the training data, and the next training iteration
              targets it directly. I report it because a portfolio that only shows the wins isn&apos;t an
              honest evaluation.
            </p>

            <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px' }}>
              An LLM judge is only trustworthy if it agrees with a human. I hand-rated 50 examples blind
              and measured the judge against them: raw agreement ran 0.68–0.84 across the four axes
              (Cohen&apos;s κ 0.25–0.54), strongest on completeness. That&apos;s a fair-to-moderate proxy,
              good enough to trust for relative comparisons, with the honest caveat that n=50 gives wide
              confidence intervals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Sample outputs ───────────────────────────────────────── */}
      <section id="sample-outputs" className="section-glow" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>sample outputs</SectionHeading>
          <motion.div {...reveal} style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                language: 'Python',
                diff: `@@ -1639,7 +1639,7 @@ def moveaxis(a, source, destination):
 >>> np.transpose(x).shape
 (5, 4, 3)
->>> np.swapaxis(x, 0, -1).shape
+>>> np.swapaxes(x, 0, -1).shape
 (5, 4, 3)
 >>> np.moveaxis(x, [0, 1], [-1, -2]).shape
 (5, 4, 3)`,
                base: 'feat(additional-function): Add `swapaxes` function with same behavior as `swapaxis` but using `swapaxes` notation. 📦',
                msg: 'docs: Fix typo in np.swapaxis docstring',
              },
              {
                language: 'C#',
                diff: `@@ -20,13 +20,17 @@ public partial class RestClient {
 /// <param name="request">Request to be executed</param>
-public RestResponse Execute(RestRequest request) => AsyncHelpers.RunSync(() => ExecuteAsync(request));
+/// <param name="cancellationToken">The cancellation token</param>
+public RestResponse Execute(RestRequest request, CancellationToken cancellationToken = default)
+    => AsyncHelpers.RunSync(() => ExecuteAsync(request, cancellationToken));`,
                base: 'feat(adds-parameter): Adds a `CancellationToken` parameter to `Execute` and `DownloadStream` methods, allowing for cancellation support. 📦',
                msg: 'feat(RestClient): add support for cancellation tokens',
              },
            ].map(pair => (
              <div key={pair.msg} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>input diff</span>
                  <span>{pair.language}</span>
                </div>
                <CodeBlock code={pair.diff} lang={pair.language === 'C#' ? 'csharp' : 'python'} diff style={{ fontSize: '13px', lineHeight: 1.7 }} />
                {/* Base (un-tuned) output: de-emphasized; raw, incl. the feat-collapse mislabel. */}
                <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '10px', padding: '12px 16px', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', lineHeight: 1.6 }}>
                  <span style={{ flexShrink: 0, color: 'var(--text-muted)' }}>base Qwen3-1.7B →</span>
                  <span style={{ color: 'var(--text-muted)' }}>{pair.base}</span>
                </div>
                {/* Fine-tune output: emphasized; what Committed produces. */}
                <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '10px', padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'rgba(var(--accent-rgb), 0.06)', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px', lineHeight: 1.6 }}>
                  <span style={{ flexShrink: 0, color: 'var(--accent)', fontWeight: 600 }}>committed →</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{pair.msg}</span>
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
              Committed runs entirely on your machine. No API, no diff ever leaving your laptop.
              Install it from the repo, pipe a diff in, and get a commit message back:
            </p>
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '6px', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                {['#e05252', '#e0b752', '#52e07a'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.7 }} />)}
              </div>
              <CodeBlock
                code={`pip install git+https://github.com/marzoukbaig14/Committed.git
git diff | committed`}
                lang="shell"
                style={{ fontSize: '14px', lineHeight: 1.8 }}
              />
            </div>
            <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '640px', marginTop: '1.25rem' }}>
              The model is a quantized GGUF served through llama.cpp on CPU; the first run downloads it
              once (~1 GB), then it&apos;s fully offline. The hosted demo above runs the identical model.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Built with & links ───────────────────────────────────── */}
      <section id="built-with" className="section-glow" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>built with</SectionHeading>
          <motion.div {...reveal}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.75rem' }}>
              {['Qwen3-1.7B', 'QLoRA / PEFT', 'llama.cpp', 'GBNF grammar', 'FastAPI', 'Docker', 'Hugging Face', 'Next.js'].map(tag => (
                <span key={tag} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb), 0.2)' }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {[
                { label: 'GitHub repo', href: 'https://github.com/marzoukbaig14/Committed' },
                { label: 'Model card (adapter)', href: 'https://huggingface.co/marzoukbaig14/committed-qwen3-1.7b-lora' },
                { label: 'Model card (GGUF)', href: 'https://huggingface.co/marzoukbaig14/committed-gguf' },
                { label: 'Dataset', href: 'https://huggingface.co/datasets/marzoukbaig14/committed-train' },
              ].map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >{link.label} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>↗</span></a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
