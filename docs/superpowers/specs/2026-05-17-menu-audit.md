# Botanika Menu Audit — Flyer ↔ Website Gap Analysis

**Date:** 2026-05-17
**Auditor:** Tester-Clement (read-only)
**Local site:** http://localhost:3002 (HTTP 200 OK)
**Source of truth:** 12 client flyer JPGs in `C:\Users\LENOVO.LENOVO\AI\botanika\Menu\`
**Inventory source:** `frontend/src/data/{services,packages}.json`, `frontend/src/locales/en.json`, `frontend/src/pages/Home.jsx`, `frontend/src/components/{NailGallery,ProductGallery}.jsx`

> Prices intentionally excluded per audit instructions. "Promo / combo / super" wording excluded from recommendations.

---

## 1. Summary

| Metric | Count |
|--------|------:|
| Distinct services in flyers | 47 |
| Distinct items on website (services + packages + nail items + products) | 39 |
| Flyer items **missing** from site | 20 |
| Site items **not** in current flyer set | 1 |
| Items present on both but with **mismatched** wording | 4 |

**Headline finding:** Two entire flyer categories — **Waxing** (all 13 services) and **Facial Treatments** (2 standalone facials) — are not on the website at all. The nail menu, by contrast, is essentially complete and well-aligned with the flyers.

---

## 2. Phase A — Master service list from flyers

### Flyer-by-flyer inventory

| File | Category | Notes |
|------|----------|-------|
| 2fb309b0…JPG | Massage (page 1) | Foot Reflexology, Head/Shoulder/Back, Traditional Thai, Four Hands Aromatic Oil |
| e5a7ae19…JPG | Massage (page 2) | Oil Massage, Botanika Aroma Therapy, Sports/Deep Tissue, Organic Coconut Oil |
| f5e18cf5…JPG | Massage (page 3) | Warm Aromatic Oil, Botanika Aromatic Body Scrub, Aromatic Herbal Compress, Aromatic Hot Stone Massage Therapy |
| 29494cd1…JPG | Packages + Facial Treatment | 6 packages + 2 Facial Treatments |
| ca448824…JPG | Waxing | Facial waxing, Body, Arm, Legs, Bikini |
| d2ff0464…JPG | Nails (master price list) | Comprehensive nail / extension / art list |
| 1c316335…JPG | Nail Menu (basic) | Manicure, Pedicure, Baby Foot Scrub (+ promo combo, excluded) |
| 96b18528…JPG | Nails Art & Extra | Gel color add, Gel Art, French Tip |
| a271c0cb…JPG | Nail Extension Menu (built) | PVC, Acrylic, Poly Gel, Sofygel Tip |
| 5ae47a96…JPG | Nail Extension Menu (basic) | Nail polish, Nail base filling, Take-Off (Hand), Take-Off (Foot) |
| 774ddc7e…JPG | Nail Polish — Organic / O.P.I | Hand/Foot organic-OPI + Packages C/D/E |
| b2305a1d…JPG | Gel Polish | Gel polish Hand / Foot + Package E variants |

### Master list (deduplicated, grouped by category)

#### MASSAGE (12 services, all with 60 / 90 / 120 min)
1. Foot Reflexology
2. Head, Shoulder & Back Massage
3. Traditional Thai Massage
4. Four Hands Aromatic Oil Massage
5. Oil Massage
6. Botanika Aroma Therapy (100% Natural Essential Oil)
7. Sports Massage / Deep Tissue
8. Organic Coconut Oil Massage (Virgin Cold-Press)
9. Warm Aromatic Oil Massage
10. Botanika Aromatic Body Scrub
11. Aromatic Herbal Compress
12. Aromatic Hot Stone Massage Therapy

#### PACKAGES (6)
1. Tension Release (90 min)
2. Mini Beauty (90 min)
3. Athlete's Heaven (90 min)
4. Beauty Complete (180 min)
5. Completely Relax (120 min)
6. Oriental Delight (120 min)

#### FACIAL TREATMENTS (2 standalone, 60 min)
1. Uplifting Facial Treatment with Collagen Mask
2. Natural Purifying Facial Treatment (with Aloe Vera)

#### WAXING (13)
**Facial:** Eyebrow, Upper Lip
**Body:** Chest, Stomach, Navel, Full Back, Armpit
**Arm:** Full-Arm, Half-Arm
**Legs:** Full-Leg, Half-Leg
**Bikini:** Hollywood, Bikini Line, Brazillian

#### NAILS — Manicure & Pedicure Care (6)
1. Normal Organic Nail Polish
2. Basic Manicure (No Color)
3. Basic Pedicure without heel file (No Color)
4. Spa QTICA Manicure (Scrub, Mask, Cream)
5. Spa QTICA Pedicure (Scrub, Mask, Cream)
6. Set Spa QTICA (Manicure + Pedicure)
7. Spa Footlogix (Pedicure / cracked heel care)
8. Baby Foot Scrub

#### NAILS — Gel Polish (3)
1. Gel Polish — Hand
2. Gel Polish — Foot
3. Gel Polish — Hand + Foot (full set)

#### NAILS — Extensions (7)
1. PVC Extension
2. Acrylic Extension
3. Poly Gel Extension
4. Sofygel Tip Extension
5. Softgel Gel Extension
6. Nail base filling (fill-in)
7. Nail coating
8. Take Off / Removal (Hand & Foot)

#### NAILS — Art & Techniques (8)
1. Cat-eye gel polish
2. Aurora / Mirror gel polish
3. French gel polish
4. Ombre gel polish
5. Marble gel polish
6. Gel Art (add per finger)
7. French Tip Color
8. Nail Polish Gel Color — extra color add-on (per color)
9. Gel-Polish removal

#### ORGANIC / O.P.I COLOR (2)
1. Nail Polish Organic / O.P.I Color — Hand
2. Nail Polish Organic / O.P.I Color — Foot

---

## 3. Phase B — Inventory of what is on the website

Source files: `services.json` (12 items), `packages.json` (6 items), `en.json` `nails.*` (4 grouped categories) and `products.*` (4 Arôme Collection products), surfaced through `Home.jsx` sections `#services`, `#packages`, `#nails`, `#products`, plus branches/testimonials/footer.

