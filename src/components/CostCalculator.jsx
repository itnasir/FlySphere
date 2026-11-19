import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { COUNTRIES, JOB_CATEGORIES, formatBDT } from '../data/siteData'
import { useReveal } from '../hooks/useReveal'
import { scrollToSectionId } from '../utils/scrollToSection'

export default function CostCalculator() {
  const {
    lang,
    t,
    calcCountryId,
    setCalcCountryId,
    calcJob,
    setCalcJob,
    calcExperience,
    setCalcExperience,
    calcIncludeTicket,
    setCalcIncludeTicket,
    setWorkPermitFormCountry,
    setActiveBookingTab,
    showToast,
  } = useApp()

  const [ref, visible] = useReveal()

  const country = useMemo(
    () => COUNTRIES.find((c) => c.id === calcCountryId) || COUNTRIES[0],
    [calcCountryId]
  )

  const jobObj = useMemo(
    () => JOB_CATEGORIES.find((j) => j.id === calcJob) || JOB_CATEGORIES[0],
    [calcJob]
  )

  // Match observed baseline: Romania + Construction + 3 yrs + ticket = ৳7,58,500
  // Processing: 4,90,000 | Embassy: 1,22,000 | Medical/BMET: 68,000 | Ticket: 78,500
  const breakdown = useMemo(() => {
    const expDiscount = Math.max(0, calcExperience - 3) * 2500
    const processing = Math.max(150000, country.processingFee + jobObj.delta - expDiscount)
    const embassy = country.embassyFee
    const medical = country.medicalFee
    const ticket = calcIncludeTicket ? country.ticketCost : 0
    const total = processing + embassy + medical + ticket

    return {
      processing,
      embassy,
      medical,
      ticket,
      total,
      pctProcessing: (processing / total) * 100,
      pctEmbassy: (embassy / total) * 100,
      pctMedical: (medical / total) * 100,
      pctTicket: (ticket / total) * 100,
    }
  }, [country, jobObj, calcExperience, calcIncludeTicket])

  const matchLabel =
    calcExperience >= 2
      ? lang === 'bn'
        ? 'উপযুক্ত প্রোফাইল'
        : 'Strong match'
      : lang === 'bn'
      ? 'প্রাথমিক যোগ্যতা'
      : 'Entry profile'

  const handleApplyWithEstimate = () => {
    setWorkPermitFormCountry(country.name)
    setActiveBookingTab('workpermit')
    scrollToSectionId('book')
    showToast(
      `Estimate loaded: ${country.name} (${jobObj.label}) — ${formatBDT(breakdown.total)}`,
      'info'
    )
  }

  return (
    <section id="calculator" ref={ref} className="py-10 sm:py-14">
      <div className="wrap">
        <div
          className={`bg-white rounded-[20px] border border-line shadow-book overflow-hidden grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] reveal-on-scroll ${
            visible ? 'is-visible' : ''
          }`}
        >
          {/* Left Panel: Interactive Controls */}
          <div className="p-6 sm:p-9 lg:p-10 space-y-6">
            <div>
              <span className="eyebrow">{t.calcEyebrow}</span>
              <h2 className="section-title text-navy mt-2">{t.calcTitle}</h2>
            </div>

            {/* Country Pill Selector */}
            <div>
              <label className="block text-[13px] font-bold text-ink mb-2.5">
                {lang === 'bn' ? 'দেশ নির্বাচন করুন' : 'Country'}
              </label>
              <div className="flex flex-wrap gap-2">
                {COUNTRIES.map((c) => {
                  const active = c.id === calcCountryId
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCalcCountryId(c.id)}
                      className={`px-3.5 py-2 rounded-full text-[13px] font-bold border transition-colors cursor-pointer ${
                        active
                          ? 'bg-royal text-white border-royal shadow-xs'
                          : 'bg-white text-ink border-field hover:border-royal'
                      }`}
                    >
                      {lang === 'bn' ? c.nameBn : c.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Job Category Pill Selector */}
            <div>
              <label className="block text-[13px] font-bold text-ink mb-2.5">
                {lang === 'bn' ? 'কাজের ধরন' : 'Job category'}
              </label>
              <div className="flex flex-wrap gap-2">
                {JOB_CATEGORIES.map((job) => {
                  const active = job.id === calcJob
                  return (
                    <button
                      key={job.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCalcJob(job.id)}
                      className={`px-3.5 py-2 rounded-full text-[13px] font-bold border transition-colors cursor-pointer ${
                        active
                          ? 'bg-cta/6 text-cta border-cta'
                          : 'bg-white text-ink border-field hover:border-navy'
                      }`}
                    >
                      {lang === 'bn' ? job.labelBn : job.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Work Experience Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="exp-range"
                  className="text-[13px] font-bold text-ink"
                >
                  {lang === 'bn' ? 'কাজের অভিজ্ঞতা' : 'Work experience'}
                </label>
                <span className="text-[14px] font-extrabold text-navy bg-tint px-3 py-0.5 rounded-full">
                  {calcExperience} {calcExperience === 1 ? 'year' : 'years'}
                </span>
              </div>
              <input
                id="exp-range"
                type="range"
                min={0}
                max={10}
                step={1}
                value={calcExperience}
                onChange={(e) => setCalcExperience(Number(e.target.value))}
                className="lusan-range"
                style={{
                  background: `linear-gradient(to right, #e3262b 0%, #e3262b ${
                    calcExperience * 10
                  }%, #e1e7f3 ${calcExperience * 10}%, #e1e7f3 100%)`,
                }}
              />
              <div className="flex justify-between text-[11.5px] font-medium text-subtle mt-1.5">
                <span>0 yrs</span>
                <span>5 yrs</span>
                <span>10 yrs</span>
              </div>
            </div>

            {/* Include Air Ticket Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-line">
              <div>
                <p className="text-[14.5px] font-bold text-ink">
                  {lang === 'bn' ? 'বিমান টিকিট অন্তর্ভুক্ত করুন' : 'Include air ticket'}
                </p>
                <p className="text-[12.5px] text-muted">
                  {lang === 'bn' ? 'ঢাকা থেকে ওয়ান ওয়ে' : 'One way from Dhaka'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={calcIncludeTicket}
                aria-label="Include air ticket"
                onClick={() => setCalcIncludeTicket((v) => !v)}
                className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
                  calcIncludeTicket ? 'bg-royal' : 'bg-field-strong'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    calcIncludeTicket ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Panel: Live Dark-Navy Breakdown */}
          <div className="bg-navy text-white p-6 sm:p-9 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[13px] font-semibold text-on-navy-2">
                  {lang === 'bn' ? 'সম্ভাব্য মোট খরচ' : 'Estimated total'}
                </span>
                <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-ok-bg text-ok">
                  {matchLabel}
                </span>
              </div>

              <div className="display text-[36px] sm:text-[42px] font-extrabold text-white tracking-tight mb-5">
                {formatBDT(breakdown.total)}
              </div>

              {/* Segmented Proportion Bar */}
              <div className="h-2.5 w-full rounded-full overflow-hidden flex gap-0.5 bg-white/10 mb-6">
                <div
                  className="bg-white h-full transition-all duration-300"
                  style={{ width: `${breakdown.pctProcessing}%` }}
                  title="Processing & service fee"
                />
                <div
                  className="bg-[#93b4ff] h-full transition-all duration-300"
                  style={{ width: `${breakdown.pctEmbassy}%` }}
                  title="Embassy, visa & permit"
                />
                <div
                  className="bg-royal h-full transition-all duration-300"
                  style={{ width: `${breakdown.pctMedical}%` }}
                  title="Medical, BMET & insurance"
                />
                {calcIncludeTicket && (
                  <div
                    className="bg-cta h-full transition-all duration-300"
                    style={{ width: `${breakdown.pctTicket}%` }}
                    title="Air ticket"
                  />
                )}
              </div>

              {/* Line Items */}
              <ul className="space-y-3 text-[14px] border-t border-white/15 pt-5">
                <li className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-on-navy">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
                    <span>Processing &amp; service fee</span>
                  </span>
                  <span className="font-mono font-semibold text-white">
                    {formatBDT(breakdown.processing)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-on-navy">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#93b4ff] shrink-0" />
                    <span>Embassy, visa &amp; permit</span>
                  </span>
                  <span className="font-mono font-semibold text-white">
                    {formatBDT(breakdown.embassy)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-on-navy">
                    <span className="w-2.5 h-2.5 rounded-full bg-royal shrink-0" />
                    <span>Medical, BMET &amp; insurance</span>
                  </span>
                  <span className="font-mono font-semibold text-white">
                    {formatBDT(breakdown.medical)}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-on-navy">
                    <span className="w-2.5 h-2.5 rounded-full bg-cta shrink-0" />
                    <span>Air ticket (one way)</span>
                  </span>
                  <span className="font-mono font-semibold text-white">
                    {calcIncludeTicket ? formatBDT(breakdown.ticket) : 'Excluded'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-7 pt-5 border-t border-white/15">
              <button
                type="button"
                onClick={handleApplyWithEstimate}
                className="w-full h-12 rounded-[12px] bg-cta hover:bg-cta-hover text-white font-bold text-[15px] transition-colors cursor-pointer shadow-sm"
              >
                {lang === 'bn' ? 'এই হিসাবসহ আবেদন করুন' : 'Apply with this estimate'}
              </button>
              <p className="text-[12px] text-on-navy-3 text-center mt-3 leading-snug">
                {lang === 'bn'
                  ? 'এটি কেবল আনুমানিক হিসাব। ফ্রি মূল্যায়নের পর চূড়ান্ত খরচ নিশ্চিত করা হয়।'
                  : 'Estimate only. Final cost is confirmed after a free assessment.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
