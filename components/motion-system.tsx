'use client';

import { useEffect } from 'react';

export function MotionSystem() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    // Content is always readable. Motion is enabled only after the observer
    // is successfully created, so a JS/browser failure can never blank a page.
    targets.forEach((target) => target.classList.add('is-visible'));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsObserver = 'IntersectionObserver' in window;

    let observer: IntersectionObserver | null = null;

    if (!reduce && supportsObserver && targets.length) {
      try {
        targets.forEach((target) => target.classList.remove('is-visible'));

        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add('is-visible');
              observer?.unobserve(entry.target);
            }
          });
        }, { threshold: 0.06, rootMargin: '0px 0px -2% 0px' });

        targets.forEach((target) => observer?.observe(target));
        root.classList.add('motion-ready');
      } catch {
        targets.forEach((target) => target.classList.add('is-visible'));
        root.classList.remove('motion-ready');
      }
    }

    const onScroll = () => {
      const max = root.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty('--scroll-progress', String(Math.min(1, Math.max(0, progress))));
    };

    const onPointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', event.clientX + 'px');
      root.style.setProperty('--pointer-y', event.clientY + 'px');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    onScroll();

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      root.classList.remove('motion-ready');
      targets.forEach((target) => target.classList.add('is-visible'));
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true"/>
      <div className="pointer-aura" aria-hidden="true"/>
    </>
  );
}
