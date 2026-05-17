# Nail Studio Promotion Section - Design Spec

**Date:** 2026-05-17
**Status:** Draft (planning only — LOCAL THIS SESSION; no GitHub, no VPS)
**Project:** Botanika Massage Website
**Pattern reference:** `docs/superpowers/specs/2026-04-27-arome-collection-design.md`

---

## 1. Overview

Add a new "Nail Studio" promotion section to the homepage showcasing Botanika's 4 nail-care categories. Follows the Arôme Collection pattern (carousel + lightbox + nav link + WhatsApp CTA). No prices. No "Super Promo" / combo callouts. 6 languages.

---

## 2. Section Placement

Section order on `Home.jsx` (top to bottom):

| # | Section | id | Notes |
|---|---------|----|----|
| 1 | Hero | — | unchanged |
| 2 | Services | `services` | unchanged |
| 3 | Packages | `packages` | unchanged |
| 4 | Arôme Collection (products) | `products` | unchanged |
| 5 | **Nail Studio (NEW)** | `nails` | **insert here** |
| 6 | Testimonials | — | unchanged |
| 7 | Branches | `branches` | unchanged |
| 8 | Footer | — | unchanged |

Rationale: Arôme is the existing "retail/promotion" anchor; Nail Studio is the natural next promo block. Grouping both promos before testimonials keeps the marketing flow contiguous before social proof and "where to find us."

Header nav link inserted AFTER "Arôme Collection".

---

## 3. Component Structure

### Files to CREATE

| Path | Purpose |
|------|---------|
| `frontend/src/components/NailGallery.jsx` | Carousel of 4 category cards (clone ProductGallery.jsx, swap data) |
| `frontend/src/components/NailGallery.css` | Styles (clone ProductGallery.css; tweak palette to nail/pastel tones) |
| `frontend/public/images/nails/manicure-pedicure.jpg` | Category 1 image (cropped) |
| `frontend/public/images/nails/gel-polish.jpg` | Category 2 image (cropped) |
| `frontend/public/images/nails/nail-extensions.jpg` | Category 3 image (cropped) |
| `frontend/public/images/nails/nail-art.jpg` | Category 4 image (cropped) |

### Files to MODIFY

| Path | Change |
|------|--------|
| `frontend/src/pages/Home.jsx` | Import `NailGallery`; add `<section id="nails">` between Arôme and Testimonials |
| `frontend/src/pages/Home.css` | Add `.section--nails` styling (mirror `.section--arome`) |
| `frontend/src/components/Header.jsx` | Add nav button: `scrollToSection('nails')` after Arôme |
| `frontend/src/locales/en.json` | Add `nav.nailStudio` + full `nails.*` block |
| `frontend/src/locales/th.json` | Same |
| `frontend/src/locales/es.json` | Same |
| `frontend/src/locales/fr.json` | Same |
| `frontend/src/locales/ko.json` | Same |
| `frontend/src/locales/zh.json` | Same |

### Component data shape (inside NailGallery.jsx)

```js
const categories = [
  { id: 'manicurePedicure', image: '/images/nails/manicure-pedicure.jpg', accentColor: '#F4E6DA' },
  { id: 'gelPolish',        image: '/images/nails/gel-polish.jpg',        accentColor: '#F8E1E4' },
  { id: 'nailExtensions',   image: '/images/nails/nail-extensions.jpg',   accentColor: '#E3E8EE' },
  { id: 'nailArt',          image: '/images/nails/nail-art.jpg',          accentColor: '#F5DDEB' },
]
```

Lightbox shows: category name, one-line description, bulleted service list (translation key `nails.<id>.services` returnObjects array). NO prices. "Available at all branches" badge reused.

---

## 4. Image Plan (Crop From Flyers)

### Source flyers (in `C:\Users\LENOVO.LENOVO\AI\botanika\Nails\`)

| File | Approx. size | Content |
|------|-------------|---------|
| `20260428_034138000_iOS.jpg` | 277 KB | Full-text price sheet — **NOT USED** (no usable photos) |
| `20260428_034138000_iOS 1.jpg` | 149 KB | NAIL MENU: manicure, pedicure, baby-foot-scrub photos |
| `20260428_034138000_iOS 2.jpg` | 149 KB | **Duplicate of above** — NOT USED |
| `20260428_034139000_iOS.jpg` | 157 KB | GEL POLISH: hand-gel, foot-gel, package combos |
| `20260428_034139000_iOS 1.jpg` | 146 KB | NAIL EXTENSION MENU: nail polish, base filling, take-off hand, take-off foot |
| `20260428_034140000_iOS.jpg` | 127 KB | NAILS ART & EXTRA: multi-color, gel art, French tip |

