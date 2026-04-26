# Branch Image Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an auto-scrolling image gallery to the Decho branch card with 5 images, lightbox view, and smooth swipe interaction.

**Architecture:** Create two new components (BranchGallery for the carousel, Lightbox for fullscreen view), update BranchCard to conditionally render the gallery, and add images array to Decho branch data.

**Tech Stack:** React 18, CSS with existing design variables, vanilla JS for scroll/touch handling.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `frontend/public/images/branches/decho/` | Create | Store 5 branch images |
| `frontend/src/components/Lightbox.jsx` | Create | Fullscreen image viewer |
| `frontend/src/components/Lightbox.css` | Create | Lightbox styles |
| `frontend/src/components/BranchGallery.jsx` | Create | Auto-scroll gallery carousel |
| `frontend/src/components/BranchGallery.css` | Create | Gallery styles |
| `frontend/src/data/branches.json` | Modify | Add images array to Decho |
| `frontend/src/components/BranchCard.jsx` | Modify | Integrate BranchGallery |

---

## Task 1: Copy Images to Project

**Files:**
- Create: `frontend/public/images/branches/decho/` directory with 5 images

- [ ] **Step 1: Create directory and copy images**

Run in PowerShell:
```powershell
mkdir -p "C:\Users\LENOVO.LENOVO\AI\botanika\frontend\public\images\branches\decho"
Copy-Item "C:\Users\LENOVO.LENOVO\Downloads\Botanika\Decho\*" "C:\Users\LENOVO.LENOVO\AI\botanika\frontend\public\images\branches\decho\"
```

- [ ] **Step 2: Verify images copied**

Run:
```powershell
Get-ChildItem "C:\Users\LENOVO.LENOVO\AI\botanika\frontend\public\images\branches\decho"
```

Expected: 5 files listed (Front.jpg, Reception.jpg, Foot Washing.jpg, Foot Massage.jpg, Thai Massage.jpg)

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\LENOVO.LENOVO\AI\botanika"
git add frontend/public/images/branches/decho/
git commit -m "feat: add Decho branch images"
```

---

## Task 2: Create Lightbox Component

**Files:**
- Create: `frontend/src/components/Lightbox.jsx`
- Create: `frontend/src/components/Lightbox.css`

- [ ] **Step 1: Create Lightbox.css**

Create file `frontend/src/components/Lightbox.css`:

```css
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-normal), visibility var(--transition-normal);
}

.lightbox--open {
  opacity: 1;
  visibility: visible;
}

.lightbox__content {
  position: relative;
  max-width: 90vw;
  max-height: 85vh;
  transform: scale(0.9);
  transition: transform var(--transition-spring);
}

.lightbox--open .lightbox__content {
  transform: scale(1);
}

.lightbox__image {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-lg);
}

.lightbox__close {
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
  padding: 10px;
  line-height: 1;
}

.lightbox__close:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .lightbox__close {
    top: -45px;
    right: -5px;
    font-size: 2rem;
  }
}
```

- [ ] **Step 2: Create Lightbox.jsx**

Create file `frontend/src/components/Lightbox.jsx`:

```jsx
import React, { useEffect, useCallback } from 'react'
import './Lightbox.css'

