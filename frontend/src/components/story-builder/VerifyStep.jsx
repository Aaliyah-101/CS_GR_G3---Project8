import { useMemo } from 'react'
import PanelArt from './PanelArt.jsx'
import VerificationStamp from './VerificationStamp.jsx'
import { verifyPanel, colorForCharacter } from './storyEngine.js'
import { IconShield } from './Icons.jsx'

function parseCharacters(str) {
  return str.split(',').map((s) => s.trim()).filter(Boolean)
}

export default function VerifyStep({ data, onVerify, goToStep }) {
  const includedFacts = data.facts.filter((f) => f.included)
  const allCharacterNames = Array.from(new Set(data.scenes.flatMap((s) => parseCharacters(s.characters))))

  const results = useMemo(
    () => data.scenes.map((scene) => ({ scene, result: verifyPanel(scene, includedFacts) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.scenes, data.facts]
  )

  const flaggedCount = results.filter((r) => r.result.status === 'flag').length

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">Stage 7 · Visual-Semantic Verification</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">Does each panel still say what the source said?</h2>
      <p className="mt-1 max-w-xl text-sm text-slate-600">
        Every panel is checked against the facts you confirmed earlier — this is the safety net before
        anything publishes.
      </p>

      <div className="mt-5 space-y-3">
        {results.map(({ scene, result }, i) => {
          const names = parseCharacters(scene.characters)
          const colors = names.map((n) => colorForCharacter(n, allCharacterNames))
          return (
            <div key={scene.id} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-slate-200">
                <PanelArt artKey={scene.artKey} colors={colors} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">Panel {i + 1} · {scene.caption || 'Untitled scene'}</p>
                <p className="mt-0.5 text-xs text-slate-600">{result.note}</p>
                {result.status === 'flag' && (
                  <button
                    type="button"
                    onClick={() => goToStep('storyboard')}
                    className="mt-1.5 font-mono text-[11px] text-[#D62828] underline decoration-dotted underline-offset-2 hover:text-[#D62828]/80"
                  >
                    Edit this scene →
                  </button>
                )}
              </div>
              <VerificationStamp status={result.status} score={result.score} size="sm" />
            </div>
          )
        })}
      </div>

      <div
        className={`mt-5 flex items-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-xs ${
          flaggedCount > 0 ? 'border-[#D62828]/40 bg-[#D62828]/10 text-[#D62828]' : 'border-[#2B7A4B]/40 bg-[#2B7A4B]/10 text-[#2B7A4B]'
        }`}
      >
        <IconShield size={14} />
        {flaggedCount > 0
          ? `${flaggedCount} of ${results.length} panels flagged — fix them or continue anyway.`
          : `All ${results.length} panels are grounded in your confirmed facts.`}
      </div>

      <div className="mt-7 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={onVerify}
          className="rounded-md bg-[#2B7A4B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2B7A4B]/90"
        >
          Continue to publish →
        </button>
      </div>
    </div>
  )
}
