import { useMemo, useState } from 'react'
import { ArrowRight, Check, Search, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { COUNTRIES, formatBDT } from '../data/siteData'
import { useReveal } from '../hooks/useReveal'
import { scrollToSectionId } from '../utils/scrollToSection'

export default function CountriesSection() {
  const {
    lang,
    t,
    selectedCountryId,
    setSelectedCountryId,
    setCalcCountryId,
    setWorkPermitFormCountry,
    setActiveBookingTab,
  } = useApp()

  const [regionFilter, setRegionFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [ref, visible] = useReveal()

  const regionCounts = useMemo(
    () => ({
      All: COUNTRIES.length,
      Europe: COUNTRIES.filter((c) => c.region === 'Europe').length,
      Gulf: COUNTRIES.filter((c) => c.region === 'Gulf').length,
      Asia: COUNTRIES.filter((c) => c.region === 'Asia').length,
    }),
    []
  )

  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return COUNTRIES.filter((c) => {
      const regionMatch = regionFilter === 'All' || c.region === regionFilter
      if (!regionMatch) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.nameBn.includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.sectors.toLowerCase().includes(q) ||
        c.sectorsBn.includes(q)
      )
    })
  }, [regionFilter, searchQuery])

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.id === selectedCountryId) || COUNTRIES[0],
    [selectedCountryId]
  )

  const handleCalculate = () => {
    setCalcCountryId(selectedCountry.id)
    scrollToSectionId('calculator')
  }

  const handleApply = () => {
    setWorkPermitFormCountry(selectedCountry.name)
    setActiveBookingTab('workpermit')
    scrollToSectionId('book')
  }

  const filterPills = [
    { id: 'All', label: lang === 'bn' ? 'সব' : 'All', count: regionCounts.All },
    { id: 'Europe', label: lang === 'bn' ? 'ইউরোপ' : 'Europe', count: regionCounts.Europe },
    { id: 'Gulf', label: lang === 'bn' ? 'গালফ' : 'Gulf', count: regionCounts.Gulf },
    { id: 'Asia', label: lang === 'bn' ? 'এশিয়া' : 'Asia', count: regionCounts.Asia },
  ]

  return (
    <section id="workpermit" ref={ref} className="py-12 sm:py-16">
      <div className="wrap">
        {/* Header + Filter Controls */}
        <div
          className={`flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 reveal-on-scroll ${
            visible ? 'is-visible' : ''
          }`}
        >
          <div>
            <span className="eyebrow">{t.countriesEyebrow}</span>
            <h2 className="section-title text-navy mt-2.5">{t.countriesTitle}</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Live Country Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'bn' ? 'দেশ বা কাজের ধরন খুঁজুন...' : 'Filter country or role...'
                }
                aria-label="Filter countries or job roles"
                className="w-full sm:w-[220px] h-10 pl-9 pr-8 rounded-full border border-field bg-white text-[13.5px] font-medium text-ink placeholder:text-subtle focus:border-royal focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Region Filter Pills */}
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Region filter">
              {filterPills.map((pill) => {
                const active = regionFilter === pill.id
                return (
                  <button
                    key={pill.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRegionFilter(pill.id)}
                    className={`h-10 px-4 rounded-full text-[13.5px] font-bold border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                      active
                        ? 'bg-navy text-white border-navy'
                        : 'bg-white text-ink border-field hover:border-navy'
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span
                      className={`text-[12px] px-1.5 py-0.2 rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-tint text-muted'
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Country Cards Grid */}
        {filteredCountries.length === 0 ? (
          <div className="bg-white rounded-[18px] border border-line p-10 text-center mb-6">
            <p className="text-[16px] font-bold text-ink mb-1">
              No countries found matching &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-[14px] text-muted mb-4">
              Try another country name, sector (e.g. Construction, Drivers), or reset the region filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setRegionFilter('All')
              }}
              className="px-4 py-2 rounded-lg bg-navy text-white text-[13.5px] font-bold hover:bg-deep cursor-pointer"
            >
              Show all 8 countries
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {filteredCountries.map((country) => {
              const isSelected = country.id === selectedCountry.id
              return (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => setSelectedCountryId(country.id)}
                  className={`text-left bg-white rounded-[16px] overflow-hidden border transition-all duration-200 cursor-pointer group ${
                    isSelected
                      ? 'border-royal ring-2 ring-royal/20 shadow-card'
                      : 'border-line hover:border-navy/40 hover:shadow-card'
                  }`}
                >
                  <div className="relative h-[168px] overflow-hidden bg-navy">
                    <img
                      src={country.photo}
                      alt={country.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(7,23,61,0.12) 0%, rgba(7,23,61,0.78) 100%)',
                      }}
                    />

                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11.5px] font-bold ${country.badgeColor}`}
                    >
                      {lang === 'bn' ? country.regionBn : country.region}
                    </span>

                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2 text-white">
                      <span className="display text-[21px] font-extrabold leading-tight">
                        {lang === 'bn' ? country.nameBn : country.name}
                      </span>
                      <span className="text-[11.5px] font-semibold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full whitespace-nowrap">
                        {lang === 'bn' ? country.durationBn : country.duration}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-[13.5px] text-muted truncate mb-2.5">
                      {lang === 'bn' ? country.sectorsBn : country.sectors}
                    </p>
                    <p
                      className={`text-[13.5px] font-bold flex items-center gap-1.5 ${
                        isSelected ? 'text-royal' : 'text-ink group-hover:text-royal'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-cta" />
                          <span>{lang === 'bn' ? 'নির্বাচিত' : 'Selected'}</span>
                        </>
                      ) : (
                        <>
                          <span>{lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View details'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Dark-Navy Country Details Panel */}
        <div className="bg-navy text-white rounded-[18px] p-6 sm:p-8 shadow-book">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr_0.9fr] gap-7 items-center">
            {/* Left Col */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-cta text-white text-[12px] font-bold mb-3">
                {lang === 'bn' ? selectedCountry.regionBn : selectedCountry.region}
              </span>
              <h3 className="display text-[28px] sm:text-[32px] font-extrabold text-white leading-tight mb-2">
                {lang === 'bn' ? selectedCountry.nameBn : selectedCountry.name}
              </h3>
              <p className="text-on-navy text-[15px] mb-5">
                {lang === 'bn' ? selectedCountry.sectorsBn : selectedCountry.sectors}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
                <div>
                  <span className="block text-[11.5px] uppercase tracking-wider text-on-navy-3 font-bold">
                    {lang === 'bn' ? 'প্রসেসিং সময়' : 'Processing time'}
                  </span>
                  <span className="block text-[15px] font-bold text-white mt-0.5">
                    {lang === 'bn' ? selectedCountry.durationBn : selectedCountry.duration}
                  </span>
                </div>
                <div>
                  <span className="block text-[11.5px] uppercase tracking-wider text-on-navy-3 font-bold">
                    {lang === 'bn' ? 'সম্ভাব্য বেতন' : 'Expected salary'}
                  </span>
                  <span className="block text-[15px] font-bold text-white mt-0.5">
                    {lang === 'bn' ? selectedCountry.salaryBn : selectedCountry.salary}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Col: Required Documents */}
            <div className="lg:border-x lg:border-white/15 lg:px-7">
              <p className="text-[12px] font-bold uppercase tracking-widest text-on-navy-2 mb-3.5">
                {lang === 'bn' ? 'প্রয়োজনীয় কাগজপত্র' : 'REQUIRED DOCUMENTS'}
              </p>
              <ul className="space-y-2.5">
                {(lang === 'bn' ? selectedCountry.docsBn : selectedCountry.docs).map((doc) => (
                  <li key={doc} className="flex items-start gap-2.5 text-[14.5px] text-on-navy">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-white/12 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-cta-light" />
                    </span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Col: Package & Actions */}
            <div className="flex flex-col justify-between lg:pl-2">
              <div className="mb-5">
                <span className="block text-[12.5px] font-semibold text-on-navy-2">
                  {lang === 'bn' ? 'প্যাকেজ শুরু' : 'Package from'}
                </span>
                <span className="display block text-[34px] sm:text-[38px] font-extrabold text-white tracking-tight mt-0.5">
                  {formatBDT(selectedCountry.packageFrom)}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="w-full h-11 px-5 rounded-[12px] border border-white/30 bg-white/8 hover:bg-white/15 text-white font-bold text-[14px] transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'খরচ হিসাব করুন' : 'Calculate my cost'}
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="w-full h-11 px-5 rounded-[12px] bg-cta hover:bg-cta-hover text-white font-bold text-[14.5px] transition-colors cursor-pointer"
                >
                  {lang === 'bn'
                    ? `${selectedCountry.nameBn}-এর জন্য আবেদন করুন`
                    : `Apply for ${selectedCountry.name}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
