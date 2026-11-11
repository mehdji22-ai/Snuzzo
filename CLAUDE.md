# Notes for Claude

This repo is the Shopify Online Store 2.0 theme for **Snuzzo** (plush animal onesies for babies).
It is connected to Shopify through the Shopify GitHub integration on branch `main`, so a push to
`main` updates the connected theme. The owner is a beginner: explain in plain words, no jargon.

- Design source of truth: `docs/handoff/HANDOFF.md` and the comps in `docs/handoff/design/`.
  Square corners, one accent (yellow), Anton (display, caps) + Nunito Sans only, ink `#1E1611`.
- Styles: `assets/snuzzo.css`. Scripts: `assets/snuzzo.js` (no frameworks).
- Fonts are self-hosted in `assets/` — don't add Google Fonts links.
- Demo photos `assets/demo-*.webp` are fallbacks used until real images are picked in the editor.
- Shopify's theme editor also commits to `main` (settings JSON in `templates/*.json`, `config/settings_data.json`,
  `sections/*-group.json`). Always pull before editing so you don't overwrite the owner's changes.
- Before pushing, run Shopify Theme Check (`@shopify/theme-check-node`) and keep it at 0 errors.
- Products, collections, blog articles and menus are store data, not theme files: they can't be changed
  through this repo. They need the Shopify Admin API for the Snuzzo store (see README / owner's setup).
- **Never** touch the FUTBOLMAX store or its Shopify connector — it's a different business, used by other agents.
