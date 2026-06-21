// Local mock for POST /generate. Returns the same shape as the real model
// service ({ message }) so the entire page can be built and demoed before
// the fine-tuned Space is live. This is intentionally a crude heuristic, not
// a model; it only needs to produce a well-formed Conventional Commit
// subject so the UI states (generating, typewriter reveal, badge) are
// exercisable. The real generation lives in the serving repo.

export const dynamic = 'force-dynamic';

// Map a file extension to a default Conventional Commit type.
const TYPE_BY_EXT = {
  md: 'docs', mdx: 'docs', rst: 'docs', txt: 'docs',
  css: 'style', scss: 'style', less: 'style',
  json: 'chore', yml: 'chore', yaml: 'chore', toml: 'chore',
};

export function parseDiff(diff) {
  const pathMatch = diff.match(/\+\+\+ b\/(\S+)/) || diff.match(/diff --git a\/\S+ b\/(\S+)/);
  const path = pathMatch ? pathMatch[1] : '';
  const file = path.split('/').pop() || '';
  const ext = file.includes('.') ? file.split('.').pop().toLowerCase() : '';
  const base = file.replace(/\.[^.]+$/, '');
  const dir = path.split('/').slice(-2, -1)[0] || '';

  const isNewFile = /new file mode/.test(diff);
  const added = (diff.match(/^\+(?!\+\+)/gm) || []).length;
  const removed = (diff.match(/^-(?!--)/gm) || []).length;

  return { path, file, ext, base, dir, isNewFile, added, removed };
}

export function buildMessage(diff) {
  const { ext, base, dir, isNewFile, added, removed } = parseDiff(diff);

  // Tests take precedence regardless of extension.
  const isTest = /\.(test|spec)\.|_test\.|(^|\/)tests?\//.test(diff);

  let type = isTest ? 'test' : TYPE_BY_EXT[ext];
  if (!type) {
    if (isNewFile) type = 'feat';
    else if (removed > 0 && added <= removed) type = 'refactor';
    else type = 'fix';
  }

  // Prefer the directory as scope when the filename is a generic index/readme.
  const generic = ['index', 'readme', 'main', 'mod', '__init__'];
  let scope = generic.includes(base.toLowerCase()) ? dir : base;
  scope = (scope || 'core').toLowerCase().replace(/[^a-z0-9_-]/g, '');

  // Pick a subject from coarse signals in the added lines.
  const body = diff.toLowerCase();
  let subject;
  if (type === 'docs') subject = `document ${scope}`;
  else if (type === 'style') subject = `refine ${scope} styles`;
  else if (type === 'test') subject = `add tests for ${scope}`;
  else if (/\b(retry|backoff)\b/.test(body)) subject = `retry on failure`;
  else if (/\b(timeout|deadline)\b/.test(body)) subject = `handle request timeouts`;
  else if (/(==\s*""|=== ''|is none|!= nil|== nil|null check|guard)/.test(body)) subject = `guard against invalid input`;
  else if (/\b(catch|except|rescue|error)\b/.test(body)) subject = `handle errors`;
  else if (isNewFile) subject = `add ${scope} helper`;
  else if (type === 'refactor') subject = `simplify ${scope}`;
  else subject = `update ${scope}`;

  return `${type}(${scope}): ${subject}`;
}

export async function POST(request) {
  // Same launch gate as the page: dark in production unless explicitly enabled.
  if (process.env.NEXT_PUBLIC_COMMITTED_ENABLED !== 'true') {
    return new Response('Not Found', { status: 404 });
  }

  let diff = '';
  try {
    const body = await request.json();
    diff = typeof body?.diff === 'string' ? body.diff : '';
  } catch {
    return Response.json({ error: 'Expected JSON body { diff }' }, { status: 400 });
  }

  if (!diff.trim()) {
    return Response.json({ error: 'Empty diff' }, { status: 400 });
  }

  // Small artificial latency so the generating + typewriter states are
  // visible against the mock. The real Space has its own (larger) latency.
  await new Promise((r) => setTimeout(r, 700 + Math.min(diff.length, 600)));

  return Response.json({ message: buildMessage(diff) }, { status: 200 });
}
