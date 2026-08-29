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
        className={`fixed inset-0 z-40 bg-[#071A1D]/75 backdrop-blur-md transition-opacity duration-300 ${
          open
            ? 'opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform
        border-r border-[#164E4A]/50
        bg-[#071A1D]/95
        backdrop-blur-xl
        transition-transform duration-300 ease-out
        flex flex-col justify-between
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
          <div className="flex items-center justify-between border-b border-[#164E4A]/50 px-6 h-20">

            <div className="flex items-center gap-3">

              {/* VisUg logo */}
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2DD4BF] to-[#0F766E] shadow-[0_0_18px_rgba(45,212,191,0.2)]">
                <span className="font-black text-[#071A1D] text-sm">
                  PV
                </span>
              </div>

              {/* Brand name */}
              <div className="flex flex-col">

                <span className="text-sm font-bold tracking-tight text-[#F0FDFA] leading-tight">
                  Pearl Visual
                </span>

                <span className="text-[8px] uppercase tracking-[0.15em] text-[#94A3B8] leading-none mt-1">
                  Health Storytelling
                </span>

              </div>

            </div>


            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-md p-1.5 text-[#94A3B8]
              hover:text-[#5EEAD4]
              hover:bg-[#0D2929]
              transition-all"
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

                  if (onNavigate) {
                    onNavigate(l.href)
                  }

                  onClose()
                }}

                className="
                  group
                  flex
                  items-center
                  gap-3.5
                  rounded-lg
                  px-3.5
                  py-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-[#94A3B8]

                  hover:bg-[#0D2929]
                  hover:text-[#5EEAD4]

                  transition-all
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
            border-t
            border-[#164E4A]/50
            px-6
            py-5
            bg-black/10
            flex
            items-center
            gap-3
          "
        >

          {/* Status indicator */}
          <span
            className={`
              h-2
              w-2
              rounded-full

              ${
                userName
                  ? 'bg-[#2DD4BF] animate-pulse'
                  : 'bg-[#64748B]/40'
              }
            `}
          />


          <div className="text-[10px] tracking-wider uppercase text-[#94A3B8]">

            {userName ? (

              <span>
                <span className="text-[#F0FDFA] font-bold">
                  {userName}
                </span>
              </span>

            ) : (

              <button
                type="button"
                className="
                  text-[#94A3B8]
                  hover:text-[#5EEAD4]
                  transition-colors
                  font-bold
                  uppercase
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