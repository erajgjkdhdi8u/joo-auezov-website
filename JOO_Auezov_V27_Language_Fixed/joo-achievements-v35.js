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
  // V36: FLIP reflow for staying cards, fade/slide for new cards, short
  // decorative exit ghosts. Filtering remains instant with reduced motion.
  // Ghosts are inert and aria-hidden, never interactive or announced.
  const grid = root.querySelector('.joo-achieve__grid');
  let animations = [];
  let active = 'all';
  const cancelPrevious = () => {
    animations.forEach(animation => animation.cancel());
    animations = [];
    root.querySelectorAll('.v36-filter-ghost').forEach(ghost => ghost.remove());
  };
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.achieveFilter;
      if (selected === active) return;
      cancelPrevious();
      const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
        !!grid && cards.every(card => typeof card.animate === 'function');
      const previous = new Map();
      const gridBox = animate ? grid.getBoundingClientRect() : null;
      if (animate) cards.forEach(card => {
        if (!card.hidden) previous.set(card, card.getBoundingClientRect());
      });
      filters.forEach(item => item.setAttribute('aria-pressed', String(item === btn)));

      if (animate) {
        cards.forEach(card => {
          const was = previous.get(card);
          const keep = selected === 'all' || card.dataset.achieveGroup === selected;
          if (!was || keep) return;
          const ghost = card.cloneNode(true);
          ghost.classList.add('v36-filter-ghost');
          ghost.removeAttribute('data-achieve-group');
          ghost.setAttribute('aria-hidden', 'true');
          ghost.setAttribute('inert', '');
          ghost.querySelectorAll('a,button,input').forEach(el => el.tabIndex = -1);
          Object.assign(ghost.style, {
            left: (was.left - gridBox.left) + 'px',
            top: (was.top - gridBox.top) + 'px',
            width: was.width + 'px',
            height: was.height + 'px'
          });
          grid.appendChild(ghost);
          const animation = ghost.animate([
            {opacity:1, scale:'1', translate:'0 0'},
            {opacity:0, scale:'.975', translate:'0 -12px'}
          ], {duration:270,easing:'ease-out',fill:'forwards'});
          animation.onfinish = () => ghost.remove();
          animations.push(animation);
        });
      }
      cards.forEach(card => {
        card.hidden = selected !== 'all' && card.dataset.achieveGroup !== selected;
      });
      active = selected;

      if (animate) cards.forEach(card => {
        if (card.hidden) return;
        const before = previous.get(card);
        const after = card.getBoundingClientRect();
        const frames = before ? [
          {translate:(before.left-after.left)+'px '+(before.top-after.top)+'px'},
          {translate:'0px 0px'}
        ] : [
          {opacity:0,translate:'0 20px'},
          {opacity:1,translate:'0 0'}
        ];
        if (before && Math.abs(before.left-after.left) + Math.abs(before.top-after.top) < 2) return;
        animations.push(card.animate(frames,{
          duration:before ? 420 : 380,
          delay:before ? 0 : 75,
          easing:'cubic-bezier(.22,1,.36,1)'
        }));
      });
    });
  });
})();
