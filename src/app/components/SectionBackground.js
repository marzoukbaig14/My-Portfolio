'use client';
import { useEffect, useRef } from 'react';

export default function SectionBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    let width, height, animId, nodes = [];
    let lastFrame = 0;
    let isVisible = false;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const initNodes = () => {
      const count = Math.min(60, Math.max(30, Math.floor((width * height) / 18000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 1.5 + 1,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      width = canvas.width = parent ? parent.offsetWidth : window.innerWidth;
      height = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
      initNodes();
    };

    resize();

    const MAX_DIST = 180;
    const MAX_DIST_SQ = MAX_DIST * MAX_DIST;
    const VISIBLE_THRESHOLD_SQ = MAX_DIST_SQ * 0.65;

    function draw(timestamp) {
      animId = requestAnimationFrame(draw);
      if (timestamp - lastFrame < FRAME_INTERVAL) return;
      lastFrame = timestamp;

      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.04;
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
            const opacity = (1 - dist / MAX_DIST) * 0.3;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(124, 111, 255, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        const r = node.radius + Math.sin(node.pulse) * 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 111, 255, 0.6)';
        ctx.fill();
      }
    }

    const startAnim = () => {
      if (animId) cancelAnimationFrame(animId);
      lastFrame = 0;
      animId = requestAnimationFrame(draw);
    };

    const stopAnim = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !document.hidden) startAnim();
        else stopAnim();
      },
      { threshold: 0.1 }
    );

    const handleVisibility = () => {
      if (document.hidden) stopAnim();
      else if (isVisible) startAnim();
    };

    observer.observe(parent);
    window.addEventListener('resize', resize);
    document.addEventListener('fullscreenchange', resize);
    document.addEventListener('webkitfullscreenchange', resize);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopAnim();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('fullscreenchange', resize);
      document.removeEventListener('webkitfullscreenchange', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}