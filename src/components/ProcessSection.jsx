import { useApp } from '../context/AppContext'
import { useReveal } from '../hooks/useReveal'

export default function ProcessSection() {
  const { lang, t } = useApp()
  const [ref, visible] = useReveal()

  const steps = [
    {
      num: '01',
      title: lang === 'bn' ? 'ফ্রি মূল্যায়ন' : 'Free assessment',
      desc:
        lang === 'bn'
          ? 'আপনার পাসপোর্ট ও অভিজ্ঞতা শেয়ার করুন; আমরা যাচাইকৃত চাকরির সাথে মিলিয়ে দেব।'
          : 'Share your passport and experience; we match you to verified openings.',
    },
    {
      num: '02',
      title: lang === 'bn' ? 'কাগজপত্র ও চুক্তি' : 'Documents & contract',
      desc:
        lang === 'bn'
          ? 'আমরা আপনার ফাইল, অনুবাদ প্রস্তুত করি এবং নিয়োগকর্তার চুক্তি যাচাই করি।'
          : 'We prepare your file, translations and verify the employer contract.',
    },
    {
      num: '03',
      title: lang === 'bn' ? 'পারমিট ও ভিসা' : 'Permit & visa',
      desc:
        lang === 'bn'
          ? 'ওয়ার্ক পারমিট আবেদন, দূতাবাস অ্যাপয়েন্টমেন্ট এবং ভিসা স্ট্যাম্পিং।'
          : 'Work permit application, embassy appointment and visa stamping.',
    },
    {
      num: '04',
      title: lang === 'bn' ? 'টিকিট ও যাত্রা' : 'Ticket & departure',
      desc:
        lang === 'bn'
          ? 'ক্লিয়ারেন্স, বিমান টিকিট এবং আমাদের অফিসে প্রি-ডিপার্চার ব্রিফিং।'
          : 'Clearance, air ticket and a pre-departure briefing at our office.',
    },
  ]

  return (
    <section
      ref={ref}
      className="relative bg-navy text-white py-16 sm:py-22 overflow-hidden"
    >
      {/* Decorative red curved arc sweeping across bottom-left */}
      <svg
        className="absolute -bottom-12 -left-12 w-[420px] h-[220px] pointer-events-none opacity-90"
        viewBox="0 0 420 220"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-30 210C80 120 210 90 410 175"
          stroke="#e3262b"
          strokeWidth="26"
          strokeLinecap="round"
        />
      </svg>

      {/* Faint dashed circular flight path SVG on the right */}
      <svg
        className="absolute -top-16 -right-16 w-[440px] h-[440px] pointer-events-none opacity-15"
        viewBox="0 0 440 440"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="220"
          cy="220"
          r="175"
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="10 10"
        />
        <circle
          cx="220"
          cy="220"
          r="118"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
      </svg>

      <div className="wrap relative z-10">
        <div
          className={`mb-10 reveal-on-scroll ${visible ? 'is-visible' : ''}`}
        >
          <span className="eyebrow eyebrow-dark">{t.processEyebrow}</span>
          <h2 className="section-title text-white mt-2.5">{t.processTitle}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, index) => (
            <div
              key={step.num}
              style={{ transitionDelay: `${index * 80}ms` }}
              className={`rounded-[18px] border border-white/15 bg-deep/55 backdrop-blur-sm p-6 hover:border-white/30 transition-all reveal-on-scroll ${
                visible ? 'is-visible' : ''
              }`}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cta text-white font-mono text-[14px] font-bold mb-5 shadow-sm">
                {step.num}
              </span>
              <h3 className="display text-[20px] font-extrabold text-white mb-2.5">
                {step.title}
              </h3>
              <p className="text-[14.5px] text-on-navy leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
