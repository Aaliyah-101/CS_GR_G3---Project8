import { useEffect } from 'react'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Create a Story', href: '/create' },
  { label: 'Share & Discover', href: '/gallery' },
  { label: 'About', href: '/about' },
]

export default function Sidebar({ open, onClose, userName, onNavigate }) {

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
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? 'opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 transform
        flex-col justify-between
        border-r border-slate-200
        bg-white/95
        backdrop-blur-xl
        transition-transform duration-300 ease-out
        ${
          open
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >

        {/* Top Section */}
        <div>

          {/* Header */}
          <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">

            <div className="flex items-center gap-3">

              {/* Pearl Visual logo */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#F5C400] via-[#FCDC4D] to-[#2B7A4B] font-black text-slate-950 shadow-glow">
                PV
              </div>

              {/* Brand name */}
              <div className="flex flex-col">

                <span className="text-sm font-extrabold tracking-tight text-slate-900">
                  Pearl Visual
                </span>

                <span className="mt-1 text-[8px] uppercase tracking-[0.18em] text-slate-500">
                  Health Storytelling
                </span>

              </div>

            </div>


            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-md p-1.5 text-slate-500
              transition
              hover:bg-slate-100
              hover:text-[#2B7A4B]"
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


          {/* Navigation */}
          <nav className="flex flex-col gap-1.5 px-4 py-6">

            {links.map((l) => (

              <a
                key={l.label}
                href={l.href}

                onClick={(e) => {
                  e.preventDefault()

                  if (onNavigate)
                  onNavigate(l.href)
                  onClose()
                }}

                className="
                  group
                  flex
                  items-center
                  gap-3.5
                  rounded-xl
                  px-3.5
                  py-3
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.22em]
                  text-slate-600
                  transition
                  hover:bg-[#FFF8D6]
                  hover:text-[#2B7A4B]
                "
              >

                {l.label}

              </a>

            ))}

          </nav>

        </div>


        {/* Footer */}
        <div
          className="
            flex
            items-center
            gap-3
            border-t
            border-slate-200
            bg-slate-50
            px-6
            py-5
          "
        >

          {/* Status indicator */}
          <span
          className={`
              h-2.5 w-2.5
              rounded-full

              ${
                userName
                ? 'animate-pulse bg-[#2B7A4B]'
                : 'bg-slate-400'
              }
            `}
          />


          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-600">

            {userName ? (

              <span>
                <span className="font-extrabold text-slate-900">
                  
                </span>
              </span>

            ) : (

              <button
                type="button"
                className="
                  font-extrabold
                  text-slate-600
                  transition
                  hover:text-[#2B7A4B]
                "
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