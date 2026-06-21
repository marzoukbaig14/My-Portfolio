'use client';
import { useRef } from 'react';

// Lightweight, dependency-free syntax highlighting tuned to the site's dark
// terminal theme. It is intentionally generic rather than a full per-language
// grammar: it colors the tokens that read as "code" (keywords, strings,
// numbers, comments, function calls) plus diff and shell structure. Output is
// React nodes (never raw HTML), so user-pasted input stays safely escaped.

// Token colors. Kept distinct from the diff add/remove tints (green/red) so
// nothing clashes on a highlighted diff line.
const C = {
  keyword: '#c792ea', // soft violet
  string: '#e0b752',  // amber (matches the site's warning accent)
  number: '#f78c6c',  // warm orange
  comment: 'var(--text-muted)',
  func: 'var(--accent)', // cyan, the site accent
  prompt: '#22c55e', // green, same as the shell prompts elsewhere on the site
};

// Combined keyword set across the languages that actually appear on the site
// (Python, C#, JS/TS). A shared set is good enough for generic highlighting.
const KEYWORDS = new Set([
  // Python
  'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'import',
  'from', 'as', 'with', 'try', 'except', 'finally', 'raise', 'lambda', 'yield',
  'pass', 'break', 'continue', 'global', 'nonlocal', 'assert', 'del', 'not',
  'and', 'or', 'is', 'None', 'True', 'False', 'self', 'async', 'await',
  // C# / Java-ish
  'public', 'private', 'protected', 'internal', 'static', 'void', 'var', 'new',
  'using', 'namespace', 'partial', 'override', 'virtual', 'abstract', 'sealed',
  'readonly', 'const', 'get', 'set', 'this', 'null', 'true', 'false', 'int',
  'string', 'bool', 'double', 'float', 'long', 'short', 'char', 'byte', 'object',
  'default', 'foreach', 'switch', 'case', 'throw', 'catch', 'base', 'params',
  'ref', 'out', 'enum', 'struct', 'interface',
  // JS/TS extras
  'function', 'let', 'typeof', 'instanceof', 'extends', 'implements', 'type',
  'export', 'then',
]);

// A regex with stable capture-group order regardless of comment style, so the
// scan loop can read groups by index. `\b\B` never matches and is used to keep
// a group present-but-disabled when a given comment kind doesn't apply.
function buildRe(comment) {
  const block = comment === 'slash' || comment === 'both' ? '\\/\\*[\\s\\S]*?\\*\\/' : '\\b\\B';
  let line;
  if (comment === 'slash') line = '\\/\\/[^\\n]*';
  else if (comment === 'hash') line = '#[^\\n]*';
  else if (comment === 'both') line = '(?:\\/\\/|#)[^\\n]*';
  else line = '\\b\\B';
  const str = '"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|`(?:\\\\.|[^`\\\\])*`';
  const num = '0[xX][0-9a-fA-F]+|\\d[\\d_]*(?:\\.\\d+)?';
  const ident = '[A-Za-z_$][\\w$]*';
  const ws = '\\s+';
  const other = '[^\\w\\s]';
  return new RegExp(`(${block})|(${line})|(${str})|(${num})|(${ident})|(${ws})|(${other})`, 'g');
}

function commentFor(lang) {
  if (['csharp', 'cs', 'js', 'ts', 'java', 'c', 'cpp'].includes(lang)) return 'slash';
  if (['python', 'py', 'shell', 'bash', 'sh', 'ruby', 'yaml'].includes(lang)) return 'hash';
  if (lang === 'none') return 'none';
  return 'both';
}

// Tokenize a run of code into colored nodes. Whitespace and punctuation pass
// through as plain text, so column positions are preserved exactly (important
// for the diff-input overlay alignment).
function codeNodes(code, comment) {
  const re = buildRe(comment);
  const out = [];
  let m;
  let key = 0;
  while ((m = re.exec(code)) !== null) {
    const [, block, line, str, num, ident] = m;
    const full = m[0];
    if (block || line) out.push(<span key={key++} style={{ color: C.comment, fontStyle: 'italic' }}>{full}</span>);
    else if (str) out.push(<span key={key++} style={{ color: C.string }}>{full}</span>);
    else if (num) out.push(<span key={key++} style={{ color: C.number }}>{full}</span>);
    else if (ident) {
      if (KEYWORDS.has(ident)) {
        out.push(<span key={key++} style={{ color: C.keyword }}>{ident}</span>);
      } else if (/^\s*\(/.test(code.slice(re.lastIndex))) {
        out.push(<span key={key++} style={{ color: C.func }}>{ident}</span>); // a call
      } else {
        out.push(full);
      }
    } else {
      out.push(full); // whitespace or punctuation
    }
  }
  return out;
}

// Single shell command (no prompt): first word is the command, -flags are
// dimmed-violet, quoted args are strings, pipes/redirects take the accent.
function shellInline(text) {
  const re = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\|\||&&|[|&><])|(\s+)|(\S+)/g;
  const out = [];
  let m;
  let key = 0;
  let cmdSeen = false;
  while ((m = re.exec(text)) !== null) {
    const [, str, op, ws, word] = m;
    if (str) out.push(<span key={key++} style={{ color: C.string }}>{str}</span>);
    else if (op) out.push(<span key={key++} style={{ color: C.func }}>{op}</span>);
    else if (ws) out.push(ws);
    else if (!cmdSeen) { out.push(<span key={key++} style={{ color: C.func }}>{word}</span>); cmdSeen = true; }
    else if (word[0] === '-') out.push(<span key={key++} style={{ color: C.keyword }}>{word}</span>);
    else out.push(word);
  }
  return out;
}

