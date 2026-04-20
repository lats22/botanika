import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './TestimonialCarousel.css'

function TestimonialCarousel({ testimonials }) {
  const { i18n } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const lang = i18n.language

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'tripadvisor': return '🦉'
      case 'facebook': return '📘'
      case 'instagram': return '📷'
      default: return '⭐'
    }
  }

  return (
    <div className="testimonial-carousel">
      <div className="testimonial-carousel__container">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`testimonial-carousel__slide ${index === currentIndex ? 'active' : ''}`}
          >
            <div className="testimonial-carousel__stars">
              {'★'.repeat(testimonial.rating)}
            </div>
            <blockquote className="testimonial-carousel__text">
              "{testimonial.text[lang] || testimonial.text.en}"
            </blockquote>
            <div className="testimonial-carousel__author">
              <span className="testimonial-carousel__platform">
                {getPlatformIcon(testimonial.platform)}
              </span>
              <span>{testimonial.author}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonial-carousel__dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`testimonial-carousel__dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default TestimonialCarousel
