import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './Hero.css'

function Hero() {
  const { t } = useTranslation()
  const [videoError, setVideoError] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef(null)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleVideoReady = () => {
    setVideoReady(true)
  }

  return (
    <section className="hero">
      <div className="hero__video-container">
        {!videoError ? (
          <video
            ref={videoRef}
            className={`hero__video ${videoReady ? 'hero__video--ready' : ''}`}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={handleVideoReady}
            onError={() => setVideoError(true)}
          >
            <source src="/video/Silom13.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            className="hero__image"
            src="/images/hero-fallback.jpg"
            alt="Botanika Massage"
          />
        )}
        <div className="hero__overlay"></div>
      </div>

      <div className="hero__content">
        <img
          src="/images/logo.png"
          alt="Botanika Massage"
          className="hero__logo"
        />
        <p className="hero__tagline">{t('hero.tagline')}</p>
        <div className="hero__buttons">
          <button
            className="btn btn-primary"
            onClick={() => scrollToSection('services')}
          >
            {t('hero.viewServices')}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => scrollToSection('contact')}
          >
            {t('hero.contactUs')}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
