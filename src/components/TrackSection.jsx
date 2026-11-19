import { useState } from 'react'
import { CheckCircle2, Clock, FileSearch, UserCheck, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useReveal } from '../hooks/useReveal'

export default function TrackSection() {
  const {
    t,
    trackedResult,
    trackNotFound,
    trackApplication,
    setTrackedResult,
    setTrackNotFound,
  } = useApp()

  const [query, setQuery] = useState('')
  const [ref, visible] = useReveal()

  const handleSubmit = (e) => {
    e.preventDefault()
    trackApplication(query)
  }

  const quickTry = (id) => {
    setQuery(id)
    trackApplication(id)
  }

  return (
    <section id="track" ref={ref} className="py-12 sm:py-16">
      <div className="wrap">
        <div
          className={`bg-cta text-white rounded-[18px] p-6 sm:p-9 lg:p-10 shadow-book reveal-on-scroll ${
            visible ? 'is-visible' : ''
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-6 lg:gap-10 items-center">
            <div>
              <h2 className="display text-[26px] sm:text-[32px] font-extrabold text-white leading-tight mb-2.5">
                {t.trackTitle}
              </h2>
              <p className="text-white/90 text-[15px] leading-relaxed max-w-[500px]">
                {t.trackSub}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
                <span className="text-white/80 font-medium">Sample IDs:</span>
                {['LT-WP-00001', 'LT-VS-00042', 'LT-TK-00108'].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => quickTry(sample)}
                    className="font-mono font-semibold px-2.5 py-1 rounded-md bg-white/18 hover:bg-navy text-white transition-colors cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="LT-WP-00001 or passport number"
                aria-label="Tracking number or passport number"
                className="flex-1 h-12 sm:h-[52px] px-4 rounded-[12px] bg-white text-ink font-semibold text-[15px] placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-navy"
              />
              <button
                type="submit"
                className="h-12 sm:h-[52px] px-7 rounded-[12px] bg-navy hover:bg-deep text-white font-bold text-[15px] transition-colors cursor-pointer shrink-0"
              >
                {t.trackBtn}
              </button>
            </form>
          </div>
        </div>

        {/* Tracking Result Panel */}
        {trackNotFound && (
          <div className="mt-4 bg-white rounded-[16px] border border-bad/30 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-bad-bg text-bad flex items-center justify-center shrink-0">
                <FileSearch className="w-5 h-5" />
              </span>
              <div>
                <p className="font-bold text-ink text-[15px]">
                  No application found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-[13.5px] text-muted">
                  Check your receipt number (e.g. LT-WP-00001) or try sample passport A12345678.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTrackNotFound(false)}
              aria-label="Dismiss message"
              className="p-2 rounded-lg hover:bg-tint text-muted cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {trackedResult && (
          <div className="mt-4 bg-white rounded-[18px] border border-line shadow-card p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-line">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <span className="font-mono text-[13px] font-bold px-2.5 py-1 rounded-md bg-tint text-navy">
                    {trackedResult.id}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-ok-bg text-ok">
                    {trackedResult.statusLabel}
                  </span>
                </div>
                <h3 className="display text-[20px] font-extrabold text-ink">
                  {trackedResult.applicant} · {trackedResult.country}
                </h3>
                <p className="text-[13.5px] text-muted mt-0.5">
                  {trackedResult.service} ({trackedResult.role}) · Officer:{' '}
                  <strong className="text-ink">{trackedResult.officer}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTrackedResult(null)}
                aria-label="Close tracking details"
                className="w-9 h-9 rounded-lg bg-tint text-ink hover:bg-line flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
              {trackedResult.steps.map((step, idx) => (
                <div
                  key={step.title}
                  className={`rounded-xl border p-4 ${
                    step.done
                      ? 'border-ok/30 bg-ok-bg/40'
                      : step.active
                      ? 'border-royal bg-tint/60'
                      : 'border-line bg-page'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11.5px] font-bold text-muted">
                      STEP 0{idx + 1}
                    </span>
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-ok" />
                    ) : step.active ? (
                      <UserCheck className="w-4 h-4 text-royal" />
                    ) : (
                      <Clock className="w-4 h-4 text-subtle" />
                    )}
                  </div>
                  <p className="text-[14px] font-bold text-ink leading-snug">
                    {step.title}
                  </p>
                  <p className="text-[12px] text-muted mt-1">{step.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
