import React, { useState } from 'react'

<<<<<<< HEAD
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
=======
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
      'This visual story transforms malaria prevention information into a simple, memorable sequence. It explains how mosquitoes spread malaria and highlights practical prevention measures that families and communities can use.'
>>>>>>> 0ed6734717591464b158d00c52cd9c309e4bac5a
  },

  {
<<<<<<< HEAD
    // Replaced the vendor card with a dedicated Tourism / Cultural Heritage option
    category: 'Cultural Heritage',
    topic: 'Tourism Education',
    title: 'Echoes of the Rwenzori',
    blurb: 'An interactive visual guide exploring the rich history and folklore of western Uganda.',
    coverImage: script,
    details: 'This multimedia asset turns raw historical texts and travel itineraries into an engaging, character-driven story framework. Built to support eco-tourism and outreach initiatives, it uses local folklore to create highly memorable visual maps for visitors exploring regional historical sites.'
=======
    category: 'Community Health',
    topic: 'Healthy Living',
    title: 'SMALL CHOICES, HEALTHIER LIVES',
    blurb:
      'A visual story about everyday habits that can help communities live healthier lives.',
    coverImage: underthenet,
    details:
      'This story transforms general health guidance into an engaging visual narrative. It can communicate topics such as hand washing, clean water, balanced nutrition and physical activity using characters and situations that audiences can easily relate to.'
>>>>>>> 0ed6734717591464b158d00c52cd9c309e4bac5a
  },

  {
    category: 'Public Health',
    topic: 'Maternal Care',
<<<<<<< HEAD
    title: 'HEALTHCARE',
    blurb: 'How a community health worker keeps three villages within reach.',
    coverImage: health,
    details: 'A multimodal interactive explainer documenting community health delivery chains. It aggregates text protocols into highly readable visual storyboards to help field workers overcome literacy and language barriers in remote areas.'
=======
    title: 'CARE WITHIN REACH',
    blurb:
      'How community health workers help connect mothers and families to essential healthcare.',
    coverImage: maternal,
    details:
      'A multimodal health explainer showing how community health workers connect people to healthcare services. The story can simplify important maternal-health information while making the information accessible to different audiences.'
>>>>>>> 0ed6734717591464b158d00c52cd9c309e4bac5a
  },
]


