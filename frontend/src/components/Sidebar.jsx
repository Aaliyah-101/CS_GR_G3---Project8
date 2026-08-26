import { useEffect } from 'react'

// Corrected keys from 'to' to 'href' to match the rendering code below
const links = [
  { label: 'Home', href: '/' },
  { label: 'Create a Story', href: '/create' },
  { label: 'Share & Discover', href: '/gallery' },
  { label: 'About', href: '/about' },
]

export default function Sidebar({ open, onClose, userName, onNavigate }) {
  // close on Escape, and stop the page from scrolling behind the sidebar
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      {/* Backdrop — Enhanced blur depth to create separation */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink/75 backdrop-blur-md transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Panel — Matches background system color matching your platform */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-panelLine/40 bg-ink/95 backdrop-blur-xl transition-transform duration-300 ease-out flex flex-col justify-between ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        {/* Top Header Section */}
        <div>
          <div className="flex items-center justify-between border-b border-panelLine/40 px-6 h-20">
            <div className="flex items-center gap-3">
              {/* Brand identity anchor dot mimicking navbar node */}
              <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-amber to-clay">
                <span className="font-display font-black text-ink text-xs leading-none">U</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xs font-bold tracking-tight text-parchment leading-tight">
                  Uganda Stories
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-sienna leading-none mt-0.5">
                  Navigation
                </span>
              </div>
            </div>
            
            {/* Close Trigger Button */}
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-md p-1.5 text-sienna hover:text-amber hover:bg-panelLine/10 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Navigation Links Area — Fixed properties and routing logic */}
          <nav className="flex flex-col gap-1.5 px-4 py-6">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault() // Prevents slow, full-page browser reloads
                  if (onNavigate) {
                    onNavigate(l.href) // Routes instantly using React Router
                  }
                  onClose() // Closes the sidebar panel drawer automatically
                }}
                className="group flex items-center gap-3.5 rounded-lg px-3.5 py-3 font-body text-xs font-semibold uppercase tracking-wider text-sienna hover:bg-panelLine/10 hover:text-amber transition-all"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Footer Authentication Section */}
        <div className="border-t border-panelLine/40 px-6 py-5 bg-black/10 flex items-center gap-3">
          {/* Active status pulse light */}
          <span className={`h-2 w-2 rounded-full ${userName ? 'bg-amber animate-pulse' : 'bg-sienna/40'}`} />
          
          <div className="font-mono text-[10px] tracking-wider uppercase text-sienna">
            {userName ? (
              <span>
                Active: <span className="text-parchment font-bold">{userName}</span>
              </span>
            ) : (
              <button 
                type="button" 
                className="text-sienna hover:text-amber transition-colors font-bold uppercase"
              >
                Sign In to Platform →
              </button>
            )}
          </div>
        </div>

      </aside>
    </>
  )
}
