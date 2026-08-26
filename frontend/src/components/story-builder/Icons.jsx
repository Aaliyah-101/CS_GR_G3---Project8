function Base({ children, size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  )
}

export const IconType = (p) => (
  <Base {...p}>
    <path d="M4 6h16M4 12h10M4 18h6" />
  </Base>
)

export const IconUpload = (p) => (
  <Base {...p}>
    <path d="M12 16V4M7 9l5-5 5 5" />
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </Base>
)

export const IconMic = (p) => (
  <Base {...p}>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
  </Base>
)

export const IconSquare = (p) => (
  <Base {...p}>
    <rect x="5" y="5" width="14" height="14" rx="2" />
  </Base>
)

export const IconPlay = (p) => (
  <Base {...p}>
    <path d="M6 4l14 8-14 8V4z" />
  </Base>
)

export const IconCheck = (p) => (
  <Base {...p}>
    <path d="M4 12l6 6L20 6" />
  </Base>
)

export const IconAlert = (p) => (
  <Base {...p}>
    <path d="M12 3l10 18H2L12 3z" />
    <path d="M12 10v4M12 17.5v.01" />
  </Base>
)

export const IconChevronLeft = (p) => (
  <Base {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Base>
)

export const IconChevronRight = (p) => (
  <Base {...p}>
    <path d="M9 5l7 7-7 7" />
  </Base>
)

export const IconX = (p) => (
  <Base {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Base>
)

export const IconUsers = (p) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M16 8a3 3 0 1 1 3.5 3M22 20c0-2.6-2-4.8-4.7-5.6" />
  </Base>
)

export const IconBook = (p) => (
  <Base {...p}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z" />
    <path d="M4 19.5V6.5" />
  </Base>
)

export const IconLayers = (p) => (
  <Base {...p}>
    <path d="M12 2 2 7l10 5 10-5-10-5z" />
    <path d="M2 12l10 5 10-5M2 17l10 5 10-5" />
  </Base>
)

export const IconShield = (p) => (
  <Base {...p}>
    <path d="M12 3l8 4v5c0 5-3.4 8-8 9-4.6-1-8-4-8-9V7l8-4z" />
  </Base>
)

export const IconRocket = (p) => (
  <Base {...p}>
    <path d="M5 15c-2 1-3 5-3 5s4-1 5-3M12 15l-3-3c1-4 3-7 8-9 2 5-1 7-5 8z" />
    <circle cx="15" cy="9" r="1.6" />
  </Base>
)

export const IconLanguages = (p) => (
  <Base {...p}>
    <path d="M4 5h9M8 3v2c0 4-2 7-6 8M6 10c1.5 2 4 3.5 6 4" />
    <path d="M14 21l4-9 4 9M15.6 17.5h4.8" />
  </Base>
)

export const IconVolume = (p) => (
  <Base {...p}>
    <path d="M4 9v6h4l5 4V5L8 9H4z" />
    <path d="M17 8a5 5 0 0 1 0 8" />
  </Base>
)

export const IconFile = (p) => (
  <Base {...p}>
    <path d="M6 2h9l5 5v15H6V2z" />
    <path d="M15 2v5h5" />
  </Base>
)

export const IconSparkle = (p) => (
  <Base {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </Base>
)

export const IconArrowUpDown = (p) => (
  <Base {...p}>
    <path d="M8 3v14M8 3 4 7M8 3l4 4M16 21V7M16 21l4-4M16 21l-4-4" />
  </Base>
)
