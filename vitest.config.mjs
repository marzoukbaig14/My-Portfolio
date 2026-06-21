import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const fromHere = (p) => fileURLToPath(new URL(p, import.meta.url));

// Two layers of tests:
//  - Pure-logic tests run in Node (fast, no DOM): the highlighter tokenizer,
//    the Conventional-Commit helpers, the mock-API builder, the API wrapper.
//  - Component tests opt into jsdom per file with `// @vitest-environment jsdom`.
// esbuild handles .ts/.tsx by extension; `jsx: 'automatic'` gives the React 17+
// runtime so components need no React import. The `@` alias mirrors tsconfig.
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: { '@': fromHere('./src') },
  },
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
