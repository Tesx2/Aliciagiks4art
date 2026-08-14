# better-colors

Color system notes and theme toggle:

- Core colors anchored to provided variables `--bg-primary`, `--bg-dark`, `--accent-pink`, `--accent-lilac`.
- Added a light theme variant via `[data-theme="light"]` CSS selector with adjusted variables.
- Consider generating OKLCH-balanced variants when building a production palette generator. This sample uses fixed swaps for clarity.

Files updated: `styles.css`, `script.js`.
