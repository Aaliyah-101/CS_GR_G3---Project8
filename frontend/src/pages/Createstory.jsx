import { useState } from 'react'
import StepRail, { STEPS } from '../components/story-builder/StepRail.jsx'
import SourceStep from '../components/story-builder/SourceStep.jsx'
import ExtractionStep from '../components/story-builder/ExtractionStep.jsx'
import AudienceStep from '../components/story-builder/AudienceStep.jsx'
import NarrativeStep from '../components/story-builder/NarrativeStep.jsx'
import StoryboardStep from '../components/story-builder/StoryboardStep.jsx'
import PanelGenStep from '../components/story-builder/PanelGenStep.jsx'
import VerifyStep from '../components/story-builder/VerifyStep.jsx'
import PublishStep from '../components/story-builder/PublishStep.jsx'
import { extractFacts, suggestAudiences, suggestNarrative } from '../components/story-builder/storyEngine.js'

const initialData = {
  title: '',
  category: 'Public Awareness',
  tone: 'Hopeful',
  sourceText: '',
  fileName: '',
  facts: [],
  audienceOptions: [],
  audienceId: null,
  language: 'English',
  protagonist: '',
  arc: '',
  coveredFactIds: [],
  scenes: [{ id: 'scene-initial', caption: '', imagePrompt: '', characters: '', artKey: 'village' }],
  audioNarration: false,
}

export default function CreateStory({ onCancel }) {
  const [data, setData] = useState(initialData)
  const [activeStep, setActiveStep] = useState('source')
  const [verifiedSteps, setVerifiedSteps] = useState([])

  function update(patch) {
    setData((prev) => ({ ...prev, ...patch }))
  }

  function markVerifiedAndAdvance(stepId, nextStepId, extraPatch) {
    if (extraPatch) update(extraPatch)
    setVerifiedSteps((prev) => (prev.includes(stepId) ? prev : [...prev, stepId]))
    setActiveStep(nextStepId)
  }

  const stepProps = {
    source: {
      data,
      update,
      onVerify: () => {
        const facts = extractFacts(data.sourceText)
        const audienceOptions = suggestAudiences(data.category)
        markVerifiedAndAdvance('source', 'extraction', {
          facts,
          audienceOptions,
          audienceId: data.audienceId || audienceOptions[0]?.id || null,
        })
      },
    },
    extraction: {
      data,
      update,
      onVerify: () => markVerifiedAndAdvance('extraction', 'audience'),
    },
    audience: {
      data,
      update,
      onVerify: () => {
        const audience = data.audienceOptions.find((a) => a.id === data.audienceId)
        const suggestion = suggestNarrative({ title: data.title, category: data.category, tone: data.tone, audience })
        markVerifiedAndAdvance('audience', 'narrative', {
          protagonist: data.protagonist || suggestion.protagonist,
          arc: data.arc || suggestion.arc,
        })
      },
    },
    narrative: {
      data,
      update,
      onVerify: () => markVerifiedAndAdvance('narrative', 'storyboard'),
    },
    storyboard: {
      data,
      update,
      onVerify: () => markVerifiedAndAdvance('storyboard', 'panels'),
    },
    panels: {
      data,
      update,
      onVerify: () => markVerifiedAndAdvance('panels', 'verify'),
    },
    verify: {
      data,
      update,
      goToStep: setActiveStep,
      onVerify: () => markVerifiedAndAdvance('verify', 'publish'),
    },
    publish: {
      data,
      update,
    },
  }

  const StepComponent = {
    source: SourceStep,
    extraction: ExtractionStep,
    audience: AudienceStep,
    narrative: NarrativeStep,
    storyboard: StoryboardStep,
    panels: PanelGenStep,
    verify: VerifyStep,
    publish: PublishStep,
  }[activeStep]

  const audience = data.audienceOptions.find((a) => a.id === data.audienceId)

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 bg-white">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-[#2B7A4B]">New Story</p>
          <h1 className="mt-3 section-heading text-slate-900">Build your <span className="gradient-text">story</span> verified <span className="gradient-text">step by step</span></h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Source → extraction → audience → narrative → storyboard → panels → verification → publish.
            Each stage needs a quick confirmation before the next one unlocks.
          </p>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="shrink-0 text-sm text-slate-600 transition hover:text-[#2B7A4B]">
            Cancel
          </button>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-[180px_1.4fr_1fr]">
        <StepRail activeStep={activeStep} verifiedSteps={verifiedSteps} onSelect={setActiveStep} />

        <div className="min-w-0">
          <StepComponent {...stepProps[activeStep]} />
        </div>

        {/* ---- Live overview, persistent across steps ---- */}
        <aside className="h-fit rounded-lg border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-24 shadow-soft">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">Overview</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{data.title || 'Untitled story'}</h2>
          <p className="mt-1 font-mono text-[11px] text-slate-600">{data.category} · {data.tone}</p>

          {audience && (
            <p className="mt-3 text-xs text-slate-600">
              For <span className="font-semibold text-slate-900">{audience.label}</span> · narrated in{' '}
              <span className="font-semibold text-slate-900">{data.language}</span>
            </p>
          )}

          {data.facts.length > 0 && (
            <p className="mt-3 font-mono text-[11px] text-slate-600">
              {data.facts.filter((f) => f.included).length} of {data.facts.length} facts grounded
            </p>
          )}

          {data.arc && (
            <p className="mt-3 text-xs italic leading-relaxed text-slate-600 line-clamp-4">
              {data.arc}
            </p>
          )}

          <ol className="mt-5 space-y-4 border-t border-slate-200 pt-4">
            {data.scenes.map((scene, i) => (
              <li key={scene.id} className="border-l-2 border-[#2B7A4B] pl-4">
                <p className="font-mono text-[11px] text-[#F5C400]">Scene {i + 1}</p>
                <p className="mt-1 text-sm text-slate-900">{scene.caption || 'Not written yet.'}</p>
              </li>
            ))}
          </ol>

          <div className="mt-5 flex flex-wrap gap-1 border-t border-slate-200 pt-4">
            {STEPS.map((s) => (
              <span
                key={s.id}
                className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide ${
                  verifiedSteps.includes(s.id) ? 'bg-[#2B7A4B]/15 text-[#2B7A4B]' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
