import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Lottie from 'lottie-react'
import './ServiceModal.css'

function ServiceModal({ service, onClose, animationData }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])

  if (!service) return null

  const name = service.name[lang] || service.name.en
  const description = service.description[lang] || service.description.en

  return (
    <div className="service-modal" onClick={onClose}>
      <div className="service-modal__content" onClick={e => e.stopPropagation()}>
        <button className="service-modal__close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {animationData && (
          <div className="service-modal__animation">
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}
            />
          </div>
        )}

        <h2 className="service-modal__title">{name}</h2>

        <p className="service-modal__description">{description}</p>

        <div className="service-modal__durations">
          <span className="service-modal__label">{t('services.duration')}:</span>
          <div className="service-modal__duration-list">
            {service.durations.map(d => (
              <span key={d} className="service-modal__duration">
                {d} {t('services.minutes')}
              </span>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary service-modal__cta"
          onClick={() => {
            onClose()
            const number = import.meta.env.VITE_WHATSAPP_NUMBER
            if (number) {
              const message = t('whatsapp.prefillMessage')
              window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank')
            }
          }}
        >
          {t('hero.contactUs')}
        </button>
      </div>
    </div>
  )
}

export default ServiceModal