### Crop targets

All sources are ~1140 wide × ~1612 tall (estimate; Simon must confirm with `identify` before cropping). Coordinates below are PROPORTIONAL (% of source width × source height) — Simon must convert to absolute pixels after running `identify`. Output is 800×800 px square JPG, ~85% quality, RGB.

| Output filename | Source flyer | Region to crop (approx., % of WxH) | What it shows |
|---|---|---|---|
| `manicure-pedicure.jpg` | `20260428_034138000_iOS 1.jpg` | x:5%–45%, y:18%–37% | The top "Manicure (No color)" hand close-up (cuticle clipper on natural nails) |
| `gel-polish.jpg` | `20260428_034139000_iOS.jpg` | x:8%–46%, y:8%–28% | The hand wearing nude gel polish on the natural background |
| `nail-extensions.jpg` | `20260428_034139000_iOS 1.jpg` | x:5%–45%, y:8%–28% | The "Nail polish" black-gloved hand applying gel — most premium-looking extension shot |
| `nail-art.jpg` | `20260428_034140000_iOS.jpg` | x:5%–45%, y:5%–28% | Multi-color rainbow gel polish on pink backdrop (most colorful, best representative for "art") |

**Crop rules (apply to ALL):**
- Exclude all price chips ("400 THB", "550 THB", crossed-out prices)
- Exclude "Super Promo" sticker, leaves/branding decorations
- Exclude any text labels ("Manicure", "Gel Polish", etc.)
- Tight to the hand/foot subject; aspect-ratio square
- Match Arôme's visual treatment: clean, soft-edged

### Recommended tool: ImageMagick

Install once on Windows: `winget install ImageMagick.ImageMagick` (Simon should verify; if unavailable, fall back to `sharp` via a tiny Node script).

**Step 1 — get exact source dimensions (run for each unique source):**
```bash
magick identify "C:\Users\LENOVO.LENOVO\AI\botanika\Nails\20260428_034138000_iOS 1.jpg"
```

**Step 2 — crop & resize (template; Simon plugs in absolute pixel offsets):**
```bash
magick "C:\Users\LENOVO.LENOVO\AI\botanika\Nails\20260428_034138000_iOS 1.jpg" ^
  -crop 460x460+60+290 +repage ^
  -resize 800x800^ -gravity center -extent 800x800 ^
  -quality 85 -strip -interlace Plane ^
  "C:\Users\LENOVO.LENOVO\AI\botanika\frontend\public\images\nails\manicure-pedicure.jpg"
```

