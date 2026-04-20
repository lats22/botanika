import React, { useState } from 'react'
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

  // Handle both 'en' and 'en-US' style codes
  const langCode = i18n.language?.split('-')[0] || 'en'
  const currentLang = languages.find(l => l.code === langCode) || languages[0]

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="language-selector">
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
                onClick={() => changeLanguage(lang.code)}
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
