'use client';
import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Coalesce to one update per frame: the previous handler ran setState (a
    // React re-render) plus a layout read on every scroll event, which adds up
    // on a long page. Passive listener so it never blocks the scroll thread.
    let raf = 0;
    const update = () => {
      raf = 0;
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div aria-hidden="true" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '2px',
      width: `${progress}%`,
      background: 'var(--accent)',
      zIndex: 9999,
      transition: 'width 0.05s linear',
      boxShadow: '0 0 8px var(--accent)',
    }} />
  );
}