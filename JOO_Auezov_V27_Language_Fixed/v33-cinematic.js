/* JOO V33 Cinematic Edition: scoped enhancements, no external dependencies. */
(() => {
  'use strict';
  const body = document.body;
  if (!body) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 700px)').matches;
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const language = document.documentElement.lang || 'kk';
  // Hero: retain a semantic h1 and localize its accessible name.
  if (body.dataset.page === 'index') {
    const title = document.querySelector('.hero--index h1.hero__title');
    if (title && !title.classList.contains('v33-type')) {
      const raw = title.getAttribute('data-' + language) || title.textContent.trim();
      const words = raw.trim().split(/\s+/).filter(Boolean);
      if (words.length && words.length < 16) {
        title.setAttribute('aria-label', raw);
        title.classList.add('v33-type');
        const fragment = document.createDocumentFragment();
        words.forEach((word, index) => {
          if (index) fragment.appendChild(document.createTextNode(' '));
          const mask = document.createElement('span');
          mask.className = 'v33-word-wrap';
          mask.setAttribute('aria-hidden', 'true');
          const inner = document.createElement('span');
          inner.className = 'v33-word';
          inner.style.setProperty('--word-index', String(index));
          inner.textContent = word;
          mask.appendChild(inner);
          fragment.appendChild(mask);
        });
        title.replaceChildren(fragment);
        // Existing four-second signature intro runs first. Avoid a second animation on phones.
        if (!reduced && !small) {
          const play = () => {
            if (title.classList.contains('v33-hero-play')) return;
            title.classList.add('v33-hero-armed');
            requestAnimationFrame(() => requestAnimationFrame(() => {
              title.classList.add('v33-hero-play');
            }));
          };
          if (document.documentElement.classList.contains('joo-hero-ready')) play();
          else {
            const watcher = new MutationObserver(() => {
              if (document.documentElement.classList.contains('joo-hero-ready')) {
                watcher.disconnect(); play();
              }
            });
            watcher.observe(document.documentElement, {attributes:true,attributeFilter:['class']});
            window.setTimeout(() => { watcher.disconnect(); play(); }, 7500);
          }
        }
      }
    }
  }
  // Campus: the existing interactive galleries remain intact; re-style editorial frames.
  if (body.dataset.page === 'campus') {
    const bento = document.querySelector('.gallery-band__grid');
    if (bento && bento.querySelectorAll('figure').length === 5)
      bento.classList.add('v33-bento');
  }
  // Results: observe the existing authentic student scores rather than inventing numbers.
  if (body.dataset.page === 'results' && !reduced && 'IntersectionObserver' in window) {
    const chart = document.querySelector('.results-chart');
    if (chart) {
      chart.querySelectorAll('.score-row').forEach((row, i) => row.style.setProperty('--score-index', String(i)));
      body.classList.add('v33-motion');
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          chart.classList.add('v33-visible');
          observer.disconnect();
          const headline = chart.querySelector('.results-chart__aside>strong');
          const numberText = headline && [...headline.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
          const target = Number.parseInt(numberText && numberText.textContent, 10);
          if (!numberText || !Number.isFinite(target) || target <= 0) return;
          const original = headline.textContent.trim();
          headline.setAttribute('aria-label', original);
          const start = performance.now(), duration = 1050;
          const frame = now => {
            const p = Math.min(1, (now - start) / duration);
            numberText.nodeValue = String(Math.round(target * (1 - Math.pow(1-p, 3))));
            if (p < 1 && headline.isConnected) requestAnimationFrame(frame);
            else numberText.nodeValue = String(target);
          };
          requestAnimationFrame(frame);
        });
      }, {threshold:0.12, rootMargin:'0px 0px 70px 0px'});
      observer.observe(chart);
    }
  }
  // Team spotlight: highlight only, never crop or hide name/photography.
  if (body.dataset.page === 'team' && finePointer && !reduced) {
    const staff = document.querySelector('.staff');
    if (staff) {
      let queued = false, pending = null;
      staff.addEventListener('pointermove', event => {
        const card = event.target.closest('.joo-team-portrait');
        if (!card) return;
        pending = {card, x:event.clientX, y:event.clientY};
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          if (!pending) return;
          const {card:el,x,y} = pending;
          const rect = el.getBoundingClientRect();
          el.style.setProperty('--v33-x', (((x-rect.left)/Math.max(1,rect.width))*100).toFixed(1) + '%');
          el.style.setProperty('--v33-y', (((y-rect.top)/Math.max(1,rect.height))*100).toFixed(1) + '%');
          pending = null;
        });
      }, {passive:true});
    }
  }
})();
