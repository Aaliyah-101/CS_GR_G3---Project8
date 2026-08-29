import { suggestArtKey } from './storyEngine.js'

export default function StoryboardStep({ data, update, onVerify }) {
  function updateScene(id, field, value) {
    update({
      scenes: data.scenes.map((s) => {
        if (s.id !== id) return s
        const next = { ...s, [field]: value }
        if (field === 'imagePrompt' || field === 'caption') {
          next.artKey = suggestArtKey(`${next.caption} ${next.imagePrompt}`)
        }
        return next
      }),
    })
  }

  function addScene() {
    update({
      scenes: [...data.scenes, { id: `scene-${Date.now()}`, caption: '', imagePrompt: '', characters: '', artKey: 'village' }],
    })
  }

  function removeScene(id) {
    update({ scenes: data.scenes.filter((s) => s.id !== id) })
  }

  function moveScene(id, direction) {
    const scenes = [...data.scenes]
    const index = scenes.findIndex((s) => s.id === id)
    const target = index + direction
    if (target < 0 || target >= scenes.length) return
    ;[scenes[index], scenes[target]] = [scenes[target], scenes[index]]
    update({ scenes })
  }

  const canVerify = data.scenes.length > 0 && data.scenes.every((s) => s.caption.trim().length > 0)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-panelLine bg-panel p-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Stage 5 · Storyboard / Scene Graph</p>
        <h2 className="mt-2 font-display text-xl font-semibold">Build it scene by scene</h2>
        <p className="mt-1 max-w-xl font-body text-sm text-sienna">
          Each scene becomes a panel. Add a visual description to help the model, and name any characters
          in it to keep them visually consistent across panels.
        </p>
      </div>

      <div className="space-y-4">
        {data.scenes.map((scene, i) => (
          <div key={scene.id} className="rounded-lg border border-panelLine bg-panel p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wide text-amber">Scene {i + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveScene(scene.id, -1)}
                  disabled={i === 0}
                  aria-label="Move scene up"
                  className="rounded p-1 text-sienna transition hover:text-parchment disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveScene(scene.id, 1)}
                  disabled={i === data.scenes.length - 1}
                  aria-label="Move scene down"
                  className="rounded p-1 text-sienna transition hover:text-parchment disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeScene(scene.id)}
                  disabled={data.scenes.length === 1}
                  aria-label="Remove scene"
                  className="rounded p-1 text-sienna transition hover:text-clay disabled:opacity-30"
                >
                  ✕
                </button>
              </div>
            </div>

            <textarea
              value={scene.caption}
              onChange={(e) => updateScene(scene.id, 'caption', e.target.value)}
              placeholder="What happens in this scene?"
              rows={2}
              className="mt-3 w-full resize-none rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment placeholder:text-sienna/60 focus:border-amber focus:outline-none"
            />

            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                value={scene.imagePrompt}
                onChange={(e) => updateScene(scene.id, 'imagePrompt', e.target.value)}
                placeholder="Visual description for the model (optional)"
                className="w-full rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-xs text-sienna placeholder:text-sienna/50 focus:border-amber focus:outline-none"
              />
              <select
                value={scene.artKey}
                onChange={(e) => updateScene(scene.id, 'artKey', e.target.value)}
                className="rounded-md border border-panelLine bg-ink px-2 py-2 font-mono text-[11px] text-sienna focus:border-amber focus:outline-none"
                title="Auto-suggested setting — override if it guessed wrong"
              >
                {['home', 'village', 'clinic', 'road', 'market', 'heritage'].map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <input
              value={scene.characters}
              onChange={(e) => updateScene(scene.id, 'characters', e.target.value)}
              placeholder="Characters in this scene, comma-separated (e.g. Nakato, Musa)"
              className="mt-2 w-full rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-xs text-sienna placeholder:text-sienna/50 focus:border-amber focus:outline-none"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addScene}
          className="w-full rounded-lg border border-dashed border-panelLine py-3 font-body text-sm text-sienna transition hover:border-amber/50 hover:text-amber"
        >
          + Add scene
        </button>
      </div>

      <div className="rounded-lg border border-panelLine bg-panel p-6">
        <button
          type="button"
          disabled={!canVerify}
          onClick={onVerify}
          className="rounded-md bg-amber px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate panels →
        </button>
      </div>
    </div>
  )
}
