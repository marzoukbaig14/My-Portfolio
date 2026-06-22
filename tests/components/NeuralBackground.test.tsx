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
  fillRect: vi.fn(),
  drawImage: vi.fn(),
  createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  globalAlpha: 1,
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

// jsdom can't measure real FPS, GPU fill, or GC, so these don't profile runtime.
// Instead they lock in the structural properties that prevent the regression
// classes we've actually hit on the canvas: per-frame allocations (GC churn),
// uncapped resolution on large monitors, a runaway frame rate, and leaked loops
// or listeners. A change that reintroduces one of these will fail here.
describe('NeuralBackground (performance guards)', () => {
  let ctxMock: ReturnType<typeof fakeCtx>;
  let rafCallbacks: FrameRequestCallback[];

  beforeEach(() => {
    ctxMock = fakeCtx();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctxMock as unknown as CanvasRenderingContext2D,
    );
    // Capture rAF callbacks instead of running them, so we can step frames.
    rafCallbacks = [];
    vi.stubGlobal('requestAnimationFrame', vi.fn((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    }));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    window.matchMedia = makeMatchMedia({ '(pointer: fine)': true }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('allocates no gradients per frame (glow is a cached sprite, not a per-frame createRadialGradient)', () => {
    render(<NeuralBackground />);
    const draw = rafCallbacks[rafCallbacks.length - 1];
    // Sprite gradients are built once at init; ignore those and inspect one frame.
    ctxMock.createRadialGradient.mockClear();
    ctxMock.drawImage.mockClear();
    draw(1000);
    expect(ctxMock.createRadialGradient).not.toHaveBeenCalled();
    expect(ctxMock.drawImage).toHaveBeenCalled(); // glow blitted from the sprite
  });

  it('throttles work to the frame interval (no second paint within ~33ms)', () => {
    render(<NeuralBackground />);
    const draw = rafCallbacks[rafCallbacks.length - 1];
    draw(1000);
    ctxMock.clearRect.mockClear();
    draw(1010); // +10ms, below the 30fps interval -> should be skipped
    expect(ctxMock.clearRect).not.toHaveBeenCalled();
    draw(1100); // +100ms, a new frame is due
    expect(ctxMock.clearRect).toHaveBeenCalled();
  });

  it('caps the backing-store resolution on large viewports', () => {
    const orig = { w: window.innerWidth, h: window.innerHeight };
    Object.defineProperty(window, 'innerWidth', { value: 3200, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1800, configurable: true });
    const { container } = render(<NeuralBackground />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.width).toBeLessThanOrEqual(1920); // MAX_BACKING
    Object.defineProperty(window, 'innerWidth', { value: orig.w, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: orig.h, configurable: true });
  });

  it('tears down its loop and listeners on unmount (no leaked rAF or handlers)', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const docRemoveSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = render(<NeuralBackground />);
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalled();
    const windowRemoved = removeSpy.mock.calls.map(c => c[0]);
    expect(windowRemoved).toContain('resize');
    expect(windowRemoved).toContain('pointermove');
    expect(docRemoveSpy.mock.calls.map(c => c[0])).toContain('visibilitychange');
  });
});