### `#services` — Our Services (12 cards, services.json)
| ID | Site name | Durations |
|---:|-----------|-----------|
| 1 | Foot Reflexology | 60/90/120 |
| 2 | Head, Shoulder & Back Massage | 60/90/120 |
| 3 | Traditional Thai Massage | 60/90/120 |
| 4 | Four Hands Aromatic Oil Massage | 60/90/120 |
| 5 | Oil Massage | 60/90/120 |
| 6 | Botanika Aroma Therapy | 60/90/120 |
| 7 | Sports Massage / Deep Tissue | 60/90/120 |
| 8 | Organic Coconut Oil Massage | 60/90/120 |
| 9 | Warm Aromatic Oil Massage | 60/90/120 |
| 10 | Botanika Aromatic Body Scrub | 60/90/120 |
| 11 | Aromatic Herbal Compress | 60/90/120 |
| 12 | Aromatic Hot Stone Therapy | 60/90/120 |

### `#packages` — Special Packages (6 cards, packages.json)
1. Tension Release (90)
2. Mini Beauty (90)
3. Athlete's Heaven (90)
4. Beauty Complete (180) — **note:** "60 min Facial Treatment" appears only as a line-item inside this package, no standalone Facial service exists on site
5. Completely Relax (120)
6. Oriental Delight (120)

### `#nails` — Botanika Nail Studio (4 category cards, en.json `nails.*`)
- **Manicure & Pedicure Care** → lists: Basic Manicure, Pedicure, Baby Foot Scrub, Spa QTICA (Manicure / Pedicure / Set), Spa Footlogix
- **Gel Polish** → lists: Gel polish Hand, Gel polish Foot, Manicure + Gel polish (hand), Pedicure + Gel polish (foot), Gel polish Hand + Foot
- **Nail Extensions** → lists: Softgel Tip, Softgel Gel, Acrylic / Polygel, PVC, Nail filling, Nail coating, Extension removal / take-off
- **Nail Art & Techniques** → lists: Cat-eye, Aurora / Mirror, French, Ombre, Marble, Gel Art, French Tip Color, Extra gel colors

### `#products` — Arôme Collection (4 retail items, en.json `products.*`)
Jasmine Rice, Rose, Tamarind, Turmeric — body scrub creams. **Not on any flyer in this audit set** (retail line, distinct from treatment menu).

---

## 4. Phase C — Comparison table & follow-up lists

### Comparison table

