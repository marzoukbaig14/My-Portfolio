'use client';
import { useRef } from 'react';
import {
  commentFor,
  tokenizeCode,
  tokenizeShellLine,
  tokenizeDiff,
} from './highlightTokens';
import type { CodeToken, ShellToken, Comment } from './highlightTokens';

// Lightweight, dependency-free syntax highlighting tuned to the site's dark
// terminal theme. The tokenizing lives in highlightTokens.ts (pure, tested);
// this module only maps token types to colors and renders React nodes. Output
// is never raw HTML, so user-pasted input stays safely escaped.

type StyleMap = Record<string, React.CSSProperties | null>;

// Token colors. Kept distinct from the diff add/remove tints (green/red) so
// nothing clashes on a highlighted diff line.
const CODE_STYLE: StyleMap = {
  comment: { color: 'var(--text-muted)', fontStyle: 'italic' },
  string: { color: '#e0b752' }, // amber
  number: { color: '#f78c6c' }, // warm orange
  keyword: { color: '#c792ea' }, // soft violet
  function: { color: 'var(--accent)' }, // cyan, the site accent
  plain: null,
};

const SHELL_STYLE: StyleMap = {
  command: { color: 'var(--accent)' },
  flag: { color: '#c792ea' },
  string: { color: '#e0b752' },
  op: { color: 'var(--accent)' },
  plain: null,
};

const PROMPT_COLOR = '#22c55e'; // green, matching the shell prompts elsewhere

// Render an array of { type, value } tokens against a style map. Plain tokens
// stay as bare strings so column positions are preserved exactly.
function renderTokens(
  tokens: Array<CodeToken | ShellToken>,
  styleMap: StyleMap,
  keyPrefix: string,
) {
  return tokens.map((t, i) => {
    const style = styleMap[t.type];
    return style ? <span key={`${keyPrefix}-${i}`} style={style}>{t.value}</span> : t.value;
  });
}

function DiffLines({ code, comment }: { code: string; comment: Comment }) {
  return tokenizeDiff(code, comment).map((ln, i) => {
    if (ln.kind === 'hunk') {
      return <span key={i} style={{ display: 'block', color: 'var(--accent)', background: 'rgba(var(--accent-rgb), 0.08)' }}>{ln.tokens[0].value || ' '}</span>;
    }
    if (ln.kind === 'meta') {
      return <span key={i} style={{ display: 'block', color: 'var(--text-muted)' }}>{ln.tokens[0].value || ' '}</span>;
    }
    const bg = ln.kind === 'add' ? 'rgba(34, 197, 94, 0.10)' : ln.kind === 'del' ? 'rgba(248, 113, 113, 0.10)' : undefined;
    const signColor = ln.kind === 'add' ? '#22c55e' : '#f87171';
    const body = renderTokens(ln.tokens, CODE_STYLE, String(i));
    const empty = !ln.sign && body.length === 0;
    return (
      <span key={i} style={{ display: 'block', background: bg }}>
        {ln.sign ? <span style={{ color: signColor }}>{ln.sign}</span> : null}
        {body}
        {empty ? ' ' : null}
      </span>
    );
  });
}

function ShellLines({ code }: { code: string }) {
  return code.split('\n').map((line, i) => {
    const { prompt, isPy, tokens } = tokenizeShellLine(line);
    const body = renderTokens(tokens, isPy ? CODE_STYLE : SHELL_STYLE, String(i));
    const empty = !prompt && body.length === 0;
    return (
      <span key={i} style={{ display: 'block' }}>
        {prompt ? <span style={{ color: PROMPT_COLOR }}>{prompt}</span> : null}
        {body}
        {empty ? ' ' : null}
      </span>
    );
  });
}

const basePre: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-geist-mono), monospace',
  fontSize: '13px',
  lineHeight: 1.7,
  color: 'var(--text-secondary)',
  whiteSpace: 'pre',
  overflowX: 'auto',
  padding: '16px',
};

// Static code/diff block. Pass `diff` for diffs; `lang` sets the inner language
// (e.g. "python", "csharp", "shell").
export function CodeBlock({
  code,
  lang = 'auto',
  diff = false,
  style,
}: {
  code: string;
  lang?: string;
  diff?: boolean;
  style?: React.CSSProperties;
}) {
  let children: React.ReactNode;
  if (diff || (lang === 'auto' && /^@@|^diff --git/m.test(code))) {
    children = <DiffLines code={code} comment={commentFor(lang)} />;
  } else if (['shell', 'bash', 'sh'].includes(lang)) {
    children = <ShellLines code={code} />;
  } else {
    children = renderTokens(tokenizeCode(code, commentFor(lang)), CODE_STYLE, 'c');
  }
  return <pre style={{ ...basePre, ...style }}>{children}</pre>;
}

// One-line command, for the terminal chrome on the project cards.
export function CommandLine({ text, style }: { text: string; style?: React.CSSProperties }) {
  const { prompt, isPy, tokens } = tokenizeShellLine(text);
  return (
    <span style={style}>
      {prompt ? <span style={{ color: PROMPT_COLOR }}>{prompt}</span> : null}
      {renderTokens(tokens, isPy ? CODE_STYLE : SHELL_STYLE, 'cmd')}
    </span>
  );
}

// A diff textarea with live syntax highlighting. A highlighted <pre> sits
// behind a transparent-text textarea; the caret and selection stay native and
// scroll is kept in sync. `data-lenis-prevent` keeps the wheel scrolling the
// box, not the page.
export function HighlightedDiffInput({
  value,
  onChange,
  placeholder,
  rows = 12,
  ariaLabel,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
  ariaLabel?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const syncScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  // Both layers must share every metric that affects glyph position.
  const shared: React.CSSProperties = {
    margin: 0,
    fontFamily: 'var(--font-geist-mono), monospace',
    fontSize: '13px',
    lineHeight: 1.6,
    padding: '14px 16px',
    whiteSpace: 'pre',
    overflowWrap: 'normal',
    tabSize: 2,
    border: '1px solid transparent',
    borderRadius: '10px',
    letterSpacing: 'normal',
  };

  return (
    <div className="cmtd-diff-input" style={{ position: 'relative', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-primary)', transition: 'border-color 0.2s' }}>
      <pre
        ref={preRef}
        aria-hidden="true"
        style={{ ...shared, position: 'absolute', inset: 0, overflow: 'hidden', color: 'var(--text-secondary)', pointerEvents: 'none', background: 'transparent' }}
      >
        {value ? <DiffLines code={value} comment="both" /> : null}
      </pre>
      <textarea
        ref={taRef}
        value={value}
        onChange={onChange}
        onScroll={syncScroll}
        placeholder={placeholder}
        spellCheck={false}
        aria-label={ariaLabel}
        rows={rows}
        data-lenis-prevent
        className="cmtd-diff-textarea"
        style={{ ...shared, position: 'relative', display: 'block', width: '100%', resize: 'vertical', background: 'transparent', color: 'transparent', caretColor: 'var(--text-primary)', outline: 'none', overflowX: 'auto', overflowY: 'auto' }}
      />
      <style>{`
        .cmtd-diff-input:focus-within { border-color: var(--accent); }
        .cmtd-diff-textarea::placeholder { color: var(--text-muted); opacity: 1; }
        .cmtd-diff-textarea::selection { background: rgba(var(--accent-rgb), 0.3); }
      `}</style>
    </div>
  );
}
