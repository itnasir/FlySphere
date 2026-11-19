import { useNavigate } from 'react-router-dom'
import { MARQUEE_ITEMS } from '../data/siteData'

function AirplaneIcon() {
  return (
    <svg
      className="w-4 h-4 text-navy shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  )
}

export default function MarqueeStrip() {
  const navigate = useNavigate()
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <div className="py-5 overflow-hidden select-none">
      <div className="bg-cta -rotate-[1.2deg] scale-[1.03] py-3.5 shadow-sm border-y border-white/15">
        <div className="animate-marquee items-center">
          {doubled.map((item, idx) => (
            <button
              key={`${item.code}-${idx}`}
              type="button"
              onClick={() =>
                navigate(`/flights?from=DAC&to=${item.to}&trip=oneway&pax=1&cabin=Economy`)
              }
              className="inline-flex items-center gap-3 px-5 text-white hover:text-white/90 transition-opacity cursor-pointer group"
            >
              <span className="display font-extrabold text-[15px] sm:text-[16px] tracking-wide">
                {item.city}
              </span>
              <span className="font-mono text-[12px] font-semibold bg-white/18 px-2 py-0.5 rounded text-white/95 group-hover:bg-navy transition-colors">
                {item.code}
              </span>
              <AirplaneIcon />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
