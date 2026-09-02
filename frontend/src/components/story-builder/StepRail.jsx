import { IconCheck } from './Icons.jsx'

export const STEPS = [
  { id: 'source', label: 'Source' },
  { id: 'extraction', label: 'Extraction' },
  { id: 'audience', label: 'Audience' },
  { id: 'narrative', label: 'Narrative' },
  { id: 'storyboard', label: 'Storyboard' },
  { id: 'panels', label: 'Panel Gen' },
  { id: 'verify', label: 'Verify' },
  { id: 'publish', label: 'Publish' },
]

export default function StepRail({ activeStep, verifiedSteps, onSelect }) {
  const activeIndex = STEPS.findIndex((s) => s.id === activeStep)

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0">
      {STEPS.map((step, i) => {
        const isActive = step.id === activeStep
        const isVerified = verifiedSteps.includes(step.id)
        const isReachable = isVerified || i === activeIndex || i === verifiedSteps.length
        return (
          <button
            key={step.id}
            type="button"
            disabled={!isReachable}
            onClick={() => onSelect(step.id)}
            className={`group flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left transition lg:shrink ${
              isActive ? 'bg-slate-100' : isReachable ? 'hover:bg-slate-100/60' : 'opacity-35'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] ${
                isVerified
                  ? 'border-[#2B7A4B] bg-[#2B7A4B]/10 text-[#2B7A4B]'
                  : isActive
                  ? 'border-[#2B7A4B] text-[#2B7A4B]'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              {isVerified ? <IconCheck size={12} /> : i + 1}
            </span>
            <span className={`whitespace-nowrap text-sm ${isActive ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
              {step.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
