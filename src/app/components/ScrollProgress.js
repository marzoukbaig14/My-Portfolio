'use client';
import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div style={{
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