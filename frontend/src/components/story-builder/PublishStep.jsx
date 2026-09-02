import { useState } from 'react'
import { IconLanguages, IconVolume, IconRocket, IconCheck } from './Icons.jsx'

const LANGUAGES = ['English', 'Luganda', 'Runyankole', 'Swahili']

export default function PublishStep({ data, update, onSubmit }) {
  const [submitting, setSubmitting] = useState(false)
  const [published, setPublished] = useState(false)

  async function handleSubmit() {
    setSubmitting(true)
    const payload = {
      title: data.title,
      category: data.category,
      tone: data.tone,
      audience: data.audienceOptions.find((a) => a.id === data.audienceId),
      language: data.language,
      audioNarration: data.audioNarration,
      facts: data.facts.filter((f) => f.included).map(({ text, weight }) => ({ text, weight })),
      narrative: { protagonist: data.protagonist, arc: data.arc },
      scenes: data.scenes.map(({ caption, imagePrompt, artKey, characters }) => ({
        caption,
        imagePrompt,
        artKey,
        characters: characters.split(',').map((s) => s.trim()).filter(Boolean),
      })),
    }

    try {
      // Replace with your real endpoint once the LVM service is wired up.
      // const res = await fetch('/api/stories', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // })
      console.log('Story payload ready to send:', payload)
      await new Promise((r) => setTimeout(r, 500))
      setPublished(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (published) {
    return (
      <div className="rounded-lg border border-[#2B7A4B]/40 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#2B7A4B] text-[#2B7A4B]">
          <IconCheck size={22} />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-slate-900">Story published</h2>
        <p className="mt-1 text-sm text-slate-600">
          "{data.title}" is ready. Check the browser console for the payload shape being sent to your API.
        </p>
      </div>
    )
  }

  const audience = data.audienceOptions.find((a) => a.id === data.audienceId)
  const included = data.facts.filter((f) => f.included).length

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">Stage 8 · Language Layer + Publish</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">Final review</h2>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 rounded-md border border-slate-200 bg-slate-50 p-4 font-mono text-xs">
        <dt className="text-slate-600">Title</dt><dd className="text-slate-900">{data.title || 'Untitled'}</dd>
        <dt className="text-slate-600">Category · Tone</dt><dd className="text-slate-900">{data.category} · {data.tone}</dd>
        <dt className="text-slate-600">Audience</dt><dd className="text-slate-900">{audience?.label}</dd>
        <dt className="text-slate-600">Facts grounded</dt><dd className="text-slate-900">{included}</dd>
        <dt className="text-slate-600">Scenes</dt><dd className="text-slate-900">{data.scenes.length}</dd>
      </dl>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <IconLanguages size={14} className="text-[#2B7A4B]" />
            <label className="font-mono text-[10px] uppercase tracking-widest text-slate-600">Narration language</label>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => update({ language: lang })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  data.language === lang ? 'border-[#2B7A4B] bg-[#2B7A4B] text-white' : 'border-slate-200 text-slate-600 hover:border-[#2B7A4B]/40'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <IconVolume size={14} className="text-[#2B7A4B]" />
            <label className="font-mono text-[10px] uppercase tracking-widest text-slate-600">Audio narration</label>
          </div>
          <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={data.audioNarration}
              onChange={(e) => update({ audioNarration: e.target.checked })}
              className="accent-[#2B7A4B]"
            />
            Generate a voiceover per panel in {data.language} (TTS not wired up yet)
          </label>
        </div>
      </div>

      <div className="mt-7 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 rounded-md bg-[#2B7A4B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2B7A4B]/90 disabled:opacity-50"
        >
          <IconRocket size={15} />
          {submitting ? 'Publishing…' : 'Publish story'}
        </button>
      </div>
    </div>
  )
}
