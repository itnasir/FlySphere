import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Luggage,
  Plane,
  SlidersHorizontal,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { AIRPORTS, formatBDT, generateFlights } from '../data/siteData'

function buildSevenDays(startDateStr, basePrice) {
  const start = new Date((startDateStr || '2026-11-26') + 'T12:00:00')
  const base = Number.isNaN(start.getTime()) ? new Date('2026-11-26T12:00:00') : start
  const offsets = [0, 800, -1200, 0, 1500, 400, -400]

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
    return {
      iso,
      label,
      price: Math.max(18000, basePrice + offsets[i]),
    }
  })
}

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { openQuoteModal } = useApp()

  const from = searchParams.get('from') || 'DAC'
  const to = searchParams.get('to') || 'DXB'
  const date = searchParams.get('date') || '2026-11-26'
  const trip = searchParams.get('trip') || 'oneway'
  const pax = Number(searchParams.get('pax') || '1')
  const cabin = searchParams.get('cabin') || 'Economy'

  const { fromAp, toAp, flights } = useMemo(
    () => generateFlights(from, to, date, cabin),
    [from, to, date, cabin]
  )

  const minFare = useMemo(
    () => Math.min(...flights.map((f) => f.price)),
    [flights]
  )
  const maxFare = useMemo(
    () => Math.max(...flights.map((f) => f.price)),
    [flights]
  )

  const [modifyOpen, setModifyOpen] = useState(false)
  const [modFrom, setModFrom] = useState(from)
  const [modTo, setModTo] = useState(to)
  const [modDate, setModDate] = useState(date)
  const [modCabin, setModCabin] = useState(cabin)

  const [stopsFilter, setStopsFilter] = useState('all')
  const [selectedAirlines, setSelectedAirlines] = useState([])
  const [maxPriceFilter, setMaxPriceFilter] = useState(null)
  const [showCalendarStrip, setShowCalendarStrip] = useState(true)

  const effectiveMaxPrice = maxPriceFilter ?? maxFare

  const sevenDays = useMemo(
    () => buildSevenDays(date, minFare),
    [date, minFare]
  )

  const filteredFlights = useMemo(() => {
    return flights.filter((f) => {
      if (stopsFilter === 'nonstop' && f.stops !== 0) return false
      if (stopsFilter === '1stop' && f.stops !== 1) return false
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airline)) {
        return false
      }
      if (f.price > effectiveMaxPrice) return false
      return true
    })
  }, [flights, stopsFilter, selectedAirlines, effectiveMaxPrice])

  const toggleAirline = (name) => {
    setSelectedAirlines((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    )
  }

  const handleModifySubmit = (e) => {
    e.preventDefault()
    setSearchParams({
      from: modFrom,
      to: modTo,
      date: modDate,
      trip,
      pax: String(pax),
      cabin: modCabin,
    })
    setMaxPriceFilter(null)
    setModifyOpen(false)
  }

  const formattedDate = useMemo(() => {
    const d = new Date(date + 'T12:00:00')
    if (Number.isNaN(d.getTime())) return date
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }, [date])

  const handleSelectFlight = (flight) => {
    const params = new URLSearchParams({
      from: fromAp.code,
      to: toAp.code,
      date,
      trip,
      pax: String(pax),
      cabin,
      airline: flight.airline,
      code: flight.code,
      dep: flight.dep,
      arr: flight.arr,
      duration: flight.duration,
      stops: flight.stopLabel,
      baggage: flight.baggage,
      price: String(flight.price),
    })
    navigate(`/flights/checkout?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="py-8 sm:py-12 min-h-[75vh]">
      <div className="wrap">
        {/* Top Breadcrumb + Route Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-royal hover:text-cta mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
            <h1 className="display text-[28px] sm:text-[34px] font-extrabold text-navy leading-tight">
              {fromAp.city} ({fromAp.code}) – {toAp.city} ({toAp.code})
            </h1>
            <p className="text-[14.5px] text-muted mt-1">
              {formattedDate} · {pax} {pax === 1 ? 'Adult' : 'Adults'} · {cabin} ·{' '}
              <strong className="text-ink">{filteredFlights.length} flights found</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowCalendarStrip((v) => !v)}
              className="h-10 px-4 rounded-[10px] border border-field-strong bg-white text-[13.5px] font-bold text-ink hover:border-navy inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-navy" />
              <span>Fare calendar</span>
            </button>
            <button
              type="button"
              onClick={() => setModifyOpen((v) => !v)}
              className="h-10 px-4 rounded-[10px] bg-navy hover:bg-deep text-white text-[13.5px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Modify search</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${modifyOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Modify Search Drawer */}
        {modifyOpen && (
          <form
            onSubmit={handleModifySubmit}
            className="bg-white rounded-[16px] border border-line p-4 sm:p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end shadow-card"
          >
            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                From
              </span>
              <select
                value={modFrom}
                onChange={(e) => setModFrom(e.target.value)}
                className="w-full h-11 px-3 rounded-[10px] border border-field text-[14px] font-bold"
              >
                {AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                To
              </span>
              <select
                value={modTo}
                onChange={(e) => setModTo(e.target.value)}
                className="w-full h-11 px-3 rounded-[10px] border border-field text-[14px] font-bold"
              >
                {AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                Departure Date
              </span>
              <input
                type="date"
                value={modDate}
                onChange={(e) => setModDate(e.target.value)}
                className="w-full h-11 px-3 rounded-[10px] border border-field text-[14px] font-bold"
              />
            </label>

            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                Cabin
              </span>
              <select
                value={modCabin}
                onChange={(e) => setModCabin(e.target.value)}
                className="w-full h-11 px-3 rounded-[10px] border border-field text-[14px] font-bold"
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
              </select>
            </label>

            <button
              type="submit"
              className="h-11 rounded-[10px] bg-cta hover:bg-cta-hover text-white font-bold text-[14px] cursor-pointer"
            >
              Update search
            </button>
          </form>
        )}

        {/* 7-day Horizontal Fare Strip */}
        {showCalendarStrip && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6">
            {sevenDays.map((day) => {
              const active = day.iso === date
              return (
                <button
                  key={day.iso}
                  type="button"
                  onClick={() =>
                    setSearchParams({
                      from,
                      to,
                      date: day.iso,
                      trip,
                      pax: String(pax),
                      cabin,
                    })
                  }
                  className={`rounded-[12px] border px-3 py-2.5 text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-navy text-white border-navy shadow-xs'
                      : 'bg-white text-ink border-line hover:border-royal'
                  }`}
                >
                  <span
                    className={`block text-[12px] font-semibold ${
                      active ? 'text-on-navy-2' : 'text-muted'
                    }`}
                  >
                    {day.label}
                  </span>
                  <span className="display block text-[15px] font-extrabold mt-0.5">
                    {formatBDT(day.price)}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Main 2-Col Grid: Filters + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* Left Filters Sidebar */}
          <aside className="bg-white rounded-[18px] border border-line p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="display text-[17px] font-extrabold text-navy flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cta" />
                <span>Filters</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setStopsFilter('all')
                  setSelectedAirlines([])
                  setMaxPriceFilter(null)
                }}
                className="text-[12.5px] font-bold text-royal hover:text-cta cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Stops */}
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-wider text-muted mb-2.5">
                STOPS
              </p>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'Any stops' },
                  { id: 'nonstop', label: 'Non-stop' },
                  { id: '1stop', label: '1 stop' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2.5 text-[14px] font-medium text-ink cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="stops"
                      checked={stopsFilter === opt.id}
                      onChange={() => setStopsFilter(opt.id)}
                      className="accent-royal w-4 h-4"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Airlines */}
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-wider text-muted mb-2.5">
                AIRLINES
              </p>
              <div className="space-y-2">
                {flights.map((f) => (
                  <label
                    key={f.airline}
                    className="flex items-center justify-between gap-2 text-[14px] font-medium text-ink cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(f.airline)}
                        onChange={() => toggleAirline(f.airline)}
                        className="accent-royal w-4 h-4 rounded"
                      />
                      <span>{f.airline}</span>
                    </span>
                    <span className="text-[12px] text-muted font-mono">
                      {formatBDT(f.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-muted">
                  MAX PRICE
                </span>
                <span className="font-mono text-[13px] font-bold text-navy">
                  {formatBDT(effectiveMaxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={minFare}
                max={maxFare}
                step={500}
                value={effectiveMaxPrice}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="lusan-range"
                style={{
                  background: `linear-gradient(to right, #0b50c0 0%, #0b50c0 ${
                    maxFare === minFare
                      ? 100
                      : ((effectiveMaxPrice - minFare) / (maxFare - minFare)) * 100
                  }%, #e1e7f3 100%)`,
                }}
              />
            </div>
          </aside>

          {/* Right Results List */}
          <div className="space-y-4">
            {/* Helper Banner */}
            <div className="bg-tint rounded-[14px] border border-line px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-[13.5px] text-ink font-medium">
                Fares are updated daily by our ticketing team. Need group fares or special baggage?
              </p>
              <button
                type="button"
                onClick={() =>
                  openQuoteModal(`Flight enquiry: ${fromAp.code} → ${toAp.code} on ${date}`)
                }
                className="text-[13.5px] font-bold text-cta hover:text-cta-hover whitespace-nowrap cursor-pointer text-left sm:text-right"
              >
                Can&apos;t find your flight? Request a quote →
              </button>
            </div>

            {filteredFlights.length === 0 ? (
              <div className="bg-white rounded-[18px] border border-line p-10 text-center">
                <p className="text-[17px] font-bold text-ink mb-1">
                  No flights match your selected filters
                </p>
                <p className="text-[14px] text-muted mb-4">
                  Try increasing the max price slider or clearing airline filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStopsFilter('all')
                    setSelectedAirlines([])
                    setMaxPriceFilter(null)
                  }}
                  className="px-5 py-2.5 rounded-[10px] bg-navy text-white font-bold text-[13.5px] cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredFlights.map((flight) => (
                <article
                  key={flight.id}
                  className="bg-white rounded-[18px] border border-line p-5 hover:border-royal hover:shadow-card transition-all grid grid-cols-1 md:grid-cols-[1.2fr_1.4fr_auto] gap-5 items-center"
                >
                  {/* Airline */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-11 h-11 rounded-[12px] text-white font-mono font-bold text-[13px] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: flight.accent }}
                    >
                      {flight.code.split(' ')[0]}
                    </div>
                    <div>
                      <h3 className="display text-[17px] font-extrabold text-ink">
                        {flight.airline}
                      </h3>
                      <p className="font-mono text-[12.5px] text-muted">{flight.code}</p>
                    </div>
                  </div>

                  {/* Times & Duration */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="display block text-[20px] font-extrabold text-ink">
                        {flight.dep}
                      </span>
                      <span className="font-mono text-[12px] text-muted">{fromAp.code}</span>
                    </div>

                    <div className="flex-1 text-center px-2">
                      <span className="block text-[12px] font-semibold text-muted mb-1">
                        {flight.duration}
                      </span>
                      <div className="relative h-[2px] bg-field-strong flex items-center justify-center">
                        <Plane className="w-3.5 h-3.5 text-royal bg-white px-0.5" />
                      </div>
                      <span className="block text-[11.5px] font-bold text-navy mt-1">
                        {flight.stopLabel}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="display block text-[20px] font-extrabold text-ink">
                        {flight.arr}
                      </span>
                      <span className="font-mono text-[12px] text-muted">{toAp.code}</span>
                    </div>
                  </div>

                  {/* Price & Select */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-line">
                    <div className="md:text-right">
                      <div className="flex items-center md:justify-end gap-2 text-[12px] text-muted mb-1">
                        <span className="inline-flex items-center gap-1">
                          <Luggage className="w-3.5 h-3.5 text-navy" />
                          {flight.baggage}
                        </span>
                        <span>·</span>
                        <span>{flight.refundable}</span>
                      </div>
                      <span className="display block text-[22px] font-extrabold text-navy">
                        {formatBDT(flight.price * pax)}
                      </span>
                      <span className="block text-[11.5px] text-subtle">
                        incl. taxes ({pax} {pax === 1 ? 'adult' : 'adults'})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectFlight(flight)}
                      className="h-10 px-6 rounded-[10px] bg-cta hover:bg-cta-hover text-white font-bold text-[14px] transition-colors cursor-pointer"
                    >
                      Select
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
