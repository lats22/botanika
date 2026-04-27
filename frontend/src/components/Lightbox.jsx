import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
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

  // Don't render anything when closed
  if (!isOpen) return null

  const lightboxContent = (
    <div
      className="lightbox lightbox--open"
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

  return createPortal(lightboxContent, document.body)
}

export default Lightbox