// One shell/REPL line: peel a leading prompt ($, >>>, #) and color the rest as
// shell, or as Python when the prompt is the REPL's >>>.
function shellLine(line, key) {
  const pm = line.match(/^(\s*)(\$|>>>|#)(\s+)/);
  let prompt = null;
  let rest = line;
  let isPy = false;
  if (pm) {
    prompt = <span style={{ color: C.prompt }}>{pm[2]}{pm[3]}</span>;
    rest = line.slice(pm[0].length);
    isPy = pm[2] === '>>>';
  }
  const inner = isPy ? codeNodes(rest, 'none') : shellInline(rest);
  const empty = !prompt && inner.length === 0;
  return <span key={key} style={{ display: 'block' }}>{prompt}{inner}{empty ? ' ' : null}</span>;
}

function shellNodes(code) {
  return code.split('\n').map((line, i) => shellLine(line, i));
}

// Diff: each line gets an add/remove tint and a colored sign gutter; the code
// after the sign is highlighted in the underlying language.
function diffNodes(code, comment) {
  return code.split('\n').map((line, i) => {
    if (/^@@/.test(line)) {
      return <span key={i} style={{ display: 'block', color: 'var(--accent)', background: 'rgba(var(--accent-rgb), 0.08)' }}>{line || ' '}</span>;
    }
    if (/^(diff --git|index |--- |\+\+\+ )/.test(line)) {
      return <span key={i} style={{ display: 'block', color: 'var(--text-muted)' }}>{line || ' '}</span>;
    }
    let bg;
    let sign = null;
    let rest = line;
    if (line.startsWith('+')) { bg = 'rgba(34, 197, 94, 0.10)'; sign = <span style={{ color: '#22c55e' }}>+</span>; rest = line.slice(1); }
    else if (line.startsWith('-')) { bg = 'rgba(248, 113, 113, 0.10)'; sign = <span style={{ color: '#f87171' }}>-</span>; rest = line.slice(1); }
    const inner = codeNodes(rest, comment);
    const empty = !sign && inner.length === 0;
    return <span key={i} style={{ display: 'block', background: bg }}>{sign}{inner}{empty ? ' ' : null}</span>;
  });
}

const basePre = {
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
export function CodeBlock({ code, lang = 'auto', diff = false, style }) {
  let children;
  if (diff || (lang === 'auto' && /^@@|^diff --git/m.test(code))) {
    children = diffNodes(code, commentFor(lang));
  } else if (['shell', 'bash', 'sh'].includes(lang)) {
    children = shellNodes(code);
  } else {
    children = codeNodes(code, commentFor(lang));
  }
  return <pre style={{ ...basePre, ...style }}>{children}</pre>;
}

// One-line command, for the terminal chrome on the project cards.
export function CommandLine({ text, style }) {
  const pm = text.match(/^(\s*)(\$|>>>|#)(\s+)/);
  if (pm) {
    const rest = text.slice(pm[0].length);
    const isPy = pm[2] === '>>>';
    return (
      <span style={style}>
        <span style={{ color: C.prompt }}>{pm[2]}{pm[3]}</span>
        {isPy ? codeNodes(rest, 'none') : shellInline(rest)}
      </span>
    );
  }
  return <span style={style}>{shellInline(text)}</span>;
}

// A diff textarea with live syntax highlighting. A highlighted <pre> sits
// behind a transparent-text textarea; the caret and selection stay native and
// scroll is kept in sync. `data-lenis-prevent` keeps the wheel scrolling the
// box, not the page.
export function HighlightedDiffInput({ value, onChange, placeholder, rows = 12, ariaLabel }) {
  const taRef = useRef(null);
  const preRef = useRef(null);

  const syncScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  // Both layers must share every metric that affects glyph position.
  const shared = {
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
        {value ? diffNodes(value, 'both') : null}
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
