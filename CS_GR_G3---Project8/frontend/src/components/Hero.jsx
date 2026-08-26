export default function Hero({ onCreateClick }) {
  return (
    <section className=" bark-texture relative overflow-hidden">
      {/* ambient glow, purely decorative, sits behind text via -z-10 */}
      <div className="pointer-events-none absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-clay/20 blur-[100px]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">
          Visual Storytelling · Uganda
        </p>

        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          Turn information
          <br />
          into <span className="text-amber">stories.</span>
        </h1>

        <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-sienna">
          Transform complex public information into visual stories people can
          understand, remember, and share.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onCreateClick}
            className="rounded-md bg-amber px-6 py-3 font-body text-sm font-semibold text-ink transition hover:bg-amber/90"
          >
            Create a Story
          </button>
          <a
            href="#stories"
            className="rounded-md border border-panelLine px-6 py-3 font-body text-sm font-semibold text-parchment transition hover:border-amber/50"
          >
            Explore Stories
          </a>
        </div>
      </div>
    </section>
  )
}
