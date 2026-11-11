# Theme B "Pick Your Animal": design handoff

This folder hands over a finished e-commerce design direction so another person, working with their own Claude, can keep designing and then build it as a Shopify theme.

It was designed for **Snuzzo** (littlesnuzzo.com), a store that sells plush animal onesies for babies and toddlers, plus snowsuits, parent-and-baby carrier hoodies and a few bath and sleep accessories. If you're using it for a different store, read **Section 8: Make it yours** first.

---

## 1. How to use this folder

**For the person receiving it:**
1. Unzip the folder.
2. Open the files in `design/` in a web browser to see the pages.
3. Start a new conversation with Claude. Claude Code is best if you want it to build the Shopify theme; claude.ai also works for design work.
4. Upload this whole folder, or the zip, to the conversation.
5. Paste the **starter prompt** below.

### Starter prompt (copy and paste)

> I'm attaching a design handoff for a Shopify store theme called "Pick Your Animal" (Theme B). Read `HANDOFF.md` fully first, then open the four HTML files in `design/` to see the layouts.
>
> My store is: [your store name, what you sell, and your website].
>
> First, tell me in a short list what needs to change for my store (logo, products, colours, copy, photos) using Section 8 of the handoff. Then ask me any questions you need answered. Do not start building until I confirm.
>
> When we build, make it a Shopify Online Store 2.0 theme, following Section 9 of the handoff, kept in a GitHub repository so I can connect it to Shopify as an unpublished theme.

---

## 2. What's in this folder

| File | What it is |
|---|---|
| `HANDOFF.md` | This brief: the design system, page specs and build notes. The source of truth. |
| `design/01-homepage.html` | Desktop homepage design, 1440 px wide |
| `design/02-collection-page.html` | Desktop collection page ("Animal onesies"), 1440 px wide |
| `design/03-product-page.html` | Desktop product page ("The Little Monkey"), 1440 px wide |
| `design/04-style-sheet.html` | Colours, type, components and the reasoning behind them |
| `design/images/` | The photos used in the designs. These are Snuzzo's own product photos. |

The HTML files are **design comps**, not theme code. They're fixed-width desktop layouts with inline styles, built for looking at. The real theme must be rebuilt as responsive Shopify Liquid (see Section 9). Phone layouts haven't been designed yet; Section 7 has the rules for them.

---

## 3. The idea in one paragraph

**The animal is the product.** Shoppers aren't buying "a onesie"; they're choosing *the Panda* or *the Duck*. So choosing an animal is the homepage's main job, and it should take two taps on a phone. The look borrows from sportswear stores like adidas: a full-bleed photo hero with huge condensed capitals, square buttons with an arrow, swipeable product rails and loud colour blocks. It's softened for babies with warm brown-black instead of pure black and one cheerful yellow. It was chosen because most traffic was expected to come from Facebook, on phones, from parents ready to pick fast.

---

## 4. Design system

### 4.1 Colour

| Token | Hex | Used for | Contrast |
|---|---|---|---|
| `ink` | `#1E1611` | Text, top bar, primary buttons, footer, before/after band | 17.8:1 on white |
| `paper` | `#FFFFFF` | Page background; buttons placed on photos | n/a |
| `light` | `#F2F1ED` | Feature panel, image wells behind product photos, search field | Ink on it: 15.8:1 |
| `yellow` | `#FFD23F` | **The only accent:** selected state, drag handle, hover shadow, the big social-proof band, small badges | Ink on it: 12.3:1 |
| `mute` | `#5A514B` | Secondary text, category labels | 7.7:1 on white |
| `line` | `#E4E2DD` / `#D6D3CE` | Header divider / input and size-button borders | n/a |
| `on-ink` | `#D9D1CB` | Body text on the ink band | 11.8:1 on ink |

Rules:
- Brown-black and white do the structure. **Yellow is the only accent; don't add a second one.** The animals in the photos bring all the other colour.
- Every text and background pair above passes WCAG 2.1 AA.

### 4.2 Typography

Use only two families, both free on Google Fonts:
- **Anton**: display only, always UPPERCASE.
- **Nunito Sans**: everything else.

| Style | Font | Size / line height | Notes |
|---|---|---|---|
| Hero H1 | Anton | 132 / 0.9 (phone 68) | Caps |
| Section H2 | Anton | 64 / 0.95 (phone 44) | Caps |
| Feature name | Anton | 84 / 0.92 | e.g. "THE PANDA" |
| Card title on image | Anton | 44 / 0.9 | White, on a dark gradient |
| UI label / button | Nunito Sans 900 | 14, caps, tracking 0.06em | "ADD THE PANDA →" |
| Product name | Nunito Sans 800 | 15–16 | |
| Price | Nunito Sans 900 | 16–22 | On cards, show the price **before** the name, as adidas does |
| Body | Nunito Sans 400–600 | 16 / 1.5 | |

### 4.3 Shape, spacing, motion

