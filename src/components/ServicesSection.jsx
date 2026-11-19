import { ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useReveal } from '../hooks/useReveal'
import { scrollToSectionId } from '../utils/scrollToSection'

export default function ServicesSection() {
  const { lang, t, setActiveBookingTab } = useApp()
  const [ref, visible] = useReveal()

  const cards = [
    {
      num: '01',
      tag: lang === 'bn' ? 'ইউরোপ · গালফ · এশিয়া' : 'Europe · Gulf · Asia',
      title: lang === 'bn' ? 'ওয়ার্ক পারমিট প্রসেসিং' : 'Work Permit Processing',
      desc:
        lang === 'bn'
          ? 'নিয়োগকর্তা-যাচাইকৃত চাকরির অফার, ডকুমেন্ট প্রস্তুতি, দূতাবাস অ্যাপয়েন্টমেন্ট ও প্রি-ডিপার্চার ব্রিফিং।'
          : 'Employer-verified job offers, document preparation, embassy appointments and pre-departure briefing.',
      bullets:
        lang === 'bn'
          ? ['চাকরির অফার ও চুক্তি যাচাই', 'বিএমইটি ক্লিয়ারেন্স সহায়তা', 'দূতাবাস ফাইল ও অ্যাপয়েন্টমেন্ট']
          : ['Job offer & contract verification', 'BMET clearance support', 'Embassy file & appointment'],
      cta: lang === 'bn' ? 'ওয়ার্ক পারমিট ফাইল শুরু করুন' : 'Start a work permit file',
      barColor: 'bg-cta',
      tab: 'workpermit',
      img: '/assets/photos/construction.jpg',
      alt: 'Work permit processing construction specialists',
    },
    {
      num: '02',
      tag: lang === 'bn' ? 'ট্যুরিস্ট · বিজনেস · ভিজিট' : 'Tourist · Business · Visit',
      title: lang === 'bn' ? 'ভিসা সহায়তা' : 'Visa Assistance',
      desc:
        lang === 'bn'
          ? 'ট্যুরিস্ট ও বিজনেস ভিসার জন্য চেকলিস্ট, ফর্ম পূরণ, ব্যাংক স্টেটমেন্ট রিভিউ ও অ্যাপয়েন্টমেন্ট বুকিং।'
          : 'Checklist, form filling, bank statement review and appointment booking for tourist and business visas.',
      bullets:
        lang === 'bn'
          ? ['দেশভিত্তিক চেকলিস্ট', 'ফর্ম পূরণ ও অনুবাদ', 'হোটেল ও টিকিট রিজার্ভেশন']
          : ['Country-specific checklists', 'Form filling & translation', 'Hotel & ticket reservations'],
      cta: lang === 'bn' ? 'ভিসার জন্য আবেদন করুন' : 'Apply for a visa',
      barColor: 'bg-royal',
      tab: 'visa',
      img: '/assets/photos/visa.jpg',
      alt: 'Visa assistance documentation desk',
    },
    {
      num: '03',
      tag: lang === 'bn' ? 'সব প্রধান এয়ারলাইন্স' : 'All major airlines',
      title: lang === 'bn' ? 'বিমান টিকিট বুকিং' : 'Air Ticket Booking',
      desc:
        lang === 'bn'
          ? 'তাৎক্ষণিক ই-টিকিট, তারিখ পরিবর্তন এবং কর্মীদের জন্য গ্রুপ ভাড়াসহ দেশি ও আন্তর্জাতিক টিকিট।'
          : 'Domestic and international tickets with instant e-ticketing, date changes and group fares for workers.',
      bullets:
        lang === 'bn'
          ? ['ইমেইলে তাৎক্ষণিক ই-টিকিট', 'গ্রুপ ও লেবার ভাড়া', 'তারিখ পরিবর্তন ও রিফান্ড']
          : ['Instant e-ticket by email', 'Group & labour fares', 'Date change & refunds'],
      cta: lang === 'bn' ? 'ফ্লাইট খুঁজুন' : 'Search flights',
      barColor: 'bg-navy',
      tab: 'flight',
      img: '/assets/photos/passport.jpg',
      alt: 'Air ticket booking and passport travel',
    },
  ]

  const handleAction = (tab) => {
    setActiveBookingTab(tab)
    scrollToSectionId('book')
  }

  return (
    <section id="services" ref={ref} className="py-14 sm:py-20">
      <div className="wrap">
        {/* Header Row */}
        <div
          className={`flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10 reveal-on-scroll ${
            visible ? 'is-visible' : ''
          }`}
        >
          <div>
            <span className="eyebrow">{t.servicesEyebrow}</span>
            <h2 className="section-title text-navy mt-2.5">{t.servicesTitle}</h2>
          </div>
          <p className="text-muted text-[15px] sm:text-[16px] max-w-[460px] lg:text-right leading-relaxed">
            {t.servicesSub}
          </p>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <article
              key={card.num}
              style={{ transitionDelay: `${index * 80}ms` }}
              className={`bg-white rounded-[16px] border border-line overflow-hidden flex flex-col hover:shadow-book hover:-translate-y-1 transition-all duration-300 reveal-on-scroll ${
                visible ? 'is-visible' : ''
              }`}
            >
              <div className="aspect-[16/10] overflow-hidden bg-tint">
                <img
                  src={card.img}
                  alt={card.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className={`h-[3px] w-full ${card.barColor}`} />

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[12px] font-bold px-2.5 py-1 rounded-md bg-tint text-navy">
                    {card.num}
                  </span>
                  <span className="text-[12.5px] font-semibold text-muted">
                    {card.tag}
                  </span>
                </div>

                <h3 className="display text-[22px] font-extrabold text-ink leading-snug mb-2.5">
                  {card.title}
                </h3>

                <p className="text-[15px] text-muted leading-relaxed mb-5">
                  {card.desc}
                </p>

                <ul className="space-y-2 mb-6">
                  {card.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-[14px] font-medium text-ink"
                    >
                      <span
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-cta shrink-0"
                        aria-hidden="true"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleAction(card.tab)}
                  className="mt-auto inline-flex items-center gap-1.5 text-[14.5px] font-bold text-royal hover:text-cta transition-colors cursor-pointer group"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
