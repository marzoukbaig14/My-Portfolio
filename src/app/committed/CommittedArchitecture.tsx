// Compact system diagram for the top of the page, so a recruiter sees the
// shape of the project (data -> training -> serving -> output) before scrolling.
// Rendered natively in the design system rather than via a heavy client-side
// Mermaid bundle; the portable Mermaid source lives in
// docs/committed-architecture.mmd and is the artifact to drop into the README.

const inferenceSteps: { label: string; sub?: string; accent?: boolean }[] = [
  { label: 'git diff' },
  { label: 'prompt + tokenize' },
  { label: 'Qwen3-1.7B fine-tune', sub: 'llama.cpp · CPU', accent: true },
  { label: 'GBNF grammar decode' },
  { label: 'Conventional Commit', sub: 'valid by construction', accent: true },
];

const trainingSteps = [
  'CommitChronicle (~10.7M commits)',
  'filter → ~58k CC diffs, 16 langs',
  'QLoRA 4-bit SFT',
  'merge + GGUF (Q4_K_M, ~1 GB)',
];

export default function CommittedArchitecture() {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
        architecture
      </div>

      {/* Inference pipeline (primary) */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px', flexWrap: 'wrap', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px' }}>
        {inferenceSteps.map((step, i) => (
          <span key={step.label} style={{ display: 'inline-flex', alignItems: 'stretch', gap: '10px' }}>
            <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3px', padding: '10px 14px', borderRadius: '8px', background: step.accent ? 'rgba(var(--accent-rgb), 0.08)' : 'var(--bg-secondary)', border: `1px solid ${step.accent ? 'rgba(var(--accent-rgb), 0.45)' : 'var(--border)'}` }}>
              <span style={{ color: step.accent ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: step.accent ? 600 : 400 }}>{step.label}</span>
              {step.sub && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{step.sub}</span>}
            </span>
            {i < inferenceSteps.length - 1 && <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>→</span>}
          </span>
        ))}
      </div>

      {/* Training pipeline (secondary), feeds the serving artifact above */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
          training pipeline (offline) — produces the served model
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px' }}>
          {trainingSteps.map((step, i) => (
            <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ padding: '6px 11px', borderRadius: '7px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{step}</span>
              {i < trainingSteps.length - 1 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
