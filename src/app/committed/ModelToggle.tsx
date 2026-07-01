'use client';
// The two-button model selector, bound to the shared ModelContext so every
// instance (demo, results) stays in sync. On-brand segmented control.
import { useModel } from './ModelContext';
import { MODELS, MODEL_ORDER } from './results';

export function ModelToggle({ disabled = false, ariaLabel = 'Model' }: { disabled?: boolean; ariaLabel?: string }) {
  const { model, setModel } = useModel();
  return (
    <div role="radiogroup" aria-label={ariaLabel} style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
      {MODEL_ORDER.map((id, i) => {
        const selected = model === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setModel(id)}
            disabled={disabled}
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '12px',
              fontWeight: 600,
              padding: '7px 16px',
              border: 'none',
              borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              background: selected ? 'var(--accent-muted)' : 'transparent',
              color: selected ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {MODELS[id].label}
          </button>
        );
      })}
    </div>
  );
}
