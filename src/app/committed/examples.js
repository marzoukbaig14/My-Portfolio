// PLACEHOLDER example diffs for the Committed demo.
//
// These are stand-ins so the tool is usable before the real examples are
// curated. The human owns the final set — pull representative single-file
// diffs from the test split and replace the `diff` strings below. Keep each
// example a single-file diff under the model's token cap (that is the regime
// Committed was trained on).
//
// Shape: { id, label, language, diff }. `label` is the chip text; `language`
// is shown as a small tag on the chip.

export const examples = [
  {
    id: 'js-debounce',
    label: 'add debounce util',
    language: 'JavaScript',
    diff: `diff --git a/src/utils/debounce.js b/src/utils/debounce.js
new file mode 100644
index 0000000..b1e4c2a
--- /dev/null
+++ b/src/utils/debounce.js
@@ -0,0 +1,12 @@
+export function debounce(fn, wait = 200) {
+  let t;
+  return (...args) => {
+    clearTimeout(t);
+    t = setTimeout(() => fn(...args), wait);
+  };
+}
`,
  },
  {
    id: 'py-retry',
    label: 'retry on timeout',
    language: 'Python',
    diff: `diff --git a/client/http.py b/client/http.py
index 3a1f9c2..7d2e4b8 100644
--- a/client/http.py
+++ b/client/http.py
@@ -10,7 +10,13 @@ def get(url, *, timeout=5):
-    resp = session.get(url, timeout=timeout)
-    resp.raise_for_status()
-    return resp.json()
+    for attempt in range(3):
+        try:
+            resp = session.get(url, timeout=timeout)
+            resp.raise_for_status()
+            return resp.json()
+        except Timeout:
+            if attempt == 2:
+                raise
`,
  },
  {
    id: 'go-nil-check',
    label: 'guard nil config',
    language: 'Go',
    diff: `diff --git a/server/config.go b/server/config.go
index 9c0a11b..2f55de1 100644
--- a/server/config.go
+++ b/server/config.go
@@ -22,6 +22,9 @@ func Load(path string) (*Config, error) {
 	var c Config
+	if path == "" {
+		return nil, errors.New("config: empty path")
+	}
 	if err := yaml.Unmarshal(data, &c); err != nil {
 		return nil, err
 	}
`,
  },
  {
    id: 'css-focus',
    label: 'fix focus ring',
    language: 'CSS',
    diff: `diff --git a/styles/button.css b/styles/button.css
index 5b2c1a0..8e1f6d3 100644
--- a/styles/button.css
+++ b/styles/button.css
@@ -14,3 +14,8 @@
 .btn:hover {
   background: var(--accent-hover);
 }
+
+.btn:focus-visible {
+  outline: 2px solid var(--accent);
+  outline-offset: 2px;
+}
`,
  },
  {
    id: 'md-readme',
    label: 'document env var',
    language: 'Markdown',
    diff: `diff --git a/README.md b/README.md
index 1a2b3c4..5d6e7f8 100644
--- a/README.md
+++ b/README.md
@@ -8,6 +8,10 @@ npm run dev

 Open http://localhost:3000 to view the app.

+## Configuration
+
+Set \`API_URL\` to point the client at your backend. When unset it falls
+back to the bundled mock.
`,
  },
];
