import React, { useState } from 'react'

// Import your existing images
//import helm from '../images/helm.jpeg'
import health from '../images/health.jpeg'
import bike from '../images/bike.jpeg'
import script from '../images/script.jpg'
const stories = [
  {
    category: 'Public Awareness',
    topic: 'Road Safety',
    title: 'ROAD SAFETY',
    blurb: 'A visual story about making safer choices when crossing busy roads.',
    coverImage: bike,
    details: 'This visual story breaks down vital pedestrian traffic laws into sequential comic strips. Designed for school outreach campaigns across Kampala, it visualizes context-specific risks and decision-making on high-speed roads to maximize text retention.'
  },
  {
    // Replaced the vendor card with a dedicated Tourism / Cultural Heritage option
    category: 'Cultural Heritage',
    topic: 'Tourism Education',
    title: 'Echoes of the Rwenzori',
    blurb: 'An interactive visual guide exploring the rich history and folklore of western Uganda.',
    coverImage: script,
    details: 'This multimedia asset turns raw historical texts and travel itineraries into an engaging, character-driven story framework. Built to support eco-tourism and outreach initiatives, it uses local folklore to create highly memorable visual maps for visitors exploring regional historical sites.'
  },
  {
    category: 'Health',
    topic: 'Maternal Care',
    title: 'HEALTHCARE',
    blurb: 'How a community health worker keeps three villages within reach.',
    coverImage: health,
    details: 'A multimodal interactive explainer documenting community health delivery chains. It aggregates text protocols into highly readable visual storyboards to help field workers overcome literacy and language barriers in remote areas.'
  },
]

export default function FeaturedStories() {
  const [selectedStory, setSelectedStory] = useState(null)

  return (
    <section id="stories" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between border-b border-panelLine pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">
            Featured
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold">
            Information/Stories that matter
          </h2>
        </div>
        <a href="#stories" className="hidden font-body text-sm text-sienna hover:text-parchment md:block">
          View all →
        </a>
      </div>

      {/* Grid List layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {stories.map((s) => (
          <article
            key={s.title}
            onClick={() => setSelectedStory(s)}
            className="group flex flex-col rounded-xl border border-panelLine bg-panel overflow-hidden transition-all duration-300 hover:border-amber/40 hover:-translate-y-1 shadow-lg cursor-pointer"
          >
            {/* Visual Thumbnail Card Cap */}
            <div className="relative h-44 w-full overflow-hidden bg-ink/50 border-b border-panelLine/40">
              <img 
                src={s.coverImage} 
                alt={s.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-panel/40 to-transparent" />
            </div>

            {/* Inner Content Area */}
            <div className="flex flex-col flex-1 p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-clay/20 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-amber font-semibold">
                  {s.category}
                </span>
                <span className="font-mono text-[11px] text-sienna tracking-wide">{s.topic}</span>
              </div>

              <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-parchment group-hover:text-amber transition-colors">
                {s.title}
              </h3>
              <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-sienna">
                {s.blurb}
              </p>

              <div className="mt-6 flex items-center font-body text-sm font-semibold text-amber">
                <span className="transition-transform group-hover:translate-x-1 flex items-center gap-1.5">
                  Read details <span>→</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* POP-UP MODAL CONTAINER */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedStory(null)}
          />
          
          <div className="relative w-full max-w-2xl bg-panel border border-panelLine rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col">
            
            <div className="relative h-64 w-full bg-ink">
              <img 
                src={selectedStory.coverImage} 
                alt={selectedStory.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
              
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 bg-ink/70 hover:bg-ink text-parchment p-2 rounded-full border border-panelLine transition-all"
                aria-label="Close details"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 text-parchment">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-clay/20 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-amber font-bold">
                  {selectedStory.category}
                </span>
                <span className="font-mono text-xs text-sienna">• {selectedStory.topic}</span>
              </div>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white">
                {selectedStory.title}
              </h2>
              
              <p className="mt-4 font-body text-base leading-relaxed text-amber/90 italic font-medium">
                "{selectedStory.blurb}"
              </p>

              <div className="mt-6 border-t border-panelLine/60 pt-6">
                <h4 className="font-mono text-[11px] uppercase tracking-widest text-sienna font-bold mb-2"> Overview</h4>
                <p className="font-body text-sm leading-relaxed text-sienna">
                  {selectedStory.details}
                </p>
              </div>
            </div>

            <div className="border-t border-panelLine/40 px-8 py-4 bg-black/20 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="rounded-lg bg-panelLine px-5 py-2 font-body text-xs font-bold uppercase tracking-wider text-parchment hover:bg-panelLine/80 transition-all"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  )
}
