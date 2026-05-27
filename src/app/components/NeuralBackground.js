'use client';
import { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const hexToRgb = (hex) => {
      const h = hex.trim().replace('#', '');
      return `${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)}`;
    };
    const accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c6fff';
    const accentRgb = hexToRgb(accentHex);
    const edgeRgb = getComputedStyle(document.documentElement).getPropertyValue('--edge-rgb').trim() || '200, 200, 220';

    let width, height, animId, nodes = [];
    let lastFrame = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const initNodes = () => {
      const count = Math.min(95, Math.max(40, Math.floor((width * height) / 16000))); // count at init
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        radius: Math.random() * 2.5 + 2.0,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };
    resize();

    const MAX_DIST = 200;
    const VISIBLE_THRESHOLD_SQ = MAX_DIST * MAX_DIST * 0.65;

    function draw(timestamp) {
      animId = requestAnimationFrame(draw);
      if (timestamp - lastFrame < FRAME_INTERVAL) return;
      lastFrame = timestamp;

      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.05;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < VISIBLE_THRESHOLD_SQ) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / MAX_DIST) * 0.50;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${edgeRgb}, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        const r = node.radius + Math.sin(node.pulse) * 0.8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, 0.95)`;
        ctx.fill();
      }
    }

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else { lastFrame = 0; animId = requestAnimationFrame(draw); }
    };

    animId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }} />;
}