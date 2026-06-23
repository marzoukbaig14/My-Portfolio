'use client';

// System diagram for the top of the page. We render the real Mermaid graph
// (the same source kept in docs/committed-architecture.mmd) so the boxes,
// connector arrows, and the vertical `direction TB` progression inside each
// subgraph all look like the diagram the human reviews in their editor.
//
// Mermaid is heavy, so it is dynamically imported and only loaded once the
// diagram scrolls near the viewport (IntersectionObserver). That keeps it off
// the initial bundle and out of the way of the demo above it. The graph is
// themed from the site's CSS tokens at render time, so it matches the page.

import { useEffect, useRef, useState } from 'react';

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

export default function CommittedArchitecture() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [failed, setFailed] = useState(false);

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
        <div
          ref={hostRef}
          className="committed-arch-host"
          style={{ display: 'flex', justifyContent: 'center' }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div
          ref={hostRef}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '160px' }}
        >
          <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
            {failed ? 'diagram unavailable, see docs/committed-architecture.mmd' : 'rendering diagram…'}
          </span>
        </div>
      )}

      <style>{`
        .committed-arch-host svg { max-width: 100%; height: auto; }
      `}</style>
    </div>
  );
}
