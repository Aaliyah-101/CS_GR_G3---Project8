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
              isActive ? 'bg-panel' : isReachable ? 'hover:bg-panel/60' : 'opacity-35'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] ${
                isVerified
                  ? 'border-amber bg-amber/10 text-amber'
                  : isActive
                  ? 'border-amber text-amber'
                  : 'border-panelLine text-sienna'
              }`}
            >
              {isVerified ? <IconCheck size={12} /> : i + 1}
            </span>
            <span className={`whitespace-nowrap font-body text-sm ${isActive ? 'font-semibold text-parchment' : 'text-sienna'}`}>
              {step.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
