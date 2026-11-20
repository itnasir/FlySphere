import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { scrollToSectionId } from '../utils/scrollToSection'

export default function Footer() {
  const { t, setActiveBookingTab } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  const goSection = (id, tab = null) => {
    if (tab) setActiveBookingTab(tab)
    if (location.pathname !== '/') {
      navigate(`/#${id}`)
      setTimeout(() => scrollToSectionId(id), 120)
    } else {
      scrollToSectionId(id)
    }
  }

  return (
    <footer className="bg-deep text-on-navy pt-14 pb-8">
      <div className="wrap">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Brand Pill */}
          <div>
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-block bg-white px-4 py-2.5 rounded-[12px] mb-4"
            >
              <img
                src="/assets/logo.png"
                alt="Lusan Travels"
                className="h-[40px] w-auto object-contain"
              />
            </Link>
            <p className="text-[14px] text-on-navy-2 leading-relaxed max-w-[280px]">
              {t.footerTagline}
            </p>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="display text-[14px] font-extrabold uppercase tracking-wider text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <button
                  type="button"
                  onClick={() => goSection('workpermit')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Work permit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goSection('book', 'visa')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Visa assistance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goSection('fares')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Air tickets
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="display text-[14px] font-extrabold uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <button
                  type="button"
                  onClick={() => goSection('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goSection('track')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track application
                </button>
              </li>
              <li>
                <Link
                  to="/agent"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-white transition-colors"
                >
                  Agent portal
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-white transition-colors"
                >
                  Customer login
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-white transition-colors"
                >
                  Staff login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Office */}
          <div>
            <h4 className="display text-[14px] font-extrabold uppercase tracking-wider text-white mb-4">
              Office
            </h4>
            <p className="text-[14px] text-on-navy leading-relaxed mb-2.5">
              98/6, Sky View Tower, Atish Dipankar Road, Khilgaon (South Basabo), Dhaka-1214
            </p>
            <a
              href="tel:+8801937866936"
              className="inline-block text-[14.5px] font-bold text-white hover:text-cta-light transition-colors"
            >
              +880 1937 866936
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-on-navy-3">
          <p>© 2026 FlySphere BD Travel & Tours. All Rights Reserved.</p>
          <p>Khilgaon, Dhaka · Sat–Thu 10:00–19:00</p>
        </div>
      </div>
    </footer>
  )
}
