'use client';
import { useEffect, useRef } from 'react';

// zPhase/zSpeed drive a per-node "depth" in [0,1] that slowly oscillates, so
// nodes appear to float toward and away from the screen. depth scales radius,
// brightness, edge weight, and parallax speed.
type GraphNode = { x: number; y: number; vx: number; vy: number; radius: number; pulse: number; zPhase: number; zSpeed: number; depth: number };

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hexToRgb = (hex: string) => {
      const h = hex.trim().replace('#', '');
      return `${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)}`;
    };
    const accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c6fff';
    const accentRgb = hexToRgb(accentHex);
    const edgeRgb = getComputedStyle(document.documentElement).getPropertyValue('--edge-rgb').trim() || '200, 200, 220';

    // Field color gradient: blend across x from the accent (cyan) to the violet
    // already used in the hero glow, so the net reads as a cohesive gradient.
    const toNums = (rgb: string) => rgb.split(',').map(s => parseInt(s.trim(), 10));
    const colorNear = toNums(accentRgb);   // left edge: brand accent
    const colorFar = [124, 111, 255];      // right edge: hero-glow violet
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Pre-render the glow into a few color-bucketed sprites and blit them at
    // draw time, instead of allocating a radial gradient per node every frame
    // (the previous hot spot). Color is picked per node by bucket; brightness
    // comes from globalAlpha, so the result matches the old per-node gradient.
    const GLOW_BUCKETS = 10;
    const GLOW_SPRITE_SIZE = 48;
    const glowSprites: HTMLCanvasElement[] = [];
    for (let k = 0; k < GLOW_BUCKETS; k++) {
      const tk = k / (GLOW_BUCKETS - 1);
      const gr = Math.round(lerp(colorNear[0], colorFar[0], tk));
      const gg = Math.round(lerp(colorNear[1], colorFar[1], tk));
      const gb = Math.round(lerp(colorNear[2], colorFar[2], tk));
      const sprite = document.createElement('canvas');
      sprite.width = sprite.height = GLOW_SPRITE_SIZE;
      const sctx = sprite.getContext('2d');
      if (!sctx) continue;
      const c = GLOW_SPRITE_SIZE / 2;
      const grad = sctx.createRadialGradient(c, c, 0, c, c, c);
      grad.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, 1)`);
      grad.addColorStop(1, `rgba(${gr}, ${gg}, ${gb}, 0)`);
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, GLOW_SPRITE_SIZE, GLOW_SPRITE_SIZE);
      glowSprites.push(sprite);
    }

    // Respect prefers-reduced-motion: when set, we paint a single static frame
    // and never start the animation loop. Checked once on mount.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let animId = 0;
    let nodes: GraphNode[] = [];
    let lastFrame = 0;
    let mouseX = -9999; // off-screen until the pointer moves
    let mouseY = -9999;
    let renderScale = 1; // backing-store scale; drops below 1 on large viewports
    let lastScroll = 0; // timestamp of the most recent scroll, for the freeze-on-scroll below
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const initNodes = () => {
      const count = Math.min(95, Math.max(40, Math.floor((width * height) / 16000))); // count at init
      nodes = Array.from({ length: count }, () => {
        const zPhase = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          radius: Math.random() * 2.2 + 2.8, // 2.8–5.0, larger so nodes read up close
          pulse: Math.random() * Math.PI * 2,
          zPhase,
          zSpeed: 0.014 + Math.random() * 0.018, // float in/out, more pronounced depth
          depth: 0.5 + 0.5 * Math.sin(zPhase),
        };
      });
    };

    const MAX_DIST = 215;
    const VISIBLE_THRESHOLD_SQ = MAX_DIST * MAX_DIST * 0.65;
    const INFLUENCE = 190; // cursor reach: nodes within this glow and link to it

    // Cap the backing-store resolution on large viewports: a soft, blurred
    // background tolerates slight upscaling, and fill cost scales with pixel
    // count, so this is a meaningful win on big external monitors. Raise
    // MAX_BACKING for a crisper field, lower it for more speed.
    const MAX_BACKING = 1920;
    const resize = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      renderScale = Math.min(1, MAX_BACKING / Math.max(cssW, cssH));
      width = canvas.width = Math.round(cssW * renderScale);
      height = canvas.height = Math.round(cssH * renderScale);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      initNodes();
      if (prefersReduced) paintFrame(); // keep the static frame correct on resize
    };

    // Advance node positions one tick. Skipped entirely under reduced motion.
    function integrate() {
      for (const node of nodes) {
        node.zPhase += node.zSpeed;
        node.depth = 0.5 + 0.5 * Math.sin(node.zPhase);
        const speed = 0.3 + node.depth * 1.5; // parallax: nearer nodes drift faster
        node.x += node.vx * speed;
        node.y += node.vy * speed;
        node.pulse += 0.05;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));
      }
    }

    // Draw the current node/edge state. Used by both the animation loop and
    // the single static frame rendered under reduced motion.
    function paintFrame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < VISIBLE_THRESHOLD_SQ) {
            const dist = Math.sqrt(distSq);
            const avgDepth = (nodes[i].depth + nodes[j].depth) / 2;
            const opacity = (1 - dist / MAX_DIST) * 0.8 * (0.45 + avgDepth * 0.7);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${edgeRgb}, ${opacity})`;
            ctx.lineWidth = 0.8 + avgDepth * 0.9;
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        const depth = node.depth;
        // Wider radius range so the depth float reads as nodes coming forward.
        let r = node.radius * (0.4 + depth * 1.4) + Math.sin(node.pulse) * 0.8;
        // Color blends across the field width (cyan -> violet).
        const t = width > 0 ? node.x / width : 0;
        const cr = Math.round(lerp(colorNear[0], colorFar[0], t));
        const cg = Math.round(lerp(colorNear[1], colorFar[1], t));
        const cb = Math.round(lerp(colorNear[2], colorFar[2], t));

        // Cursor influence: nodes near the pointer grow, brighten, and link to it.
        const mdx = node.x - mouseX;
        const mdy = node.y - mouseY;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        const infl = mDist < INFLUENCE ? 1 - mDist / INFLUENCE : 0;
        if (infl > 0) {
          r += infl * 2.5;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${infl * 0.55})`;
          ctx.lineWidth = 0.8 + infl * 0.8;
          ctx.stroke();
        }

        // Soft glow halo: blit a cached sprite (color bucketed by x, brightness
        // via globalAlpha) instead of building a gradient every frame.
        if (glowSprites.length) {
          const glowAlpha = Math.min(1, 0.62 * (0.5 + depth * 0.5) + infl * 0.4);
          const bucket = Math.min(glowSprites.length - 1, Math.floor(t * glowSprites.length));
          const R = r * 3;
          ctx.globalAlpha = glowAlpha;
          ctx.drawImage(glowSprites[bucket], node.x - R, node.y - R, R * 2, R * 2);
          ctx.globalAlpha = 1;
        }

        // Solid core.
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${Math.min(1, 0.82 + depth * 0.18 + infl * 0.2)})`;
        ctx.fill();

        // Hot near-white center, so nodes pop instead of reading as flat dots.
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(225, 248, 255, ${Math.min(1, 0.55 + depth * 0.4 + infl * 0.4)})`;
        ctx.fill();
      }
    }

    resize();

    function draw(timestamp: number) {
      animId = requestAnimationFrame(draw);
      if (timestamp - lastFrame < FRAME_INTERVAL) return;
      lastFrame = timestamp;
      // Hold the last frame while the user is actively scrolling: repainting a
      // full-screen canvas every frame competes with the browser's scroll
      // compositing and is a big cause of scroll jank on weak machines. The net
      // resumes animating ~120ms after scrolling stops.
      if (performance.now() - lastScroll < 120) return;
      integrate();
      paintFrame();
    }

    // Reduced motion: resize() has already painted one static frame. Keep it
    // correct across resizes and skip the animation loop entirely.
    if (prefersReduced) {
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else { lastFrame = 0; animId = requestAnimationFrame(draw); }
    };

    // Cursor reactivity, pointer devices only. Touch has no hover, and under
    // reduced motion the loop never runs, so this is naturally disabled there.
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const handlePointer = (e: PointerEvent) => { mouseX = e.clientX * renderScale; mouseY = e.clientY * renderScale; };
    const handlePointerLeave = () => { mouseX = -9999; mouseY = -9999; };
    const handleScroll = () => { lastScroll = performance.now(); };

    animId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    if (finePointer) {
      window.addEventListener('pointermove', handlePointer);
      document.addEventListener('mouseleave', handlePointerLeave);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pointermove', handlePointer);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }} />;
}