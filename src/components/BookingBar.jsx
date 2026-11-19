import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeftRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileCheck,
  Briefcase,
  Plane,
  Search,
  Users,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  AIRPORTS,
  COUNTRIES,
  JOB_CATEGORIES,
  VISA_DESTINATIONS,
  VISA_TYPES,
} from '../data/siteData'

function AirportCombobox({ label, valueCode, onChange, align = 'left' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef = useRef(null)

  const selected = useMemo(
    () => AIRPORTS.find((a) => a.code === valueCode) || AIRPORTS[0],
    [valueCode]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return AIRPORTS
    return AIRPORTS.filter(
      (a) =>
        a.city.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.airport.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q)
    )
  }, [query])

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="w-full text-left rounded-[12px] border border-field hover:border-royal bg-white px-3.5 py-2.5 transition-colors cursor-pointer"
      >
        <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
          {label}
        </span>
        <span className="block text-[16px] font-extrabold text-ink truncate mt-0.5">
          {selected.city} ({selected.code})
        </span>
        <span className="block text-[12px] text-subtle truncate">
          {selected.airport}
        </span>
      </button>

      {open && (
        <div
          className={`absolute top-full mt-1.5 w-full min-w-[270px] bg-white rounded-2xl border border-line shadow-book z-40 overflow-hidden ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="p-2.5 border-b border-line flex items-center gap-2 bg-page">
            <Search className="w-4 h-4 text-muted shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city, airport, or IATA..."
              className="w-full bg-transparent text-[14px] text-ink placeholder:text-subtle focus:outline-none"
            />
          </div>
          <ul role="listbox" className="max-h-[240px] overflow-y-auto divide-y divide-line/60">
            {filtered.length === 0 ? (
              <li className="px-4 py-5 text-center text-[13px] text-muted">
                No airports found for &ldquo;{query}&rdquo;
              </li>
            ) : (
              filtered.map((ap) => (
                <li key={ap.code}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(ap.code)
                      setOpen(false)
                      setQuery('')
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-2 hover:bg-tint transition-colors cursor-pointer ${
                      ap.code === valueCode ? 'bg-tint/80' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-ink truncate">
                        {ap.city}, {ap.country}
                      </p>
                      <p className="text-[12px] text-muted truncate">{ap.airport}</p>
                    </div>
                    <span className="font-mono text-[12px] font-semibold px-2 py-0.5 rounded bg-navy/10 text-navy shrink-0">
                      {ap.code}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

function getWeekdayLabel(dateStr) {
  if (!dateStr) return 'Select date'
  const d = new Date(dateStr + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return 'Select date'
  return d.toLocaleDateString('en-US', { weekday: 'long' })
}

export default function BookingBar() {
  const navigate = useNavigate()
  const {
    lang,
    t,
    activeBookingTab,
    setActiveBookingTab,
    workPermitFormCountry,
    setWorkPermitFormCountry,
    addApplication,
    showToast,
    openQuoteModal,
  } = useApp()

  // Flight state
  const [tripType, setTripType] = useState('oneway')
  const [fromCode, setFromCode] = useState('DAC')
  const [toCode, setToCode] = useState('DXB')
  const [depDate, setDepDate] = useState('2026-11-26')
  const [retDate, setRetDate] = useState('2026-12-10')
  const [pax, setPax] = useState(1)
  const [cabin, setCabin] = useState('Economy')
  const [paxOpen, setPaxOpen] = useState(false)
  const paxRef = useRef(null)

  // Visa form state
  const [visaDest, setVisaDest] = useState(VISA_DESTINATIONS[0])
  const [visaType, setVisaType] = useState(VISA_TYPES[0])
  const [visaName, setVisaName] = useState('')
  const [visaPhone, setVisaPhone] = useState('')
  const [visaError, setVisaError] = useState('')
  const [visaSubmittedId, setVisaSubmittedId] = useState('')

  // Work permit form state
  const wpCountry = workPermitFormCountry || 'Romania'
  const [wpJob, setWpJob] = useState(JOB_CATEGORIES[0].id)
  const [wpName, setWpName] = useState('')
  const [wpPhone, setWpPhone] = useState('')
  const [wpError, setWpError] = useState('')
  const [wpSubmittedId, setWpSubmittedId] = useState('')

  useEffect(() => {
    const onDoc = (e) => {
      if (paxRef.current && !paxRef.current.contains(e.target)) {
        setPaxOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const handleSwap = () => {
    const prevFrom = fromCode
    setFromCode(toCode)
    setToCode(prevFrom)
  }

  const handleFlightSubmit = (e) => {
    e.preventDefault()
    if (tripType === 'multicity') {
      openQuoteModal(`Multi-city flight quote (${fromCode} → ${toCode}, ${pax} Adult, ${cabin})`)
      return
    }
    if (fromCode === toCode) {
      showToast('Departure and destination airports cannot be the same.', 'error')
      return
    }
    const params = new URLSearchParams({
      from: fromCode,
      to: toCode,
      date: depDate,
      trip: tripType,
      pax: String(pax),
      cabin,
    })
    if (tripType === 'roundtrip') {
      params.set('ret', retDate)
    }
    navigate(`/flights?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleVisaSubmit = (e) => {
    e.preventDefault()
    setVisaError('')
    if (visaName.trim().length < 2) {
      setVisaError('Please enter your full name as shown on your passport.')
      return
    }
    if (visaPhone.trim().length < 8) {
      setVisaError('Please enter a valid mobile or WhatsApp number.')
      return
    }
    const created = addApplication({
      prefix: 'LT-VS',
      applicant: visaName.trim(),
      phone: visaPhone.trim(),
      service: 'Visa Assistance',
      country: visaDest,
      role: `${visaType} Visa`,
    })
    setVisaSubmittedId(created.id)
    setVisaName('')
    setVisaPhone('')
    showToast(`Visa enquiry submitted! Tracking ID: ${created.id}`, 'success')
  }

  const handleWorkPermitSubmit = (e) => {
    e.preventDefault()
    setWpError('')
    if (wpName.trim().length < 2) {
      setWpError('Please enter your full name as shown on your passport.')
      return
    }
    if (wpPhone.trim().length < 8) {
      setWpError('Please enter a valid mobile or WhatsApp number.')
      return
    }
    const created = addApplication({
      prefix: 'LT-WP',
      applicant: wpName.trim(),
      phone: wpPhone.trim(),
      service: 'Work Permit Processing',
      country: wpCountry,
      role: wpJob,
    })
    setWpSubmittedId(created.id)
    setWpName('')
    setWpPhone('')
    showToast(`Work permit enquiry submitted! Tracking ID: ${created.id}`, 'success')
  }

  const tabs = [
    { id: 'flight', label: t.tabs.flight, icon: Plane },
    { id: 'visa', label: t.tabs.visa, icon: FileCheck },
    { id: 'workpermit', label: t.tabs.workpermit, icon: Briefcase },
  ]

  return (
    <section id="book" className="relative z-10 -mt-[84px] sm:-mt-[100px] pb-10">
      <div className="wrap">
        <div className="bg-white rounded-[20px] shadow-book border border-line overflow-visible">
          {/* Top Tabs */}
          <div
            role="tablist"
            aria-label="Booking services"
            className="grid grid-cols-3 border-b border-line rounded-t-[20px] overflow-hidden"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active = activeBookingTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveBookingTab(tab.id)}
                  className={`relative flex items-center justify-center gap-2 py-4 px-3 text-[14px] sm:text-[15px] font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-white text-navy'
                      : 'bg-page text-muted hover:text-ink hover:bg-tint/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-cta' : 'text-muted'}`} />
                  <span>{tab.label}</span>
                  {active && (
                    <span
                      className="absolute bottom-0 inset-x-0 h-[3px] bg-cta"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab Panel 1: Air Ticket */}
          {activeBookingTab === 'flight' && (
            <form onSubmit={handleFlightSubmit} className="p-4 sm:p-6">
              {/* Trip Type Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="inline-flex items-center gap-2 flex-wrap">
                  {[
                    { id: 'oneway', label: lang === 'bn' ? 'ওয়ান ওয়ে' : 'One way' },
                    { id: 'roundtrip', label: lang === 'bn' ? 'রাউন্ড ট্রিপ' : 'Round trip' },
                    { id: 'multicity', label: lang === 'bn' ? 'মাল্টি-সিটি' : 'Multi-city' },
                  ].map((opt) => {
                    const pressed = tripType === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={pressed}
                        onClick={() => setTripType(opt.id)}
                        className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold border transition-colors cursor-pointer ${
                          pressed
                            ? 'bg-tint border-royal text-royal'
                            : 'bg-white border-field text-muted hover:border-navy hover:text-ink'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>

                {tripType === 'multicity' && (
                  <p className="text-[13px] font-medium text-muted">
                    Multi-city fares are quoted by our team.
                  </p>
                )}
              </div>

              {/* Fields Grid */}
              <div
                className={`grid gap-3 items-stretch ${
                  tripType === 'roundtrip'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.1fr_auto_1.1fr_0.9fr_0.9fr_1fr_auto]'
                    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.2fr_auto_1.2fr_1fr_1.1fr_auto]'
                }`}
              >
                <AirportCombobox
                  label={lang === 'bn' ? 'যাত্রা শুরু' : 'FROM'}
                  valueCode={fromCode}
                  onChange={setFromCode}
                />

                {/* Swap Button */}
                <div className="hidden md:flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleSwap}
                    aria-label="Swap departure and destination airports"
                    title="Swap airports"
                    className="w-9 h-9 rounded-full border border-field-strong bg-page hover:bg-navy hover:text-white hover:border-navy text-navy flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                <AirportCombobox
                  label={lang === 'bn' ? 'গন্তব্য' : 'TO'}
                  valueCode={toCode}
                  onChange={setToCode}
                />

                {/* Departure Date */}
                <label className="block rounded-[12px] border border-field hover:border-royal bg-white px-3.5 py-2.5 transition-colors cursor-pointer">
                  <span className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted">
                    <span>{lang === 'bn' ? 'যাত্রার তারিখ' : 'DEPARTURE'}</span>
                    <Calendar className="w-3.5 h-3.5 text-muted" />
                  </span>
                  <input
                    type="date"
                    value={depDate}
                    onChange={(e) => setDepDate(e.target.value)}
                    className="w-full text-[15px] font-extrabold text-ink bg-transparent mt-0.5 focus:outline-none cursor-pointer"
                  />
                  <span className="block text-[12px] text-subtle">
                    {getWeekdayLabel(depDate)}
                  </span>
                </label>

                {/* Return Date (Round trip only) */}
                {tripType === 'roundtrip' && (
                  <label className="block rounded-[12px] border border-field hover:border-royal bg-white px-3.5 py-2.5 transition-colors cursor-pointer">
                    <span className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted">
                      <span>{lang === 'bn' ? 'ফেরার তারিখ' : 'RETURN'}</span>
                      <Calendar className="w-3.5 h-3.5 text-muted" />
                    </span>
                    <input
                      type="date"
                      value={retDate}
                      min={depDate}
                      onChange={(e) => setRetDate(e.target.value)}
                      className="w-full text-[15px] font-extrabold text-ink bg-transparent mt-0.5 focus:outline-none cursor-pointer"
                    />
                    <span className="block text-[12px] text-subtle">
                      {getWeekdayLabel(retDate)}
                    </span>
                  </label>
                )}

                {/* Travellers & Class */}
                <div ref={paxRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setPaxOpen((o) => !o)}
                    aria-expanded={paxOpen}
                    className="w-full h-full text-left rounded-[12px] border border-field hover:border-royal bg-white px-3.5 py-2.5 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted">
                      <span>{lang === 'bn' ? 'যাত্রী ও ক্লাস' : 'TRAVELLERS & CLASS'}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted" />
                    </span>
                    <span className="block text-[15px] font-extrabold text-ink truncate mt-0.5">
                      {pax} {pax === 1 ? 'Adult' : 'Adults'} · {cabin}
                    </span>
                    <span className="block text-[12px] text-subtle truncate">
                      Baggage per fare rules
                    </span>
                  </button>

                  {paxOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-[260px] bg-white rounded-2xl border border-line shadow-book p-4 z-40 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[14px] font-bold text-ink flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-navy" />
                            Adults
                          </p>
                          <p className="text-[12px] text-muted">12+ years</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPax((p) => Math.max(1, p - 1))}
                            className="w-8 h-8 rounded-lg border border-field-strong font-bold hover:bg-tint cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-5 text-center font-bold">{pax}</span>
                          <button
                            type="button"
                            onClick={() => setPax((p) => Math.min(9, p + 1))}
                            className="w-8 h-8 rounded-lg border border-field-strong font-bold hover:bg-tint cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                          Cabin Class
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {['Economy', 'Business'].map((cls) => (
                            <button
                              key={cls}
                              type="button"
                              onClick={() => setCabin(cls)}
                              className={`py-2 rounded-lg text-[13px] font-bold border cursor-pointer ${
                                cabin === cls
                                  ? 'bg-navy text-white border-navy'
                                  : 'bg-white text-ink border-field hover:border-navy'
                              }`}
                            >
                              {cls}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPaxOpen(false)}
                        className="w-full py-2 rounded-lg bg-tint text-navy font-bold text-[13px] hover:bg-line cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="h-full min-h-[58px] px-6 rounded-[12px] bg-cta hover:bg-cta-hover text-white font-bold text-[15px] transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                >
                  {tripType === 'multicity'
                    ? lang === 'bn'
                      ? 'কোটেশন চান'
                      : 'Request a quote'
                    : lang === 'bn'
                    ? 'ফ্লাইট খুঁজুন'
                    : 'Search flights'}
                </button>
              </div>
            </form>
          )}

          {/* Tab Panel 2: Visa */}
          {activeBookingTab === 'visa' && (
            <form onSubmit={handleVisaSubmit} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.1fr_1fr_auto] gap-3 items-stretch">
                <label className="block rounded-[12px] border border-field bg-white px-3.5 py-2.5 focus-within:border-royal">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                    DESTINATION
                  </span>
                  <select
                    value={visaDest}
                    onChange={(e) => setVisaDest(e.target.value)}
                    className="w-full text-[15px] font-bold text-ink bg-transparent mt-1 focus:outline-none cursor-pointer"
                  >
                    {VISA_DESTINATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block rounded-[12px] border border-field bg-white px-3.5 py-2.5 focus-within:border-royal">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                    VISA TYPE
                  </span>
                  <select
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                    className="w-full text-[15px] font-bold text-ink bg-transparent mt-1 focus:outline-none cursor-pointer"
                  >
                    {VISA_TYPES.map((vt) => (
                      <option key={vt} value={vt}>
                        {vt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block rounded-[12px] border border-field bg-white px-3.5 py-2.5 focus-within:border-royal">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                    FULL NAME (AS PASSPORT)
                  </span>
                  <input
                    type="text"
                    value={visaName}
                    onChange={(e) => setVisaName(e.target.value)}
                    placeholder="e.g. Rahim Uddin"
                    className="w-full text-[15px] font-semibold text-ink placeholder:text-subtle bg-transparent mt-1 focus:outline-none"
                  />
                </label>

                <label className="block rounded-[12px] border border-field bg-white px-3.5 py-2.5 focus-within:border-royal">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                    MOBILE / WHATSAPP
                  </span>
                  <input
                    type="tel"
                    value={visaPhone}
                    onChange={(e) => setVisaPhone(e.target.value)}
                    placeholder="+880"
                    className="w-full text-[15px] font-semibold text-ink placeholder:text-subtle bg-transparent mt-1 focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="min-h-[58px] px-6 rounded-[12px] bg-cta hover:bg-cta-hover text-white font-bold text-[15px] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {lang === 'bn' ? 'ভিসার জন্য আবেদন' : 'Apply for visa'}
                </button>
              </div>

              {visaError && (
                <p className="mt-3 text-[13px] font-semibold text-bad bg-bad-bg px-3.5 py-2 rounded-lg">
                  {visaError}
                </p>
              )}
              {visaSubmittedId && (
                <div className="mt-3 flex items-center justify-between flex-wrap gap-2 text-[13.5px] font-semibold text-ok bg-ok-bg px-4 py-2.5 rounded-xl">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Visa enquiry received! Your tracking number is{' '}
                    <span className="font-mono font-bold">{visaSubmittedId}</span>.
                  </span>
                  <a
                    href="#track"
                    className="underline font-bold hover:text-navy"
                  >
                    Track status →
                  </a>
                </div>
              )}
            </form>
          )}

          {/* Tab Panel 3: Work Permit */}
          {activeBookingTab === 'workpermit' && (
            <form onSubmit={handleWorkPermitSubmit} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.1fr_1fr_auto] gap-3 items-stretch">
                <label className="block rounded-[12px] border border-field bg-white px-3.5 py-2.5 focus-within:border-royal">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                    COUNTRY
                  </span>
                  <select
                    value={wpCountry}
                    onChange={(e) => setWorkPermitFormCountry(e.target.value)}
                    className="w-full text-[15px] font-bold text-ink bg-transparent mt-1 focus:outline-none cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block rounded-[12px] border border-field bg-white px-3.5 py-2.5 focus-within:border-royal">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                    JOB CATEGORY
                  </span>
                  <select
                    value={wpJob}
                    onChange={(e) => setWpJob(e.target.value)}
                    className="w-full text-[15px] font-bold text-ink bg-transparent mt-1 focus:outline-none cursor-pointer"
                  >
                    {JOB_CATEGORIES.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block rounded-[12px] border border-field bg-white px-3.5 py-2.5 focus-within:border-royal">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                    FULL NAME
                  </span>
                  <input
                    type="text"
                    value={wpName}
                    onChange={(e) => setWpName(e.target.value)}
                    placeholder="As on passport"
                    className="w-full text-[15px] font-semibold text-ink placeholder:text-subtle bg-transparent mt-1 focus:outline-none"
                  />
                </label>

                <label className="block rounded-[12px] border border-field bg-white px-3.5 py-2.5 focus-within:border-royal">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                    MOBILE / WHATSAPP
                  </span>
                  <input
                    type="tel"
                    value={wpPhone}
                    onChange={(e) => setWpPhone(e.target.value)}
                    placeholder="+880"
                    className="w-full text-[15px] font-semibold text-ink placeholder:text-subtle bg-transparent mt-1 focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="min-h-[58px] px-6 rounded-[12px] bg-cta hover:bg-cta-hover text-white font-bold text-[15px] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {lang === 'bn' ? 'আবেদন জমা দিন' : 'Submit enquiry'}
                </button>
              </div>

              {wpError && (
                <p className="mt-3 text-[13px] font-semibold text-bad bg-bad-bg px-3.5 py-2 rounded-lg">
                  {wpError}
                </p>
              )}
              {wpSubmittedId && (
                <div className="mt-3 flex items-center justify-between flex-wrap gap-2 text-[13.5px] font-semibold text-ok bg-ok-bg px-4 py-2.5 rounded-xl">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Work permit enquiry submitted! Tracking ID:{' '}
                    <span className="font-mono font-bold">{wpSubmittedId}</span>.
                  </span>
                  <a
                    href="#track"
                    className="underline font-bold hover:text-navy"
                  >
                    Track status →
                  </a>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
