'use client';
import { useEffect } from 'react';

export function MotionSystem() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    document.documentElement.classList.add('motion-ready');
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
    targets.forEach((target) => observer.observe(target));
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      document.documentElement.style.setProperty('--scroll-progress', String(progress));
    };
    const onPointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--pointer-x', event.clientX + 'px');
      document.documentElement.style.setProperty('--pointer-y', event.clientY + 'px');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);
  return <><div className="scroll-progress" aria-hidden="true"/><div className="pointer-aura" aria-hidden="true"/></>;
}
