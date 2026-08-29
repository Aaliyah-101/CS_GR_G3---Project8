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
    <div className="rounded-lg border border-panelLine bg-panel p-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Stage 7 · Visual-Semantic Verification</p>
      <h2 className="mt-2 font-display text-xl font-semibold">Does each panel still say what the source said?</h2>
      <p className="mt-1 max-w-xl font-body text-sm text-sienna">
        Every panel is checked against the facts you confirmed earlier — this is the safety net before
        anything publishes.
      </p>

      <div className="mt-5 space-y-3">
        {results.map(({ scene, result }, i) => {
          const names = parseCharacters(scene.characters)
          const colors = names.map((n) => colorForCharacter(n, allCharacterNames))
          return (
            <div key={scene.id} className="flex items-center gap-4 rounded-lg border border-panelLine bg-ink p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-panelLine">
                <PanelArt artKey={scene.artKey} colors={colors} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm font-medium text-parchment">Panel {i + 1} · {scene.caption || 'Untitled scene'}</p>
                <p className="mt-0.5 font-body text-xs text-sienna">{result.note}</p>
                {result.status === 'flag' && (
                  <button
                    type="button"
                    onClick={() => goToStep('storyboard')}
                    className="mt-1.5 font-mono text-[11px] text-clay underline decoration-dotted underline-offset-2 hover:text-clay/80"
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
          flaggedCount > 0 ? 'border-clay/40 bg-clay/10 text-clay' : 'border-amber/40 bg-amber/10 text-amber'
        }`}
      >
        <IconShield size={14} />
        {flaggedCount > 0
          ? `${flaggedCount} of ${results.length} panels flagged — fix them or continue anyway.`
          : `All ${results.length} panels are grounded in your confirmed facts.`}
      </div>

      <div className="mt-7 border-t border-panelLine pt-6">
        <button
          type="button"
          onClick={onVerify}
          className="rounded-md bg-amber px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-amber/90"
        >
          Continue to publish →
        </button>
      </div>
    </div>
  )
}
