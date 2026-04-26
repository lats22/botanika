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
