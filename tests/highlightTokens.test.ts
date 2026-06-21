import { describe, it, expect } from 'vitest';
import {
  tokenizeCode,
  tokenizeDiff,
  tokenizeShellLine,
  commentFor,
} from '../src/app/components/highlightTokens';

const join = (toks: Array<{ value: string }>) => toks.map((t) => t.value).join('');

describe('tokenizeCode', () => {
  it('is lossless: token values concatenate back to the input', () => {
    const src = 'def foo(x):\n    return x + 1  # note';
    expect(join(tokenizeCode(src, 'hash'))).toBe(src);
  });

  it('classifies keywords, calls, numbers, and strings', () => {
    const toks = tokenizeCode('return foo("hi", 42)', 'hash');
    const ofType = (ty: string) => toks.filter((t) => t.type === ty).map((t) => t.value);
    expect(ofType('keyword')).toContain('return');
    expect(ofType('function')).toContain('foo');
    expect(ofType('string')).toContain('"hi"');
    expect(ofType('number')).toContain('42');
  });

  it('honors the comment style (# vs //)', () => {
    expect(tokenizeCode('a # c', 'hash').some((t) => t.type === 'comment' && t.value === '# c')).toBe(true);
    expect(tokenizeCode('a # c', 'slash').some((t) => t.type === 'comment')).toBe(false);
    expect(tokenizeCode('a // c', 'slash').some((t) => t.type === 'comment' && t.value === '// c')).toBe(true);
  });

  it('does not mistake // inside a URL for a comment when comments are off', () => {
    const src = 'pip install https://example.com//path';
    const toks = tokenizeCode(src, 'none');
    expect(toks.some((t) => t.type === 'comment')).toBe(false);
    expect(join(toks)).toBe(src);
  });
});

describe('tokenizeDiff', () => {
  it('tags each line kind and stays lossless per line', () => {
    const code = ['@@ -1 +1 @@', '-old()', '+new()', ' ctx', 'diff --git a/x b/x'].join('\n');
    const lines = tokenizeDiff(code, 'both');
    expect(lines.map((l) => l.kind)).toEqual(['hunk', 'del', 'add', 'context', 'meta']);
    const original = code.split('\n');
    lines.forEach((l, i) => {
      expect(l.sign + join(l.tokens)).toBe(original[i]);
    });
  });
});

describe('tokenizeShellLine', () => {
  it('peels a $ prompt and marks the command and pipe', () => {
    const { prompt, isPy, tokens } = tokenizeShellLine('$ git diff | committed');
    expect(prompt).toBe('$ ');
    expect(isPy).toBe(false);
    expect(tokens.find((t) => t.type === 'command')?.value).toBe('git');
    expect(tokens.some((t) => t.type === 'op' && t.value === '|')).toBe(true);
  });

  it('treats a >>> prompt as Python', () => {
    const { prompt, isPy, tokens } = tokenizeShellLine('>>> model.fit(X, y)');
    expect(prompt).toBe('>>> ');
    expect(isPy).toBe(true);
    expect(tokens.find((t) => t.type === 'function')?.value).toBe('fit');
  });

  it('handles a prompt-less command line', () => {
    const { prompt, tokens } = tokenizeShellLine('pip install pkg');
    expect(prompt).toBe('');
    expect(tokens[0]).toEqual({ type: 'command', value: 'pip' });
  });
});

describe('commentFor', () => {
  it('maps languages to comment styles', () => {
    expect(commentFor('python')).toBe('hash');
    expect(commentFor('csharp')).toBe('slash');
    expect(commentFor('none')).toBe('none');
    expect(commentFor('whatever')).toBe('both');
  });
});
