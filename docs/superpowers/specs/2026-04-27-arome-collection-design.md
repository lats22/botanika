# Botanika Arôme Collection - Design Spec

**Date:** 2026-04-27
**Status:** Approved
**Project:** Botanika Massage Website

---

## Overview

Update the existing Products Section to showcase the Botanika Arôme Collection body scrub products with proper branding, descriptions, and branch availability.

---

## Header Navigation

Add new nav item:
- **Label:** Arôme Collection
- **Section ID:** `#products` (or `#arome-collection`)
- **Position:** After "Locations"
- **Translation keys:** Add to EN/TH language files

---

## Section Design

### Title
- **Main:** Botanika Arôme Collection
- **Subtitle:** Body Scrub Cream · Natural Intensive Moisturizing

### Carousel Cards (Before Click)
Each card displays:
- Product image
- Product name
- Short tagline

| Product | Tagline |
|---------|---------|
| Jasmine Rice | Brightens & Moisturizes |
| Rose | Hydrates & Tones |
| Tamarind | Exfoliates & Glows |
| Turmeric | Heals & Rejuvenates |

### Carousel Features
- Auto-scroll
- Floating effect on images
- Same-size cards
- Mobile responsive

---

## Lightbox (On Click)

When user clicks a product card, lightbox opens with:

1. **Large product image**
2. **Product name**
3. **Full description & skin benefits**
4. **"Available at all branches" badge**

### Product Descriptions

#### Jasmine Rice Body Scrub Cream
Enriched with Thai jasmine rice extract, known for centuries in Asian beauty rituals.

**Skin Benefits:**
- Brightens skin tone
- Deeply moisturizes
- Softens rough skin
- Rich in vitamins B & E

#### Rose Body Scrub Cream
Infused with natural rose essence for a luxurious aromatic experience.

**Skin Benefits:**
- Hydrates and tones skin
- Reduces redness
- Anti-aging properties
- Leaves skin silky smooth

#### Tamarind Body Scrub Cream
Contains tamarind extract, a traditional Thai ingredient for radiant skin.

**Skin Benefits:**
- Natural AHA for gentle exfoliation
- Evens skin tone
- Removes dead skin cells
- Adds natural glow

#### Turmeric Body Scrub Cream
Blended with turmeric known for its healing properties in Ayurvedic tradition.

**Skin Benefits:**
- Anti-inflammatory
- Reduces dark spots
- Fights signs of aging
- Gives healthy golden glow

---

## Availability

**All products available at all 5 branches:**
- Decho
- Silom
- Silom 13
- Sala Daeng
- Patpong

---

## Product Images

Location: `/images/products/`
- `jasmine-rice.jpg`
- `rose.jpg`
- `tamarind.jpg`
- `turmeric.jpg`

---

## Technical Notes

- Section ID: `products` or `arome-collection`
- Reuse existing `Lightbox.jsx` component if compatible
- Add translations for EN/TH
- Ensure mobile responsive (no horizontal scroll)
