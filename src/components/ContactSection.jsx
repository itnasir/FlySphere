import { useState } from 'react'
import { CheckCircle2, ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useReveal } from '../hooks/useReveal'

export default function ContactSection() {
  const { lang, t, addApplication, showToast } = useApp()
  const [ref, visible] = useReveal()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState('Work permit processing')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submittedRef, setSubmittedRef] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (name.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }
    if (phone.trim().length < 8) {
      setError('Please enter a valid mobile or WhatsApp number.')
      return
    }
    if (message.trim().length < 5) {
      setError('Please write a short message about how we can help.')
      return
    }

    const prefix = service.toLowerCase().includes('visa')
      ? 'LT-VS'
      : service.toLowerCase().includes('air')
      ? 'LT-TK'
      : 'LT-WP'

    const created = addApplication({
      prefix,
      applicant: name.trim(),
      phone: phone.trim(),
      service,
      country: 'General Enquiry',
      role: message.trim().slice(0, 48),
    })

    setSubmittedRef(created.id)
    setName('')
    setPhone('')
    setMessage('')
    showToast(`Enquiry sent! Reference ID: ${created.id}`, 'success')
  }

  return (
    <section id="contact" ref={ref} className="py-12 sm:py-20">
      <div className="wrap">
        <div
          className={`mb-8 reveal-on-scroll ${visible ? 'is-visible' : ''}`}
        >
          <span className="eyebrow">{t.contactEyebrow}</span>
          <h2 className="section-title text-navy mt-2.5">{t.contactTitle}</h2>
        </div>

        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch reveal-on-scroll ${
            visible ? 'is-visible' : ''
          }`}
        >
          {/* Left Column: Info Card + Map */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-[18px] border border-line p-6 sm:p-7">
              <div className="pb-4 mb-5 border-b border-line">
                <h3 className="display text-[22px] sm:text-[24px] font-extrabold tracking-tight">
                  <span className="text-navy">MAHMUDUL</span>{' '}
                  <span className="text-cta">HASAN</span>
                </h3>
                <p className="text-[14px] font-semibold text-muted mt-0.5">
                  {lang === 'bn' ? 'ব্যবস্থাপনা পরিচালক' : 'Managing Director'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-tint text-navy flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="block text-[12px] font-bold uppercase tracking-wider text-muted">
                      WhatsApp &amp; Viber
                    </span>
                    <a
                      href="tel:+8801312772233"
                      className="text-[15.5px] font-bold text-ink hover:text-royal transition-colors"
                    >
                      +880 1312-772233
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-tint text-navy flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="block text-[12px] font-bold uppercase tracking-wider text-muted">
                      Email
                    </span>
                    <a
                      href="mailto:info@lusantravelsbd.com"
                      className="text-[15.5px] font-bold text-ink hover:text-royal transition-colors"
                    >
                      info@lusantravelsbd.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-tint text-navy flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="block text-[12px] font-bold uppercase tracking-wider text-muted">
                      Office address
                    </span>
                    <p className="text-[15px] font-semibold text-ink leading-snug">
                      2nd Floor, House #105, Road #4, Block #B, Banani, Dhaka-1213
                    </p>
                    <a
                      href="https://maps.google.com/?q=House+105,+Road+4,+Block+B,+Banani,+Dhaka+1213"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[13.5px] font-bold text-royal hover:text-cta mt-1"
                    >
                      <span>Next to Gulshan · Get directions</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="flex-1 min-h-[240px] rounded-[18px] overflow-hidden border border-line bg-tint">
              <iframe
                title="Lusan Travels Office Map — Banani, Dhaka"
                src="https://www.google.com/maps?q=House+105,+Road+4,+Block+B,+Banani,+Dhaka+1213&output=embed"
                className="w-full h-full min-h-[240px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Send an enquiry form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[20px] border border-line p-6 sm:p-8 flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-4">
              <h3 className="display text-[22px] font-extrabold text-navy mb-2">
                {t.sendEnquiry}
              </h3>

              <label className="block">
                <span className="block text-[13px] font-bold text-ink mb-1.5">
                  Full name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="As on passport"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-field bg-white text-[15px] text-ink placeholder:text-subtle focus:border-royal focus:outline-none"
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
                  className="w-full h-11 px-3.5 rounded-[12px] border border-field bg-white text-[15px] text-ink placeholder:text-subtle focus:border-royal focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="block text-[13px] font-bold text-ink mb-1.5">
                  Service
                </span>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-[12px] border border-field bg-white text-[15px] font-semibold text-ink focus:border-royal focus:outline-none cursor-pointer"
                >
                  <option value="Work permit processing">Work permit processing</option>
                  <option value="Visa assistance">Visa assistance</option>
                  <option value="Air ticket booking">Air ticket booking</option>
                  <option value="Become an agent / agency partnership">
                    Become an agent / agency partnership
                  </option>
                </select>
              </label>

              <label className="block">
                <span className="block text-[13px] font-bold text-ink mb-1.5">
                  Your message
                </span>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us the country, travel date, or question..."
                  className="w-full p-3.5 rounded-[12px] border border-field bg-white text-[15px] text-ink placeholder:text-subtle focus:border-royal focus:outline-none resize-y"
                />
              </label>

              {error && (
                <p className="text-[13px] font-semibold text-bad bg-bad-bg px-3.5 py-2 rounded-lg">
                  {error}
                </p>
              )}

              {submittedRef && (
                <div className="text-[13.5px] font-semibold text-ok bg-ok-bg px-4 py-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Enquiry submitted! Reference ID:{' '}
                    <span className="font-mono font-bold">{submittedRef}</span>
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="mt-6 w-full h-12 rounded-[12px] bg-navy hover:bg-deep text-white font-bold text-[15px] transition-colors cursor-pointer"
            >
              {t.submitEnquiry}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
