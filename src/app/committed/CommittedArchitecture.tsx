'use client';

// System diagram for the top of the page. We render the real Mermaid graph
// (the same source kept in docs/committed-architecture.mmd) so the boxes,
// connector arrows, and the vertical `direction TB` progression inside each
// subgraph all look like the diagram the human reviews in their editor.
//
// The full graph is large, so a static fit-to-width render is unreadable. We
// wrap the SVG in a pan/zoom viewport (react-zoom-pan-pinch) that lands focused
// on the "you are here" node and exposes zoom / reset / fullscreen controls,
// like a Mermaid live editor. Mermaid itself is dynamically imported and only
// loaded once the diagram nears the viewport, so it never weighs on first paint.

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
  type ReactZoomPanPinchContentRef,
} from 'react-zoom-pan-pinch';

// Canonical diagram source. Mirrors docs/committed-architecture.mmd; the class
// assignments at the end highlight the load-bearing nodes (model artifact and
// the "you are here" front end) in the accent color.
const DIAGRAM = `flowchart TB
  subgraph training["1 · Training pipeline — offline, iterable"]
    direction TB
    A["CommitChronicle<br/>~10.7M real commits"]
    B["Filter to Conventional Commits<br/>~58k single-file diffs, 16 languages"]
    C["QLoRA 4-bit SFT<br/>Qwen3-1.7B + PEFT / TRL"]
    D["Merge + GGUF quantize<br/>Q4_K_M, ~1 GB · model ready"]
    EVAL["Evaluate + iterate"]
    A --> B --> C --> D --> EVAL
    EVAL -. "next iteration · manual today,<br/>pip / automation later" .-> C
  end

  subgraph sources["2 · Source of truth"]
    direction TB
    GH["GitHub repo<br/>prompts · inference code · GBNF grammar"]
    HFM["Hugging Face model repo<br/>GGUF weights + model card"]
  end

  D ==>|"publish weights"| HFM

  subgraph local["3 · Inference · local — CPU, no network"]
    direction TB
    E["git diff"]
    F["Prompt + tokenize"]
    G["Fine-tuned Qwen3-1.7B<br/>llama.cpp · CPU"]
    H["GBNF grammar-constrained decoding"]
    I["Conventional Commit message<br/>valid by construction"]
    E --> F --> G --> H --> I
  end

  HFM -. "download weights once" .-> G
  GH -. "clone code + grammar" .-> F

  subgraph online["4 · Inference · hosted demo — over the network, not local"]
    direction TB
    WEB["Website / Vercel front end<br/>(you are here)"]
    GRADIO["Gradio front end"]
    VSCODE["VS Code extension<br/>(planned)"]
    SPACE_API["Hugging Face Space · portfolio backend<br/>Linux + Docker · FastAPI + llama.cpp · GGUF"]
    SPACE_GR["Hugging Face Space · Gradio app<br/>Linux + Docker · FastAPI + llama.cpp · GGUF"]
    WEB -->|"HTTPS · POST /generate (REST/JSON)"| SPACE_API
    GRADIO -->|"HTTPS · API call"| SPACE_GR
    VSCODE -. "HTTPS · POST /generate" .-> SPACE_API
  end

  HFM -. "pulls latest published model" .-> SPACE_API
  HFM -. "pulls latest published model" .-> SPACE_GR
  GH -. "inference code + grammar" .-> SPACE_API
  GH -. "inference code + grammar" .-> SPACE_GR
`;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Find the "you are here" node inside a rendered SVG so we can land the view on it.
function findYouAreHere(root: HTMLElement | null): HTMLElement | null {
  if (!root) return null;
  const nodes = root.querySelectorAll<HTMLElement>('g.node');
  for (const n of nodes) {
    if (n.textContent && n.textContent.toLowerCase().includes('you are here')) return n;
  }
  return null;
}

const btnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '7px',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-geist-mono), monospace',
  fontSize: '15px',
  lineHeight: 1,
  cursor: 'pointer',
  transition: 'border-color 0.15s, color 0.15s',
};

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={btnStyle}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      {children}
    </button>
  );
}

