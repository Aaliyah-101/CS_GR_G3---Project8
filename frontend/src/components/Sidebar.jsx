import { useEffect } from 'react'
import { Link } from 'react-router-dom'
const links = [
  { label: 'Home', to: '/' },
  { label: 'Create a Story', to: '/create' },
  { label: 'Share & Discover', to: '/gallery' },
  { label: 'About', to: '/about' },
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
      {/* Backdrop — fades in, click to close. pointer-events-none when closed
          so it never blocks clicks on the page underneath. */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Panel — translate-x handles the slide, always in the DOM so the
          transition can run both ways instead of popping in/out. */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-panelLine bg-[#10011bd8] transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="flex items-center justify-between border-b border-panelLine px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#10011bd8]" />
            <span className="font-display text-sm font-semibold tracking-wide">
              Pearl Visual
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-sienna transition hover:text-parchment"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => {
                onClose()
                if (window.innerWidth < 768) {
                   // Mobile specific close logic if needed, but onClose handles backdrop
                }
              }}
              className="rounded-md px-3 py-2.5 font-body text-sm text-sienna transition hover:bg-ink hover:text-parchment"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-panelLine px-6 py-4 font-mono text-xs text-sienna">
          {userName ? `Welcome back, ${userName}` : 'Sign in'}
        </div>
      </aside>
    </>
  )
}
