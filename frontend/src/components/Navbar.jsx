export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-panelLine bg-[#10011bd8]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-md p-1.5 text-parchment transition hover:text-amber"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber" />
          <span className="font-display text-sm font-semibold tracking-wide">
            Pearl Visual
          </span>
        </div>

        {/* spacer so the logo stays visually centered against the hamburger */}
        <div className="w-[22px]" />
      </div>
    </header>
  )
}
