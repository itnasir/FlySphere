import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Menu,
  Search,
  User,
  X,
  Briefcase,
  FileCheck,
  Plane,
  Calculator,
  Globe2,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { scrollToSectionId } from '../utils/scrollToSection'

export default function Header() {
  const {
    lang,
    setLang,
    t,
    setActiveBookingTab,
    setSearchModalOpen,
  } = useApp()

  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [activeSection, setActiveSection] = useState('top')
  const headerRef = useRef(null)

  // Scroll spy on homepage
  useEffect(() => {
    if (location.pathname !== '/') return
    const sectionIds = ['top', 'services', 'workpermit', 'fares', 'track', 'contact']

    const onScroll = () => {
      const scrollY = window.scrollY + 140
      let current = 'top'
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) {
          current = id
        }
      }
      setActiveSection(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const onDocClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenDropdown(null)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const goToSection = (sectionId, tabOverride = null) => {
    setOpenDropdown(null)
    setMobileOpen(false)
    if (tabOverride) {
      setActiveBookingTab(tabOverride)
    }
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`)
      setTimeout(() => scrollToSectionId(sectionId), 120)
    } else {
      scrollToSectionId(sectionId)
    }
  }

  const goToRoute = (path) => {
    setOpenDropdown(null)
    setMobileOpen(false)
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isNavActive = (key) => {
    if (location.pathname === '/flights' || location.pathname === '/flights/checkout') {
      return key === 'fares'
    }
    if (location.pathname === '/account') return key === 'account'
    if (location.pathname !== '/') return false
    return activeSection === key
  }

  const navItems = [
    {
      key: 'top',
      label: t.nav.home,
      hideClass: '',
      action: () => goToSection('top'),
    },
    {
      key: 'services',
      label: t.nav.services,
      hideClass: '',
      action: () => goToSection('services'),
      dropdown: [
        {
          icon: Briefcase,
          title: lang === 'bn' ? 'ওয়ার্ক পারমিট প্রসেসিং' : 'Work Permit Processing',
          desc: lang === 'bn' ? 'ইউরোপ, গালফ ও এশিয়া' : 'Europe, Gulf & Asia job files',
          onClick: () => goToSection('book', 'workpermit'),
        },
        {
          icon: FileCheck,
          title: lang === 'bn' ? 'ভিসা সহায়তা' : 'Visa Assistance',
          desc: lang === 'bn' ? 'ট্যুরিস্ট, বিজনেস ও ভিজিট' : 'Tourist, Business & Visit visas',
          onClick: () => goToSection('book', 'visa'),
        },
        {
          icon: Plane,
          title: lang === 'bn' ? 'বিমান টিকিট বুকিং' : 'Air Ticket Booking',
          desc: lang === 'bn' ? 'তাৎক্ষণিক ই-টিকিট ও গ্রুপ ভাড়া' : 'Instant e-tickets & group fares',
          onClick: () => goToSection('book', 'flight'),
        },
        {
          icon: Calculator,
          title: lang === 'bn' ? 'খরচ ক্যালকুলেটর' : 'Cost Calculator',
          desc: lang === 'bn' ? 'তাৎক্ষণিক প্যাকেজ হিসাব' : 'Estimate total permit budget',
          onClick: () => goToSection('calculator'),
        },
      ],
    },
    {
      key: 'workpermit',
      label: t.nav.workpermit,
      hideClass: 'hidden min-[861px]:inline-flex',
      action: () => goToSection('workpermit'),
      dropdown: [
        {
          icon: Globe2,
          title: lang === 'bn' ? 'সব ৮টি দেশ দেখুন' : 'All 8 Countries',
          desc: 'Romania, Poland, UAE, Saudi & more',
          onClick: () => goToSection('workpermit'),
        },
        {
          icon: Globe2,
          title: lang === 'bn' ? 'ইউরোপ (৪ দেশ)' : 'Europe (4 Countries)',
          desc: 'Romania, Poland, Croatia, Serbia',
          onClick: () => goToSection('workpermit'),
        },
        {
          icon: Globe2,
          title: lang === 'bn' ? 'গালফ (৩ দেশ)' : 'Gulf (3 Countries)',
          desc: 'Saudi Arabia, Qatar, UAE',
          onClick: () => goToSection('workpermit'),
        },
      ],
    },
    {
      key: 'fares',
      label: t.nav.fares,
      hideClass: 'hidden min-[861px]:inline-flex',
      action: () => goToSection('fares'),
      dropdown: [
        {
          icon: Plane,
          title: lang === 'bn' ? 'ঢাকা থেকে জনপ্রিয় ভাড়া' : 'Popular Fares from Dhaka',
          desc: 'DXB, JED, DOH, KUL, SIN, OTP',
          onClick: () => goToSection('fares'),
        },
        {
          icon: Search,
          title: lang === 'bn' ? 'সব ফ্লাইট খুঁজুন' : 'Live Flight Search',
          desc: 'Compare airlines, stops & baggage',
          onClick: () => goToRoute('/flights?from=DAC&to=DXB&trip=oneway&pax=1&cabin=Economy'),
        },
      ],
    },
    {
      key: 'track',
      label: t.nav.track,
      hideClass: 'hidden min-[1181px]:inline-flex',
      action: () => goToSection('track'),
    },
    {
      key: 'contact',
      label: t.nav.contact,
      hideClass: 'hidden min-[1181px]:inline-flex',
      action: () => goToSection('contact'),
    },
  ]

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-30 bg-white/98 backdrop-blur-md border-b border-line"
      >
        <div className="wrap h-[72px] flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="shrink-0 flex items-center gap-2 focus-visible:rounded-lg"
            aria-label="Lusan Travels Home"
          >
            <img
              src="/assets/logo.png"
              alt="Lusan Travels"
              className="h-[46px] sm:h-[50px] w-auto max-w-[190px] object-contain"
            />
          </Link>

          {/* Desktop / Tablet Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Primary Navigation">
            {navItems.map((item) => {
              const active = isNavActive(item.key)
              const hasDropdown = Boolean(item.dropdown)
              const isOpen = openDropdown === item.key

              return (
                <div
                  key={item.key}
                  className={`relative items-center ${item.hideClass || 'inline-flex'}`}
                  onMouseEnter={() => hasDropdown && setOpenDropdown(item.key)}
                  onMouseLeave={() => hasDropdown && setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (hasDropdown && openDropdown !== item.key) {
                        setOpenDropdown(item.key)
                      } else {
                        item.action()
                      }
                    }}
                    aria-expanded={hasDropdown ? isOpen : undefined}
                    className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'text-cta bg-cta/5'
                        : 'text-ink hover:text-navy hover:bg-tint/70'
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-cta' : 'text-muted'
                        }`}
                      />
                    )}
                  </button>

                  {hasDropdown && isOpen && (
                    <div className="absolute left-0 top-full pt-2 w-[270px] z-40">
                      <div className="bg-white rounded-2xl border border-line shadow-book p-2">
                        {item.dropdown.map((sub) => {
                          const Icon = sub.icon
                          return (
                            <button
                              key={sub.title}
                              type="button"
                              onClick={sub.onClick}
                              className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-tint/80 transition-colors cursor-pointer group"
                            >
                              <span className="mt-0.5 w-8 h-8 rounded-lg bg-tint text-navy flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
                                <Icon className="w-4 h-4" />
                              </span>
                              <span>
                                <span className="block text-[13.5px] font-bold text-ink group-hover:text-navy">
                                  {sub.title}
                                </span>
                                <span className="block text-[12px] text-muted leading-snug">
                                  {sub.desc}
                                </span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Live Search Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search site"
              title="Search countries, flights, visas (Ctrl+K)"
              className="inline-flex items-center gap-1.5 h-[40px] px-2.5 sm:px-3 rounded-[10px] border border-field-strong bg-white text-ink hover:border-navy hover:text-navy text-[13px] font-semibold transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-navy" />
              <span className="hidden lg:inline">{t.nav.search}</span>
            </button>

            {/* Language Switcher */}
            <div
              className="hidden sm:inline-flex items-center bg-tint p-1 rounded-[10px] border border-line"
              role="group"
              aria-label="Language switch"
            >
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`px-2.5 py-1 rounded-[8px] text-[12.5px] font-semibold transition-colors cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-royal text-white shadow-xs'
                    : 'text-ink hover:text-navy'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-[8px] text-[12.5px] font-semibold transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-royal text-white shadow-xs'
                    : 'text-ink hover:text-navy'
                }`}
              >
                EN
              </button>
            </div>

            {/* My account */}
            <Link
              to="/account"
              className="hidden min-[764px]:inline-flex min-[861px]:hidden min-[1001px]:inline-flex items-center gap-1.5 h-[40px] px-3.5 rounded-[10px] border border-field-strong bg-white text-ink hover:border-navy hover:text-navy text-[13.5px] font-semibold transition-colors whitespace-nowrap"
            >
              <User className="w-4 h-4 text-navy" />
              <span>{t.nav.account}</span>
            </Link>

            {/* Book now */}
            <button
              type="button"
              onClick={() => goToSection('book')}
              className="inline-flex items-center justify-center h-[40px] px-4 rounded-[10px] bg-cta hover:bg-cta-hover text-white text-[13.5px] font-bold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              {t.nav.bookNow}
            </button>

            {/* Hamburger (<1181px) */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="inline-flex min-[1181px]:hidden items-center justify-center w-[42px] h-[40px] rounded-[10px] border border-field-strong bg-white text-ink hover:border-navy cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-deep/55 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="relative w-full max-w-[340px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
          >
            <div>
              <div className="flex items-center justify-between px-5 py-4 border-b border-line">
                <img src="/assets/logo.png" alt="Lusan Travels" className="h-[40px] w-auto" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-[10px] bg-tint text-ink flex items-center justify-center hover:bg-line cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Switcher inside Drawer */}
              <div className="px-5 py-3.5 border-b border-line flex items-center justify-between">
                <span className="text-[13px] font-semibold text-muted">
                  {lang === 'bn' ? 'ভাষা' : 'Language'}
                </span>
                <div className="inline-flex items-center bg-tint p-1 rounded-[10px]">
                  <button
                    type="button"
                    onClick={() => setLang('bn')}
                    className={`px-3 py-1 rounded-[8px] text-[12.5px] font-semibold cursor-pointer ${
                      lang === 'bn' ? 'bg-royal text-white' : 'text-ink'
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 rounded-[8px] text-[12.5px] font-semibold cursor-pointer ${
                      lang === 'en' ? 'bg-royal text-white' : 'text-ink'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Drawer Nav Links */}
              <div className="px-5 py-2 divide-y divide-line">
                <button
                  type="button"
                  onClick={() => goToSection('top')}
                  className="w-full text-left py-3.5 text-[15px] font-bold text-ink hover:text-cta cursor-pointer"
                >
                  {t.nav.home}
                </button>
                <button
                  type="button"
                  onClick={() => goToSection('services')}
                  className="w-full text-left py-3.5 text-[15px] font-bold text-ink hover:text-cta cursor-pointer"
                >
                  {t.nav.services}
                </button>
                <button
                  type="button"
                  onClick={() => goToSection('workpermit')}
                  className="w-full text-left py-3.5 text-[15px] font-bold text-ink hover:text-cta cursor-pointer"
                >
                  {t.nav.workpermit}
                </button>
                <button
                  type="button"
                  onClick={() => goToSection('fares')}
                  className="w-full text-left py-3.5 text-[15px] font-bold text-ink hover:text-cta cursor-pointer"
                >
                  {t.nav.fares}
                </button>
                <button
                  type="button"
                  onClick={() => goToSection('track')}
                  className="w-full text-left py-3.5 text-[15px] font-bold text-ink hover:text-cta cursor-pointer"
                >
                  {t.nav.track}
                </button>
                <button
                  type="button"
                  onClick={() => goToSection('contact')}
                  className="w-full text-left py-3.5 text-[15px] font-bold text-ink hover:text-cta cursor-pointer"
                >
                  {t.nav.contact}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    setSearchModalOpen(true)
                  }}
                  className="w-full flex items-center gap-2 text-left py-3.5 text-[15px] font-bold text-royal hover:text-cta cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সাইট খুঁজুন' : 'Search site'}</span>
                </button>
              </div>
            </div>

            <div className="p-5 border-t border-line space-y-2.5 bg-page">
              <button
                type="button"
                onClick={() => goToRoute('/account')}
                className="w-full h-11 rounded-[12px] border border-field-strong bg-white text-ink font-bold text-[14px] flex items-center justify-center gap-2 hover:border-navy cursor-pointer"
              >
                <User className="w-4 h-4 text-navy" />
                <span>{t.nav.account}</span>
              </button>
              <button
                type="button"
                onClick={() => goToSection('book')}
                className="w-full h-11 rounded-[12px] bg-cta hover:bg-cta-hover text-white font-bold text-[14px] cursor-pointer"
              >
                {t.nav.bookNow}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
