const stories = [
  {
    category: 'Public Awareness',
    topic: 'Road Safety',
    title: 'The journey home',
    blurb: 'A visual story about making safer choices when crossing busy roads.',
  },
  {
    category: 'Civic Life',
    topic: 'Local Government',
    title: 'Where the tax shilling goes',
    blurb: 'Following a market vendor\u2019s daily levy from stall to service delivery.',
  },
  {
    category: 'Health',
    topic: 'Maternal Care',
    title: 'Nine months, one village',
    blurb: 'How a community health worker keeps three villages within reach.',
  },
]

export default function FeaturedStories() {
  return (
    <section id="stories" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between border-b border-panelLine pb-6 ">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">
            Featured
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold">
            Stories that matter
          </h2>
        </div>
        <a href="#stories" className="hidden font-body text-sm text-sienna hover:text-parchment md:block">
          View all →
        </a>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {stories.map((s) => (
          <article
            key={s.title}
            className="group flex flex-col rounded-lg border border-panelLine bg-panel p-6 transition hover:border-amber/40"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-clay/20 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-amber">
                {s.category}
              </span>
              <span className="font-mono text-[11px] text-sienna">{s.topic}</span>
            </div>

            <h3 className="mt-5 font-display text-xl font-semibold leading-snug">
              {s.title}
            </h3>
            <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-sienna">
              {s.blurb}
            </p>

            <a
              href="#stories"
              className="mt-6 font-body text-sm font-medium text-amber transition group-hover:translate-x-0.5"
            >
              View story →
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
