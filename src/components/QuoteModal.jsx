import { useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function QuoteModal() {
  const {
    quoteModalOpen,
    setQuoteModalOpen,
    quoteContext,
    addApplication,
    showToast,
  } = useApp()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')
  const [refId, setRefId] = useState('')

  if (!quoteModalOpen) return null

  const handleClose = () => {
    setQuoteModalOpen(false)
    setError('')
    setRefId('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (name.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }
    if (phone.trim().length < 8) {
      setError('Please enter a valid phone / WhatsApp number.')
      return
    }
    const created = addApplication({
      prefix: 'LT-TK',
      applicant: name.trim(),
      phone: phone.trim(),
      service: 'Custom Flight Quote',
      country: quoteContext || 'Multi-city Itinerary',
      role: details.trim() || 'Custom fare request',
    })
    setRefId(created.id)
    setName('')
    setPhone('')
    setDetails('')
    showToast(`Quote request submitted! Ref: ${created.id}`, 'success')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-deep/55 backdrop-blur-xs"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Request a flight quote"
        className="relative z-10 w-full max-w-[480px] bg-white rounded-[20px] border border-line shadow-book p-6 sm:p-7"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="display text-[22px] font-extrabold text-navy">
              Request a custom quote
            </h3>
            <p className="text-[13.5px] text-muted mt-0.5">
              Our ticketing desk replies within 30 minutes during office hours.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-[10px] bg-tint text-ink hover:bg-line flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {quoteContext && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-tint text-[13px] font-semibold text-navy">
            Route / Context: {quoteContext}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <label className="block">
            <span className="block text-[12.5px] font-bold text-ink mb-1">
              Full name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="As on passport"
              className="w-full h-11 px-3.5 rounded-[12px] border border-field text-[14.5px] focus:border-royal focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="block text-[12.5px] font-bold text-ink mb-1">
              Mobile / WhatsApp
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1XXX-XXXXXX"
              className="w-full h-11 px-3.5 rounded-[12px] border border-field text-[14.5px] focus:border-royal focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="block text-[12.5px] font-bold text-ink mb-1">
              Itinerary &amp; preferred dates
            </span>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Dhaka → Dubai → London, 2 adults, flexible ±2 days"
              className="w-full p-3.5 rounded-[12px] border border-field text-[14.5px] focus:border-royal focus:outline-none resize-none"
            />
          </label>

          {error && (
            <p className="text-[13px] font-semibold text-bad bg-bad-bg px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {refId && (
            <div className="text-[13.5px] font-semibold text-ok bg-ok-bg px-3.5 py-2.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Quote request saved! Reference:{' '}
                <strong className="font-mono">{refId}</strong>
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-[12px] bg-cta hover:bg-cta-hover text-white font-bold text-[14.5px] transition-colors cursor-pointer"
          >
            Submit quote request
          </button>
        </form>
      </div>
    </div>
  )
}
