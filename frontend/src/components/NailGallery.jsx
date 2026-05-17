import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import './NailGallery.css'

const AUTO_SCROLL_INTERVAL = 4000
const RESUME_DELAY = 5000
const CLICK_DRAG_THRESHOLD = 5

// Map a JPG/JPEG src to its WebP sibling for <picture> srcset.
const toWebp = (src) => (typeof src === 'string' ? src.replace(/\.(jpe?g)$/i, '.webp') : null)

const categories = [
  {
    id: 'manicurePedicure',
    image: '/images/nails/manicure-pedicure.jpg',
    accentColor: '#F4E6DA'
  },
  {
    id: 'gelPolish',
    image: '/images/nails/gel-polish.jpg',
    accentColor: '#F8E1E4'
  },
  {
    id: 'nailExtensions',
    image: '/images/nails/nail-extensions.jpg',
    accentColor: '#E3E8EE'
  },
  {
    id: 'nailArt',
    image: '/images/nails/nail-art.jpg',
    accentColor: '#F5DDEB'
  },
  {
    id: 'gelPolishRemoval',
    image: '/images/nails/gel-polish-removal.jpg',
    accentColor: '#DDEEE0'
  },
]

function NailLightbox({ category, onClose, t }) {
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

  const categoryName = t(`nails.${category.id}.name`)
  const categoryDescription = t(`nails.${category.id}.description`)
  const categoryServices = t(`nails.${category.id}.services`, { returnObjects: true })
  // Helper text shown only for the Manicure & Pedicure card — clarifies the
  // Basic Pedicure scope (no heel file). Returns the literal key string if
  // missing, so we treat that as "no helper" and render nothing.
  const helperKey = `nails.${category.id}.helperBasicPedicure`
  const helperText = t(helperKey)
  const hasHelper = category.id === 'manicurePedicure' && helperText && helperText !== helperKey

  const lightboxContent = (
    <div
      ref={lightboxRef}
      className="nail-lightbox nail-lightbox--open"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={categoryName}
    >
      <div className="nail-lightbox__content">
        <button
          ref={closeButtonRef}
          className="nail-lightbox__close"
          onClick={onClose}
          aria-label={t('lightbox.close')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="nail-lightbox__grid">
          <div
            className="nail-lightbox__image-container nail-lightbox__image-container--zoomable"
            onClick={handleImageClick}
            role="button"
            tabIndex={0}
            aria-label={t('lightbox.zoomImageAria')}
            onKeyDown={(e) => e.key === 'Enter' && handleImageClick(e)}
          >
            <div
              className="nail-lightbox__image-bg"
              style={{ backgroundColor: category.accentColor }}
            />
            <picture>
              <source srcSet={toWebp(category.image)} type="image/webp" />
              <img
                className="nail-lightbox__image"
                src={category.image}
                alt={categoryName}
              />
            </picture>
            <div className="nail-lightbox__zoom-hint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <span>{t('lightbox.zoomHint')}</span>
            </div>
          </div>

          <div className="nail-lightbox__details">
            <h3 className="nail-lightbox__name">{categoryName}</h3>
            <p className="nail-lightbox__description">{categoryDescription}</p>

            <div className="nail-lightbox__services">
              <h4 className="nail-lightbox__services-title">
                {t('nails.servicesIncluded')}
              </h4>
              <ul className="nail-lightbox__services-list">
                {Array.isArray(categoryServices) && categoryServices.map((service, index) => (
                  <li key={index} className="nail-lightbox__service">
                    <span className="nail-lightbox__service-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.7 6.3l-4 4c-.2.2-.4.3-.7.3s-.5-.1-.7-.3l-2-2c-.4-.4-.4-1 0-1.4s1-.4 1.4 0L7 8.2l3.3-3.3c.4-.4 1-.4 1.4 0s.4 1 0 1.4z"/>
                      </svg>
                    </span>
                    {service}
                  </li>
                ))}
              </ul>
              {hasHelper && (
                <p className="nail-lightbox__helper">{helperText}</p>
              )}
            </div>

            <div className="nail-lightbox__badge">
              <span className="nail-lightbox__badge-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              {t('nails.availableAtSelectBranches')}
            </div>
          </div>
        </div>

        {/* Zoom Overlay */}
        {isZoomed && (
          <div
            className="nail-lightbox__zoom-overlay"
            onClick={handleZoomClose}
            role="button"
            tabIndex={0}
            aria-label={t('lightbox.closeZoomAria')}
            onKeyDown={(e) => e.key === 'Enter' && handleZoomClose()}
          >
            <picture>
              <source srcSet={toWebp(category.image)} type="image/webp" />
              <img
                className="nail-lightbox__zoom-image"
                src={category.image}
                alt={`${categoryName} - Zoomed view`}
                onClick={(e) => e.stopPropagation()}
              />
            </picture>
            <button
              className="nail-lightbox__zoom-close"
              onClick={handleZoomClose}
              aria-label={t('lightbox.closeZoom')}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="nail-lightbox__zoom-instruction">
              {t('lightbox.zoomInstruction')}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(lightboxContent, document.body)
}

function NailGallery() {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const scrollRef = useRef(null)
  const autoScrollRef = useRef(null)
  const resumeTimeoutRef = useRef(null)

  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const movedDistanceRef = useRef(0)
  const wasDraggedRef = useRef(false)

  const isHoverPausedRef = useRef(false)

  const getImageWidth = useCallback(() => {
    if (!scrollRef.current) return 300
    const firstCard = scrollRef.current.querySelector('.nail-card')
    if (!firstCard) return 300
    const style = window.getComputedStyle(scrollRef.current)
    const gap = parseFloat(style.gap) || 24
    return firstCard.offsetWidth + gap
  }, [])

  const scrollToIndex = useCallback((index, behavior = 'smooth') => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const imageWidth = getImageWidth()
    const targetScroll = index * imageWidth
    container.scrollTo({ left: targetScroll, behavior })
  }, [getImageWidth])

  const nextImage = useCallback(() => {
    const nextIndex = (currentIndex + 1) % categories.length
    setCurrentIndex(nextIndex)
    scrollToIndex(nextIndex)
  }, [currentIndex, scrollToIndex])

  const startAutoScroll = useCallback(() => {
    if (isHoverPausedRef.current) return
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
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < categories.length) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex, getImageWidth])

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

  const handleContainerMouseEnter = () => {
    isHoverPausedRef.current = true
    clearInterval(autoScrollRef.current)
    clearTimeout(resumeTimeoutRef.current)
  }

  const handleContainerMouseLeave = () => {
    isHoverPausedRef.current = false
    startAutoScroll()
  }

  const handleWheel = (e) => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
    if (delta === 0) return
    const atStart = el.scrollLeft <= 0 && delta < 0
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1 && delta > 0
    if (atStart || atEnd) return
    e.preventDefault()
    el.scrollLeft += delta
    pauseAutoScroll()
  }

  const handleTouchStart = () => {
    pauseAutoScroll()
  }

  const handleCardClick = (e, category) => {
    if (wasDraggedRef.current) {
      e.preventDefault()
      e.stopPropagation()
      wasDraggedRef.current = false
      return
    }
    pauseAutoScroll()
    setSelectedCategory(category)
  }

  const handleLightboxClose = () => {
    setSelectedCategory(null)
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
      className="nail-gallery"
      role="region"
      aria-label={t('nails.title')}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
      <div className="nail-gallery__viewport">
        <div
          ref={scrollRef}
          className="nail-gallery__scroll"
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveScroll}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onWheel={handleWheel}
          aria-live="polite"
        >
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`nail-card ${index === currentIndex ? 'nail-card--active' : ''}`}
              onClick={(e) => handleCardClick(e, category)}
              style={{ '--accent-color': category.accentColor }}
            >
              <div className="nail-card__image-wrapper">
                <div className="nail-card__float-effect">
                  <picture>
                    <source srcSet={toWebp(category.image)} type="image/webp" />
                    <img
                      className="nail-card__image"
                      src={category.image}
                      alt={t(`nails.${category.id}.name`)}
                      loading="lazy"
                      draggable={false}
                      onError={handleImageError}
                    />
                  </picture>
                </div>
              </div>
              <div className="nail-card__content">
                <h3 className="nail-card__name">
                  {t(`nails.${category.id}.name`)}
                </h3>
                <p className="nail-card__tagline">{t(`nails.${category.id}.tagline`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="nail-gallery__dots">
        {categories.map((category, index) => (
          <button
            key={category.id}
            className={`nail-gallery__dot ${index === currentIndex ? 'nail-gallery__dot--active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={t('lightbox.goToSlide', { name: t(`nails.${category.id}.name`) })}
          />
        ))}
      </div>

      {selectedCategory && (
        <NailLightbox
          category={selectedCategory}
          onClose={handleLightboxClose}
          t={t}
        />
      )}
    </div>
  )
}

export default NailGallery