| # | Flyer Category | Service (flyer) | On site? | Section | Site name | Match | Notes |
|---:|---|---|:---:|---|---|:---:|---|
| 1 | Massage | Foot Reflexology | Yes | `#services` | Foot Reflexology | Exact | — |
| 2 | Massage | Head, Shoulder & Back Massage | Yes | `#services` | Head, Shoulder & Back Massage | Exact | — |
| 3 | Massage | Traditional Thai Massage | Yes | `#services` | Traditional Thai Massage | Exact | — |
| 4 | Massage | Four Hands Aromatic Oil Massage | Yes | `#services` | Four Hands Aromatic Oil Massage | Exact | — |
| 5 | Massage | Oil Massage | Yes | `#services` | Oil Massage | Exact | — |
| 6 | Massage | Botanika Aroma Therapy | Yes | `#services` | Botanika Aroma Therapy | Exact | — |
| 7 | Massage | Sports Massage / Deep Tissue | Yes | `#services` | Sports Massage / Deep Tissue | Exact | — |
| 8 | Massage | Organic Coconut Oil Massage | Yes | `#services` | Organic Coconut Oil Massage | Exact | — |
| 9 | Massage | Warm Aromatic Oil Massage | Yes | `#services` | Warm Aromatic Oil Massage | Exact | — |
| 10 | Massage | Botanika Aromatic Body Scrub | Yes | `#services` | Botanika Aromatic Body Scrub | Exact | — |
| 11 | Massage | Aromatic Herbal Compress | Yes | `#services` | Aromatic Herbal Compress | Exact | — |
| 12 | Massage | Aromatic Hot Stone Massage Therapy | Yes | `#services` | Aromatic Hot Stone Therapy | Minor mismatch | Site drops the word "Massage" |
| 13 | Package | Tension Release (90) | Yes | `#packages` | Tension Release | Exact | — |
| 14 | Package | Mini Beauty (90) | Yes | `#packages` | Mini Beauty | Exact | — |
| 15 | Package | Athlete's Heaven (90) | Yes | `#packages` | Athlete's Heaven | Exact | — |
| 16 | Package | Beauty Complete (180) | Yes | `#packages` | Beauty Complete | Exact | — |
| 17 | Package | Completely Relax (120) | Yes | `#packages` | Completely Relax | Exact | — |
| 18 | Package | Oriental Delight (120) | Yes | `#packages` | Oriental Delight | Exact | — |
| 19 | Facial | Uplifting Facial Treatment with Collagen Mask | No | — | — | Missing | Standalone facial absent; only "60 min Facial Treatment" line inside Beauty Complete |
| 20 | Facial | Natural Purifying Facial Treatment (Aloe Vera) | No | — | — | Missing | Same as above |
| 21 | Waxing | Eyebrow | No | — | — | Missing | Entire Waxing menu absent |
| 22 | Waxing | Upper Lip | No | — | — | Missing | |
| 23 | Waxing | Chest | No | — | — | Missing | |
| 24 | Waxing | Stomach | No | — | — | Missing | |
| 25 | Waxing | Navel | No | — | — | Missing | |
| 26 | Waxing | Full Back | No | — | — | Missing | |
| 27 | Waxing | Armpit | No | — | — | Missing | |
| 28 | Waxing | Full-Arm | No | — | — | Missing | |
| 29 | Waxing | Half-Arm | No | — | — | Missing | |
| 30 | Waxing | Full-Leg | No | — | — | Missing | |
| 31 | Waxing | Half-Leg | No | — | — | Missing | |
| 32 | Waxing | Hollywood | No | — | — | Missing | |
| 33 | Waxing | Bikini Line | No | — | — | Missing | |
| 34 | Waxing | Brazillian | No | — | — | Missing | (flyer spelling — "Brazilian" is standard) |
| 35 | Nails | Basic Manicure (No Color) | Yes | `#nails` | Basic Manicure | Exact | — |
| 36 | Nails | Basic Pedicure (No Color) | Yes | `#nails` | Pedicure | Minor | Flyer calls it "Basic Pedicure without heel file" |
| 37 | Nails | Baby Foot Scrub | Yes | `#nails` | Baby Foot Scrub | Exact | — |
| 38 | Nails | Spa QTICA Manicure | Yes | `#nails` | Spa QTICA (Manicure / Pedicure / Set) | Exact | Site groups all three variants in one line |
| 39 | Nails | Spa QTICA Pedicure | Yes | `#nails` | (same) | Exact | grouped |
| 40 | Nails | Set Spa QTICA | Yes | `#nails` | (same) | Exact | grouped |
| 41 | Nails | Spa Footlogix | Yes | `#nails` | Spa Footlogix | Exact | — |
| 42 | Nails | Normal Organic Nail Polish | No | — | — | Missing | Distinct from gel polish on flyer |
| 43 | Nails | Nail Polish Organic / O.P.I — Hand | No | — | — | Missing | Dedicated flyer for this |
| 44 | Nails | Nail Polish Organic / O.P.I — Foot | No | — | — | Missing | Dedicated flyer for this |
| 45 | Gel | Gel Polish — Hand | Yes | `#nails` | Gel polish — Hand | Exact | — |
| 46 | Gel | Gel Polish — Foot | Yes | `#nails` | Gel polish — Foot | Exact | — |
| 47 | Gel | Gel Polish — Hand + Foot | Yes | `#nails` | Gel polish — Hand + Foot | Exact | — |
| 48 | Gel | Manicure + Gel polish (hand) | Yes | `#nails` | Manicure + Gel polish (hand) | Exact | — |
| 49 | Gel | Pedicure + Gel polish (foot) | Yes | `#nails` | Pedicure + Gel polish (foot) | Exact | — |
| 50 | Extensions | PVC Extension | Yes | `#nails` | PVC | Exact | — |
| 51 | Extensions | Acrylic Extension | Yes | `#nails` | Acrylic / Polygel | Exact | site groups |
| 52 | Extensions | Poly Gel Extension | Yes | `#nails` | Acrylic / Polygel | Exact | grouped |
| 53 | Extensions | Sofygel Tip Extension | Yes | `#nails` | Softgel Tip | Minor mismatch | Flyer "Sofygel Tip", site "Softgel Tip" |
| 54 | Extensions | Softgel Gel Extension | Yes | `#nails` | Softgel Gel | Exact | — |
| 55 | Extensions | Nail base filling | Yes | `#nails` | Nail filling | Exact | — |
| 56 | Extensions | Nail coating | Yes | `#nails` | Nail coating | Exact | — |
| 57 | Extensions | Take Off (Hand) | Yes | `#nails` | Extension removal / take-off | Exact | grouped |
| 58 | Extensions | Take Off (Foot) | Yes | `#nails` | Extension removal / take-off | Exact | grouped |
| 59 | Art | Cat-eye gel polish | Yes | `#nails` | Cat-eye | Exact | — |
| 60 | Art | Aurora / Mirror gel polish | Yes | `#nails` | Aurora / Mirror | Exact | — |
| 61 | Art | French gel polish | Yes | `#nails` | French | Exact | — |
| 62 | Art | Ombre gel polish | Yes | `#nails` | Ombre | Exact | — |
| 63 | Art | Marble gel polish | Yes | `#nails` | Marble | Exact | — |
| 64 | Art | Gel Art (per finger) | Yes | `#nails` | Gel Art | Exact | — |
| 65 | Art | French Tip Color | Yes | `#nails` | French Tip Color | Exact | — |
| 66 | Art | Extra gel color (per color) | Yes | `#nails` | Extra gel colors | Exact | — |
| 67 | Art | Gel-Polish removal | No | — | — | Missing | Listed on flyer d2ff0464 |

