/* JOO: Triple page transition — adapted from Golden Split, Depth Zoom and Diagonal Wipe.
   Only intercept ordinary left clicks on links to other local HTML pages. */
(() => {
  'use strict';
  const root = document.documentElement;
  const overlay = document.getElementById('jooPageRoute');
  if (!overlay) return;
  const key = 'joo-route-transition-v1';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const title = overlay.querySelector('[data-joo-route-target]');
  let leaving = false, navigateTimer = 0;

  function reset() {
    leaving = false;
    if (navigateTimer) clearTimeout(navigateTimer);
    navigateTimer = 0;
    root.classList.remove('joo-route-departing', 'joo-route-incoming');
    overlay.classList.remove('is-covering');
    if (title) title.textContent = 'THE FUTURE STARTS HERE';
  }
  const incoming = root.classList.contains('joo-route-incoming');
  if (incoming) {
    const text = root.dataset.jooRouteTitle;
    if (title && text) title.textContent = text;
    // CSS starts the split automatically; always clean up even without animationend.
    setTimeout(() => {
      root.classList.remove('joo-route-incoming');
      delete root.dataset.jooRouteTitle;
    }, 1180);
  }
  // Browser back/forward may restore a page frozen during its exit.
  window.addEventListener('pageshow', e => {
    if (e.persisted) reset();
  });

  function eligible(event, anchor) {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduced.matches || leaving) return null;
    if (!anchor || anchor.hasAttribute('download') || anchor.getAttribute('target') &&
        anchor.getAttribute('target').toLowerCase() !== '_self') return null;
    const raw = anchor.getAttribute('href');
    if (!raw || raw.startsWith('#') || /^\s*(?:mailto:|tel:|javascript:)/i.test(raw)) return null;
    let url;
    try { url = new URL(raw, window.location.href); } catch (_) { return null; }
    if (!['http:', 'https:', 'file:'].includes(url.protocol) || url.protocol !== location.protocol) return null;
    if (url.protocol !== 'file:' && url.origin !== location.origin) return null;
    // Site pages share a single directory; this also prevents unrelated file:// links.
    if (url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1) !==
        location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1)) return null;
    if (!/\.html$/i.test(url.pathname)) return null;
    if (url.pathname === location.pathname && url.search === location.search) return null;
    return url;
  }

  document.addEventListener('click', event => {
    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
    const url = eligible(event, anchor);
    if (!url) return;
    event.preventDefault();
    leaving = true;
    const label = (anchor.textContent || '').replace(/\s+/g, ' ').trim().replace(/[↗→↑]/g, '').trim().slice(0, 72) || 'JOO HIGH SCHOOL';
    if (title) title.textContent = label;
    try {
      sessionStorage.setItem(key, JSON.stringify({ path: url.pathname, title: label, time: Date.now() }));
    } catch (_) { /* Unavailable storage: departure still plays, arrival falls back. */ }
    root.classList.add('joo-route-departing');
    overlay.classList.add('is-covering');
    navigateTimer = setTimeout(() => {
      const dest = new URL(url.href);
      dest.searchParams.set('jooRoute', '1');
      location.assign(dest.href);
    }, 700);
  }, false);

  // If a link failed to navigate for any reason, don't trap the page.
  document.addEventListener('visibilitychange', () => { if (!document.hidden && leaving && !navigateTimer) reset(); });
})();
