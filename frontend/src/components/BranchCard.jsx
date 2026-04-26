import React from 'react'
import { useTranslation } from 'react-i18next'
import BranchGallery from './BranchGallery'
import './BranchCard.css'

function BranchCard({ branch }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const address = branch.address[lang] || branch.address.en

  return (
    <article className="branch-card">
      {branch.images && branch.images.length > 0 && (
        <BranchGallery images={branch.images} branchName={branch.name} />
      )}
      <h3 className="branch-card__name">{branch.name}</h3>

      <div className="branch-card__info">
        <div className="branch-card__row">
          <span className="branch-card__icon">📍</span>
          <span>{address !== 'TBD' ? address : 'Address coming soon'}</span>
        </div>

        <div className="branch-card__row">
          <span className="branch-card__icon">📞</span>
          <a href={`tel:${branch.phone}`} className="branch-card__phone">
            {branch.phone}
          </a>
        </div>

        <div className="branch-card__row">
          <span className="branch-card__icon">🕐</span>
          <span>{t('branches.hours')}: {branch.hours}</span>
        </div>
      </div>

      {/* QR Code Section */}
      {branch.qrCode && branch.mapsUrl && (
        <div className="branch-card__qr-section">
          <a
            href={branch.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="branch-card__qr-link"
          >
            <div className="branch-card__qr-frame">
              <img
                src={branch.qrCode}
                alt={`QR code for ${branch.name} directions`}
                className="branch-card__qr-image"
                loading="lazy"
              />
            </div>
            <span className="branch-card__qr-label">
              {t('branches.scanForDirections', 'Scan for directions')}
            </span>
          </a>
        </div>
      )}

      {branch.mapsUrl && (
        <a
          href={branch.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary branch-card__btn"
        >
          {t('branches.directions')}
        </a>
      )}
    </article>
  )
}

export default BranchCard
