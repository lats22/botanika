import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './LanguageSelector.css'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'th', label: 'ไทย' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
  { code: 'ko', label: '한국' }
]

function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const selectorRef = useRef(null)

  // Handle both 'en' and 'en-US' style codes
  const langCode = i18n.language?.split('-')[0] || 'en'
  const currentLang = languages.find(l => l.code === langCode) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    // Close on scroll
    const handleScroll = () => {
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const changeLanguage = (e, code) => {
    e.preventDefault()
    e.stopPropagation()
    // Explicitly set localStorage first to ensure persistence
    localStorage.setItem('i18nextLng', code)
    i18n.changeLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="language-selector" ref={selectorRef}>
      <button
        className="language-selector__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className="language-selector__code">{currentLang.label}</span>
      </button>

      {isOpen && (
        <ul className="language-selector__dropdown">
          {languages.map(lang => (
            <li key={lang.code}>
              <button
                onClick={(e) => changeLanguage(e, lang.code)}
                className={lang.code === langCode ? 'active' : ''}
              >
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSelector
