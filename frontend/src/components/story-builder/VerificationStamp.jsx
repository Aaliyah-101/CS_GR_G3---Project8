import { IconCheck, IconAlert } from './Icons.jsx'

export default function VerificationStamp({ status, score, size = 'md' }) {
  const pass = status === 'pass'
  const dims = size === 'sm' ? 'h-14 w-14 text-[8px]' : 'h-20 w-20 text-[10px]'
  const tone = pass ? 'border-amber text-amber' : 'border-clay text-clay'

  return (
    <div
      className={`${dims} shrink-0 -rotate-6 select-none rounded-full flex flex-col items-center justify-center font-mono font-semibold uppercase tracking-wide ${tone}`}
      style={{ borderStyle: 'double', borderWidth: '4px' }}
      title={`Visual-semantic verification: ${pass ? 'grounded' : 'flagged'} (${Math.round(score * 100)}%)`}
    >
      {pass ? <IconCheck size={size === 'sm' ? 12 : 16} /> : <IconAlert size={size === 'sm' ? 12 : 16} />}
      <span className="leading-none mt-0.5">{pass ? 'Grounded' : 'Flagged'}</span>
      <span className="leading-none opacity-70">{Math.round(score * 100)}%</span>
    </div>
  )
}
