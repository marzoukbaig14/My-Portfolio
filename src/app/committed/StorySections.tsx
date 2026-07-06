'use client';
import { motion } from 'framer-motion';
import { CodeBlock } from '../components/CodeHighlight';
import { useModel } from './ModelContext';
import { ModelToggle } from './ModelToggle';
import { METRICS, MODELS, EVAL_META, SUMMARY, JUDGE_AGREEMENT } from './results';
import type { ModelId } from './api';

// Story sections beneath the tool: how it works, results (with the real eval
// numbers and the honest specificity regression), sample outputs, run-it-locally,
// and the built-with stack + links. Copy and metrics here are the project's real,
// final content.

// Each section shares the .surface-a background and is separated by the
// .section-divider accent rule (see globals.css).
const sectionStyle: React.CSSProperties = {
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
  const { model } = useModel();

  // Columns for the four-arm comparison: each model's base and fine-tune.
  const cols: { model: ModelId; arm: 'base' | 'ft' }[] = [
    { model: '0.6b', arm: 'base' },
    { model: '0.6b', arm: 'ft' },
    { model: '1.7b', arm: 'base' },
    { model: '1.7b', arm: 'ft' },
  ];

  return (
    <>
      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="surface-a section-divider" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>how it works</SectionHeading>
          <motion.div {...reveal}>
            <p style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px', marginBottom: '1.75rem' }}>
              Committed is a complete pipeline, not just a model. I started from CommitChronicle
              (roughly 10.7M real GitHub commits) and wrote a filter to extract clean, single-file diffs
              paired with well-formed Conventional Commit subjects, normalizing them into a consistent
              training target. I fine-tuned Qwen3 with QLoRA on the result — first the 1.7B, then the
              0.6B on the identical recipe — evaluated each against its un-tuned base on a multi-metric
              harness with an LLM judge I validated against my own hand-ratings, then served them locally
              through llama.cpp with grammar-constrained decoding that guarantees every output is
              syntactically valid. Most of the work was the data, not the model, and all four stages
              (data, training, evaluation, serving) are here.
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
      <section id="results" className="surface-a section-divider" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>results</SectionHeading>
          <motion.div {...reveal}>
            <p style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px', marginBottom: '1.5rem' }}>
              I fine-tuned two sizes on the identical pipeline — Qwen3-1.7B and a smaller Qwen3-0.6B —
              and evaluated each against its un-tuned base on a {EVAL_META.sample}-example test sample,
              scored by a {EVAL_META.judge} judge on four orthogonal axes and reweighted to the test
              split&apos;s true commit-type distribution. All four arms share the same judge, so every
              comparison below is apples-to-apples.
            </p>

            {/* Shared model toggle + a focused readout that changes with it. */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <ModelToggle ariaLabel="Model to spotlight" />
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
                spotlighting {MODELS[model].label} — synced with the demo
              </span>
            </div>

            <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                {SUMMARY[model].blurb}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                {SUMMARY[model].stats.map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 'clamp(18px, 2.6vw, 22px)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.1 }}>{s.value}</div>
                    <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full four-arm comparison. Fine-tune columns are emphasized; the
                spotlighted model's fine-tune column is highlighted. Scrolls on
                narrow screens. */}
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', overflowX: 'auto', marginBottom: '1.25rem' }}>
              <div style={{ minWidth: '540px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1.6fr) repeat(4, minmax(58px, 1fr))', gap: '2px 8px', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <span>metric</span>
                  {cols.map(col => {
                    const spot = col.model === model && col.arm === 'ft';
                    return (
                      <span key={`${col.model}-${col.arm}`} style={{ textAlign: 'right', color: spot ? 'var(--accent)' : 'var(--text-muted)', fontWeight: spot ? 700 : 400 }}>
                        {MODELS[col.model].params} {col.arm}
                      </span>
                    );
                  })}
                </div>
                {METRICS.map((row, i) => (
                  <div key={row.metric} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1.6fr) repeat(4, minmax(58px, 1fr))', gap: '2px 8px', padding: '9px 16px', borderBottom: i < METRICS.length - 1 ? '1px solid var(--border)' : 'none', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12.5px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {row.metric}
                      {row.hint && <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>{row.hint}</span>}
                    </span>
                    {cols.map(col => {
                      const val = row[col.arm][col.model];
                      const spot = col.model === model && col.arm === 'ft';
                      const isFt = col.arm === 'ft';
                      const color = row.neutral ? 'var(--text-secondary)' : (isFt ? 'var(--accent)' : 'var(--text-muted)');
                      return (
                        <span key={`${col.model}-${col.arm}`} style={{ textAlign: 'right', color, fontWeight: isFt && !row.neutral ? 600 : 400, background: spot ? 'rgba(var(--accent-rgb), 0.10)' : 'transparent', borderRadius: '4px', padding: '2px 4px' }}>
                          {val}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px', marginBottom: '1.25rem' }}>
              Both base models share the same dominant failure mode — &ldquo;feat-collapse&rdquo;: they
              label the overwhelming majority of diffs as <code style={inlineCode}>feat</code> (86.7% for
              the 0.6B base, 95.5% for the 1.7B), regardless of what the change actually did. Because{' '}
              <code style={inlineCode}>fix</code> commits alone make up about 49% of real-world commits, a
              model that almost never predicts <code style={inlineCode}>fix</code> scores below a trivial
              always-<code style={inlineCode}>fix</code> baseline ({EVAL_META.floor}) on reweighted type
              accuracy — which is exactly what both bases do (0.15 and 0.13). Fine-tuning breaks the
              collapse: feat-share drops under 10% and type accuracy clears the floor for both sizes.
            </p>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '700px', marginBottom: '1.25rem' }}>
              The one axis the fine-tunes give something up on is specificity. The 1.7B fine-tune trades
              down from its base (0.81 → 0.67) as it adopts the terse, normalized subject style of the
              training targets, and the smaller 0.6B is vaguer still (0.55). It&apos;s a real trade-off,
              traceable to a normalization choice in the training data, and the next iteration targets it.
              Otherwise the two fine-tunes are close — graded 2.09 (0.6B) vs 2.14 (1.7B) — so the 0.6B gets
              most of the quality at roughly a third the size.
            </p>

            <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px', marginBottom: '1.25rem' }}>
              An LLM judge is only trustworthy if it agrees with a human. I hand-rated {JUDGE_AGREEMENT.n}{' '}
              examples blind and validated the DeepSeek judge against them:
            </p>
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', overflowX: 'auto', marginBottom: '1.25rem', maxWidth: '460px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: '2px 8px', padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>axis</span>
                <span style={{ textAlign: 'right' }}>agreement</span>
                <span style={{ textAlign: 'right' }}>Cohen&apos;s κ</span>
              </div>
              {JUDGE_AGREEMENT.axes.map((a, i) => {
                const weak = a.axis === 'specificity';
                return (
                  <div key={a.axis} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: '2px 8px', padding: '8px 16px', borderBottom: i < JUDGE_AGREEMENT.axes.length - 1 ? '1px solid var(--border)' : 'none', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12.5px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{a.axis}</span>
                    <span style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{a.agreement}</span>
                    <span style={{ textAlign: 'right', color: weak ? '#e0b752' : 'var(--accent)', fontWeight: 600 }}>{a.kappa}</span>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px' }}>
              Three axes land at moderate-to-substantial agreement (κ ≈ 0.56–0.61); specificity is the
              weakest (κ 0.34), so specificity-driven differences carry the most judge uncertainty. Two
              honest caveats: these DeepSeek-judged numbers are not comparable to earlier Gemini-judged
              figures (only the deltas within the table above are valid), and n={JUDGE_AGREEMENT.n} gives
              wide confidence intervals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Sample outputs ───────────────────────────────────────── */}
      <section id="sample-outputs" className="surface-a section-divider" style={sectionStyle}>
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
      <section id="run-locally" className="surface-a section-divider" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>run it locally</SectionHeading>
          <motion.div {...reveal}>
            <p style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '640px', marginBottom: '1.5rem' }}>
              Committed runs entirely on your machine — no API, no diff ever leaving your laptop. It
              defaults to the 0.6B (a smaller, faster download); the 1.7B is available when you want
              maximum specificity. Install it, pipe a diff in, and get a commit message back:
            </p>
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '6px', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                {['#e05252', '#e0b752', '#52e07a'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.7 }} />)}
              </div>
              <CodeBlock
                code={`pip install git+https://github.com/marzoukbaig14/Committed.git
git diff | committed          # 0.6B by default`}
                lang="shell"
                style={{ fontSize: '14px', lineHeight: 1.8 }}
              />
            </div>
            <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '640px', marginTop: '1.25rem' }}>
              {/* [placeholder] A --model picker is being added to the CLI (mirrors this page's toggle,
                  0.6B default). Fill the exact flag syntax and per-size GGUF download sizes from the
                  Committed CLI report — do not guess them. */}
              A model flag selects the size (default 0.6B); the exact flag and per-size download are{' '}
              <span style={{ color: 'var(--text-secondary)' }}>[to be filled from the CLI report]</span>.
              Either serves as a quantized GGUF through llama.cpp on CPU — the first run downloads it
              once, then it&apos;s fully offline. The hosted demo above runs the model you pick with the
              toggle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Built with & links ───────────────────────────────────── */}
      <section id="built-with" className="surface-a section-divider" style={sectionStyle}>
        <div style={innerStyle}>
          <SectionHeading>built with</SectionHeading>
          <motion.div {...reveal}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.75rem' }}>
              {['Qwen3 (0.6B / 1.7B)', 'QLoRA / PEFT', 'llama.cpp', 'GBNF grammar', 'FastAPI', 'Docker', 'Hugging Face', 'Next.js'].map(tag => (
                <span key={tag} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb), 0.2)' }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {[
                { label: 'GitHub repo', href: 'https://github.com/marzoukbaig14/Committed' },
                { label: 'Model card (adapter)', href: 'https://huggingface.co/marzoukbaig14/committed-qwen3-1.7b-lora' },
                { label: 'Model card (1.7B GGUF)', href: 'https://huggingface.co/marzoukbaig14/committed-gguf' },
                { label: 'Model card (0.6B GGUF)', href: 'https://huggingface.co/marzoukbaig14/committed-gguf-0.6b' },
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
