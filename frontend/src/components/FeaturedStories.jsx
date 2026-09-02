import React, { useState } from 'react'

import health from '../images/health.jpeg'
import maternal from '../images/maternal.png'
import underthenet from '../assets/images/underthenet.png'


const stories = [
  {
    category: 'Health Education',
    topic: 'Malaria Prevention',
    title: 'SLEEP UNDER THE NET',
    blurb:
     'A visual story showing how sleeping under an insecticide-treated mosquito net can help protect families from malaria.',
    coverImage: health,
    details:
     'This visual story transforms malaria prevention information into a simple memorable sequence. It explains how mosquitoes spread malaria and highlights practical prevention measures that families and communities can use.'
  },

  {
    category: 'Community Health',
    topic: 'Healthy Living',
    title: 'SMALL CHOICES, HEALTHIER LIVES',
    blurb:
     'A visual story about everyday habits that can help communities live healthier lives.',
    coverImage: underthenet,
    details:
     'This story transforms general health guidance into an engaging visual narrative. It can communicate topics such as hand washing, clean water, balanced nutrition and physical activity using characters and situations that audiences can easily relate to.'
  },

  {
    category: 'Public Health',
    topic: 'Maternal Care',
    title: 'CARE WITHIN REACH',
    blurb:
     'How community health workers help connect mothers and families to essential healthcare.',
    coverImage: maternal,
    details:
     'A multimodal health explainer showing how community health workers connect people to healthcare services. The story can simplify important maternal-health information while making the information accessible to different audiences.'
  },
]


export default function FeaturedStories() {

  const [selectedStory, setSelectedStory] = useState(null)

  return (

    <section
     id="stories"
     className="bg-[#eceae5]">
      <div className="mx-auto max-w-7xl px-6 py-20">
       <div className="mb-10 flex items-end justify-between pb-6">
          <div>
            <p className="eyebrow text-[#2B7A4B]">Featured Stories</p>
            <h2 className="mt-3 section-heading text-slate-900">
              Public Health <span className="text-slate-600">information that</span> <span className="gradient-text">matters.</span>
            </h2>
          </div>
          <a href="#stories" className="hidden text-sm font-semibold text-slate-600 transition hover:text-[#2B7A4B] md:block">View all →</a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stories.map((s) => (
            <article
              key={s.title}
              onClick={() => setSelectedStory(s)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-[#F5C400]"
            >
              <div className="relative h-52 w-full overflow-hidden border-b border-slate-200 bg-slate-100">
                <img src={s.coverImage} alt={s.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#F5C400]/40 bg-[#FFF8D6] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">
                    {s.category}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{s.topic}</span>
                </div>

                <h3 className="mt-4 text-2xl font-extrabold leading-snug text-slate-900 transition group-hover:text-[#D62828]">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{s.blurb}</p>

                <div className="mt-6 flex items-center text-sm font-extrabold uppercase tracking-[0.18em] text-[#2B7A4B]">
                  <span className="transition group-hover:translate-x-1">Read details <span className="ml-2">→</span></span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm" onClick={() => setSelectedStory(null)} />

            <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
              <div className="relative h-64 w-full bg-slate-100">
                <img src={selectedStory.coverImage} alt={selectedStory.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-800 transition hover:bg-[#D62828] hover:text-white"
                  aria-label="Close details"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 text-slate-900">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-[#F5C400]/40 bg-[#FFF8D6] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">{selectedStory.category}</span>
                  <span className="text-xs text-slate-500">• {selectedStory.topic}</span>
                </div>

                <h2 className="mt-4 text-3xl font-extrabold text-slate-900">{selectedStory.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-[#D62828] italic">“{selectedStory.blurb}”</p>

                <div className="mt-6 border-t border-slate-200 pt-6">
                  <h4 className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Overview</h4>
                  <p className="text-sm leading-relaxed text-slate-600">{selectedStory.details}</p>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-8 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-[#2B7A4B] hover:text-white"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}