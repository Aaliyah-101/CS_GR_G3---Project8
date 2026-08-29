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
      'This visual story transforms malaria prevention information into a simple, memorable sequence. It explains how mosquitoes spread malaria and highlights practical prevention measures that families and communities can use.'
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

        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-[0.5em]
              text-[#5EEAD4]
              font-semibold
            "
          >
            Featured Stories
          </p>

          <h2
            className="
              mt-2
              text-5xl
              font-semibold
              text-[orange]
              
            "
          >
            Public Health 
            <span className="text-[white] text-5xl"> Information that </span>{' '}
            <span className="text-[orange] text-5xl"> Matters.</span>
 
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


      {/* STORY CARDS */}

      <div className="grid gap-6 md:grid-cols-3">

        {stories.map((s) => (

          <article
            key={s.title}
            onClick={() => setSelectedStory(s)}

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

              hover:border-[orange]/60
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

          </article>

        ))}

      </div>


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

                  hover:bg-[orange]

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

                  hover:bg-[orange]

                  hover:text-[black]

                  transition-all
                "
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