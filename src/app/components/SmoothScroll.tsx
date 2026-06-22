'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

// A single, app-wide Lenis instance lives here and is mounted once in the root
// layout, so it survives client-side navigations instead of being torn down and
// recreated per page. Previously each page mounted its own instance; on a route
// change the outgoing instance's rAF loop kept writing the old scroll position
// to the window while the incoming instance tried to reset it, so the two raced
// and the page could open scrolled partway down. One persistent instance removes
// the race entirely.
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const href = (e.target as Element | null)?.closest('a')?.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector<HTMLElement>(href);
        if (target) lenis.scrollTo(target);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Reset to the top on every client-side route change, unless the URL targets
  // an anchor. This runs on the persistent instance, so no overlapping instance
  // can pull the scroll back down.
  useEffect(() => {
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
