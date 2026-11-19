import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Plane } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { POPULAR_FARES, formatBDT } from '../data/siteData'
import { useReveal } from '../hooks/useReveal'

export default function PopularFares() {
  const { lang, t } = useApp()
  const [fareType, setFareType] = useState('oneway')
  const [ref, visible] = useReveal()

  return (
    <section id="fares" ref={ref} className="py-14 sm:py-20">
      <div className="wrap">
        <div
          className={`grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start reveal-on-scroll ${
            visible ? 'is-visible' : ''
          }`}
        >
          {/* Left Column */}
          <div>
            <span className="eyebrow">{t.faresEyebrow}</span>
            <h2 className="section-title text-navy mt-2.5 mb-5">{t.faresTitle}</h2>

            {/* Segmented Toggle */}
            <div
              className="inline-flex items-center bg-tint p-1 rounded-[12px] border border-line mb-4"
              role="group"
              aria-label="Fare type toggle"
            >
              <button
                type="button"
                aria-pressed={fareType === 'oneway'}
                onClick={() => setFareType('oneway')}
                className={`px-4 py-2 rounded-[9px] text-[13.5px] font-bold transition-colors cursor-pointer ${
                  fareType === 'oneway'
                    ? 'bg-navy text-white shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {lang === 'bn' ? 'ওয়ান ওয়ে' : 'One way'}
              </button>
              <button
                type="button"
                aria-pressed={fareType === 'return'}
                onClick={() => setFareType('return')}
                className={`px-4 py-2 rounded-[9px] text-[13.5px] font-bold transition-colors cursor-pointer ${
                  fareType === 'return'
                    ? 'bg-navy text-white shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {lang === 'bn' ? 'রিটার্ন' : 'Return'}
              </button>
            </div>

            <p className="text-[15px] text-muted leading-relaxed mb-6">
              {fareType === 'oneway'
                ? lang === 'bn'
                  ? 'ট্যাক্সসহ ওয়ান-ওয়ে ইকোনমি ভাড়া। বিকাশ, নগদ, কার্ড বা ব্যাংক ট্রান্সফারে পেমেন্ট করুন।'
                  : 'One-way economy fares including taxes. Pay with bKash, Nagad, card or bank transfer.'
                : lang === 'bn'
                ? 'ট্যাক্সসহ রিটার্ন ইকোনমি ভাড়া। বিকাশ, নগদ, কার্ড বা ব্যাংক ট্রান্সফারে পেমেন্ট করুন।'
                : 'Return economy fares including taxes. Pay with bKash, Nagad, card or bank transfer.'}
            </p>

            <div className="rounded-[18px] overflow-hidden border border-line shadow-card aspect-[16/10] bg-navy">
              <img
                src="/assets/photos/wing.jpg"
                alt="Aircraft wing above the clouds"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: 6 Stacked Route Cards */}
          <div className="space-y-3">
            {POPULAR_FARES.map((fare) => {
              const price = fareType === 'oneway' ? fare.oneWay : fare.returnFare
              const tripParam = fareType === 'oneway' ? 'oneway' : 'roundtrip'
              return (
                <Link
                  key={fare.id}
                  to={`/flights?from=${fare.from}&to=${fare.to}&trip=${tripParam}&pax=1&cabin=Economy`}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center justify-between gap-4 bg-white rounded-[16px] border border-line p-3.5 sm:p-4 hover:border-royal hover:shadow-card transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={fare.photo}
                      alt={fare.city}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-[12px] object-cover shrink-0 bg-tint"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 font-mono text-[12.5px] font-bold text-navy">
                        <span>{fare.from}</span>
                        <Plane className="w-3.5 h-3.5 text-cta" />
                        <span>{fare.to}</span>
                      </div>
                      <h3 className="display text-[17px] sm:text-[18px] font-extrabold text-ink truncate group-hover:text-royal transition-colors">
                        {lang === 'bn' ? fare.cityBn : fare.city}
                      </h3>
                      <p className="text-[13px] text-muted truncate">{fare.airline}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-subtle">
                        {fareType === 'oneway' ? 'From' : 'Return from'}
                      </span>
                      <span className="display text-[19px] sm:text-[21px] font-extrabold text-navy">
                        {formatBDT(price)}
                      </span>
                    </div>
                    <span className="w-9 h-9 rounded-full bg-tint text-navy group-hover:bg-cta group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
