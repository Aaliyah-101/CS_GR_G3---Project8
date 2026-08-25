import { useState } from 'react'

const CATEGORIES = ['Public Awareness', 'Health', 'Education', 'Culture']
const TONES = ['Hopeful', 'Urgent', 'Reflective', 'Playful']

let nextId = 1
function makeScene() {
  return { id: nextId++, caption: '', imagePrompt: '' }
}

export default function CreateStory({ onCancel }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [tone, setTone] = useState(TONES[0])
  const [scenes, setScenes] = useState([makeScene()])
  const [submitting, setSubmitting] = useState(false)

  function updateScene(id, field, value) {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  function addScene() {
    setScenes((prev) => [...prev, makeScene()])
  }

  function removeScene(id) {
    setScenes((prev) => prev.filter((s) => s.id !== id))
  }

  function moveScene(id, direction) {
    setScenes((prev) => {
      const index = prev.findIndex((s) => s.id === id)
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const payload = {
      title,
      category,
      tone,
      scenes: scenes.map(({ caption, imagePrompt }) => ({ caption, imagePrompt })),
    }

    try {
      // Replace with your real endpoint once the LVM service is wired up.
      // const res = await fetch('/api/stories', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // })
      console.log('Story payload ready to send:', payload)
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit =
    title.trim().length > 0 &&
    scenes.length > 0 &&
    scenes.every((s) => s.caption.trim().length > 0)

  return (
    <section className=" bark-texture mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">
          New Story
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Build your story, scene by scene
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-sienna">
          Add as many scenes as you need. Each one becomes a panel the model
          turns into a visual — reorder them until the flow feels right.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        {/* ---- Left: the actual builder ---- */}
        <div className="space-y-8">
          {/* Story details */}
          <div className="rounded-lg border border-panelLine bg-panel p-6">
            <label className="block font-body text-sm font-medium text-parchment">
              Story title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The journey home"
              className="mt-2 w-full rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment placeholder:text-sienna/60 focus:border-amber focus:outline-none"
            />

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-parchment">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment focus:border-amber focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-parchment">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="mt-2 w-full rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment focus:border-amber focus:outline-none"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Scenes */}
          <div className="space-y-4">
            {scenes.map((scene, i) => (
              <div
                key={scene.id}
                className="rounded-lg border border-panelLine bg-panel p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wide text-amber">
                    Scene {i + 1}
                  </span>
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
                      disabled={i === scenes.length - 1}
                      aria-label="Move scene down"
                      className="rounded p-1 text-sienna transition hover:text-parchment disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeScene(scene.id)}
                      disabled={scenes.length === 1}
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

                <input
                  value={scene.imagePrompt}
                  onChange={(e) => updateScene(scene.id, 'imagePrompt', e.target.value)}
                  placeholder="Visual description for the model (optional)"
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

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="rounded-md bg-amber px-6 py-3 font-body text-sm font-semibold text-ink transition hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? 'Generating…' : 'Generate Story'}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="font-body text-sm text-sienna hover:text-parchment"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* ---- Right: live preview ---- */}
        <aside className="h-fit rounded-lg border border-panelLine bg-panel p-6 lg:sticky lg:top-24">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">
            Preview
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold">
            {title || 'Untitled story'}
          </h2>
          <p className="mt-1 font-mono text-[11px] text-sienna">
            {category} · {tone}
          </p>

          <ol className="mt-5 space-y-4">
            {scenes.map((scene, i) => (
              <li key={scene.id} className="border-l-2 border-panelLine pl-4">
                <p className="font-mono text-[11px] text-amber">Scene {i + 1}</p>
                <p className="mt-1 font-body text-sm text-parchment">
                  {scene.caption || 'Not written yet.'}
                </p>
              </li>
            ))}
          </ol>
        </aside>
      </form>
    </section>
  )
}
