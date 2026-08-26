import PanelArt from './PanelArt.jsx'
import { colorForCharacter } from './storyEngine.js'

function parseCharacters(str) {
  return str.split(',').map((s) => s.trim()).filter(Boolean)
}

export default function PanelGenStep({ data, onVerify }) {
  const allCharacterNames = Array.from(
    new Set(data.scenes.flatMap((s) => parseCharacters(s.characters)))
  )

  return (
    <div className="rounded-lg border border-panelLine bg-panel p-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Stage 6 · Character/Object Generation</p>
      <h2 className="mt-2 font-display text-xl font-semibold">Generated panels</h2>
      <p className="mt-1 max-w-xl font-body text-sm text-sienna">
        Each named character keeps the same colour tag across every panel — the visual anchor a real
        diffusion pipeline would enforce with image embeddings instead of a flat colour.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {data.scenes.map((scene, i) => {
          const names = parseCharacters(scene.characters)
          const colors = names.map((n) => colorForCharacter(n, allCharacterNames))
          return (
            <div key={scene.id} className="overflow-hidden rounded-lg border border-panelLine bg-ink">
              <div className="aspect-[4/3]">
                <PanelArt artKey={scene.artKey} colors={colors} />
              </div>
              <div className="p-3">
                <span className="font-mono text-[10px] text-sienna/70">Panel {i + 1}</span>
                <p className="font-body text-xs font-medium text-parchment">{scene.caption}</p>
              </div>
            </div>
          )
        })}
      </div>

      {allCharacterNames.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {allCharacterNames.map((name) => (
            <span
              key={name}
              className="flex items-center gap-1.5 rounded-full border border-panelLine px-2.5 py-1 font-mono text-[11px] text-sienna"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: colorForCharacter(name, allCharacterNames) }}
              />
              {name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-7 border-t border-panelLine pt-6">
        <button
          type="button"
          onClick={onVerify}
          className="rounded-md bg-amber px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-amber/90"
        >
          Run verification →
        </button>
      </div>
    </div>
  )
}
