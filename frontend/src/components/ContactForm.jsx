import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './ContactForm.css'

function ContactForm() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus({ type: 'success', message: t('contact.success') })
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        throw new Error('Failed to send')
      }
    } catch (error) {
      setStatus({ type: 'error', message: t('contact.error') })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__group">
        <label htmlFor="name">{t('contact.name')}</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="contact-form__group">
        <label htmlFor="email">{t('contact.email')}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="contact-form__group">
        <label htmlFor="phone">{t('contact.phone')}</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="contact-form__group">
        <label htmlFor="message">{t('contact.message')}</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>

      {status.message && (
        <div className={`contact-form__status contact-form__status--${status.type}`}>
          {status.message}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary contact-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? '...' : t('contact.send')}
      </button>
    </form>
  )
}

export default ContactForm