- **Square corners everywhere** (radius 0). No soft cards, no drop shadows.
- Page side padding: 32 px on desktop, 16 px on phones. Vertical rhythm: about 72 px between sections on desktop, 48 px on phones.
- Lay groups out with flex or grid and `gap`.
- **Hover on buttons:** the button moves up-left by 2 px and gets a `4px 4px 0` yellow shadow.
- **Selected state:** a 3 px ink outline on the image plus a 3 px yellow underline under the label.
- **Motion budget:** button lift, instant swaps in the animal picker, and the before/after slider following the finger. Nothing else animates. Respect `prefers-reduced-motion`.

### 4.4 Components

| Component | Spec |
|---|---|
| Announcement bar | Ink, 36 px, caps 12 px, centred: "FREE SHIPPING WORLDWIDE · 30-DAY MONEY-BACK GUARANTEE" |
| Header | Logo left; nav centred (bold caps 14 px); search field in `light` plus a bag icon on the right; 1 px bottom border |
| Arrow button | Rectangle with label, a 22 px gap, then →. Variants: **white on photo**, **ink**, **ghost** (white outline) |
| Animal chip | 118 px square photo plus caps label. Selected: ink outline and yellow underline |
| Feature panel | Two columns on `light`: big photo / "ANIMAL 1 OF 10", Anton name, 3 square-bullet benefits, price, ink "ADD THE … →" button, small shipping line |
| Drop card | Tall photo with a bottom gradient and an Anton title on the image, then a bold caps title with price, one line of copy, and an underlined **SHOP NOW** |
| Tabbed rail | Caps tabs with a 4 px underline on the active tab; cards scroll sideways with scroll-snap |
| Product card | Image on `light` (4:5); white square heart button top-right; price, then name, then category |
| Promo tile in grid | A yellow tile placed inside the product grid with an Anton line and a link, e.g. to the before/after story |
| Before/after slider | Two stacked photos; the top one is clipped by a range input; yellow 3 px line and a yellow "← DRAG →" knob |
| Size buttons | 46 px tall, 1 px border, selected border is ink |
| Social band | Yellow background, "450K" in Anton at 180 px, a 3×2 photo grid |

---

## 5. Page specs

### 5.1 Homepage (`design/01-homepage.html`)

In order, with each section's job:

1. **Announcement bar:** shipping and returns, said once. Don't repeat "Free shipping" on every product card.
2. **Header:** Onesies · Snowsuits · Hoodies · Bath & sleep · Gifts.
3. **Hero:** full-bleed photo of three babies in different animals, which signals a range. A dark bottom gradient keeps white text readable. H1 "PICK YOUR ANIMAL." Subline: "Plush onesies with a padded hood and a chin-guard zip. Ten animals, one for every personality in the house." Three white arrow buttons: ONESIES → · SNOWSUITS → · GIFTS →.
4. **Animal picker, the core section:** heading "WHO ARE THEY TONIGHT?" and the rating on the right. A row of animal chips (Panda, Bunny, Duck, Lion, Penguin, Tiger, Monkey, Pig, Reindeer). Tapping one swaps the feature panel below **without leaving the page**, so it's one tap to choose and one to add.
5. **Winter drops:** four drop cards for the non-onesie products (Snowsuits $86, Carrier hoodies $71, Holiday onesies $57, CalmBuds $36), each with a story instead of a slot in a carousel.
6. **Tabbed product rail:** Best sellers · Winter · Bath & sleep · For two.
7. **Before/after, "THE HALF HOUR BEFORE BED.":** the same toddler on the same sofa, in pyjamas and then in the panda onesie, with a draggable slider. It's the most persuasive moment on the page.
8. **Three features:** CHIN-GUARD ZIP · PADDED 3D HOOD · SOFT AT WASH 100. Plain words; no "ours vs others" table.
9. **Social band:** "450K parents following along on Facebook" with real customer-style photos.
10. **Footer:** Shop · Help · Follow · Brand.

### 5.2 Collection page (`design/02-collection-page.html`)

- Breadcrumb ("← Back · Home / Onesies"), then an Anton H1 "ANIMAL ONESIES" with a small "[10]" count, then one line of copy.
- **Filter chips** (bordered boxes; the active one is filled ink): All animals · Christmas · Best sellers · Matching for two. On the right, a "FILTER & SORT" button.
- A 4-column grid of product cards, with a **yellow promo tile** placed in the grid.
- A progress line ("You've seen 7 of 10") and an ink "SHOW MORE →" button. Use this instead of numbered pages.

### 5.3 Product page (`design/03-product-page.html`)

- **Left:** a 2×2 gallery on `light`, where the last image can span both columns, with the breadcrumb overlaid top-left.
- **Right column, about 470 px:**
  1. Category line
  2. Yellow badge ("Ships free, worldwide")
  3. Rating
  4. Anton product name
  5. One-line description
  6. Price
  7. **"Animals" grid:** thumbnails of the other animals, where adidas shows colourways. Selected is underlined in ink.
  8. Size buttons with a size guide link
  9. Ink "ADD TO BAG →" and a square heart button
  10. Accordion: Why it's easier at 3 a.m. · Fabric and care · Shipping and 30-day returns
