// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import NeuralBackground from '../../src/app/components/NeuralBackground';

// These guard the mobile behavior of the interactive canvas: cursor reactivity
// must never wire mouse handlers on touch devices, and reduced motion must keep
// the animation loop off. jsdom has no canvas or matchMedia, so we stub the few
// browser APIs the component touches and assert on the listeners it registers.

const makeMatchMedia = (matchers: Record<string, boolean>) =>
  vi.fn((query: string) => ({
    matches: matchers[query] ?? false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

const fakeCtx = () => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
});

describe('NeuralBackground (mobile safety)', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      fakeCtx() as unknown as CanvasRenderingContext2D,
    );
    // Keep rAF from actually looping; we only care about setup-time behavior.
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('attaches no pointer listener on a touch device (no fine pointer)', () => {
    window.matchMedia = makeMatchMedia({ '(pointer: fine)': false }) as unknown as typeof window.matchMedia;
    const addSpy = vi.spyOn(window, 'addEventListener');
    render(<NeuralBackground />);
    const events = addSpy.mock.calls.map(c => c[0]);
    expect(events).not.toContain('pointermove');
  });

  it('attaches a pointermove listener on a fine-pointer (desktop) device', () => {
    window.matchMedia = makeMatchMedia({ '(pointer: fine)': true }) as unknown as typeof window.matchMedia;
    const addSpy = vi.spyOn(window, 'addEventListener');
    render(<NeuralBackground />);
    const events = addSpy.mock.calls.map(c => c[0]);
    expect(events).toContain('pointermove');
  });

  it('starts no animation loop and no pointer listener under reduced motion', () => {
    window.matchMedia = makeMatchMedia({
      '(pointer: fine)': true,
      '(prefers-reduced-motion: reduce)': true,
    }) as unknown as typeof window.matchMedia;
    const raf = vi.fn(() => 1);
    vi.stubGlobal('requestAnimationFrame', raf);
    const addSpy = vi.spyOn(window, 'addEventListener');
    render(<NeuralBackground />);
    expect(raf).not.toHaveBeenCalled();
    expect(addSpy.mock.calls.map(c => c[0])).not.toContain('pointermove');
  });

  it('renders an aria-hidden canvas', () => {
    window.matchMedia = makeMatchMedia({}) as unknown as typeof window.matchMedia;
    const { container } = render(<NeuralBackground />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });
});