function Lightbox({ isOpen, imageSrc, imageAlt, onClose }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`lightbox ${isOpen ? 'lightbox--open' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="lightbox__content">
        <button className="lightbox__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {imageSrc && (
          <img
            className="lightbox__image"
            src={imageSrc}
            alt={imageAlt || 'Lightbox image'}
          />
        )}
      </div>
    </div>
  )
}

export default Lightbox
```

- [ ] **Step 3: Verify file created**

Run:
```bash
ls frontend/src/components/Lightbox.*
```

Expected: Lightbox.jsx and Lightbox.css listed

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/Lightbox.jsx frontend/src/components/Lightbox.css
git commit -m "feat: add Lightbox component for fullscreen image view"
```

---

## Task 3: Create BranchGallery Component

**Files:**
- Create: `frontend/src/components/BranchGallery.jsx`
- Create: `frontend/src/components/BranchGallery.css`

- [ ] **Step 1: Create BranchGallery.css**

Create file `frontend/src/components/BranchGallery.css`:

```css
.branch-gallery {
  position: relative;
  margin-bottom: var(--spacing-md);
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  overflow: hidden;
}

.branch-gallery__scroll {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  gap: 8px;
  padding: 8px;
  cursor: grab;
}

.branch-gallery__scroll::-webkit-scrollbar {
  display: none;
}

.branch-gallery__scroll:active {
  cursor: grabbing;
}

.branch-gallery__image-wrapper {
  flex: 0 0 auto;
  width: 240px;
  height: 160px;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  position: relative;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.branch-gallery__image-wrapper:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.branch-gallery__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

/* Progress bar */
.branch-gallery__progress {
  height: 3px;
  background: rgba(27, 94, 58, 0.1);
  position: relative;
  overflow: hidden;
}

.branch-gallery__progress-fill {
  height: 100%;
  background: var(--color-deep-green);
  transition: width 0.3s ease, left 0.3s ease;
  position: absolute;
}

/* Auto-scroll indicator */
.branch-gallery__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  font-size: 0.7rem;
  color: var(--color-gold);
  opacity: 0.7;
}

.branch-gallery__indicator-dot {
  width: 6px;
  height: 6px;
  background: var(--color-gold);
  border-radius: 50%;
  animation: pulse 3s infinite;
}

.branch-gallery__indicator--paused .branch-gallery__indicator-dot {
  animation: none;
  opacity: 0.4;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

/* Fade edges */
.branch-gallery::before,
.branch-gallery::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 30px;
  width: 20px;
  z-index: 5;
  pointer-events: none;
}

.branch-gallery::before {
  left: 0;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.9), transparent);
}

.branch-gallery::after {
  right: 0;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.9), transparent);
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .branch-gallery__image-wrapper {
    width: 200px;
    height: 140px;
  }

  .branch-gallery__scroll {
    gap: 6px;
    padding: 6px;
  }
}
```

- [ ] **Step 2: Create BranchGallery.jsx**

Create file `frontend/src/components/BranchGallery.jsx`:

```jsx
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Lightbox from './Lightbox'
import './BranchGallery.css'

const AUTO_SCROLL_INTERVAL = 3000
const RESUME_DELAY = 3000

