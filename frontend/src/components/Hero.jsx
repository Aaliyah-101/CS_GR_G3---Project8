import React from 'react'
import net from '../images/net.png'
import script from '../images/script.jpg'
import netcover from '../images/netcover.png'

export default function Hero({ onCreateClick }) {
  return (
    <section
      className="
        relative
        overflow-hidden
        pb-28
        pt-16
        md:pb-36
        md:pt-20
      "
    >

      {/* Soft health-themed glow */}
      <div
       className="
         mx-auto grid
         max-w-[1400px]
         items-center
         gap-10
         px-6
         md:grid-cols-12
        "
      >

        {/* LEFT SIDE */}
        <div className="md:col-span-5">

          <p
            className="
            eyebrow
            mb-5
            text-[#2B7A4B]
            "
          >
          LVM-Powered Visual Storytelling
          </p>


          <h1 className="section-heading text-slate-900">
            Turning <span className="gradient-text">
            Public Health</span> information into <span className="gradient-text">
            visual stories.
            </span>
       </h1>



          <p
            className="
              mt-7
              max-w-xl
              text-base
              leading-relaxed
              text-slate-600
            "
          >
            Transforming Complex Health Information Into
            Visual Stories People Can Understand,
            Remember and Share.
          </p>


          {/* BUTTONS */}
          <div className="mt-9 flex flex-wrap gap-4">

            <button
              type="button"
              onClick={onCreateClick}
              className="
                rounded-xl
                bg-gradient-to-r from-[#F5C400] to-[#2B7A4B]
                px-6
                py-3
                text-sm
                font-extrabold
                uppercase tracking-[0.18em]
                text-slate-950
                shadow-glow transition
                hover:-translate-y-0.5
                hover:shadow-soft
              "
            >
              Create a Story
            </button>


            <a
              href="#stories"
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-6
                py-3
                text-sm
                font-extrabold
                uppercase
                tracking-[0.18em]
                text-slate-700
                transition
                hover:border-[#F5C400]
                hover:text-[#2B7A4B]
              "
            >
              Explore Stories
            </a>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="relative w-full md:col-span-7">

          <div
             className="
               glass-panel
               relative
               overflow-hidden
               rounded-[28px]
               border
               border-slate-200
               p-5
              "
             >


            <div
              className="
                grid
                gap-5
                md:grid-cols-[0.9fr_0.2fr_1.15fr_0.2fr_1.15fr]
                md:items-center
              "
            >

              {/* IMAGE 1 */}
              <div
                className="
                  -rotate-2
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#F5C400]/40
                  bg-slate-100
                  shadow-soft
                  transition
                  hover:rotate-0
                "
              >


              <img
                src={script}
                alt="Health information"
                className="
                  h-[300px]
                  w-full
                  object-cover
                  md:h-[360px]
                "
              />

            </div>


            {/* ARROW 1 */}
            <div
              className="
                hidden
                items-center
                justify-center
                md:flex
              "
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-[#2B7A4B]">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>


              {/* IMAGE 2 */}
              <div className="rotate-1 overflow-hidden rounded-2xl border border-[#2B7A4B]/30 bg-slate-100 shadow-soft transition hover:rotate-0">
                <img src={netcover} alt="Health visual story" className="h-[300px] w-full object-cover md:h-[360px]" />
              </div>


              {/* ARROW 2 */}
              <div className="hidden items-center justify-center md:flex">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-[#D62828] animate-pulse">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>


            {/* IMAGE 3 */}
            <div
              className="
                rotate-2
                overflow-hidden
                rounded-2xl
                border
                border-[#F5C400]/40
                bg-slate-100
                shadow-soft
                transition
                hover:rotate-0
              "
            >

              <img
                src={net}
                alt="Health storytelling"
                className="
                  h-[300px]
                  w-full
                  object-cover
                  md:h-[360px]
                "
              />

              </div>
            </div>

          </div>

        </div>

      </div>


      {/* Bottom wave */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          overflow-hidden
          leading-[0]
          z-20
        "
      >

        <svg
          className="relative block h-12 w-full md:h-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >

          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,4.75,55.05,10.3,81.39,15.22,154,28.87,227.18,39,321.39,56.44Z"
            fill="#f3f3ef"
          />

        </svg>

      </div>

    </section>
  )
}