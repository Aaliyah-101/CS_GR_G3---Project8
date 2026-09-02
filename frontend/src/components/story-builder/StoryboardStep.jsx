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
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">Stage 5 · Storyboard / Scene Graph</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Build it scene by scene</h2>
        <p className="mt-1 max-w-xl text-sm text-slate-600">
          Each scene becomes a panel. Add a visual description to help the model, and name any characters
          in it to keep them visually consistent across panels.
        </p>
      </div>

      <div className="space-y-4">
        {data.scenes.map((scene, i) => (
          <div key={scene.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">Scene {i + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveScene(scene.id, -1)}
                  disabled={i === 0}
                  aria-label="Move scene up"
                  className="rounded p-1 text-slate-600 transition hover:text-slate-900 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveScene(scene.id, 1)}
                  disabled={i === data.scenes.length - 1}
                  aria-label="Move scene down"
                  className="rounded p-1 text-slate-600 transition hover:text-slate-900 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeScene(scene.id)}
                  disabled={data.scenes.length === 1}
                  aria-label="Remove scene"
                  className="rounded p-1 text-slate-600 transition hover:text-[#D62828] disabled:opacity-30"
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
              className="mt-3 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2B7A4B] focus:outline-none"
            />

            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                value={scene.imagePrompt}
                onChange={(e) => updateScene(scene.id, 'imagePrompt', e.target.value)}
                placeholder="Visual description for the model (optional)"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 placeholder:text-slate-400 focus:border-[#2B7A4B] focus:outline-none"
              />
              <select
                value={scene.artKey}
                onChange={(e) => updateScene(scene.id, 'artKey', e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-2 font-mono text-[11px] text-slate-600 focus:border-[#2B7A4B] focus:outline-none"
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
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 placeholder:text-slate-400 focus:border-[#2B7A4B] focus:outline-none"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addScene}
          className="w-full rounded-lg border border-dashed border-slate-200 py-3 text-sm text-slate-600 transition hover:border-[#2B7A4B]/50 hover:text-[#2B7A4B]"
        >
          + Add scene
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <button
          type="button"
          disabled={!canVerify}
          onClick={onVerify}
          className="rounded-md bg-[#2B7A4B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2B7A4B]/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate panels →
        </button>
      </div>
    </div>
  )
}
