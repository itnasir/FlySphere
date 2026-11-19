import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { FAQS } from '../data/siteData'
import { useReveal } from '../hooks/useReveal'

export default function FaqSection() {
  const { lang, t } = useApp()
  const [openId, setOpenId] = useState('faq-1')
  const [ref, visible] = useReveal()

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section id="faq" ref={ref} className="py-10 sm:py-16">
      <div className="wrap">
        <div
          className={`mb-8 reveal-on-scroll ${visible ? 'is-visible' : ''}`}
        >
          <span className="eyebrow">{t.faqEyebrow}</span>
          <h2 className="section-title text-navy mt-2.5">{t.faqTitle}</h2>
        </div>

        <div
          className={`bg-white rounded-[18px] border border-line divide-y divide-line overflow-hidden shadow-xs reveal-on-scroll ${
            visible ? 'is-visible' : ''
          }`}
        >
          {FAQS.map((item) => {
            const isOpen = openId === item.id
            return (
              <div key={item.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-5 text-left hover:bg-page/60 transition-colors cursor-pointer"
                >
                  <span className="display text-[16px] sm:text-[18px] font-bold text-ink">
                    {lang === 'bn' ? item.qBn : item.q}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-cta text-white'
                        : 'bg-tint text-royal'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-7 pb-5 text-[15px] text-muted leading-relaxed">
                    {lang === 'bn' ? item.aBn : item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