### MISSING — on flyer, NOT on website (20)

**Facial (standalone) — 2**
- Uplifting Facial Treatment with Collagen Mask (60 min)
- Natural Purifying Facial Treatment with Aloe Vera (60 min)

**Waxing — entire category (13)**
- Eyebrow, Upper Lip
- Chest, Stomach, Navel, Full Back, Armpit
- Full-Arm, Half-Arm
- Full-Leg, Half-Leg
- Hollywood, Bikini Line, Brazillian

**Nails — Organic / O.P.I polish line (3)**
- Normal Organic Nail Polish
- Nail Polish Organic / O.P.I Color — Hand
- Nail Polish Organic / O.P.I Color — Foot

**Nails — misc (2)**
- Gel-Polish removal (listed on master nail price list flyer)
- "Basic Pedicure without heel file" distinction (the site has just "Pedicure")

### EXTRA — on website, NOT in current flyer set (1 family)

- **Arôme Collection retail products** (Jasmine Rice, Rose, Tamarind, Turmeric body scrub creams). These are retail products, not treatments, so flyers wouldn't necessarily list them — almost certainly **KEEP**. Flag only for client confirmation.

### MISMATCH — on both but wording differs (4)

| Flyer name | Site name | Section |
|------------|-----------|---------|
| Aromatic Hot Stone Massage Therapy | Aromatic Hot Stone Therapy | `#services` |
| Sofygel Tip Extension | Softgel Tip | `#nails` (Nail Extensions) |
| Basic Pedicure without heel file | Pedicure | `#nails` (Manicure & Pedicure Care) |
| Brazillian (flyer spelling) | n/a (missing) | — |

