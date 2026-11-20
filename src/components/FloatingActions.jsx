import { MessageCircle, Phone, Plane } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { scrollToSectionId } from '../utils/scrollToSection'

export default function FloatingActions() {
  const { lang } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  const handleBookNow = () => {
    if (location.pathname !== '/') {
      navigate('/#book')
      setTimeout(() => scrollToSectionId('book'), 120)
    } else {
      scrollToSectionId('book')
    }
  }

  return (
    <>
      {/* Desktop WhatsApp Pill */}
      <a
        href="https://wa.me/8801937866936"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="hidden md:inline-flex fixed bottom-6 right-6 z-40 items-center gap-2.5 h-12 px-5 rounded-full bg-wa hover:bg-[#198f55] text-white font-bold text-[14px] shadow-book transition-transform hover:-translate-y-0.5"
      >
        <MessageCircle className="w-5 h-5" />
        <span>WhatsApp</span>
      </a>

      {/* Mobile Fixed Bottom Sticky Bar (<768px) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line px-3 py-2.5 flex items-center gap-2 shadow-[0_-8px_24px_rgba(7,23,61,0.08)]">
        <a
          href="tel:+8801937866936"
          className="flex-1 h-11 rounded-[10px] border border-field-strong bg-page text-ink font-bold text-[13.5px] flex items-center justify-center gap-1.5"
        >
          <Phone className="w-4 h-4 text-navy" />
          <span>{lang === 'bn' ? 'কল' : 'Call'}</span>
        </a>

        <a
          href="https://wa.me/8801937866936"
          target="_blank"
          rel="noreferrer"
          className="flex-1 h-11 rounded-[10px] bg-wa text-white font-bold text-[13.5px] flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={handleBookNow}
          className="flex-[1.2] h-11 rounded-[10px] bg-cta text-white font-bold text-[13.5px] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plane className="w-4 h-4" />
          <span>{lang === 'bn' ? 'বুক করুন' : 'Book now'}</span>
        </button>
      </div>
    </>
  )
}
