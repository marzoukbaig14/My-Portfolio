'use client';
import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    let animId;

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX - 4}px`;
        dotRef.current.style.top = `${e.clientY - 4}px`;
      }
    };

    const animate = () => {
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPosRef.current.x - 16}px`;
        ringRef.current.style.top = `${ringPosRef.current.y - 16}px`;
      }
      animId = requestAnimationFrame(animate);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      <div ref={dotRef} style={{ position: 'fixed', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', pointerEvents: 'none', zIndex: 99999, opacity: visible ? 1 : 0, transform: clicking ? 'scale(0.6)' : 'scale(1)', transition: 'opacity 0.2s, transform 0.1s', left: '-100px', top: '-100px' }} />
      <div ref={ringRef} style={{ position: 'fixed', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(124,111,255,0.6)', pointerEvents: 'none', zIndex: 99998, opacity: visible ? 1 : 0, transform: clicking ? 'scale(1.4)' : 'scale(1)', transition: 'opacity 0.2s, transform 0.15s', left: '-100px', top: '-100px' }} />
    </>
  );
}