import React from 'react'

export default function Navbar({ onCreateClick, onMenuClick, onGalleryClick, onAboutClick }) {
  return (
    <nav className="border-b border-panelLine/40 bg-ink/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        
        {/* Left Side: Brand Identity */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex flex-col gap-1.5 p-2 rounded-lg border border-panelLine/20 hover:border-amber/40 hover:bg-panelLine/10 transition-all group"
            aria-label="Open sidebar"
          >
            <span className="h-0.5 w-5 bg-sienna group-hover:bg-amber transition-colors" />
            <span className="h-0.5 w-5 bg-sienna group-hover:bg-amber transition-colors" />
            <span className="h-0.5 w-4 bg-sienna group-hover:bg-amber transition-colors self-start" />
          </button>

          {/* Brand Identity */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-parchment leading-tight group-hover:text-amber transition-colors">
                Pearl Visual (Ugandan Source Information)
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-sienna leading-none mt-0.5">
                LVM Visual Creator
              </span>
            </div>
          </a>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {/* How It Works -> Links to your existing About route */}
          <a 
            href="/about" 
            onClick={(e) => {
              e.preventDefault()
              if (onAboutClick) onAboutClick()
            }}
            className="font-body text-xs font-semibold uppercase tracking-widest text-sienna hover:text-amber transition-colors"
          >
           How It Works
          </a>

          {/* Browse Stories -> Links to your Gallery route */}
          <a 
            href="/gallery" 
            onClick={(e) => {
              e.preventDefault()
              if (onGalleryClick) onGalleryClick()
            }}
            className="font-body text-xs font-semibold uppercase tracking-widest text-sienna hover:text-amber transition-colors"
          >
            Browse Stories
          </a>

          {/* Features -> Links to your existing About route */}
          <a 
            href="/about" 
            onClick={(e) => {
              e.preventDefault()
              if (onAboutClick) onAboutClick()
            }}
            className="font-body text-xs font-semibold uppercase tracking-widest text-sienna hover:text-amber transition-colors"
          >
           Features
          </a>
        </div>

        {/* Right Side: Action Trigger */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCreateClick}
            className="rounded-lg bg-amber px-4 py-2 font-body text-xs font-bold uppercase tracking-wider text-ink shadow-md hover:bg-amber/90 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Get Started
          </button>
        </div>

      </div>
    </nav>
  )
}




