import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import BookingBar from '../components/BookingBar'
import MarqueeStrip from '../components/MarqueeStrip'
import ServicesSection from '../components/ServicesSection'
import CountriesSection from '../components/CountriesSection'
import CostCalculator from '../components/CostCalculator'
import PopularFares from '../components/PopularFares'
import ProcessSection from '../components/ProcessSection'
import TrackSection from '../components/TrackSection'
import FaqSection from '../components/FaqSection'
import ContactSection from '../components/ContactSection'
import { useApp } from '../context/AppContext'
import { scrollToSectionId } from '../utils/scrollToSection'

export default function HomePage() {
  const location = useLocation()
  const { setActiveBookingTab } = useApp()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')
    if (tabParam === 'visa' || tabParam === 'workpermit' || tabParam === 'flight') {
      setActiveBookingTab(tabParam)
    }
    if (location.hash) {
      setTimeout(() => scrollToSectionId(location.hash), 80)
    }
  }, [location.hash, location.search, setActiveBookingTab])

  return (
    <main>
      <Hero />
      <BookingBar />
      <MarqueeStrip />
      <ServicesSection />
      <CountriesSection />
      <CostCalculator />
      <PopularFares />
      <ProcessSection />
      <TrackSection />
      <FaqSection />
      <ContactSection />
    </main>
  )
}
