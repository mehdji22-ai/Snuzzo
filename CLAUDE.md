# Notes for Claude

This repo is the Shopify Online Store 2.0 theme for **Snuzzo** (plush animal onesies for babies).
It is connected to Shopify through the Shopify GitHub integration on branch `main`, so a push to
`main` updates the connected theme. The owner is a beginner: explain in plain words, no jargon.

- Design: look "A" chosen by the owner (Nov 2026), structure inspired by coterie.com: light, airy, rounded cards,
  pill buttons in Snuzzo brown `#3C2820`, cream/pastel panels, one font (Instrument Sans, self-hosted).
  Copy is original Snuzzo text written on that model (short benefit headline + 1-2 sentences, calm tone).
  Never copy another site's text, photos or logos. Older brief: `docs/handoff/` (superseded look).
- Styles: `assets/snuzzo.css`. Scripts: `assets/snuzzo.js` (no frameworks).
- Font is self-hosted in `assets/instrument-sans.woff2` — don't add Google Fonts links.
- Demo photos `assets/demo-*.webp` are fallbacks used until real images are picked in the editor.
- Shopify's theme editor also commits to `main` (settings JSON in `templates/*.json`, `config/settings_data.json`,
  `sections/*-group.json`). Always pull before editing so you don't overwrite the owner's changes.
- Before pushing, run Shopify Theme Check (`@shopify/theme-check-node`) and keep it at 0 errors.
- Products, collections, blog articles and menus are store data, not theme files: they can't be changed
  through this repo. They need the Shopify Admin API for the Snuzzo store (see README / owner's setup).
- **Never** touch the FUTBOLMAX store or its Shopify connector — it's a different business, used by other agents.
- Customer reviews live in the store's Firebase Realtime Database (`snuzzo_reviews/<productId>`), shown by
  `sections/product-reviews.liquid` + `assets/snuzzo-reviews.js`. Star ratings on cards read Shopify's
  standard `reviews.rating` / `reviews.rating_count` metafields. Never add invented reviews, ratings or
  testimonials — only real customer content.
- Theme text is translated in `locales/` (en, fr, es, de, it, ja). Add new keys to every file.
- **Store data (products, articles, menus):** use `tools/shopify-gql.sh <query.graphql> [vars.json]`. It calls the
  Snuzzo store's Admin GraphQL API (`ugdyvb-hx.myshopify.com`) via the "Claude Snuzzo" Dev Dashboard app: the
  session proxy injects the app's Client ID/secret, the script exchanges them for a 24h token (cached in
  `~/.cache`, never committed). Needs the "snuzzo" cloud environment. Always confirm with the owner before
  changing live store data (prices, products, publishing).
- Grouped products (drafts until launch): The Animal Onesies (default product template), The Christmas Onesies
  (`product.christmas`), The Baby Snowsuit (`product.snowsuit`). The old one-per-animal products stay live until launch.
- Live theme (Nov 16, 2026): "Horizon + Bundles" (copy of the old Horizon theme, not in this repo). Its CalmBuds
  template (`templates/product.the-snuzzo-calmbuds.json`) has the Black Friday pack selector block (live Nov 16, 2026; banner hides itself after Nov 30) from
  `tools/bundles/calmbuds-pack-selector.liquid`, backed by 3 automatic discounts "CalmBuds Duo/Family Pack/Big Happy
  Family" (16.6556% / 33.3222% / 36.6539% off at 2/3/4+). Change prices in both places together.
  The new Snuzzo theme from this repo is unpublished (relaunch pending).
- Shipping (Nov 16, 2026, Black Friday): FREE shipping on every order. One "General profile" (all variants),
  6 zones / 237 countries, all 6 markets active, each zone has a single "Free Shipping" $0 rate (no minimum).
  Site texts say "Black Friday: free shipping on every order". If a threshold comes back: add rates per zone and
  set `window.SNZ_SHIP_USD` (announcement bar script in the live theme's `sections/header-group.json`, currently 0)
  and put `<span data-snz-ship>` amounts back in the texts.
