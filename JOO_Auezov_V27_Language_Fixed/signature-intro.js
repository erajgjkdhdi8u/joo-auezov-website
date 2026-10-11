/* JOO Signature Intro — replay on each homepage load / refresh.
   Use ?intro=off to skip; prefers-reduced-motion also disables animation. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (!root.classList.contains('joo-intro-armed')) return;
  const intro = document.getElementById('jooSignatureIntro');
  if (!intro) { root.classList.remove('joo-intro-armed'); return; }
  const skip = intro.querySelector('.joo-intro__skip');
  let completed = false;
  let launchTimer = null;
  let clearTimer = null;
  let lastFocus = document.activeElement;
  // The escape hatch works from the first frame. Never set overflow:hidden.
  function cleanup() {
    if (completed) return;
    completed = true;
    if (launchTimer) clearTimeout(launchTimer);
    if (clearTimer) clearTimeout(clearTimer);
    document.removeEventListener('keydown', onKey);
    intro.remove();
    root.classList.remove('joo-intro-armed');
    if (intro.classList.contains('is-leaving')) {
      setTimeout(() => root.classList.remove('joo-intro-revealing'), 1000);
    } else { root.classList.remove('joo-intro-revealing'); }
    if (skip && document.activeElement === skip && lastFocus instanceof HTMLElement) {
      try { lastFocus.focus({ preventScroll: true }); } catch(e) {}
    }
  }
  function finishNow() {
    if (completed) return;
    cleanup();
  }
  function finishAnimated() {
    if (completed || intro.classList.contains('is-leaving')) return;
    intro.classList.add('is-leaving');
    root.classList.add('joo-intro-revealing');
    clearTimer = setTimeout(cleanup, 1100);
  }
  function onKey(event) {
    if (event.key === 'Escape') { event.preventDefault(); finishNow(); }
  }
  skip?.addEventListener('click', finishNow);
  document.addEventListener('keydown', onKey);
  // Intentional: no sessionStorage guard. Reload should replay the intro.
  // Avoid BFCache overlay on navigation back to this document.
  window.addEventListener('pagehide', finishNow, { once:true });
  requestAnimationFrame(() => {
    if (completed) return;
    intro.classList.add('is-playing');
    try { skip?.focus({ preventScroll: true }); } catch(e) {}
    launchTimer = setTimeout(finishAnimated, 3050);
  });
})();
