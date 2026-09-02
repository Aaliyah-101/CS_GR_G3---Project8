import React from 'react'

export default function Navbar({
  onCreateClick,
  onMenuClick,
  onGalleryClick,
  onAboutClick
}) {
  return (
    <nav
      className="
        sticky top-0 z-50
        border-b border-slate-200/80
        bg-white/80 backdrop-blur-xl
      "
    >

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* LEFT SIDE: Brand + Menu */}
        <div className="flex items-center gap-4">

          {/* Hamburger Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="
              group
              flex flex-col gap-1.5
              rounded-xl
              border border-slate-200
              bg-white p-2
              transition
              hover:border-[#F5C400]
              hover:bg-[#FFF8D6]
            "
            aria-label="Open sidebar"
          >

            <span
              className="
                h-0.5 w-5
                bg-slate-600
                transition
                group-hover:bg-[#2B7A4B]
              "
            />


            <span
               className="
               h-0.5 w-5
               bg-slate-600
               transition
               group-hover:bg-[#2B7A4B]
             "
           />


            <span
              className="
                h-0.5 w-4
                self-start
                bg-slate-600
                transition
                group-hover:bg-[#2B7A4B]
              "
            />

          </button>


          {/* BRAND */}
          <a
            href="#"
            className="group flex items-center gap-3">
            <div
            className="
              flex h-10 w-10 items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-[#F5C400]
              via-[#FCDC4D]
              to-[#2B7A4B]
              font-black
              text-slate-950
              shadow-soft
            "
          >
              PV
            </div>
            <div className="flex flex-col">

              <span
                className="
                  text-sm
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  transition
                  group-hover:text-[#2B7A4B]
                "
              >
                Pearl Visual
              </span>

              <span
                className="
                  mt-1
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  text-slate-500
                "
              >
                LVM Visual Creator
              </span>
            </div>

          </a>

        </div>


        {/* CENTER NAVIGATION */}
        <div className="hidden items-center gap-8 md:flex">

          {/* HOW IT WORKS */}
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();

              if (onAboutClick)
              onAboutClick()
            }}
            className="
              text-[11px]
              font-extrabold
              uppercase
              tracking-[0.22em]
              text-slate-600
              transition
              hover:text-[#2B7A4B]
            "
          >
            How It Works
          </a>


          {/* BROWSE STORIES */}
          <a
            href="/gallery"
            onClick={(e) => {
              e.preventDefault();

              if (onGalleryClick)
              onGalleryClick()
            }}
            className="
              text-[11px]
              font-extrabold
              uppercase
              tracking-[0.22em]
              text-slate-600
              transition
              hover:text-[#2B7A4B]
            "
          >
            Browse Stories
          </a>


          {/* FEATURES */}
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();

              if (onAboutClick)
                onAboutClick()
            }}
            className="
              text-[11px]
              font-extrabold
              uppercase
              tracking-[0.22em]
              text-slate-600
              transition
              hover:text-[#2B7A4B]
            "
          >
            Features
          </a>

        </div>


        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={onCreateClick}
            className="
              rounded-xl
              bg-gradient-to-r
              from-[#F5C400]
              to-[#2B7A4B]
              px-4 py-2.5
              text-[11px]
              font-extrabold
              uppercase
              tracking-[0.18em]
              text-slate-950
              shadow-glow
              transition
              hover:-translate-y-0.5
              hover:shadow-soft
            "
          >
            Get Started
          </button>

        </div>

      </div>

    </nav>
  )
}
