import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './LanguageSelector'
import WhatsAppButton from './WhatsAppButton'
import './Header.css'

function Header() {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navRef = useRef(null)
  const toggleRef = useRef(null)
  const timeoutRef = useRef(null)

  // Auto-hide menu after 5 seconds of inactivity
  useEffect(() => {
    if (isMobileMenuOpen) {
      timeoutRef.current = setTimeout(() => {
        setIsMobileMenuOpen(false)
      }, 5000)
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isMobileMenuOpen])

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      setIsMobileMenuOpen(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        navRef.current &&
        !navRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__container">
        <a href="#" className="header__logo">
          <img src="/images/logo.jpg" alt="Botanika Massage" />
        </a>

        <button
          ref={toggleRef}
          className="header__mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav ref={navRef} className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}>
          <button onClick={() => scrollToSection('services')}>{t('nav.services')}</button>
          <button onClick={() => scrollToSection('packages')}>{t('nav.packages')}</button>
          <button onClick={() => scrollToSection('branches')}>{t('nav.locations')}</button>
        </nav>

        <WhatsAppButton />

        <LanguageSelector />
      </div>
    </header>
  )
}

export default Header