---

## 5. Phase D — Recommendations by severity

### HIGH (customer-visible gaps; entire categories missing)

1. **ADD a Waxing section** to the site.
   - Recommend a new section `#waxing` (or fold into a "Beauty Services" combined section) with sub-groups Facial / Body / Arm / Legs / Bikini.
   - 13 services to add (names verbatim from flyer; no prices).
   - One-line proposed lead-in: *"Professional waxing for face and body — quick, hygienic, and salon-clean."*

2. **ADD standalone Facial Treatments** to `#services` (or add a dedicated `#facials` section).
   - Service A: *Uplifting Facial Treatment with Collagen Mask* — Make-up remover, deep cleansing, scrub, facial massage, collagen mask, moisturizing. (60 min)
   - Service B: *Natural Purifying Facial Treatment* — Make-up remover, deep cleansing, scrub, facial massage, aloe vera mask, moisturizing. (60 min)
   - Currently "Facial Treatment" only appears as a sub-line inside the Beauty Complete package — a guest cannot book a facial on its own from the site.

3. **ADD Organic / O.P.I Nail Polish** to the Nail Studio "Manicure & Pedicure Care" category (or extend "Gel Polish" with an "Organic / O.P.I" sub-line).
   - Three variants: Normal Organic Nail Polish, Organic / O.P.I Color — Hand, Organic / O.P.I Color — Foot.
   - Distinct from gel polish (different durability and removal).

### MEDIUM (rename / accuracy)

4. **RENAME** `Aromatic Hot Stone Therapy` → `Aromatic Hot Stone Massage Therapy` (services.json id 12) to match flyer wording.

5. **RENAME** `Softgel Tip` → `Sofygel Tip` in `en.json` `nails.nailExtensions.services[0]` to match the flyer's brand spelling. *(Confirm with client — "Softgel" is the standard English spelling; "Sofygel" may be a deliberate brand spelling from the supplier.)*

6. **CLARIFY** `Pedicure` (Manicure & Pedicure Care list) → flyer specifically says "Basic Pedicure (no heel file)". Suggest changing site label to `Basic Pedicure` and adding a short helper: *"(does not include heel file — see Baby Foot Scrub or Spa Footlogix for heel care)"*.

### LOW (minor)

7. **ADD** "Gel-Polish removal" to the Nail Art & Techniques (or Nail Extensions) services list — currently absent on site, listed on master nail flyer.

8. **VERIFY spelling**: Flyer uses "Brazillian" (double L). Recommend the site (when added) use the standard English "Brazilian".

### KEEP-AS-IS

- Arôme Collection (4 retail body-scrub creams) — retail products, not treatments; flyer set provided is treatment-only. Keep on site.
- All 12 massage services (services.json) — fully aligned with the 3 massage flyers.
- All 6 packages (packages.json) — fully aligned with the packages flyer.
- Nail Studio category structure — 4-category grouping is a sensible UX simplification of the busy flyer; recommend keeping the grouped presentation rather than mirroring the flyer line-for-line.

---

## 6. Open questions for the user

1. **Are Waxing services actually offered at all current branches?** The flyer is branded "BOTANIKA" and looks current, but the absence from the site is so complete it might be intentional (e.g., only offered at one branch, or being discontinued). If branch-specific, we'd add it with an `availableAtSelectBranches`-style badge like Nail Studio uses.

2. **Standalone Facials — at all branches, or branch-specific?** Same question. The flyer pairs them with the Packages page, suggesting they're a general offering, but they could be branch-limited.

3. **Sofygel vs Softgel spelling** — is the flyer's "Sofygel" intentional brand spelling (matching the supplier), or a typo? If intentional, the site should be renamed to match.

4. **Organic / O.P.I Nail Polish** — confirm this is a distinct service tier from Gel Polish (different polish system, not just a color choice), so we add it as its own line rather than as an O.P.I color option inside the existing Gel Polish entry.

5. **Brazillian vs Brazilian** — confirm preferred spelling on site (standard English is one L).

---

## Method note

- All 12 flyer JPGs read as images via the Read tool; no duplicates detected.
- Website inventory built from source code (`services.json`, `packages.json`, `en.json`, `Home.jsx`, `NailGallery.jsx`, `ProductGallery.jsx`) because Chrome DevTools port 9222 was not running at audit time. Source-code inventory is authoritative — Home.jsx renders exactly those data files.
- No code, content, or translations were modified during this audit.
