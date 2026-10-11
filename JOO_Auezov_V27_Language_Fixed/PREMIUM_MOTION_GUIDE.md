# JOO Auezov V27 — Premium Motion Update

Base: original V27 content refresh + montage portraits preserved. The site is **not rebuilt**.

## Interactive effects

- `campus.html`: circular-thumbnail interactive background photo switcher, six local photos. Click/arrow keys/buttons; crossfade with no blur. Inspired by the requested jQuery example, reimplemented without jQuery.
- `gallery-band__grid`: archive-style focus and 3D hover, inspired by rudra-xi/image-archive.
- `.fx-pointer-card`: mouse-position reactive light gradients (Cursor-JS & Kinesis concept only, **not custom cursor**).
- Hero section: layered ambient lighting, editorial entrances; CTA shimmer.
- Scroll into view: soft text entrances, content never invisible while waiting.
- Career: subtle orb/globe motion, only decorative elements.
- Respects `prefers-reduced-motion`, touch devices do not receive hover-only effects.
- No scroll-lock animation, blurry photography, forced route changes, or heavy WebGL.

## Credits/reference links
https://github.com/rudra-xi/image-archive
https://github.com/iDev-Games/Cursor-JS
https://kinesisjs.com/
https://github.com/houmahani/codrops-depth-gallery
https://github.com/sunyctf/js-effects
https://yesiamrocks.github.io/cssanimation/
https://lab.hakim.se/scroll-effects/
https://codepen.io/Jkidd/pen/qYxKgG

All site effects implemented natively in local CSS/JS, no copying external demos or requiring a CDN.
