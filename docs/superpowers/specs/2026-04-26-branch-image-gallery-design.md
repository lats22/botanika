# Branch Image Gallery Design

**Date:** 2026-04-26
**Status:** Draft
**Scope:** Decho branch only (pilot), other branches after validation

---

## Overview

Add an auto-scrolling image gallery to the Decho branch card, displaying 5 images of the location. After validation, extend to all 5 branches.

---

## Gallery Behavior

| Feature | Specification |
|---------|---------------|
| Auto-scroll | Advances every 3 seconds |
| Loop | Infinite (image 5 → image 1 → image 2...) |
| Manual control | Swipe/drag pauses auto-scroll |
| Resume | Auto-scroll resumes 3 seconds after last interaction |
| Lightbox | Tap any image to open fullscreen view |
| Progress indicator | Bar showing current position |
| Mobile | Touch/swipe support with momentum |

---

## Images

### Source Location

Copy from: `C:\Users\LENOVO.LENOVO\Downloads\Botanika\Decho\`

Copy to: `frontend/public/images/branches/decho/`

### Decho Images

| File | Description |
|------|-------------|
| Front.jpg | Exterior/storefront |
| Reception.jpg | Reception area |
| Foot Washing.jpg | Foot washing station |
| Foot Massage.jpg | Foot massage room |
| Thai Massage.jpg | Thai massage room |

---

## Data Model

Update `frontend/src/data/branches.json` for Decho branch only:

```json
{
  "id": 3,
  "name": "Decho",
  "images": [
    "/images/branches/decho/Front.jpg",
    "/images/branches/decho/Reception.jpg",
    "/images/branches/decho/Foot Washing.jpg",
    "/images/branches/decho/Foot Massage.jpg",
    "/images/branches/decho/Thai Massage.jpg"
  ],
  ...existing fields...
}
```

Other branches: No `images` array (gallery won't render).

---

## Components

### 1. BranchGallery.jsx (New)

Auto-scrolling image gallery component.

**Props:**
- `images` — Array of image paths
- `branchName` — For alt text

**Features:**
- 3-second auto-advance interval
- Infinite loop scrolling
- Pause on user interaction
- Resume after 3 seconds of inactivity
- Progress bar indicator
- Click to open lightbox

### 2. BranchGallery.css (New)

Styles for gallery, progress bar, scroll container.

### 3. Lightbox.jsx (New)

Fullscreen image viewer.

**Features:**
- Dark overlay background
- Close on click outside or ESC key
- Smooth open/close animation

### 4. Lightbox.css (New)

Styles for lightbox overlay and image display.

### 5. BranchCard.jsx (Update)

Add BranchGallery above branch info, only if `images` array exists.

```jsx
{branch.images && branch.images.length > 0 && (
  <BranchGallery images={branch.images} branchName={branch.name} />
)}
```

---

## File Structure

```
frontend/
├── public/
│   └── images/
│       └── branches/
│           └── decho/
│               ├── Front.jpg
│               ├── Reception.jpg
│               ├── Foot Washing.jpg
│               ├── Foot Massage.jpg
│               └── Thai Massage.jpg
└── src/
    ├── components/
    │   ├── BranchGallery.jsx (new)
    │   ├── BranchGallery.css (new)
    │   ├── Lightbox.jsx (new)
    │   ├── Lightbox.css (new)
    │   └── BranchCard.jsx (update)
    └── data/
        └── branches.json (update)
```

---

## Validation Criteria

After implementation, verify:

1. Gallery displays 5 images for Decho branch
2. Auto-scrolls every 3 seconds
3. Loops infinitely (5 → 1)
4. Manual swipe pauses auto-scroll
5. Auto-scroll resumes after 3 seconds
6. Tap opens lightbox
7. ESC or click outside closes lightbox
8. Progress bar updates correctly
9. Works on mobile (touch/swipe)
10. Other branches show no gallery (no errors)

---

## Future Work (After Validation)

- Add images for Silom, Silom 13, Sala Daeng, Patpong
- Optional: Add image captions/labels
- Optional: Swipe navigation in lightbox
