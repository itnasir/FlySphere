export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[640px] bg-navy overflow-hidden flex items-end"
    >
      <h1 className="sr-only">
        Work abroad. Fly anywhere. We handle the paperwork.
      </h1>

      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        poster="/assets/photos/wing.jpg"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,23,61,0.15) 0%, rgba(7,23,61,0) 45%, rgba(7,23,61,0.55) 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
