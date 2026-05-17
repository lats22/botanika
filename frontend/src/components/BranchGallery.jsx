import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Lightbox from './Lightbox'
import './BranchGallery.css'

const AUTO_SCROLL_INTERVAL = 3000
const RESUME_DELAY = 3000
const CLICK_DRAG_THRESHOLD = 5 // px movement above which a mousedown is a drag, not a click

function BranchGallery({ images, branchName }) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)
  // FIX #25: track whether the scroll strip actually overflows; when it doesn't,
  // we hide arrows/scrubber and stop auto-scroll entirely.
  const [canScroll, setCanScroll] = useState(true)

  const scrollRef = useRef(null)
  const progressRef = useRef(null)
  const autoScrollRef = useRef(null)
  const resumeTimeoutRef = useRef(null)
  const canScrollRef = useRef(true)

  // Drag / click-vs-drag state
  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const movedDistanceRef = useRef(0)
  const wasDraggedRef = useRef(false)

  // Hover/paused state — single source of truth
  const isHoverPausedRef = useRef(false)
  const isScrubbingRef = useRef(false)

  // Get actual image width dynamically (handles mobile responsiveness)
  const getImageWidth = useCallback(() => {
    if (!scrollRef.current) return 248
    const firstImage = scrollRef.current.querySelector('.branch-gallery__image-wrapper')
    if (!firstImage) return 248
    const style = window.getComputedStyle(scrollRef.current)
    const gap = parseFloat(style.gap) || 8
    return firstImage.offsetWidth + gap
  }, [])

  const scrollToIndex = useCallback((index, behavior = 'smooth') => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const imageWidth = getImageWidth()
    const targetScroll = index * imageWidth
    container.scrollTo({ left: targetScroll, behavior })
  }, [getImageWidth])

  const nextImage = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length
    setCurrentIndex(nextIndex)
    scrollToIndex(nextIndex)
  }, [currentIndex, images.length, scrollToIndex])

  const startAutoScroll = useCallback(() => {
    if (isHoverPausedRef.current) return
    // FIX #25: don't auto-scroll when everything fits on screen.
    if (!canScrollRef.current) return
    clearInterval(autoScrollRef.current)
    autoScrollRef.current = setInterval(() => {
      nextImage()
    }, AUTO_SCROLL_INTERVAL)
  }, [nextImage])

  const pauseAutoScroll = useCallback(() => {
    clearInterval(autoScrollRef.current)
    clearTimeout(resumeTimeoutRef.current)
    if (isHoverPausedRef.current) return
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

  // FIX #25: recompute canScroll on mount, resize, and data change.
  // ResizeObserver is the primary trigger; window resize is a debounced fallback.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const recompute = () => {
      // +1 avoids subpixel false positives where scrollWidth is fractionally larger.
      const overflow = el.scrollWidth > el.clientWidth + 1
      canScrollRef.current = overflow
      setCanScroll((prev) => (prev === overflow ? prev : overflow))
      if (!overflow) {
        // stop and DO NOT restart while in this state
        clearInterval(autoScrollRef.current)
        clearTimeout(resumeTimeoutRef.current)
      } else {
        startAutoScroll()
      }
    }

    recompute()

    const ro = new ResizeObserver(recompute)
    ro.observe(el)

    let rafId = 0
    let timerId = 0
    const onWinResize = () => {
      clearTimeout(timerId)
      timerId = setTimeout(() => {
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(recompute)
      }, 150)
    }
    window.addEventListener('resize', onWinResize)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onWinResize)
      clearTimeout(timerId)
      cancelAnimationFrame(rafId)
    }
  }, [images, startAutoScroll])

  // Track scroll position to update current index
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const scrollPos = scrollRef.current.scrollLeft
    const imageWidth = getImageWidth()
    const newIndex = Math.round(scrollPos / imageWidth)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex, images.length, getImageWidth])

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    isDownRef.current = true
    wasDraggedRef.current = false
    movedDistanceRef.current = 0
    scrollRef.current.style.cursor = 'grabbing'
    startXRef.current = e.pageX - scrollRef.current.offsetLeft
    startYRef.current = e.pageY
    scrollLeftRef.current = scrollRef.current.scrollLeft
    pauseAutoScroll()
  }

  const handleMouseLeaveScroll = () => {
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
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startXRef.current) * 1.5
    movedDistanceRef.current = Math.max(movedDistanceRef.current, Math.abs(walk))
    if (movedDistanceRef.current > CLICK_DRAG_THRESHOLD) {
      wasDraggedRef.current = true
      e.preventDefault()
    }
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  // Hover pause
  const handleContainerMouseEnter = () => {
    isHoverPausedRef.current = true
    clearInterval(autoScrollRef.current)
    clearTimeout(resumeTimeoutRef.current)
  }

  const handleContainerMouseLeave = () => {
    isHoverPausedRef.current = false
    startAutoScroll()
  }

  // Mouse wheel → horizontal scroll
  const handleWheel = (e) => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
    if (delta === 0) return
    const atStart = el.scrollLeft <= 0 && delta < 0
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1 && delta > 0
    if (atStart || atEnd) return // let page scroll
    e.preventDefault()
    el.scrollLeft += delta
    pauseAutoScroll()
  }

  // Touch handler
  const handleTouchStart = () => {
    pauseAutoScroll()
  }

  // Image click handler with drag detection
  const handleImageClick = (e, imageSrc) => {
    if (wasDraggedRef.current) {
      e.preventDefault()
      e.stopPropagation()
      wasDraggedRef.current = false
      return
    }
    pauseAutoScroll()
    setLightboxImage(imageSrc)
    setLightboxOpen(true)
  }

  const handleLightboxClose = () => {
    setLightboxOpen(false)
    setLightboxImage(null)
    setTimeout(() => startAutoScroll(), 500)
  }

  // Handle broken images gracefully
  const handleImageError = (e) => {
    e.target.style.display = 'none'
  }

  // Arrow controls
  const goPrev = () => {
    if (currentIndex <= 0) return
    const idx = currentIndex - 1
    setCurrentIndex(idx)
    scrollToIndex(idx)
    pauseAutoScroll()
  }

  const goNext = () => {
    if (currentIndex >= images.length - 1) return
    const idx = currentIndex + 1
    setCurrentIndex(idx)
    scrollToIndex(idx)
    pauseAutoScroll()
  }

  // Scrubber (progress bar) interaction
  const scrubFromClientX = useCallback((clientX) => {
    if (!progressRef.current || !scrollRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const targetIndex = Math.min(images.length - 1, Math.max(0, Math.round(ratio * (images.length - 1))))
    setCurrentIndex(targetIndex)
    scrollToIndex(targetIndex)
  }, [images.length, scrollToIndex])

  const handleProgressMouseDown = (e) => {
    isScrubbingRef.current = true
    pauseAutoScroll()
    scrubFromClientX(e.clientX)
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (e) => {
      if (!isScrubbingRef.current) return
      scrubFromClientX(e.clientX)
    }
    const onUp = () => {
      isScrubbingRef.current = false
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [scrubFromClientX])

  const handleProgressKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goPrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      goNext()
    } else if (e.key === 'Home') {
      e.preventDefault()
      setCurrentIndex(0)
      scrollToIndex(0)
      pauseAutoScroll()
    } else if (e.key === 'End') {
      e.preventDefault()
      const last = images.length - 1
      setCurrentIndex(last)
      scrollToIndex(last)
      pauseAutoScroll()
    }
  }

  // Progress bar calculation
  const progressWidth = 100 / images.length
  const progressLeft = (currentIndex / images.length) * 100

  const atFirst = currentIndex === 0
  const atLast = currentIndex === images.length - 1

  return (
    <div
      className="branch-gallery"
      role="region"
      aria-label={`${branchName} photo gallery`}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
      <div className="branch-gallery__viewport">
        <div
          ref={scrollRef}
          className="branch-gallery__scroll"
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveScroll}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onWheel={handleWheel}
          aria-live="polite"
        >
          {images.map((src, index) => (
            <div key={src} className="branch-gallery__image-wrapper">
              <img
                className="branch-gallery__image"
                src={src}
                alt={`${branchName} - Image ${index + 1}`}
                loading="lazy"
                draggable={false}
                onClick={(e) => handleImageClick(e, src)}
                onError={handleImageError}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className={`branch-gallery__arrow branch-gallery__arrow--prev${canScroll ? '' : ' branch-gallery__arrow--hidden'}`}
          onClick={goPrev}
          disabled={atFirst}
          aria-label={t('carousel.prev')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          type="button"
          className={`branch-gallery__arrow branch-gallery__arrow--next${canScroll ? '' : ' branch-gallery__arrow--hidden'}`}
          onClick={goNext}
          disabled={atLast}
          aria-label={t('carousel.next')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div
        ref={progressRef}
        className={`branch-gallery__progress${canScroll ? '' : ' branch-gallery__progress--hidden'}`}
        role="slider"
        tabIndex={0}
        aria-label={t('carousel.scrubber')}
        aria-valuemin={0}
        aria-valuemax={images.length - 1}
        aria-valuenow={currentIndex}
        onMouseDown={handleProgressMouseDown}
        onKeyDown={handleProgressKeyDown}
      >
        <div
          className="branch-gallery__progress-fill"
          style={{ width: `${progressWidth}%`, left: `${progressLeft}%` }}
        />
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
