import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import th from './locales/th.json'
import zh from './locales/zh.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import ko from './locales/ko.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      th: { translation: th },
      zh: { translation: zh },
      fr: { translation: fr },
      es: { translation: es },
      ko: { translation: ko }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'th', 'zh', 'fr', 'es', 'ko'],
    load: 'languageOnly',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    }
  })

export default i18n
