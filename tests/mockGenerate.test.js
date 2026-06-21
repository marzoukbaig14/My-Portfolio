import { describe, it, expect } from 'vitest';
import { parseDiff, buildMessage } from '../src/app/api/committed-mock/generate/route.js';
import { isWellFormed } from '../src/app/committed/cc.js';

describe('parseDiff', () => {
  it('extracts path, file, ext, base, and dir from a +++ header', () => {
    const d = parseDiff('+++ b/src/utils/helpers.py\n+x');
    expect(d.file).toBe('helpers.py');
    expect(d.ext).toBe('py');
    expect(d.base).toBe('helpers');
    expect(d.dir).toBe('utils');
  });

  it('counts added and removed lines without miscounting headers', () => {
    const d = parseDiff('+++ b/x.py\n+added one\n+added two\n-removed one');
    expect(d.added).toBe(2);
    expect(d.removed).toBe(1);
  });
});

describe('buildMessage', () => {
  it('always produces a well-formed Conventional Commit subject', () => {
    const diffs = [
      '+++ b/docs/intro.md\n+hello',
      'diff --git a/x.py b/x.py\nnew file mode 100644\n+++ b/x.py\n+code',
      '+++ b/net.py\n+ handle timeout here',
      '+++ b/app.test.js\n+it("works")',
    ];
    for (const d of diffs) expect(isWellFormed(buildMessage(d))).toBe(true);
  });

  it('classifies docs by extension', () => {
    expect(buildMessage('+++ b/docs/intro.md\n+text')).toMatch(/^docs\(/);
  });

  it('classifies a new file as a feature', () => {
    expect(buildMessage('diff --git a/x.py b/x.py\nnew file mode 100644\n+++ b/x.py\n+code')).toMatch(/^feat\(/);
  });

  it('classifies a test file as a test regardless of extension', () => {
    expect(buildMessage('+++ b/app.test.js\n+it("works")')).toMatch(/^test\(/);
  });

  it('picks a subject from coarse signals in the diff body', () => {
    expect(buildMessage('+++ b/net.py\n+ handle timeout here')).toContain('handle request timeouts');
  });
});
