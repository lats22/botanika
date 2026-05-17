import React from 'react'
import { useTranslation } from 'react-i18next'
import './ServiceCard.css'

function ServiceCard({ service, onClick }) {
  const { t, i18n } = useTranslation()
  // Handle both 'en' and 'en-US' style codes
  const lang = i18n.language?.split('-')[0] || 'en'

  const name = service.name[lang] || service.name.en
  const imgPath = `/images/${service.image}`
  // Only JPG/JPEG sources have a WebP sibling; PNG service images (e.g. Coconut Oil) skip the <source>.
  const webpSrc = /\.(jpe?g)$/i.test(imgPath) ? imgPath.replace(/\.(jpe?g)$/i, '.webp') : null

  return (
    <article className="service-card" onClick={() => onClick(service)}>
      <div className="service-card__image">
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img src={imgPath} alt={name} loading="lazy" />
        </picture>
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
