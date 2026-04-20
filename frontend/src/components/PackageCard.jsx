import React from 'react'
import { useTranslation } from 'react-i18next'
import './PackageCard.css'

function PackageCard({ pkg }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const name = pkg.name[lang] || pkg.name.en

  return (
    <article className="package-card">
      <div className="package-card__header">
        <h3 className="package-card__name">{name}</h3>
        <span className="package-card__duration">
          {pkg.duration} {t('services.minutes')}
        </span>
      </div>
      <div className="package-card__content">
        <p className="package-card__label">{t('packages.includes')}:</p>
        <ul className="package-card__includes">
          {pkg.includes.map((item, index) => (
            <li key={index}>{item[lang] || item.en}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default PackageCard