- **Below:** a tabbed "Complete the bedtime" row (bath visor, sleep headband, carrier hoodie, another animal).
- Recommended addition from a sibling concept: a **"Complete the bedtime set"** box (bath visor + onesie + headband, showing the plain sum of the three prices).

---

## 6. Copy voice

- Talk like a tired, funny parent, with specific moments rather than adjectives: "3 a.m. changes", "the hundredth wash", "bath, then panda, then lights low".
- Headlines are short, in caps, and phrased as an instruction or a question: "PICK YOUR ANIMAL.", "WHO ARE THEY TONIGHT?"
- Buttons say exactly what happens: "ADD THE PANDA →", not "Learn more".
- No invented statistics or reviews. Use only real numbers from the store.

---

## 7. Phone layout rules (not drawn yet; design these next)

- Hero: about 560 px tall; H1 at 68 px; the arrow buttons share one row and wrap if needed.
- Animal chips scroll sideways at 92 px each; the feature panel stacks with the photo on top.
- Drop cards and product rails become swipe rows showing about 75% of a card, so the next card peeks in.
- The before/after slider runs full width.
- Touch targets are at least 44 px. Keep the add-to-bag button visible on product pages; consider a sticky bottom bar.

---

## 8. Make it yours (if this isn't Snuzzo)

These parts are **Snuzzo-specific**. Replace them with your own:

| Item | In the designs | Replace with |
|---|---|---|
| Logo | Snuzzo brown wordmark | Your logo |
| Photos in `design/images/` | Snuzzo's product photos. **Reference only; don't publish them on another store.** | Your own product photography |
| Products and prices | Animal onesies $57, snowsuits $86, hoodies $71, CalmBuds $36, SplashShield $29 (CAD) | Your catalogue, pulled from Shopify |
| Proof numbers | 4.8/5 from 5,762 parents; 450K Facebook, 21K Instagram, 10K YouTube | Your real numbers, or remove them |
| Promises | Free shipping worldwide; 30-day money-back guarantee | Your real policies |
| Accent colour | Duck yellow `#FFD23F` | Can change; keep **one** accent and re-check contrast |
| "Pick your animal" concept | Works because each product is a character | If your products aren't characters, change "animal" to your main choice (colour, style, scent…) and keep the picker pattern |

If it *is* Snuzzo, these items are still unconfirmed:
- Prices for Panda, Bunny, Lion, Penguin, Tiger and Pig are **assumed** at $57, to match Duck and Monkey.
- Size buttons read "[size]" because the real size range wasn't known.
- Whether the "was $142 / was $100" sale prices are permanent. The design shows no strikethrough prices on purpose.
- Material claims: the old site said both "certified organic cotton" and "plush fleece". Confirm before putting either in copy.

---

## 9. Build notes for Shopify

**Theme type:** Shopify **Online Store 2.0**, with JSON templates and sections that the store owner can rearrange in the theme editor. Starting from Shopify's free **Dawn** theme or a clean skeleton theme is fine. Strip it back to this design system rather than layering it on top.

**Suggested sections** (each one editable in the theme editor):

| Section file | From |
|---|---|
| `announcement-bar.liquid` | 4.4 |
| `header.liquid` | 4.4 |
| `hero-campaign.liquid` (image, heading, up to 3 arrow buttons) | 5.1 #3 |
| `animal-picker.liquid` (products from a collection; tap swaps the feature panel; add to cart via the AJAX Cart API) | 5.1 #4 |
| `drop-cards.liquid` (blocks: image, overlay title, title, line, link) | 5.1 #5 |
| `product-tabs-rail.liquid` (each tab is a collection) | 5.1 #6 |
| `before-after.liquid` (two images, range input) | 5.1 #7 |
| `feature-trio.liquid` | 5.1 #8 |
| `social-band.liquid` | 5.1 #9 |
| `main-collection.liquid` with filter chips + promo tile block | 5.2 |
| `main-product.liquid` with "Animals" sibling grid + accordion | 5.3 |

**Data:**
- Put all animals in one collection, e.g. `animal-onesies`.
- Use a product **metafield** for the short animal name ("Panda") and, optionally, a swatch image.
- The "Animals" grid on product pages lists the other products in that collection.

**Delivery:**
- Keep the theme in a **GitHub repository**.
- In Shopify, go to **Online Store → Themes → Add theme → Connect from GitHub** and connect the repository as an **unpublished** theme.
- Preview it, then publish. Duplicate the current live theme first as a backup.

**Quality bar:**
- WCAG 2.1 AA, which the colours above already pass.
- Real `<button>` and `<a>` elements, with visible focus outlines.
- Alt text on every product image.
- Only the two font families.
- Lazy-load images below the fold.
- Keep third-party scripts to a minimum.
- Don't use a pop-up to choose the country. Show the currency in the header.