function DiagramViewer({
  svg,
  fullscreen,
  onToggleFullscreen,
}: {
  svg: string;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);

  // Land the view on the "you are here" node; fall back to a centered fit.
  const focus = useCallback((ref: ReactZoomPanPinchRef) => {
    const target = findYouAreHere(boxRef.current);
    const ms = prefersReducedMotion() ? 0 : 400;
    if (target) {
      ref.zoomToElement(target, 1.5, ms);
    } else {
      ref.centerView(0.8, ms);
    }
  }, []);

  return (
    <div
      ref={boxRef}
      style={{
        position: 'relative',
        width: '100%',
        height: fullscreen ? '100%' : '460px',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
      }}
    >
      <TransformWrapper
        minScale={0.3}
        maxScale={6}
        initialScale={1}
        limitToBounds={false}
        centerOnInit
        doubleClick={{ disabled: false, mode: 'zoomIn' }}
        // Don't zoom on wheel: this sits inside a scrollable page, so hijacking
        // the wheel to zoom would trap page scroll. Buttons, drag-pan, and touch
        // pinch cover zooming instead.
        wheel={{ disabled: true }}
        panning={{ velocityDisabled: true }}
        onInit={focus}
      >
        {({ zoomIn, zoomOut, resetTransform }: ReactZoomPanPinchContentRef) => (
          <>
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 5, display: 'flex', gap: '6px' }}>
              <ToolbarButton label="Zoom in" onClick={() => zoomIn()}>+</ToolbarButton>
              <ToolbarButton label="Zoom out" onClick={() => zoomOut()}>−</ToolbarButton>
              <ToolbarButton label="Reset view" onClick={() => resetTransform()}>⤢</ToolbarButton>
              <ToolbarButton label={fullscreen ? 'Close fullscreen' : 'Open fullscreen'} onClick={onToggleFullscreen}>
                {fullscreen ? '✕' : '⛶'}
              </ToolbarButton>
            </div>

            {/* Hint, so it's obvious the diagram is interactive. */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                zIndex: 5,
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '10.5px',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            >
              drag to pan · +/− to zoom · ⛶ fullscreen
            </div>

            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: 'max-content' }}>
              <div className="committed-arch-host" dangerouslySetInnerHTML={{ __html: svg }} />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export default function CommittedArchitecture() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;

    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default;

        // Pull live theme values so the graph matches the current site palette.
        const css = getComputedStyle(document.documentElement);
        const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
        const accent = v('--accent', '#16c5e8');
        const border = v('--border', '#2a2a35');
        const nodeBg = v('--bg-secondary', '#16161d');
        const cardBg = v('--bg-card', '#101016');
        const textSecondary = v('--text-secondary', '#b4b4b8');
        const textMuted = v('--text-muted', '#6b6b76');
        const mono = v('--font-geist-mono', 'monospace') + ', monospace';

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'base',
          themeVariables: {
            fontFamily: mono,
            fontSize: '13px',
            background: 'transparent',
            mainBkg: nodeBg,
            primaryColor: nodeBg,
            primaryBorderColor: border,
            primaryTextColor: textSecondary,
            secondaryColor: nodeBg,
            tertiaryColor: 'transparent',
            lineColor: textMuted,
            textColor: textSecondary,
            nodeBorder: border,
            clusterBkg: 'transparent',
            clusterBorder: border,
            titleColor: textMuted,
            edgeLabelBackground: cardBg,
          },
          flowchart: { htmlLabels: true, curve: 'basis', padding: 12, nodeSpacing: 28, rankSpacing: 36 },
        });

        // Accent the load-bearing nodes via an injected classDef. Values must be
        // hex (comma-free): Mermaid's classDef parser splits properties on commas,
        // so an rgba(...) value would break parsing.
        const themed =
          DIAGRAM +
          `\n  classDef accent stroke:${accent},color:${accent},stroke-width:1.4px;` +
          `\n  class D,HFM,G,I,WEB accent;`;

        const id = 'committed-arch-' + Math.random().toString(36).slice(2);
        const { svg: out } = await mermaid.render(id, themed);
        if (!cancelled) setSvg(out);
      } catch (err) {
        // Surface the real parse/render error to the console for debugging;
        // the UI falls back to a pointer at the .mmd source.
        console.error('Committed architecture diagram failed to render:', err);
        if (!cancelled) setFailed(true);
      }
    };

    // Defer the (heavy) Mermaid import until the diagram is near the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          render();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(host);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  // Close the fullscreen overlay on Escape, and lock background scroll while open.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '11px',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '16px',
        }}
      >
        architecture
      </div>

      {svg ? (
        <DiagramViewer svg={svg} fullscreen={false} onToggleFullscreen={() => setExpanded(true)} />
      ) : (
        <div ref={hostRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '160px' }}>
          <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
            {failed ? 'diagram unavailable, see docs/committed-architecture.mmd' : 'rendering diagram…'}
          </span>
        </div>
      )}

      {expanded &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Committed architecture diagram, fullscreen"
            onClick={(e) => { if (e.target === e.currentTarget) setExpanded(false); }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(0,0,0,0.86)',
              padding: 'clamp(12px, 3vw, 32px)',
            }}
          >
            <DiagramViewer svg={svg} fullscreen onToggleFullscreen={() => setExpanded(false)} />
          </div>,
          document.body,
        )}

      <style>{`
        .committed-arch-host svg { max-width: none !important; height: auto; display: block; }
        .committed-arch-host { cursor: grab; }
        .committed-arch-host:active { cursor: grabbing; }
      `}</style>
    </div>
  );
}
