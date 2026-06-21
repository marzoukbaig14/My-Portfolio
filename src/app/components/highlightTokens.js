// Pure, framework-free tokenizers for the lightweight syntax highlighter.
// They return plain token descriptors ({ type, value }) whose values, when
// concatenated, reproduce the input exactly. Keeping this logic free of React
// lets both the renderer (CodeHighlight.js) and the unit tests share it.

// Combined keyword set across the languages that appear on the site (Python,
// C#, JS/TS). A shared set is good enough for generic highlighting.
export const KEYWORDS = new Set([
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

export function commentFor(lang) {
  if (['csharp', 'cs', 'js', 'ts', 'java', 'c', 'cpp'].includes(lang)) return 'slash';
  if (['python', 'py', 'shell', 'bash', 'sh', 'ruby', 'yaml'].includes(lang)) return 'hash';
  if (lang === 'none') return 'none';
  return 'both';
}

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

// Tokenize a run of code. `comment` is one of 'slash' | 'hash' | 'both' | 'none'.
// Types: comment | string | number | keyword | function | plain.
export function tokenizeCode(code, comment = 'both') {
  const re = buildRe(comment);
  const out = [];
  let m;
  while ((m = re.exec(code)) !== null) {
    const [, block, line, str, num, ident] = m;
    const full = m[0];
    if (block || line) out.push({ type: 'comment', value: full });
    else if (str) out.push({ type: 'string', value: full });
    else if (num) out.push({ type: 'number', value: full });
    else if (ident) {
      if (KEYWORDS.has(ident)) out.push({ type: 'keyword', value: ident });
      else if (/^\s*\(/.test(code.slice(re.lastIndex))) out.push({ type: 'function', value: ident });
      else out.push({ type: 'plain', value: full });
    } else {
      out.push({ type: 'plain', value: full });
    }
  }
  return out;
}

// One shell command without a prompt. Types: command | flag | string | op | plain.
export function tokenizeShellInline(text) {
  const re = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\|\||&&|[|&><])|(\s+)|(\S+)/g;
  const out = [];
  let m;
  let cmdSeen = false;
  while ((m = re.exec(text)) !== null) {
    const [, str, op, ws, word] = m;
    if (str) out.push({ type: 'string', value: str });
    else if (op) out.push({ type: 'op', value: op });
    else if (ws) out.push({ type: 'plain', value: ws });
    else if (!cmdSeen) { out.push({ type: 'command', value: word }); cmdSeen = true; }
    else if (word[0] === '-') out.push({ type: 'flag', value: word });
    else out.push({ type: 'plain', value: word });
  }
  return out;
}

// One shell/REPL line: { prompt, isPy, tokens }. A `>>>` prompt means the rest
// is Python, so it is tokenized as code; otherwise it is tokenized as shell.
export function tokenizeShellLine(line) {
  const pm = line.match(/^(\s*)(\$|>>>|#)(\s+)/);
  if (pm) {
    const rest = line.slice(pm[0].length);
    const isPy = pm[2] === '>>>';
    return { prompt: pm[2] + pm[3], isPy, tokens: isPy ? tokenizeCode(rest, 'none') : tokenizeShellInline(rest) };
  }
  return { prompt: '', isPy: false, tokens: tokenizeShellInline(line) };
}

// Diff lines: { kind, sign, tokens }. kind is hunk | meta | add | del | context.
export function tokenizeDiff(code, comment = 'both') {
  return code.split('\n').map((line) => {
    if (/^@@/.test(line)) return { kind: 'hunk', sign: '', tokens: [{ type: 'plain', value: line }] };
    if (/^(diff --git|index |--- |\+\+\+ )/.test(line)) return { kind: 'meta', sign: '', tokens: [{ type: 'plain', value: line }] };
    if (line.startsWith('+')) return { kind: 'add', sign: '+', tokens: tokenizeCode(line.slice(1), comment) };
    if (line.startsWith('-')) return { kind: 'del', sign: '-', tokens: tokenizeCode(line.slice(1), comment) };
    return { kind: 'context', sign: '', tokens: tokenizeCode(line, comment) };
  });
}