export default function FeaturedStories() {
<<<<<<< HEAD
  const [selectedStory, setSelectedStory] = useState(null)

  return (
    <section id="stories" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between border-b border-panelLine pb-6">
=======

  const [selectedStory, setSelectedStory] = useState(null)

  return (

    <section
      id="stories"
      className="mx-auto max-w-7xl px-6 py-20"
    >

      {/* SECTION HEADER */}

      <div
        className="
          mb-10
          flex
          items-end
          justify-between
          border-b
          border-[#164E4A]/50
          pb-6
        "
      >

>>>>>>> 0ed6734717591464b158d00c52cd9c309e4bac5a
        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-[#5EEAD4]
              font-semibold
            "
          >
            Featured Stories
          </p>
<<<<<<< HEAD
          <h2 className="mt-2 font-display text-3xl font-semibold">
            Information/Stories that matter
=======

          <h2
            className="
              mt-2
              text-3xl
              font-semibold
              text-[#F0FDFA]
            "
          >
            Public Health Information that matters
>>>>>>> 0ed6734717591464b158d00c52cd9c309e4bac5a
          </h2>

        </div>


        <a
          href="#stories"
          className="
            hidden
            text-sm
            text-[#94A3B8]
            hover:text-[#5EEAD4]
            md:block
            transition-colors
          "
        >
          View all →
        </a>

      </div>

<<<<<<< HEAD
      {/* Grid List layout */}
      <div className="grid gap-6 md:grid-cols-3">
=======

      {/* STORY CARDS */}

      <div className="grid gap-6 md:grid-cols-3">

>>>>>>> 0ed6734717591464b158d00c52cd9c309e4bac5a
        {stories.map((s) => (

          <article
            key={s.title}
            onClick={() => setSelectedStory(s)}
<<<<<<< HEAD
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
=======

            className="
              group
              flex
              flex-col
              rounded-xl
              border
              border-[#164E4A]/60
              bg-[#0D2929]/60
              overflow-hidden
              transition-all
              duration-300

              hover:border-[#2DD4BF]/60
              hover:-translate-y-1

              shadow-[0_10px_35px_rgba(0,0,0,0.25)]

              cursor-pointer
            "
          >

            {/* IMAGE */}

            <div
              className="
                relative
                h-44
                w-full
                overflow-hidden
                bg-[#071A1D]
                border-b
                border-[#164E4A]/50
              "
            >

              <img
                src={s.coverImage}
                alt={s.title}
                className="
                  w-full
                  h-full
                  object-cover

                  transition-transform
                  duration-500

                  group-hover:scale-105
                "
              />

              {/* Dark overlay */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#071A1D]/70
                  to-transparent
                "
              />

            </div>


            {/* CARD CONTENT */}

            <div
              className="
                flex
                flex-col
                flex-1
                p-6
              "
            >

              {/* Category + Topic */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    rounded-full
                    bg-[#2DD4BF]/10
                    px-3
                    py-1

                    text-[10px]
                    uppercase
                    tracking-wider
                    text-[#5EEAD4]
                    font-semibold

                    border
                    border-[#2DD4BF]/20
                  "
                >
                  {s.category}
                </span>


                <span
                  className="
                    text-[11px]
                    text-[#94A3B8]
                    tracking-wide
                  "
                >
                  {s.topic}
                </span>

              </div>


              {/* Title */}

              <h3
                className="
                  mt-4
                  text-xl
                  font-semibold
                  leading-snug
                  text-[#F0FDFA]

                  group-hover:text-[#5EEAD4]

                  transition-colors
                "
              >
                {s.title}
              </h3>


              {/* Description */}

              <p
                className="
                  mt-2
                  flex-1
                  text-sm
                  leading-relaxed
                  text-[#94A3B8]
                "
              >
                {s.blurb}
              </p>


              {/* Read button */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  text-sm
                  font-semibold
                  text-[#5EEAD4]
                "
              >

                <span
                  className="
                    transition-transform
                    group-hover:translate-x-1
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  Read details <span>→</span>
                </span>

              </div>

            </div>

>>>>>>> 0ed6734717591464b158d00c52cd9c309e4bac5a
          </article>

        ))}

      </div>

<<<<<<< HEAD
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
=======

      {/* =========================
          STORY DETAILS MODAL
          ========================= */}

      {selectedStory && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
          "
        >

          {/* Backdrop */}

          <div
            className="
              absolute
              inset-0
              bg-[#020809]/85
              backdrop-blur-sm
            "

            onClick={() => setSelectedStory(null)}
          />


          {/* Modal */}

          <div
            className="
              relative
              w-full
              max-w-2xl

              bg-[#071A1D]

              border
              border-[#164E4A]

              rounded-2xl

              overflow-hidden

              shadow-[0_25px_80px_rgba(0,0,0,0.5)]

              z-10

              max-h-[90vh]

              flex
              flex-col
            "
          >

            {/* Modal Image */}

            <div
              className="
                relative
                h-64
                w-full
                bg-[#071A1D]
              "
            >

              <img
                src={selectedStory.coverImage}
                alt={selectedStory.title}
                className="
                  w-full
                  h-full
                  object-cover
                "
              />


              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#071A1D]
                  via-[#071A1D]/20
                  to-transparent
                "
              />


              {/* Close */}

              <button
                type="button"

                onClick={() => setSelectedStory(null)}

                className="
                  absolute
                  top-4
                  right-4

                  bg-[#071A1D]/80

                  hover:bg-[#0D2929]

                  text-[#F0FDFA]

                  p-2

                  rounded-full

                  border
                  border-[#164E4A]

                  transition-all
                "

                aria-label="Close details"
              >

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >

                  <path
                    d="M18 6 6 18M6 6l12 12"
                    strokeLinecap="round"
                  />

                </svg>

              </button>

            </div>


            {/* Modal Content */}

            <div
              className="
                p-8
                overflow-y-auto
                flex-1
                text-[#F0FDFA]
              "
            >

              {/* Category */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <span
                  className="
                    rounded-full
                    bg-[#2DD4BF]/10

                    px-3
                    py-1

                    text-[10px]
                    uppercase
                    tracking-wider

                    text-[#5EEAD4]

                    font-bold

                    border
                    border-[#2DD4BF]/20
                  "
                >
                  {selectedStory.category}
                </span>


                <span
                  className="
                    text-xs
                    text-[#94A3B8]
                  "
                >
                  • {selectedStory.topic}
                </span>

              </div>


              {/* Title */}

              <h2
                className="
                  mt-4
                  text-3xl
                  font-bold
                  tracking-tight
                  text-[#F0FDFA]
                "
              >
                {selectedStory.title}
              </h2>


              {/* Blurb */}

              <p
                className="
                  mt-4
                  text-base
                  leading-relaxed
                  text-[#5EEAD4]
                  italic
                  font-medium
                "
              >
                "{selectedStory.blurb}"
              </p>


              {/* Overview */}

              <div
                className="
                  mt-6
                  border-t
                  border-[#164E4A]/60
                  pt-6
                "
              >

                <h4
                  className="
                    text-[11px]
                    uppercase
                    tracking-widest
                    text-[#94A3B8]
                    font-bold
                    mb-2
                  "
                >
                  Overview
                </h4>


                <p
                  className="
                    text-sm
                    leading-relaxed
                    text-[#94A3B8]
                  "
                >
                  {selectedStory.details}
                </p>

              </div>

            </div>


            {/* Modal Footer */}

            <div
              className="
                border-t
                border-[#164E4A]/50

                px-8
                py-4

                bg-black/20

                flex
                justify-end
              "
            >

              <button
                type="button"

                onClick={() => setSelectedStory(null)}

                className="
                  rounded-lg

                  bg-[#0D2929]

                  border
                  border-[#164E4A]

                  px-5
                  py-2

                  text-xs
                  font-bold
                  uppercase
                  tracking-wider

                  text-[#F0FDFA]

                  hover:bg-[#164E4A]

                  hover:text-[#5EEAD4]

                  transition-all
                "
              >
                Close View
              </button>

            </div>

          </div>

        </div>

      )}

>>>>>>> 0ed6734717591464b158d00c52cd9c309e4bac5a
    </section>
  )
}