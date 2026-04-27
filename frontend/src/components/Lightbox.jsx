import React, { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import './Lightbox.css'

function Lightbox({ isOpen, imageSrc, imageAlt, onClose }) {
  const closeButtonRef = useRef(null)
  const lightboxRef = useRef(null)

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose()
    }
    // Focus trap - keep focus within lightbox
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
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      // Focus the close button when lightbox opens
      setTimeout(() => closeButtonRef.current?.focus(), 0)
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

  // Don't render anything when closed
  if (!isOpen) return null

  const lightboxContent = (
    <div
      ref={lightboxRef}
      className="lightbox lightbox--open"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={imageAlt || 'Image lightbox'}
    >
      <div className="lightbox__content">
        <button ref={closeButtonRef} className="lightbox__close" onClick={onClose} aria-label="Close lightbox">
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

  return createPortal(lightboxContent, document.body)
}

export default Lightbox
