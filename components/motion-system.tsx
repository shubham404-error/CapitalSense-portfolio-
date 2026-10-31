'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function MotionSystem() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    targets.forEach((target, index) => {
      if (!target.dataset.reveal || target.dataset.reveal === 'true') target.dataset.reveal = 'headline';
      if (target.classList.contains('inner-block') || target.classList.contains('article-section')) {
        target.dataset.reveal = 'section';
      }
      target.style.setProperty('--reveal-order', String(index % 4));
    });

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

    let frame = 0;
    const updateScroll = () => {
      const max = root.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty('--scroll-progress', String(Math.min(1, Math.max(0, progress))));
      root.style.setProperty('--hero-shift', `${Math.min(80, window.scrollY * 0.09)}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        updateScroll();
        frame = 0;
      });
    };

    const onPointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', event.clientX + 'px');
      root.style.setProperty('--pointer-y', event.clientY + 'px');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(onScroll) : null;
    resizeObserver?.observe(document.body);
    updateScroll();

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onScroll);
      resizeObserver?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove('motion-ready');
      targets.forEach((target) => target.classList.add('is-visible'));
    };
  }, [pathname]);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true"/>
      <div className="pointer-aura" aria-hidden="true"/>
    </>
  );
}
