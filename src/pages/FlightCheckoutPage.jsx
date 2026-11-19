import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, CreditCard, Plane, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatBDT } from '../data/siteData'

export default function FlightCheckoutPage() {
  const [params] = useSearchParams()
  const { addApplication, showToast } = useApp()

  const from = params.get('from') || 'DAC'
  const to = params.get('to') || 'DXB'
  const date = params.get('date') || '2026-11-26'
  const pax = Number(params.get('pax') || '1')
  const cabin = params.get('cabin') || 'Economy'
  const airline = params.get('airline') || 'US-Bangla Airlines'
  const code = params.get('code') || 'BS 341'
  const dep = params.get('dep') || '18:30'
  const arr = params.get('arr') || '22:00'
  const duration = params.get('duration') || '5h 30m'
  const stops = params.get('stops') || 'Non-stop'
  const baggage = params.get('baggage') || '30 kg'
  const unitPrice = Number(params.get('price') || '36900')
  const total = unitPrice * pax

  const [fullName, setFullName] = useState('')
  const [passportNo, setPassportNo] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bKash')
  const [error, setError] = useState('')
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (fullName.trim().length < 2) {
      setError('Please enter passenger full name as on passport.')
      return
    }
    if (passportNo.trim().length < 5) {
      setError('Please enter a valid passport number.')
      return
    }
    if (phone.trim().length < 8) {
      setError('Please enter a valid mobile or WhatsApp number.')
      return
    }

    const created = addApplication({
      prefix: 'LT-TK',
      applicant: fullName.trim(),
      phone: phone.trim(),
      service: 'Air Ticket Booking',
      country: `${from} → ${to}`,
      role: `${airline} (${code}) · ${pax} ${pax === 1 ? 'Adult' : 'Adults'} · ${paymentMethod}`,
    })

    setConfirmedBooking(created)
    showToast(`Ticket reserved! Tracking ID: ${created.id}`, 'success')
  }

  return (
    <main className="py-8 sm:py-12 min-h-[75vh]">
      <div className="wrap max-w-[980px]">
        <Link
          to={`/flights?from=${from}&to=${to}&date=${date}&pax=${pax}&cabin=${cabin}`}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-royal hover:text-cta mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to flight results</span>
        </Link>

        {confirmedBooking ? (
          <div className="bg-white rounded-[20px] border border-line shadow-book p-7 sm:p-10 text-center max-w-[640px] mx-auto">
            <span className="w-14 h-14 rounded-full bg-ok-bg text-ok flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </span>
            <h1 className="display text-[28px] font-extrabold text-navy mb-2">
              Booking Confirmed
            </h1>
            <p className="text-[15px] text-muted mb-6">
              Your reservation has been logged with our ticketing desk. Use your tracking ID below anytime on the Track Application banner.
            </p>

            <div className="bg-page rounded-[16px] border border-line p-5 text-left space-y-2.5 mb-6">
              <div className="flex justify-between text-[14px]">
                <span className="text-muted">Tracking ID</span>
                <span className="font-mono font-bold text-navy">{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-muted">Passenger</span>
                <span className="font-bold text-ink">{confirmedBooking.applicant}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-muted">Flight</span>
                <span className="font-bold text-ink">
                  {airline} ({code}) · {from} → {to}
                </span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-muted">Payment Method</span>
                <span className="font-bold text-ink">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[15px] pt-2 border-t border-line">
                <span className="font-bold text-ink">Total Payable</span>
                <span className="display font-extrabold text-cta">{formatBDT(total)}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/#track"
                className="h-11 px-6 rounded-[12px] bg-navy hover:bg-deep text-white font-bold text-[14px] inline-flex items-center"
              >
                Track application
              </Link>
              <Link
                to="/"
                className="h-11 px-6 rounded-[12px] border border-field-strong bg-white text-ink font-bold text-[14px] inline-flex items-center hover:border-navy"
              >
                Return home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
            {/* Passenger & Payment Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[20px] border border-line p-6 sm:p-8 space-y-5"
            >
              <div>
                <h1 className="display text-[24px] font-extrabold text-navy">
                  Passenger &amp; payment details
                </h1>
                <p className="text-[14px] text-muted mt-1">
                  Enter details exactly as printed on the passport.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block sm:col-span-2">
                  <span className="block text-[13px] font-bold text-ink mb-1.5">
                    Full name (as on passport)
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. MD RAHIM UDDIN"
                    className="w-full h-11 px-3.5 rounded-[12px] border border-field text-[15px] focus:border-royal focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="block text-[13px] font-bold text-ink mb-1.5">
                    Passport number
                  </span>
                  <input
                    type="text"
                    value={passportNo}
                    onChange={(e) => setPassportNo(e.target.value)}
                    placeholder="e.g. A12345678"
                    className="w-full h-11 px-3.5 rounded-[12px] border border-field text-[15px] font-mono focus:border-royal focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="block text-[13px] font-bold text-ink mb-1.5">
                    Mobile / WhatsApp
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                    className="w-full h-11 px-3.5 rounded-[12px] border border-field text-[15px] focus:border-royal focus:outline-none"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="block text-[13px] font-bold text-ink mb-1.5">
                    Email for e-ticket (optional)
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 px-3.5 rounded-[12px] border border-field text-[15px] focus:border-royal focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <p className="text-[13px] font-bold text-ink mb-2.5 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-navy" />
                  <span>Select payment method</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['bKash', 'Nagad', 'Card', 'Bank transfer'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`h-11 rounded-[10px] border text-[13.5px] font-bold transition-colors cursor-pointer ${
                        paymentMethod === method
                          ? 'bg-navy text-white border-navy'
                          : 'bg-white text-ink border-field hover:border-navy'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-[13px] font-semibold text-bad bg-bad-bg px-3.5 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-[12px] bg-cta hover:bg-cta-hover text-white font-bold text-[15px] transition-colors cursor-pointer"
              >
                Confirm booking · {formatBDT(total)}
              </button>
            </form>

            {/* Right Summary */}
            <aside className="bg-navy text-white rounded-[20px] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-on-navy-2">
                    Selected Flight
                  </span>
                  <h2 className="display text-[20px] font-extrabold text-white mt-0.5">
                    {from} → {to}
                  </h2>
                </div>
                <Plane className="w-6 h-6 text-cta-light" />
              </div>

              <div className="space-y-2.5 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-on-navy-2">Airline</span>
                  <span className="font-bold">
                    {airline} ({code})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-navy-2">Date</span>
                  <span className="font-bold">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-navy-2">Time</span>
                  <span className="font-bold">
                    {dep} – {arr} ({duration})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-navy-2">Stops &amp; Baggage</span>
                  <span className="font-bold">
                    {stops} · {baggage}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-navy-2">Travellers</span>
                  <span className="font-bold">
                    {pax} {pax === 1 ? 'Adult' : 'Adults'} · {cabin}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                <span className="text-[14px] text-on-navy-2">Total (incl. taxes)</span>
                <span className="display text-[26px] font-extrabold text-white">
                  {formatBDT(total)}
                </span>
              </div>

              <p className="text-[12px] text-on-navy-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cta-light shrink-0" />
                <span>Every payment gets an official receipt and live tracking ID.</span>
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
