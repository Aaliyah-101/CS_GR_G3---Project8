export default function AboutUs() {
  return (
    <section className="bark-texture mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">
          About Us
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
          Empowering Uganda through <span className="text-amber">Visual Storytelling</span>
        </h1>
        <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-sienna">
          We believe that public information shouldn't be trapped in complex reports and dry documents.
          Our mission is to transform essential data into visual narratives that can resonate with every citizen through the
          <span className="text-parchment"> Pearl Visual</span> platform.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-panelLine bg-panel p-8 transition hover:border-amber/30">
          <h2 className="font-display text-2xl font-semibold text-parchment">Our Vision</h2>
          <p className="mt-4 font-body text-sm leading-relaxed text-sienna">
            To create a more informed and engaged Ugandan society where public policies, health guidelines
            and civic duties are understood through the universal language of visuals. By leveraging
            Large Vision Models (LVM), we bridge the gap between technical data and community understanding.
          </p>
        </div>

        <div className="rounded-lg border border-panelLine bg-panel p-8 transition hover:border-amber/30">
          <h2 className="font-display text-2xl font-semibold text-parchment">How it Works</h2>
          <p className="mt-4 font-body text-sm leading-relaxed text-sienna">
            Our platform allows communicators to break down complex topics into simple scenes.
            These scenes are then processed by LVM models to generate culturally relevant and
            contextually accurate visuals making information accessible, memorable and shareable.
          </p>
        </div>
      </div>

      <div className="mt-16 border-t border-panelLine pt-12">
        <h2 className="font-display text-2xl font-semibold">Core Principles</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Accessibility', desc: 'Making information available to everyone regardless of literacy levels.' },
            { title: 'Cultural Context', desc: 'Ensuring visuals reflect the rich and diverse Ugandan culture.' },
            { title: 'Transparency', desc: 'Clarifying how public resources are used and how decisions are made.' },
          ].map((principle) => (
            <div key={principle.title}>
              <h3 className="font-mono text-xs uppercase tracking-wide text-amber">{principle.title}</h3>
              <p className="mt-2 font-body text-sm text-sienna">{principle.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
