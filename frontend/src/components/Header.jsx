import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './LanguageSelector'
import './Header.css'

function Header() {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          <img src="/images/logo.png" alt="Botanika Massage" />
        </a>

        <button
          className="header__mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}>
          <button onClick={() => scrollToSection('services')}>{t('nav.services')}</button>
          <button onClick={() => scrollToSection('packages')}>{t('nav.packages')}</button>
          <button onClick={() => scrollToSection('branches')}>{t('nav.locations')}</button>
          <button onClick={() => scrollToSection('contact')}>{t('nav.contact')}</button>
        </nav>

        <LanguageSelector />
      </div>
    </header>
  )
}

export default Header
