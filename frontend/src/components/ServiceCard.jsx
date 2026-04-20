import React from 'react'
import { useTranslation } from 'react-i18next'
import './ServiceCard.css'

function ServiceCard({ service, onClick }) {
  const { t, i18n } = useTranslation()
  // Handle both 'en' and 'en-US' style codes
  const lang = i18n.language?.split('-')[0] || 'en'

  const name = service.name[lang] || service.name.en

  return (
    <article className="service-card" onClick={() => onClick(service)}>
      <div className="service-card__image">
        <img src={`/images/${service.image}`} alt={name} loading="lazy" />
        <div className="service-card__overlay">
          <span>{t('services.viewDetails') || 'View Details'}</span>
        </div>
      </div>
      <div className="service-card__content">
        <h3 className="service-card__name">{name}</h3>
      </div>
    </article>
  )
}

export default ServiceCard
