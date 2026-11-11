# Snuzzo — "Pick Your Animal" Shopify theme

This repository **is** the Snuzzo website design (a Shopify Online Store 2.0 theme).
Shopify reads it directly from GitHub: when a change lands on the `main` branch, the
connected theme in Shopify updates by itself within a minute or so.

## Connect it to Shopify (one time)

1. In Shopify admin, open **Online Store → Themes**.
2. Click the **⋯** next to your current live theme and choose **Duplicate** (a backup, just in case).
3. Click **Add theme → Connect from GitHub**.
4. Log in to GitHub and allow Shopify to see the `snuzzo` repository.
5. Pick repository **snuzzo**, branch **main**, and click **Connect**.
6. The theme appears under *Theme library* as **unpublished**. Click **Preview** to look at it.
7. When you're happy, click **Publish**.

From then on it syncs both ways:
- Changes Claude pushes to `main` show up in the Shopify theme.
- Changes you make in Shopify's theme editor (**Customize**) are committed back to GitHub.

## Set up your store data so the design fills in

The theme shows demo photos until you choose real ones. To make it use your real products:

| What | Where |
|---|---|
| Animal collection | Create a collection (e.g. **Animal onesies**, handle `animal-onesies`) with every animal onesie in it. Then in **Customize → Home page → Animal picker**, choose it. Do the same in **Product page → 'Animals' grid collection**. |
| Main menu | **Online Store → Navigation → Main menu**: Onesies · Snowsuits · Hoodies · Bath & sleep · Gifts |
| Footer menu | **Navigation → Footer menu**: Size guide · Shipping · Returns · Contact |
| Tabs on the home page | **Customize → Home page → Tabbed product rail**: pick a collection for each tab |
| Photos | **Customize**: click any section and choose an image |
| Social links | **Customize → Theme settings → Social media** |
| Proof numbers (rating, 450K) | **Customize → Theme settings → Store details** and the **Social band** section. Use only real numbers. |

### Optional product fields (metafields)

In **Settings → Custom data → Products** you can add these, and the theme uses them automatically:

| Name | Key | Type | Used for |
|---|---|---|---|
| Animal name | `custom.animal_name` | Single line text | "Panda" on chips and "ADD THE PANDA →" |
| Benefits | `custom.benefits` | Single line text (list) | The 3 square bullets in the animal picker |
| One-liner | `custom.one_liner` | Single line text | Line under the product name |
| Card label | `custom.card_label` | Single line text | Small grey category under the card |
| Swatch | `custom.swatch` | File (image) | Thumbnail in the animal chips and the Animals grid |
| Fabric & care | `custom.fabric_care` | Rich text | "Fabric and care" accordion |

## What's in here

```
layout/      page frame (fonts, header, footer)
sections/    each block of the page you can move around in the theme editor
snippets/    small reusable pieces (product card, icons…)
templates/   which sections appear on which page
assets/      CSS, JavaScript, fonts and demo photos
config/      theme settings
locales/     all button and label text
docs/handoff the original design brief and mockups
```