(Use `^` for Windows cmd / `\` for bash. Repeat per category. Simon: verify each output visually before committing to disk — any visible price chip = re-crop.)

---

## 5. Translations

### New keys

#### `nav.nailStudio` (top-level nav label)

| Lang | Value |
|------|-------|
| en   | Nail Studio |
| th   | เนลสตูดิโอ |
| es   | Estudio de Uñas |
| fr   | Studio Ongles |
| ko   | 네일 스튜디오 |
| zh   | 美甲工作室 |

#### `nails.title` (section title)

| Lang | Value |
|------|-------|
| en   | Botanika Nail Studio |
| th   | บูทานิก้า เนลสตูดิโอ |
| es   | Botanika Estudio de Uñas |
| fr   | Botanika Studio Ongles |
| ko   | 보타니카 네일 스튜디오 |
| zh   | Botanika 美甲工作室 |

#### `nails.subtitle`

| Lang | Value |
|------|-------|
| en   | Manicure · Pedicure · Gel · Extensions · Art |
| th   | ทำเล็บมือ · ทำเล็บเท้า · เจล · ต่อเล็บ · เพ้นท์เล็บ |
| es   | Manicura · Pedicura · Gel · Extensiones · Arte |
| fr   | Manucure · Pédicure · Gel · Extensions · Art |
| ko   | 매니큐어 · 페디큐어 · 젤 · 익스텐션 · 아트 |
| zh   | 美甲 · 修足 · 凝胶 · 延长 · 美甲艺术 |

#### `nails.availableAtAllBranches` — reuse same string as products section per language

### Category names (4 categories × 6 languages)

| id | en | th | es | fr | ko | zh |
|---|---|---|---|---|---|---|
| manicurePedicure | Manicure & Pedicure Care | ดูแลเล็บมือและเล็บเท้า | Cuidado de Manicura y Pedicura | Soins Manucure & Pédicure | 매니큐어 & 페디큐어 케어 | 美甲与修足护理 |
| gelPolish | Gel Polish | ทาสีเจล | Esmalte en Gel | Vernis Gel | 젤 폴리시 | 凝胶指甲油 |
| nailExtensions | Nail Extensions | ต่อเล็บ | Extensiones de Uñas | Extensions d'Ongles | 네일 익스텐션 | 美甲延长 |
| nailArt | Nail Art & Techniques | เพ้นท์เล็บและเทคนิคพิเศษ | Arte y Técnicas de Uñas | Nail Art & Techniques | 네일 아트 & 테크닉 | 美甲艺术与技法 |

### One-line descriptions (lightbox)

| id | en |
|---|---|
| manicurePedicure | Classic hand & foot care — cuticle trim, scrub, mask, cream, and Spa QTICA & Footlogix treatments. |
| gelPolish | Long-lasting gel color for hands, feet, or both — choose individual application or full sets. |
| nailExtensions | Build, lengthen, and refine — softgel, acrylic/polygel, PVC, fills, coatings, and safe removal. |
| nailArt | Cat-eye, aurora/mirror, French, ombre, marble, gel art and French tip — bring your nails to life. |

(Same descriptions translated for th/es/fr/ko/zh — Simon translates following Arôme tone; PM will spot-check.)

### Service bullet lists (lightbox; arrays returned via `returnObjects: true`)

**`nails.manicurePedicure.services` (EN):**
- Basic Manicure
- Pedicure
- Baby Foot Scrub
- Spa QTICA (Manicure / Pedicure / Set)
- Spa Footlogix

**`nails.gelPolish.services` (EN):**
- Gel polish — Hand
- Gel polish — Foot
- Manicure + Gel polish (hand)
- Pedicure + Gel polish (foot)
- Gel polish — Hand + Foot

**`nails.nailExtensions.services` (EN):**
- Softgel Tip
- Softgel Gel
- Acrylic / Polygel
- PVC
- Nail filling
- Nail coating
- Extension removal / take-off

**`nails.nailArt.services` (EN):**
- Cat-eye
- Aurora / Mirror
- French
- Ombre
- Marble
- Gel Art
- French Tip Color
- Extra gel colors

(Translate the entries into th/es/fr/ko/zh; keep technique proper names as-is where industry-standard, e.g. "French", "Ombre", "Cat-eye".)

---

## 6. Subtask Breakdown — Frontend-Simon

Numbered steps to execute in order. Simon MUST invoke `frontend-design:frontend-design` skill before writing UI code.

1. **Prepare image directory:** Create `frontend/public/images/nails/`.
2. **Identify source dimensions:** Run `magick identify` on the 4 unique source flyers (NOT the duplicate `iOS 2.jpg`); record actual pixel WxH.
3. **Crop & resize 4 images** using `magick` per section 4 table; convert proportional % to absolute pixels; output 800×800 JPGs. Visually inspect each output — re-crop if any price chip / "Super Promo" sticker / text label is visible. Re-test if hand/foot subject is off-center.
4. **Clone ProductGallery → NailGallery:** Copy `ProductGallery.jsx` + `.css` to `NailGallery.jsx` + `.css`. Replace `products` array with `categories` array per section 3. Replace `product`/`products` identifiers with `category`/`categories` (rename consistently). Update translation key roots from `products.*` to `nails.*`.
5. **Lightbox tweaks:** In NailGallery's `<ProductLightbox>` clone, change the "benefits" section to "services" (rename CSS classes too, e.g. `__benefits` → `__services`). Reuse `availableAtAllBranches` badge as-is.
6. **Add to Home.jsx:** Import `NailGallery`. Insert new `<section id="nails" className="section section--nails">` between the Arôme `<section id="products">` and the Testimonials section.
7. **Home.css:** Add `.section--nails` class with subtle background tint (recommend: very light pastel pink `#FDF6F8`, different enough from Arôme's tone to feel distinct but in family).
8. **Header.jsx:** Add nav button `scrollToSection('nails')` between the Arôme button and the closing `</nav>`.
9. **i18n:** Add `nav.nailStudio` and full `nails.*` block to all 6 locale files (en, th, es, fr, ko, zh). Follow Arôme's schema exactly.
10. **Local sanity check:** Run `docker compose up -d --build frontend` on port 3002; verify section renders, lightbox opens, all 4 categories show, no missing images, no console errors.
11. **Report to PM-Fred** with: file diff list, screenshot of section on desktop + mobile, list of any open issues. STOP — do NOT commit, do NOT push, do NOT touch VPS.

---

## 7. Reviewer-Ben Checklist (this section)

| # | Check | Pass criteria |
|---|---|---|
| 1 | Pattern consistency | NailGallery mirrors ProductGallery structure (state, refs, auto-scroll, lightbox portal) |
| 2 | No price leakage | Search codebase for `THB`, `บาท`, `price`, currency chars — must return ZERO hits in nail files |
| 3 | No "Super Promo" / combo callout | Search for "promo", "combo", "super" in nail files & translations — zero hits |
| 4 | i18n parity | All 6 locale files have identical key structure under `nails.*`; no missing keys; no untranslated EN strings in non-EN files |
| 5 | Image hygiene | All 4 nail JPGs ≤ 250 KB each; 800×800; visually clean (no chips/text bleed in crop) |
| 6 | A11y | Lightbox has `role="dialog"`, `aria-modal`, focus trap, ESC closes; cards keyboard-navigable; aria-labels translated |
| 7 | Mobile responsive | No horizontal scroll on 360 px viewport; touch targets ≥ 44 px; dots visible on mobile only (matches Arôme) |
| 8 | Dead code | No leftover `products` references in NailGallery; no commented-out imports |
| 9 | CSS scope | NailGallery CSS classes are uniquely prefixed (`nail-gallery__*`) — must not collide with `product-gallery__*` |
| 10 | Header | Nav link visible on desktop AND mobile menu; smooth-scrolls to `#nails`; label translates correctly per active language |

Report format: `| File | Issue | Line | Severity | Recommendation |`. If ANY issue: invoke `superpowers:systematic-debugging` per Ben template.

---

## 8. Tester-Clement Test Plan (LOCAL ONLY, port 3002)

Browser tool: `mcp__plugin_superpowers-chrome_chrome__use_browser`. Base URL: `http://localhost:3002`.

| # | Test | Expected | Actual | Status |
|---|------|----------|--------|--------|
| 1 | Load homepage | 200, no console errors | | |
| 2 | Scroll to `#nails` section | Section visible with title "Botanika Nail Studio" | | |
| 3 | Carousel shows 4 cards | manicure-pedicure / gel-polish / nail-extensions / nail-art | | |
| 4 | Auto-scroll advances every ~4 s | Active index changes | | |
| 5 | Click card → lightbox opens | Dialog appears with name + description + services list + badge | | |
| 6 | Lightbox: ESC closes | Lightbox closes, focus returns | | |
| 7 | Lightbox: click backdrop closes | Closes | | |
| 8 | Lightbox: click image zooms | Full-screen zoom overlay | | |
| 9 | Header nav "Nail Studio" link smooth-scrolls to section | Scrolls to `#nails` | | |
| 10 | Switch language → EN | All nail text in English | | |
| 11 | Switch language → TH | All nail text in Thai | | |
| 12 | Switch language → ES | All nail text in Spanish | | |
| 13 | Switch language → FR | All nail text in French | | |
| 14 | Switch language → KO | All nail text in Korean | | |
| 15 | Switch language → ZH | All nail text in Chinese | | |
| 16 | NO prices anywhere | grep visible page text — no "THB", no "บาท", no "$", no "€" | | |
| 17 | NO "Super Promo" / combo callout | grep — no "Promo", "Combo", "Super" | | |
| 18 | Mobile viewport 360 px | No horizontal scroll, cards swipeable, dots visible | | |
| 19 | Mobile menu shows nav link | "Nail Studio" appears in burger menu | | |
| 20 | All 4 nail images load (200) | DevTools network — no 404s | | |

If ANY test fails: invoke `superpowers:systematic-debugging` per Clement template. Report table back to PM.

---

## 8b. Pre-Docker Check Gate (per project memory `feedback_ben_pre_docker_check.md`)

Order of operations:

```
Simon implements (steps 1–9, NO docker yet)
        ↓
Reviewer-Ben R0 (gate: code-only review BEFORE Docker stand-up)
        ↓ (pass)
Simon: docker compose up -d --build frontend (step 10)
        ↓
Tester-Clement (section 8 test plan)
        ↓
Reviewer-Ben R1 (final post-test review)
        ↓
PM-Fred reports back to user
```

Per memory `feedback_ben_clement_before_commit.md`: Ben R1 + Clement complete BEFORE any commit decision (not applicable this session — no commit anyway).

Per memory `feedback_never_mention_vps.md` is botanika-irrelevant (TechCart-specific), but per task brief: **NO GitHub, NO VPS this session.**

---

## OPEN QUESTIONS

1. The full-text price-sheet flyer (`20260428_034138000_iOS.jpg`) is unused — it's text-only with no usable photos and contains prices. (recommend: leave on disk untouched, no action needed)
2. Section background color tint — Arôme uses a warm cream. (recommend: very light pastel pink `#FDF6F8` for Nail Studio to feel distinct but in-family; Simon can adjust during frontend-design skill exploration)
3. The "extra gel colors" item in Nail Art has no exact source line — implied from "Nail Polish Gel Color (More Than 1 Color)". (recommend: include as "Extra gel colors" — accurate to flyer intent without leaking the per-color upcharge)
