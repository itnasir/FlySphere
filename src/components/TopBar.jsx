import { Phone, Mail, MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function TopBar() {
  const { t } = useApp()

  return (
    <div className="hidden md:block bg-deep text-on-navy text-[13px] border-b border-white/10">
      <div className="wrap flex items-center justify-between py-2 gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <a
            href="tel:+8801312772233"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-cta-light" />
            <span>{t.topContact}</span>
          </a>
          <span className="text-white/25" aria-hidden="true">
            ·
          </span>
          <a
            href="mailto:info@lusantravelsbd.com"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-cta-light" />
            <span>info@lusantravelsbd.com</span>
          </a>
        </div>
        <div className="inline-flex items-center gap-1.5 text-on-navy-2">
          <MapPin className="w-3.5 h-3.5 text-cta-light shrink-0" />
          <span>{t.topHours}</span>
        </div>
      </div>
    </div>
  )
}
