'use client';

import { useEffect } from 'react';

/**
 * Efeitos de rolagem do site: aparecer ao rolar (.reveal) e contadores (data-count).
 * Não renderiza nada; só observa elementos já existentes na página.
 */
export default function Effects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasObserver = 'IntersectionObserver' in window;

    // ---- Aparecer ao rolar ----
    const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    let revealObserver: IntersectionObserver | null = null;

    if (reduceMotion || !hasObserver) {
      items.forEach((el) => el.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );
      items.forEach((el) => observer.observe(el));
      revealObserver = observer;
    }

    // ---- Contadores ----
    const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
    let countObserver: IntersectionObserver | null = null;
    let frame = 0;

    const animate = (el: HTMLElement) => {
      const target = Number(el.dataset.count ?? '0');
      const suffix = el.dataset.suffix ?? '';
      const start = performance.now();
      const duration = 1600;
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    if (!reduceMotion && hasObserver) {
      counters.forEach((el) => {
        el.textContent = `0${el.dataset.suffix ?? ''}`;
      });
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(entry.target as HTMLElement);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 },
      );
      counters.forEach((el) => observer.observe(el));
      countObserver = observer;
    }

    return () => {
      revealObserver?.disconnect();
      countObserver?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
