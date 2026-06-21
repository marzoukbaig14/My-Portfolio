'use client';
import dynamic from 'next/dynamic';

// Lazy-load the shared NeuralBackground as its own client-only chunk so it
// never blocks the demo's first paint. It's the same node-graph used on the
// home page, so the page stays visually native to the site.
const NeuralBackground = dynamic(() => import('../components/NeuralBackground'), { ssr: false });

export default function CommittedBackground() {
  return <NeuralBackground />;
}
