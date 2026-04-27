import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Lightbox from './Lightbox'
import './ProductGallery.css'

const AUTO_SCROLL_INTERVAL = 3000
const RESUME_DELAY = 3000

const products = [
  { id: 1, name: 'Jasmine Rice Body Scrub Cream', image: '/images/products/jasmine-rice.jpg' },
  { id: 2, name: 'Rose Body Scrub Cream', image: '/images/products/rose.jpg' },
  { id: 3, name: 'Tamarind Body Scrub Cream', image: '/images/products/tamarind.jpg' },
  { id: 4, name: 'Turmeric Body Scrub Cream', image: '/images/products/turmeric.jpg' },
]

function ProductGallery() {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxAlt, setLightboxAlt] = useState('')

  const scrollRef = useRef(null)
  const autoScrollRef = useRef(null)
  const resumeTimeoutRef = useRef(null)
  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  // Get actual image width dynamically (handles mobile responsiveness)
  const getImageWidth = useCallback(() => {
    if (!scrollRef.current) return 280
    const firstImage = scrollRef.current.querySelector('.product-gallery__image-wrapper')
    if (!firstImage) return 280
    const style = window.getComputedStyle(scrollRef.current)
    const gap = parseFloat(style.gap) || 16
    return firstImage.offsetWidth + gap
  }, [])

  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const imageWidth = getImageWidth()
    const targetScroll = index * imageWidth
    container.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }, [getImageWidth])

  const nextImage = useCallback(() => {
    const nextIndex = (currentIndex + 1) % products.length
    setCurrentIndex(nextIndex)
    scrollToIndex(nextIndex)
  }, [currentIndex, scrollToIndex])

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
    const imageWidth = getImageWidth()
    const newIndex = Math.round(scrollPos / imageWidth)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < products.length) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex, getImageWidth])

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
  const handleImageClick = (product) => {
    pauseAutoScroll()
    setLightboxImage(product.image)
    setLightboxAlt(product.name)
    setLightboxOpen(true)
  }

  const handleLightboxClose = () => {
    setLightboxOpen(false)
    setLightboxImage(null)
    setLightboxAlt('')
    setTimeout(() => startAutoScroll(), 500)
  }

  // Handle broken images gracefully
  const handleImageError = (e) => {
    e.target.style.display = 'none'
  }

  // Progress bar calculation
  const progressWidth = 100 / products.length
  const progressLeft = (currentIndex / products.length) * 100

  return (
    <div
      className="product-gallery"
      role="region"
      aria-label={t('products.title')}
    >
      <div
        ref={scrollRef}
        className="product-gallery__scroll"
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        aria-live="polite"
      >
        {products.map((product, index) => (
          <div key={product.id} className="product-gallery__image-wrapper">
            <img
              className="product-gallery__image"
              src={product.image}
              alt={product.name}
              loading="lazy"
              onClick={() => handleImageClick(product)}
              onError={handleImageError}
            />
          </div>
        ))}
      </div>

      <div className="product-gallery__progress">
        <div
          className="product-gallery__progress-fill"
          style={{ width: `${progressWidth}%`, left: `${progressLeft}%` }}
        />
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        imageSrc={lightboxImage}
        imageAlt={lightboxAlt}
        onClose={handleLightboxClose}
      />
    </div>
  )
}

export default ProductGallery
