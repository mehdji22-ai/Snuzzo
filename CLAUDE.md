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
- LIVE THEME on Nov 20, 2026: "Thème brun Matisse". - LIVE THEME CHANGED (Nov 19, 2026): "Snuzzo (prochaine version 2)" (gid 190213751075) was published, then "Snuzzo (prochaine version 4)"
  (Nov 19 evening), then "version 5". New theme copies keep appearing: always read the MAIN theme before editing.
  Black Friday bar is now compact (one line, black + coral #FF5A36); bf_end = Nov 28 midnight NY. The pack selector block also
  holds mobile layout CSS for this page (4:3 photo, dots instead of thumbnails, tighter spacing), hides the sticky bar on the
  first screen, and picking an animal switches the gallery photo to that animal. Always check
  `themes(roles: MAIN)` before editing: earlier notes below were written for "Horizon + Bundles" (190100209955, now unpublished).
  On the live theme's CalmBuds template: video stories block `snuzzo_videos` (from `tools/videos/calmbuds-video-stories.liquid`,
  6 videos from Shopify Files) right after `snuzzo_bundles`; upsell "You might also like" (custom_liquid_wRxKbV) and the old
  video gallery (custom_liquid_zCe7Kr) are disabled.
  Same template (Nov 19): "Why parents choose CalmBuds" (custom_liquid_nGdyjV, `tools/calmbuds-page/why-parents-choose.liquid`,
  new mom + fox photo, rating read from the reviews metafields like the top stars), FAQ (custom_liquid_6jYqpU,
  `tools/calmbuds-page/faq.liquid`), "The story behind each onesie" (custom_liquid_b4FMLH) disabled.
  CalmBuds rating metafield is currently 4.7 (changed outside this session), count 172.
  Comparison table after the FAQ (custom_liquid_htCcQq, `tools/calmbuds-page/comparison-table.liquid`): CalmBuds vs
  Earbuds vs Headphones, only true rows. CalmBuds now has 12 animals (Nov 19 added Monster, Puppy, Koala, $29.99 / $49.99,
  CONTINUE). Pack discounts target the whole product, so new variants are included automatically.
- Previous live theme (Nov 16, 2026): "Horizon + Bundles" (copy of the old Horizon theme, not in this repo). Its CalmBuds
  template (`templates/product.the-snuzzo-calmbuds.json`) has the Black Friday pack selector block (live Nov 16, 2026; countdown ends Nov 18 midnight New York time, then the banner hides itself) from
  `tools/bundles/calmbuds-pack-selector.liquid`, backed by 3 automatic discounts "CalmBuds Duo/Family Pack/Big Happy
  Family" (16.6556% / 33.3222% / 36.6539% off at 2/3/4+). Change prices in both places together.
  The new Snuzzo theme from this repo is unpublished (relaunch pending).
  Country/currency card (Nov 17, 2026): live theme footer-group custom_liquid_EDXeTC = `tools/popups/country-card.liquid`
  (old full pop-up kept in `tools/popups/country-picker-old.liquid`). Small bottom card, once per visit, after page load;
  uses /browsing_context_suggestions.json to detect the real country. AUTO-FIX (Nov 20): on the first page of each visit,
  if a link forced another country/currency (YouTube adds ?country=XX, which Shopify keeps for the whole visit), the
  page reloads once with `?country=<real country>` (NOT ?currency=, which picks the first country using that currency,
  e.g. EUR -> Andorra). Manual choice in the card uses the same ?country= reload.
  Nov 20: the card itself is TURNED OFF at the owner's request (SHOW_CARD = false in the script); only the auto-fix runs.
  Cart photos (live `sections/main-cart.liquid` + `snippets/cart-products.liquid`): whole photo in a white square, never cropped.
  CalmBuds reviews (real, confirmed by owner Nov 17, 2026): 172 reviews, 4.8/5, stored in the product's standard
  `reviews.rating` / `reviews.rating_count` metafields. Collection cards and the product page rating block both read them.
- Shipping (Nov 16, 2026, Black Friday): FREE shipping on every order. One "General profile" (all variants),
  6 zones / 237 countries, all 6 markets active, each zone has a single "Free Shipping" $0 rate (no minimum).
  Site texts say "Black Friday: free shipping on every order". If a threshold comes back: add rates per zone and
  set `window.SNZ_SHIP_USD` (announcement bar script in the live theme's `sections/header-group.json`, currently 0)
  and put `<span data-snz-ship>` amounts back in the texts.
