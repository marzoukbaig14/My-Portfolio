// Registers @testing-library/jest-dom matchers (toBeInTheDocument,
// toHaveAttribute, etc.) with Vitest's expect. Safe to load in the Node
// environment too: it only extends expect and touches the DOM when a matcher
// is actually called. Per-test cleanup lives in the component test files.
import '@testing-library/jest-dom/vitest';
