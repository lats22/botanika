import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import './ProductGallery.css'

const AUTO_SCROLL_INTERVAL = 4000
const RESUME_DELAY = 5000

const products = [
  {
    id: 'jasmineRice',
    image: '/images/products/jasmine-rice.jpg',
    accentColor: '#F5E6D3'
  },
  {
    id: 'rose',
    image: '/images/products/rose.jpg',
    accentColor: '#F8E1E4'
  },
  {
    id: 'tamarind',
    image: '/images/products/tamarind.jpg',
    accentColor: '#E8DDD0'
  },
  {
    id: 'turmeric',
    image: '/images/products/turmeric.jpg',
    accentColor: '#F5E8C8'
  },
]

function ProductLightbox({ product, onClose, t }) {
  const lightboxRef = useRef(null)
  const closeButtonRef = useRef(null)
  const [isZoomed, setIsZoomed] = useState(false)

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (isZoomed) {
        setIsZoomed(false)
      } else {
        onClose()
      }
    }
    if (e.key === 'Tab') {
      const focusableElements = lightboxRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  }, [onClose, isZoomed])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    setTimeout(() => closeButtonRef.current?.focus(), 0)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleImageClick = (e) => {
    e.stopPropagation()
    setIsZoomed(true)
  }

  const handleZoomClose = () => {
    setIsZoomed(false)
  }

  const productName = t(`products.${product.id}.name`)
  const productDescription = t(`products.${product.id}.description`)
  const productBenefits = t(`products.${product.id}.benefits`, { returnObjects: true })

  const lightboxContent = (
    <div
      ref={lightboxRef}
      className="product-lightbox product-lightbox--open"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={productName}
    >
      <div className="product-lightbox__content">
        <button
          ref={closeButtonRef}
          className="product-lightbox__close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="product-lightbox__grid">
          <div
            className="product-lightbox__image-container product-lightbox__image-container--zoomable"
            onClick={handleImageClick}
            role="button"
            tabIndex={0}
            aria-label="Click to zoom image"
            onKeyDown={(e) => e.key === 'Enter' && handleImageClick(e)}
          >
            <div
              className="product-lightbox__image-bg"
              style={{ backgroundColor: product.accentColor }}
            />
            <img
              className="product-lightbox__image"
              src={product.image}
              alt={productName}
            />
            <div className="product-lightbox__zoom-hint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <span>Click to zoom</span>
            </div>
          </div>

          <div className="product-lightbox__details">
            <h3 className="product-lightbox__name">{productName}</h3>
            <p className="product-lightbox__description">{productDescription}</p>

            <div className="product-lightbox__benefits">
              <h4 className="product-lightbox__benefits-title">
                {t('products.skinBenefits')}
              </h4>
              <ul className="product-lightbox__benefits-list">
                {Array.isArray(productBenefits) && productBenefits.map((benefit, index) => (
                  <li key={index} className="product-lightbox__benefit">
                    <span className="product-lightbox__benefit-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.7 6.3l-4 4c-.2.2-.4.3-.7.3s-.5-.1-.7-.3l-2-2c-.4-.4-.4-1 0-1.4s1-.4 1.4 0L7 8.2l3.3-3.3c.4-.4 1-.4 1.4 0s.4 1 0 1.4z"/>
                      </svg>
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="product-lightbox__badge">
              <span className="product-lightbox__badge-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              {t('products.availableAtAllBranches')}
            </div>
          </div>
        </div>

        {/* Zoom Overlay */}
        {isZoomed && (
          <div
            className="product-lightbox__zoom-overlay"
            onClick={handleZoomClose}
            role="button"
            tabIndex={0}
            aria-label="Close zoomed image"
            onKeyDown={(e) => e.key === 'Enter' && handleZoomClose()}
          >
            <img
              className="product-lightbox__zoom-image"
              src={product.image}
              alt={`${productName} - Zoomed view`}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="product-lightbox__zoom-close"
              onClick={handleZoomClose}
              aria-label="Close zoom"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="product-lightbox__zoom-instruction">
              Click anywhere or press ESC to close
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(lightboxContent, document.body)
}

function ProductGallery() {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const scrollRef = useRef(null)
  const autoScrollRef = useRef(null)
  const resumeTimeoutRef = useRef(null)
  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const getImageWidth = useCallback(() => {
    if (!scrollRef.current) return 300
    const firstCard = scrollRef.current.querySelector('.product-card')
    if (!firstCard) return 300
    const style = window.getComputedStyle(scrollRef.current)
    const gap = parseFloat(style.gap) || 24
    return firstCard.offsetWidth + gap
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
    clearInterval(autoScrollRef.current)
    autoScrollRef.current = setInterval(() => {
      nextImage()
    }, AUTO_SCROLL_INTERVAL)
  }, [nextImage])

  const pauseAutoScroll = useCallback(() => {
    clearInterval(autoScrollRef.current)
    clearTimeout(resumeTimeoutRef.current)

    resumeTimeoutRef.current = setTimeout(() => {
      startAutoScroll()
    }, RESUME_DELAY)
  }, [startAutoScroll])

  useEffect(() => {
    startAutoScroll()
    return () => {
      clearInterval(autoScrollRef.current)
      clearTimeout(resumeTimeoutRef.current)
    }
  }, [startAutoScroll])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const scrollPos = scrollRef.current.scrollLeft
    const imageWidth = getImageWidth()
    const newIndex = Math.round(scrollPos / imageWidth)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < products.length) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex, getImageWidth])

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

  const handleTouchStart = () => {
    pauseAutoScroll()
  }

  const handleCardClick = (product) => {
    pauseAutoScroll()
    setSelectedProduct(product)
  }

  const handleLightboxClose = () => {
    setSelectedProduct(null)
    setTimeout(() => startAutoScroll(), 500)
  }

  const handleImageError = (e) => {
    e.target.style.opacity = '0.5'
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    scrollToIndex(index)
    pauseAutoScroll()
  }

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
          <div
            key={product.id}
            className={`product-card ${index === currentIndex ? 'product-card--active' : ''}`}
            onClick={() => handleCardClick(product)}
            style={{ '--accent-color': product.accentColor }}
          >
            <div className="product-card__image-wrapper">
              <div className="product-card__float-effect">
                <img
                  className="product-card__image"
                  src={product.image}
                  alt={t(`products.${product.id}.name`)}
                  loading="lazy"
                  onError={handleImageError}
                />
              </div>
            </div>
            <div className="product-card__content">
              <h3 className="product-card__name">
                {t(`products.${product.id}.name`).replace(' Body Scrub Cream', '')}
              </h3>
              <p className="product-card__tagline">{t(`products.${product.id}.tagline`)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="product-gallery__dots">
        {products.map((product, index) => (
          <button
            key={product.id}
            className={`product-gallery__dot ${index === currentIndex ? 'product-gallery__dot--active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to ${t(`products.${product.id}.name`)}`}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductLightbox
          product={selectedProduct}
          onClose={handleLightboxClose}
          t={t}
        />
      )}
    </div>
  )
}

export default ProductGallery
