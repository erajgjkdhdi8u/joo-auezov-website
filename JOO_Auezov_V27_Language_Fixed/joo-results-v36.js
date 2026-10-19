/* JOO V36 — Results-only, progressive enhancements (no data changes). */
(() => {
  'use strict';
  if (document.body?.dataset.page !== 'results') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const root = document.getElementById('achievements');
  // 3D tilt and localized lighting only where a mouse/fine pointer is present.
  if (root && window.matchMedia('(hover:hover) and (pointer:fine) and (min-width:769px)').matches) {
    const grid = root.querySelector('.joo-achieve__grid');
    const cards = [...root.querySelectorAll('.joo-achieve__card[data-achieve-group]')];
    let raf = 0, pending = null;
    const reset = (card) => {
      card.style.removeProperty('--v36-rx');
      card.style.removeProperty('--v36-ry');
      card.style.removeProperty('--v36-gx');
      card.style.removeProperty('--v36-gy');
    };
    cards.forEach(card => card.addEventListener('pointerleave', () => reset(card)));
    if (grid) grid.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      const card = event.target.closest('.joo-achieve__card[data-achieve-group]');
      if (!card || card.hidden) return;
      pending = {card, x:event.clientX, y:event.clientY};
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!pending) return;
        const {card, x, y} = pending;
        pending = null;
        const rect = card.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (x - rect.left) / Math.max(1, rect.width)));
        const py = Math.max(0, Math.min(1, (y - rect.top) / Math.max(1, rect.height)));
        card.style.setProperty('--v36-rx', ((.5 - py) * 7).toFixed(2) + 'deg');
        card.style.setProperty('--v36-ry', ((px - .5) * 9).toFixed(2) + 'deg');
        card.style.setProperty('--v36-gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--v36-gy', (py * 100).toFixed(1) + '%');
      });
    }, {passive:true});
  }

  // Never arm hidden scroll elements without IntersectionObserver support.
  if (!('IntersectionObserver' in window)) return;
  const observeOnce = (targets, className, options) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(className);
        observer.unobserve(entry.target);
      });
    }, options || {threshold:.1, rootMargin:'0px 0px -20px 0px'});
    targets.forEach(el => observer.observe(el));
  };

  const staggerTargets = [...document.querySelectorAll(
    '.joo-achieve__card[data-achieve-group],.results-progress .progress-card,#students .poster,#grantee-list .grantee'
  )];
  const groupCounts = new Map();
  staggerTargets.forEach(el => {
    const group = el.parentElement;
    const i = groupCounts.get(group) || 0;
    groupCounts.set(group, i + 1);
    el.style.setProperty('--v36-stagger', String((i % 4) * 75) + 'ms');
  });
  observeOnce(staggerTargets, 'v36-in', {threshold:.08,rootMargin:'0px 0px -28px 0px'});
  if (root) observeOnce([root], 'v36-title-visible', {threshold:.14,rootMargin:'0px 0px -25px 0px'});

  const bars = [...document.querySelectorAll(
    '.results-chart .score-row,.results-progress .progress-card,.rg-cities .rg-meter'
  )];
  observeOnce(bars, 'v36-bar-in', {threshold:.12,rootMargin:'0px 0px -12px 0px'});
  document.body.classList.add('v36-armed');
})();
