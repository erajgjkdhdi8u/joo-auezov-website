# JOO Signature Intro / V27 Premium Motion

- Home page only: `index.html`
- New tab session: 3-second gold/navy cinematic logo sequence with a door-split reveal of the existing homepage.
- Skip anytime using the «ӨТКІЗУ» button or `Escape`.
- Does not replay on internal navigation or reload in the same tab session.
- Test again deliberately using `index.html?intro=replay`.
- Automatically disabled for `prefers-reduced-motion: reduce`.
- Does not add custom cursor, blur the site photographs, or change the original design, navigation or page structure.

Files added: `signature-intro.css`, `signature-intro.js`; `index.html` is the only original file modified.

## Reload behavior fixed

The intro now plays whenever the homepage loads or refreshes. The old sessionStorage seen-flag has been removed. For a quick bypass use `index.html?intro=off` or click **ӨТКІЗУ**. The effect is disabled for users requesting reduced motion. Cross-page transitions are intentionally **not yet installed** until the transition style is selected.
