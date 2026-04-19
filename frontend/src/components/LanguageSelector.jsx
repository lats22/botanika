import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './LanguageSelector.css'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
]

function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

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
        <span className="language-selector__flag">{currentLang.flag}</span>
        <span className="language-selector__code">{currentLang.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <ul className="language-selector__dropdown">
          {languages.map(lang => (
            <li key={lang.code}>
              <button
                onClick={() => changeLanguage(lang.code)}
                className={lang.code === i18n.language ? 'active' : ''}
              >
                <span className="language-selector__flag">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSelector
