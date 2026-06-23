// System diagram for the top of the page, so a recruiter sees the shape of the
// project before scrolling. Rendered natively in the design system rather than
// via a heavy client-side Mermaid bundle. The portable Mermaid source lives in
// docs/committed-architecture.mmd and is kept in sync with this layout.
//
// Layout (vertical spine that forks into two siblings, so it stays readable on
// narrow / mobile screens):
//
//   1. Training pipeline (offline, iterable)
//          | publish weights
//   2. Source of truth (GitHub code + Hugging Face model)
//          | consumed downstream
//   +------------------------+------------------------+
//   4. Front end (hosted demo)   3. Local inference (offline)
//
// The cross-cutting relationships from the Mermaid (weights from HF, code from
// GitHub feeding both inference paths) are carried as quiet captions inside each
// leaf box rather than free-floating arrows, which keeps the render clean and
// responsive without an SVG overlay.

import type { CSSProperties } from 'react';

const mono = 'var(--font-geist-mono), monospace';

const boxStyle: CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: '10px',
  padding: '14px',
  background: 'rgba(var(--accent-rgb), 0.015)',
};

const boxTitleStyle: CSSProperties = {
  fontFamily: mono,
  fontSize: '11px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '12px',
};

const captionStyle: CSSProperties = {
  fontFamily: mono,
  fontSize: '10.5px',
  color: 'var(--text-muted)',
  lineHeight: 1.6,
  marginTop: '12px',
};

type NodeProps = { label: string; sub?: string; accent?: boolean; dim?: boolean };

function Node({ label, sub, accent, dim }: NodeProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '8px 12px',
        borderRadius: '8px',
        background: accent ? 'rgba(var(--accent-rgb), 0.08)' : 'var(--bg-secondary)',
        border: `1px solid ${accent ? 'rgba(var(--accent-rgb), 0.45)' : 'var(--border)'}`,
        borderStyle: dim ? 'dashed' : 'solid',
        opacity: dim ? 0.7 : 1,
      }}
    >
      <span
        style={{
          fontFamily: mono,
          fontSize: '12.5px',
          color: accent ? 'var(--accent)' : 'var(--text-secondary)',
          fontWeight: accent ? 600 : 400,
        }}
        dangerouslySetInnerHTML={{ __html: label }}
      />
      {sub && (
        <span style={{ fontFamily: mono, fontSize: '10.5px', color: 'var(--text-muted)' }}>{sub}</span>
      )}
    </div>
  );
}

// Vertical connector between two stacked nodes, with an optional label on the wire.
function Down({ label, dashed }: { label?: string; dashed?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 0' }}>
      <span
        style={{
          width: 0,
          height: '12px',
          borderLeft: `1.5px ${dashed ? 'dashed' : 'solid'} var(--border)`,
        }}
      />
      {label && (
        <span style={{ fontFamily: mono, fontSize: '9.5px', color: 'var(--text-muted)', padding: '2px 0', textAlign: 'center' }}>
          {label}
        </span>
      )}
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1 }}>▼</span>
    </div>
  );
}

export default function CommittedArchitecture() {
  return (
    <div>
      <div
        style={{
          fontFamily: mono,
          fontSize: '11px',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '16px',
        }}
      >
        architecture
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '760px', margin: '0 auto' }}>
        {/* ===== 1 · Training pipeline (offline, iterable) ===== */}
        <div style={{ ...boxStyle, width: '100%' }}>
          <div style={boxTitleStyle}>1 · training pipeline — offline, iterable</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: '8px' }}>
            <Node label="CommitChronicle" sub="~10.7M real commits" />
            <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>→</span>
            <Node label="filter to Conventional Commits" sub="~58k single-file diffs, 16 langs" />
            <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>→</span>
            <Node label="QLoRA 4-bit SFT" sub="Qwen3-1.7B · PEFT / TRL" />
            <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>→</span>
            <Node label="merge + GGUF quantize" sub="Q4_K_M, ~1 GB · model ready" accent />
            <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>→</span>
            <Node label="evaluate + iterate" />
          </div>
          <div style={captionStyle}>
            ↺ next iteration feeds back into SFT — manual today, pip / automation later
          </div>
        </div>

        <Down label="publish weights" />

        {/* ===== 2 · Source of truth ===== */}
        <div style={{ ...boxStyle, width: '100%' }}>
          <div style={boxTitleStyle}>2 · source of truth</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ flex: '1 1 240px' }}>
              <Node label="GitHub repo" sub="prompts · inference code · GBNF grammar" />
            </div>
            <div style={{ flex: '1 1 240px' }}>
              <Node label="Hugging Face model repo" sub="GGUF weights + model card" accent />
            </div>
          </div>
        </div>

        <Down label="consumed downstream" />

        {/* ===== 3 + 4 · Two sibling consumers ===== */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', width: '100%', alignItems: 'flex-start' }}>
          {/* 4 · Front end (hosted demo) */}
          <div style={{ ...boxStyle, flex: '1 1 300px' }}>
            <div style={boxTitleStyle}>4 · front end — hosted demo, over the network</div>

            <Node label="website / Vercel front end<br/>(you are here)" accent />
            <Down label="HTTPS · POST /generate · FastAPI" />
            <Node label="HF Space · portfolio backend" sub="Linux + Docker · FastAPI + llama.cpp · GGUF" />

            <div style={{ height: '14px' }} />

            <Node label="Gradio front end" />
            <Down label="HTTPS · FastAPI" />
            <Node label="HF Space · Gradio app" sub="Linux + Docker · FastAPI + llama.cpp · GGUF" />

            <div style={{ height: '14px' }} />
            <Node label="VS Code extension (planned)" sub="HTTPS · POST /generate → portfolio backend" dim />

            <div style={captionStyle}>
              not local — each Space pulls the latest model from Hugging Face and its inference code +
              grammar from GitHub
            </div>
          </div>

          {/* 3 · Local inference */}
          <div style={{ ...boxStyle, flex: '1 1 220px' }}>
            <div style={boxTitleStyle}>3 · local inference — CPU, no network</div>
            <Node label="git diff" />
            <Down />
            <Node label="prompt + tokenize" />
            <Down />
            <Node label="fine-tuned Qwen3-1.7B" sub="llama.cpp · CPU" accent />
            <Down />
            <Node label="GBNF grammar-constrained decode" />
            <Down />
            <Node label="Conventional Commit message" sub="valid by construction" accent />
            <div style={captionStyle}>
              fully offline — weights downloaded once from Hugging Face, code + grammar from GitHub
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
