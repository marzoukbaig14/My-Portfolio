import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const fromHere = (p) => fileURLToPath(new URL(p, import.meta.url));

// Two layers of tests:
//  - Pure-logic tests run in Node (fast, no DOM): the highlighter tokenizer,
//    the Conventional-Commit helpers, the mock-API builder, the API wrapper.
//  - Component tests opt into jsdom per file with `// @vitest-environment jsdom`.
// Our React components live in .js files (Next/SWC convention), so esbuild is
// told to parse .js as JSX with the automatic runtime. The `@` alias mirrors
// jsconfig so `@/...` imports resolve in tests.
export default defineConfig({
  esbuild: {
    loader: 'jsx',
    jsx: 'automatic',
    include: /\.[jt]sx?$/,
    exclude: /node_modules/,
  },
  resolve: {
    alias: { '@': fromHere('./src') },
  },
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx}'],
  },
});
