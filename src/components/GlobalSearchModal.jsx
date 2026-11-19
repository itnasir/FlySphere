import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Briefcase, FileCheck, HelpCircle, Plane, Search, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  COUNTRIES,
  FAQS,
  POPULAR_FARES,
  VISA_DESTINATIONS,
  formatBDT,
} from '../data/siteData'
import { scrollToSectionId } from '../utils/scrollToSection'

export default function GlobalSearchModal() {
  const {
    searchModalOpen,
    setSearchModalOpen,
    setSelectedCountryId,
    setActiveBookingTab,
  } = useApp()

  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [searchModalOpen, setSearchModalOpen])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const items = []

    COUNTRIES.forEach((c) => {
      items.push({
        id: `country-${c.id}`,
        category: 'Work Permit',
        title: `${c.name} Work Permit`,
        subtitle: `${c.sectors} · ${c.duration} · From ${formatBDT(c.packageFrom)}`,
        icon: Briefcase,
        searchBlob: `${c.name} ${c.region} ${c.sectors} work permit`,
        action: () => {
          setSelectedCountryId(c.id)
          setSearchModalOpen(false)
          if (location.pathname !== '/') {
            navigate('/#workpermit')
            setTimeout(() => scrollToSectionId('workpermit'), 120)
          } else {
            scrollToSectionId('workpermit')
          }
        },
      })
    })

    POPULAR_FARES.forEach((f) => {
      items.push({
        id: `fare-${f.id}`,
        category: 'Flight Route',
        title: `Dhaka (${f.from}) → ${f.city} (${f.to})`,
        subtitle: `${f.airline} · One way from ${formatBDT(f.oneWay)}`,
        icon: Plane,
        searchBlob: `${f.city} ${f.from} ${f.to} ${f.airline} flight air ticket`,
        action: () => {
          setSearchModalOpen(false)
          navigate(`/flights?from=${f.from}&to=${f.to}&trip=oneway&pax=1&cabin=Economy`)
        },
      })
    })

    VISA_DESTINATIONS.forEach((dest) => {
      items.push({
        id: `visa-${dest}`,
        category: 'Visa Assistance',
        title: `${dest} Visa Processing`,
        subtitle: 'Tourist, Business, Visit / Family & Transit visas',
        icon: FileCheck,
        searchBlob: `${dest} visa tourist business visit`,
        action: () => {
          setActiveBookingTab('visa')
          setSearchModalOpen(false)
          if (location.pathname !== '/') {
            navigate('/#book')
            setTimeout(() => scrollToSectionId('book'), 120)
          } else {
            scrollToSectionId('book')
          }
        },
      })
    })

    FAQS.forEach((faq) => {
      items.push({
        id: faq.id,
        category: 'FAQ',
        title: faq.q,
        subtitle: faq.a,
        icon: HelpCircle,
        searchBlob: `${faq.q} ${faq.a}`,
        action: () => {
          setSearchModalOpen(false)
          if (location.pathname !== '/') {
            navigate('/#faq')
            setTimeout(() => scrollToSectionId('faq'), 120)
          } else {
            scrollToSectionId('faq')
          }
        },
      })
    })

    if (!q) return items.slice(0, 8)
    return items.filter((item) => item.searchBlob.toLowerCase().includes(q))
  }, [query, location.pathname, navigate, setActiveBookingTab, setSearchModalOpen, setSelectedCountryId])

  if (!searchModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="fixed inset-0 bg-deep/55 backdrop-blur-xs"
        onClick={() => setSearchModalOpen(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global site search"
        className="relative z-10 w-full max-w-[640px] bg-white rounded-[20px] border border-line shadow-book overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-line bg-page">
          <Search className="w-5 h-5 text-navy shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search countries (Romania, Dubai), flights (DXB), visas, or FAQs..."
            className="flex-1 bg-transparent text-[15px] font-medium text-ink placeholder:text-subtle focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[12px] font-bold text-muted hover:text-ink px-2 py-1 rounded bg-white border border-line cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setSearchModalOpen(false)}
            aria-label="Close search"
            className="w-8 h-8 rounded-lg bg-tint text-ink hover:bg-line flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto divide-y divide-line">
          {results.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-[16px] font-bold text-ink mb-1">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-[14px] text-muted">
                Try searching for &ldquo;Romania&rdquo;, &ldquo;Dubai&rdquo;, &ldquo;Visa&rdquo;, or &ldquo;Payment&rdquo;.
              </p>
            </div>
          ) : (
            results.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  className="w-full text-left px-5 py-3.5 flex items-start gap-3.5 hover:bg-tint/70 transition-colors cursor-pointer"
                >
                  <span className="mt-0.5 w-9 h-9 rounded-xl bg-tint text-navy flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[15px] font-bold text-ink truncate">
                        {item.title}
                      </p>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-page border border-line text-muted shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[13px] text-muted truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
