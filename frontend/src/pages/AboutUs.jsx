import React from 'react'

const principles = [
  { title: 'Accessibility', desc: 'Making health information available to everyone regardless of literacy levels.' },
  { title: 'Cultural Context', desc: 'Ensuring visuals reflect the rich and diverse Ugandan culture.' },
  { title: 'Transparency', desc: 'Clarifying how public health resources are used and how decisions are made.' },
]

export default function AboutUs() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="eyebrow text-[#2B7A4B]">About Us</p>
        <h1 className="mt-3 section-heading text-slate-900">
          Empowering Uganda through <span className="gradient-text">Visual Storytelling</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">
          We believe that public health information shouldn't be trapped in complex reports and dry documents.
          Our mission is to transform essential data into visual narratives that can resonate with every citizen through the <span className="font-extrabold text-[#2B7A4B]">Pearl Visual</span> platform.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="glass-panel rounded-3xl border border-slate-200 p-8">
          <h2 className="text-2xl font-extrabold text-slate-900">Our Vision</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            To create a more informed and engaged Ugandan society where public health policies, health guidelines
            and civic duties are understood through the universal language of visuals. By leveraging
            Large Vision Models (LVM), we bridge the gap between technical data and community understanding.
          </p>
        </div>

        <div className="glass-panel rounded-3xl border border-slate-200 p-8">
          <h2 className="text-2xl font-extrabold text-slate-900">How it Works</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Our platform allows communicators to break down complex health topics into simple scenes.
            These scenes are then processed by LVM models to generate culturally relevant and
            contextually accurate visuals making information accessible, memorable and shareable.
          </p>
        </div>
      </div>

      <div className="mt-16 border-t border-slate-200 pt-12">
        <h2 className="text-2xl font-extrabold text-slate-900">Core principles</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => (
            <div key={principle.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">{principle.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{principle.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
