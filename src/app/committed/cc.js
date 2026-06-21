// Conventional Commit subject helpers, shared by the demo UI and the tests.
//
// Grammar: type(scope)!: subject. A match means the syntax is well-formed; it
// does NOT mean the type is the right call, so we never claim more than that.
export const CC_RE = /^([a-z]+)(\(([^)]+)\))?(!)?:\s(.+)$/i;

export function isWellFormed(msg) {
  return CC_RE.test(msg.trim());
}

// Count the file headers in a diff. Committed only saw single-file diffs, so
// more than one is worth a gentle nudge.
export function fileCount(diff) {
  const m = diff.match(/^diff --git /gm) || diff.match(/^\+\+\+ /gm) || [];
  return m.length;
}