function BranchGallery({ images, branchName }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)

  const scrollRef = useRef(null)
  const autoScrollRef = useRef(null)
  const resumeTimeoutRef = useRef(null)
  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const imageWidth = 248 // 240px + 8px gap
    const targetScroll = index * imageWidth
    container.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }, [])

  const nextImage = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length
    setCurrentIndex(nextIndex)
    scrollToIndex(nextIndex)
  }, [currentIndex, images.length, scrollToIndex])

  const startAutoScroll = useCallback(() => {
    setIsPaused(false)
    clearInterval(autoScrollRef.current)
    autoScrollRef.current = setInterval(() => {
      nextImage()
    }, AUTO_SCROLL_INTERVAL)
  }, [nextImage])

  const pauseAutoScroll = useCallback(() => {
    setIsPaused(true)
    clearInterval(autoScrollRef.current)
    clearTimeout(resumeTimeoutRef.current)

    resumeTimeoutRef.current = setTimeout(() => {
      startAutoScroll()
    }, RESUME_DELAY)
  }, [startAutoScroll])

  // Initialize auto-scroll
  useEffect(() => {
    startAutoScroll()
    return () => {
      clearInterval(autoScrollRef.current)
      clearTimeout(resumeTimeoutRef.current)
    }
  }, [startAutoScroll])

  // Track scroll position to update current index
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const scrollPos = scrollRef.current.scrollLeft
    const imageWidth = 248
    const newIndex = Math.round(scrollPos / imageWidth)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex, images.length])

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    isDownRef.current = true
    scrollRef.current.style.cursor = 'grabbing'
    startXRef.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeftRef.current = scrollRef.current.scrollLeft
    pauseAutoScroll()
  }

  const handleMouseLeave = () => {
    isDownRef.current = false
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseUp = () => {
    isDownRef.current = false
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseMove = (e) => {
    if (!isDownRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startXRef.current) * 1.5
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  // Touch handler
  const handleTouchStart = () => {
    pauseAutoScroll()
  }

  // Image click handler
  const handleImageClick = (imageSrc) => {
    pauseAutoScroll()
    setLightboxImage(imageSrc)
    setLightboxOpen(true)
  }

  const handleLightboxClose = () => {
    setLightboxOpen(false)
    setLightboxImage(null)
    setTimeout(() => startAutoScroll(), 500)
  }

  // Progress bar calculation
  const progressWidth = 100 / images.length
  const progressLeft = (currentIndex / images.length) * 100

  return (
    <div className="branch-gallery">
      <div
        ref={scrollRef}
        className="branch-gallery__scroll"
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
      >
        {images.map((src, index) => (
          <div key={index} className="branch-gallery__image-wrapper">
            <img
              className="branch-gallery__image"
              src={src}
              alt={`${branchName} - Image ${index + 1}`}
              loading="lazy"
              onClick={() => handleImageClick(src)}
            />
          </div>
        ))}
      </div>

      <div className="branch-gallery__progress">
        <div
          className="branch-gallery__progress-fill"
          style={{ width: `${progressWidth}%`, left: `${progressLeft}%` }}
        />
      </div>

      <div className={`branch-gallery__indicator ${isPaused ? 'branch-gallery__indicator--paused' : ''}`}>
        <span className="branch-gallery__indicator-dot" />
        <span>{isPaused ? 'Paused' : 'Auto-scrolling'}</span>
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        imageSrc={lightboxImage}
        imageAlt={`${branchName} full view`}
        onClose={handleLightboxClose}
      />
    </div>
  )
}

export default BranchGallery
```

- [ ] **Step 3: Verify files created**

Run:
```bash
ls frontend/src/components/BranchGallery.*
```

Expected: BranchGallery.jsx and BranchGallery.css listed

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/BranchGallery.jsx frontend/src/components/BranchGallery.css
git commit -m "feat: add BranchGallery component with auto-scroll carousel"
```

---

## Task 4: Update branches.json for Decho

**Files:**
- Modify: `frontend/src/data/branches.json`

- [ ] **Step 1: Add images array to Decho branch**

Edit `frontend/src/data/branches.json`. Find the Decho entry (id: 3) and add the images array after the qrCode field:

```json
{
  "id": 3,
  "name": "Decho",
  "phone": "02-115-0288",
  "address": {
    "en": "174/3 Silom Rd, Suriya Wong, Bang Rak, Bangkok 10500",
    "th": "174/3 ถ.สีลม สุริยวงศ์ บางรัก กรุงเทพฯ 10500"
  },
  "hours": "10:00 - 01:30",
  "mapsUrl": "https://www.google.com/maps/place/Botanika+Massage+-+Decho/@13.72568,100.523154,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29f58393c0e67:0x54271c2db5ab09b4!8m2!3d13.7256748!4d100.5257289!16s%2Fg%2F11t30w1ddh",
  "qrCode": "/images/qr/print/white-bg/qr-decho.png",
  "images": [
    "/images/branches/decho/Front.jpg",
    "/images/branches/decho/Reception.jpg",
    "/images/branches/decho/Foot Washing.jpg",
    "/images/branches/decho/Foot Massage.jpg",
    "/images/branches/decho/Thai Massage.jpg"
  ]
}
```

- [ ] **Step 2: Verify JSON is valid**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('frontend/src/data/branches.json', 'utf8')); console.log('Valid JSON')"
```

Expected: "Valid JSON"

- [ ] **Step 3: Commit**

```bash
git add frontend/src/data/branches.json
git commit -m "feat: add images array to Decho branch data"
```

---

## Task 5: Integrate BranchGallery into BranchCard

**Files:**
- Modify: `frontend/src/components/BranchCard.jsx`

- [ ] **Step 1: Add import for BranchGallery**

At the top of `frontend/src/components/BranchCard.jsx`, add import after the existing imports:

```jsx
import BranchGallery from './BranchGallery'
```

- [ ] **Step 2: Add BranchGallery to render**

Inside the `<article className="branch-card">` element, add the gallery before the `<h3>` element:

```jsx
return (
  <article className="branch-card">
    {branch.images && branch.images.length > 0 && (
      <BranchGallery images={branch.images} branchName={branch.name} />
    )}
    <h3 className="branch-card__name">{branch.name}</h3>
    {/* rest of component unchanged */}
```

- [ ] **Step 3: Verify file syntax**

Run:
```bash
node -e "require('@babel/parser').parse(require('fs').readFileSync('frontend/src/components/BranchCard.jsx', 'utf8'), {sourceType: 'module', plugins: ['jsx']}); console.log('Valid JSX')" 2>/dev/null || echo "Check file manually"
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/BranchCard.jsx
git commit -m "feat: integrate BranchGallery into BranchCard component"
```

---

## Task 6: Update BranchCard CSS for Gallery Integration

**Files:**
- Modify: `frontend/src/components/BranchCard.css`

- [ ] **Step 1: Add styles for card with gallery**

Add at the end of `frontend/src/components/BranchCard.css`:

```css
/* Branch card with gallery */
.branch-card:has(.branch-gallery) {
  padding: 0;
  overflow: hidden;
}

.branch-card:has(.branch-gallery) .branch-card__name {
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-sm);
  margin-bottom: 0;
}

.branch-card:has(.branch-gallery) .branch-card__info {
  padding: 0 var(--spacing-lg);
}

.branch-card:has(.branch-gallery) .branch-card__qr-section {
  margin: var(--spacing-md) var(--spacing-lg);
}

.branch-card:has(.branch-gallery) .branch-card__btn {
  margin: 0 var(--spacing-lg) var(--spacing-lg);
  width: calc(100% - var(--spacing-lg) * 2);
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/BranchCard.css
git commit -m "style: adjust BranchCard layout when gallery is present"
```

---

## Task 7: Test and Validate

**Files:** None (manual testing)

- [ ] **Step 1: Rebuild Docker container**

Run:
```powershell
cd "C:\Users\LENOVO.LENOVO\AI\botanika"
docker compose build --no-cache frontend
docker compose up -d
```

- [ ] **Step 2: Open browser and test**

Open http://localhost:3002 and scroll to the Branches section.

**Validation checklist:**

1. Decho branch shows image gallery at top of card
2. Other branches (Silom, Silom 13, Sala Daeng, Patpong) show no gallery
3. Gallery auto-scrolls every 3 seconds
4. Auto-scroll loops (after image 5, goes back to image 1)
5. Drag/swipe pauses auto-scroll
6. "Paused" indicator shows when paused
7. Auto-scroll resumes after ~3 seconds of no interaction
8. Click any image opens lightbox
9. ESC key or click outside closes lightbox
10. Progress bar updates as images scroll

- [ ] **Step 3: Test on mobile viewport**

In browser dev tools, toggle device toolbar (Ctrl+Shift+M) and test at 375px width:
- Swipe gestures work
- Images display correctly
- Lightbox fits screen

- [ ] **Step 4: Final commit with all changes**

If any fixes were needed:
```bash
git add -A
git commit -m "fix: address gallery issues found during testing"
```

---

## Validation Summary

| # | Criteria | Expected |
|---|----------|----------|
| 1 | Gallery displays 5 images for Decho | 5 images visible |
| 2 | Auto-scrolls every 3 seconds | Smooth transition every 3s |
| 3 | Loops infinitely | 5 → 1 → 2... |
| 4 | Manual swipe pauses auto-scroll | "Paused" indicator shows |
| 5 | Auto-scroll resumes after 3 seconds | Returns to "Auto-scrolling" |
| 6 | Tap opens lightbox | Fullscreen image appears |
| 7 | ESC or click outside closes lightbox | Lightbox closes |
| 8 | Progress bar updates | Bar moves with scroll |
| 9 | Works on mobile | Touch/swipe functional |
| 10 | Other branches show no gallery | No errors, no gallery |
