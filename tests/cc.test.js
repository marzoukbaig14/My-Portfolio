import { describe, it, expect } from 'vitest';
import { isWellFormed, fileCount, CC_RE } from '../src/app/committed/cc.js';

describe('isWellFormed', () => {
  it('accepts valid Conventional Commit subjects', () => {
    expect(isWellFormed('feat: add thing')).toBe(true);
    expect(isWellFormed('fix(api): handle null')).toBe(true);
    expect(isWellFormed('refactor(core)!: drop legacy path')).toBe(true);
    expect(isWellFormed('  docs: trims surrounding whitespace  ')).toBe(true);
  });

  it('rejects malformed subjects', () => {
    expect(isWellFormed('just a message')).toBe(false);
    expect(isWellFormed('feat:no space after colon')).toBe(false);
    expect(isWellFormed('feat: ')).toBe(false);
  });
});

describe('fileCount', () => {
  it('counts diff --git headers', () => {
    expect(fileCount('diff --git a/x b/x\n...\ndiff --git a/y b/y')).toBe(2);
  });

  it('falls back to +++ headers when there are no diff --git lines', () => {
    expect(fileCount('+++ b/x\n+++ b/y\n+++ b/z')).toBe(3);
  });

  it('returns 0 for non-diff text', () => {
    expect(fileCount('hello world')).toBe(0);
  });
});

describe('CC_RE', () => {
  it('captures type, scope, and subject', () => {
    const m = 'feat(scope): subject'.match(CC_RE);
    expect(m[1]).toBe('feat');
    expect(m[3]).toBe('scope');
    expect(m[5]).toBe('subject');
  });
});
