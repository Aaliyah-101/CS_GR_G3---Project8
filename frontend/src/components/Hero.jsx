import React from 'react'
import helm from '../images/helm.jpeg'
import script from '../images/script.jpg'
import bike from '../images/bike.jpeg'

export default function Hero({ onCreateClick }) {
  return (
    <section className="bg-cream bark-texture relative overflow-hidden text-[#2E2A24] pb-28 md:pb-36 w-full">

      <div className="pointer-events-none absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-amber/20 blur-[100px]" />

      <div className="mx-auto w-full max-w-[1400px] px-6 pt-16 md:pt-24 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

        {/* LEFT - 40% */}
        <div className="md:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.5em] text-clay font-bold">
            LVM-Powered Visual Storytelling · Uganda
          </p>
          <h1 className="mt-6 font-display text-7xl md:text-[84px] font-black leading-[0.9] tracking-tighter text-black">
            Turning information <br />
            into <span className="text-clay">Visual Stories.</span>
          </h1>
          <p className="mt-7 max-w-xl font-body text-base leading-relaxed text-black">
            Transform complex public information into visual stories people can understand, remember, and share.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <button type="button" onClick={onCreateClick} className="rounded-md bg-clay px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-black/90">
              Create a Visual Story
            </button>
            <a href="#stories" className="rounded-md border-2 border-clay/30 px-6 py-3 text-sm font-semibold text-clay hover:bg-black hover:text-white">
              Explore Other Stories
            </a>
          </div>
        </div>

        {/* RIGHT - 60% - FITS, NO OVERFLOW */}
        <div className="relative w-full md:col-span-8">

          {/* container is 100% of col-span-8 */}
          <div className="flex items-center justify-between gap-2 md:gap-3 py-12 w-full">

            {/* Image 1 - 28% */}
            <div className="w-[25%] flex-shrink-0 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform">
              <img
                src={script}
                alt="Text"
                className="w-full h-[300px] md:h-[340px] object-cover rounded-xl border-2 border-[#4A4238]/20"
              />
            </div>

            {/* Arrow 1 - 4% */}
            <div className="w-[4%] flex-shrink-0 flex justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-clay">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </div>

            {/* Image 2 - 28% */}
            <div className="w-[28%] flex-shrink-0 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform">
              <img
                src={bike}
                alt="Visual"
                className="w-full h-[300px] md:h-[340px] object-cover rounded-xl border-2 border-clay"
              />
            </div>

            {/* Arrow 2 - 4% */}
            <div className="w-[4%] flex-shrink-0 flex justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-clay animate-pulse">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </div>

            {/* Image 3 - 28% */}
            <div className="w-[28%] flex-shrink-0 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform">
              <img
                src={helm}
                alt="Story"
                className="w-full h-[300px] md:h-[340px] object-cover rounded-xl border-2 border-green-600"
              />
            </div>

          </div>
        </div>

      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
        <svg className="relative block w-full h-12 md:h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,4.75,55.05,10.3,81.39,15.22,154,28.87,227.18,39,321.39,56.44Z" fill="#12100D"></path>
        </svg>
      </div>

    </section>
  )
}