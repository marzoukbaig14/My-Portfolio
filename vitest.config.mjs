import { defineConfig } from 'vitest/config';

// Unit tests cover the pure logic (highlighter tokenizer, Conventional-Commit
// helpers, the mock-API message builder, the client API wrapper). They run in
// Node with no DOM, so they stay fast and have no React/jsdom dependency.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
});
