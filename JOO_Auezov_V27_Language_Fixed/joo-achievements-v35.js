/* JOO V35 — Filtered achievements and reduced-motion-safe statistic animation. */
(() => {
  'use strict';
  const root = document.getElementById('achievements');
  if (!root) return;
  const cards = Array.from(root.querySelectorAll('[data-achieve-group]'));
  const filters = Array.from(root.querySelectorAll('[data-achieve-filter]'));
  const counters = Array.from(root.querySelectorAll('[data-count-to]'));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finished = new WeakSet();
  const render = (el, n) => {
    const decimals = Number(el.dataset.decimals || 0);
    const prefix = el.dataset.prefix || '';
    el.textContent = prefix + n.toFixed(decimals);
  };
  const animate = (el) => {
    if (finished.has(el)) return;
    finished.add(el);
    const target = Number(el.dataset.countTo);
    if (!Number.isFinite(target)) return;
    if (reduceMotion || typeof requestAnimationFrame !== 'function') {
      render(el, target);
      return;
    }
    const duration = 1250;
    let start;
    const frame = (timestamp) => {
      if (start === undefined) start = timestamp;
      const x = Math.min(1, (timestamp - start) / duration);
      render(el, target * (1 - Math.pow(1 - x, 3)));
      if (x < 1) requestAnimationFrame(frame);
      else render(el, target);
    };
    requestAnimationFrame(frame);
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animate(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.25 });
    counters.forEach((el) => observer.observe(el));
  } else counters.forEach(animate);
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.achieveFilter;
      filters.forEach((item) => item.setAttribute('aria-pressed', String(item === btn)));
      cards.forEach((card) => { card.hidden = selected !== 'all' && card.dataset.achieveGroup !== selected; });
    });
  });
})();
