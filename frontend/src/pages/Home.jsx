import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ServiceCard from '../components/ServiceCard'
import ServiceModal from '../components/ServiceModal'
import PackageCard from '../components/PackageCard'
import TestimonialCarousel from '../components/TestimonialCarousel'
import BranchCard from '../components/BranchCard'
import Footer from '../components/Footer'
import services from '../data/services.json'
import packages from '../data/packages.json'
import branches from '../data/branches.json'
import testimonials from '../data/testimonials.json'
import './Home.css'

function Home() {
  const { t } = useTranslation()
  const [selectedService, setSelectedService] = useState(null)

  return (
    <div className="home">
      <Header />
      <Hero />

      {/* Services Section */}
      <section id="services" className="section section--light">
        <div className="container">
          <h2 className="section-title">{t('services.title')}</h2>
          <div className="services-grid">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={setSelectedService}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="section">
        <div className="container">
          <h2 className="section-title">{t('packages.title')}</h2>
          <div className="packages-grid">
            {packages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section section--light">
        <div className="container">
          <h2 className="section-title">{t('testimonials.title')}</h2>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="section">
        <div className="container">
          <h2 className="section-title">{t('branches.title')}</h2>
          <div className="branches-grid">
            {branches.map(branch => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Service Modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          animationData={null}
        />
      )}
    </div>
  )
}

export default Home
