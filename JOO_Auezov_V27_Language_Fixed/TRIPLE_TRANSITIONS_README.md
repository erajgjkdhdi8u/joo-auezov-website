# JOO High School — 3-in-1 Page Transitions

The original V27 design, results photos, profile montage images, cinematic homepage intro and other site content are retained.

Three transition styles are combined into **one** route transition rather than applying three animations in sequence:

1. **Editorial Diagonal Wipe** — two navy diagonal panels cover the outgoing page.
2. **Cinematic Depth Zoom** — the page gently recedes and the next page arrives from depth.
3. **JOO Golden Split** — gold blade flashes and the two panels separate to reveal the destination.

Duration: ~0.7 s to navigate, ~0.9 s to unveil. No photo blur, mouse-follow ring or scroll locking.

## Behavior
- Runs on ordinary same-folder `.html` page navigation only.
- Does not affect on-page anchors, modals, filters, tabs, external links, new-tab and modified clicks.
- The homepage's cinematic intro continues to replay on **refresh/F5**; on an internal navigation to Home, the short route animation is shown instead.
- Gracefully bypasses animation for visitors who prefer reduced motion.
- A one-time `sessionStorage` marker plus a `?jooRoute=1` fallback support both hosted URLs and local `file://` archives. The destination removes the temporary query whenever browser history rules permit; a refresh never restarts an old route transition.

## Files changed
- A small bootstrap and stylesheet/script reference were inserted into the 14 existing HTML pages.
- New: `joo-route-transitions.css` and `joo-route-transitions.js`.
- One line in the homepage's intro bootstrap avoids overlapping two intro animations.
