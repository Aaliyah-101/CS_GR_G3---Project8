import { useState } from 'react'
import api from '../../apis/api'
import {
  IconLanguages,
  IconVolume,
  IconRocket,
  IconCheck,
} from './Icons.jsx'

const LANGUAGES = [
  'English',
  'Luganda',
  'Runyankole',
  'Swahili',
]

export default function PublishStep({
  data,
  update,
  onSubmit,
}) {
  const [submitting, setSubmitting] = useState(false)
  const [published, setPublished] = useState(false)
  const [publishError, setPublishError] = useState(null)

  // ============================================================
  // BUILD FINAL STORY PAYLOAD
  // ============================================================

  function buildPayload() {
    const audience =
      data.audienceOptions?.find(
        (a) => a.id === data.audienceId
      )

    return {
      title: data.title,

      category: data.category,

      tone: data.tone,

      audience: audience || {
        id: data.audienceId || 'General',
        label: data.audienceId || 'General',
      },

      language: data.language,

      audioNarration: data.audioNarration,

      // --------------------------------------------------------
      // FACTS
      // --------------------------------------------------------

      facts: data.facts
        .filter((fact) => fact.included)
        .map((fact) => ({
          id: fact.id,
          text: fact.text,
        })),

      // --------------------------------------------------------
      // NARRATIVE
      // --------------------------------------------------------

      narrative: {
        protagonist: data.protagonist,
        arc: data.arc,
      },

      // --------------------------------------------------------
      // SCENES
      // --------------------------------------------------------
      // Merge in whatever image was generated for each scene during the
      // Panel Gen step (data.panels), matched by scene id. Without this,
      // the publish payload only carries the *prompt* for each scene, not
      // the actual generated image — and the gallery has nothing to show.
      // Both `imageUrl` and `image_url` are sent since the generate-panel
      // and stories endpoints have been observed using different casing;
      // confirm with the backend which one it actually persists/reads and
      // this can be trimmed to just that one.

      scenes: data.scenes.map((scene) => {
        const panel = data.panels?.find(
          (p) => p.scene_id === scene.id
        )

        return {
          id: scene.id,

          caption: scene.caption,

          imagePrompt: scene.imagePrompt,

          artKey: scene.artKey || 'village',

          characters:
            Array.isArray(scene.characters)
              ? scene.characters
              : String(scene.characters || '')
                  .split(',')
                  .map((character) => character.trim())
                  .filter(Boolean),

          // Generated image from the Panel Gen step, if any.
          imageUrl: panel?.image_url || null,
          image_url: panel?.image_url || null,
        }
      }),
    }
  }

  // ============================================================
  // PUBLISH STORY
  // ============================================================

  async function handleSubmit() {
    setSubmitting(true)
    setPublishError(null)

    const payload = buildPayload()

    console.log(
      'Final story payload:',
      payload
    )

    try {
      // --------------------------------------------------------
      // SEND STORY TO BACKEND
      // --------------------------------------------------------

      const response = await api.post(
        '/api/story/publish',
        payload
      )

      console.log(
        'Story published successfully:',
        response.data
      )

      // --------------------------------------------------------
      // OPTIONAL CALLBACK TO CREATESTORY
      // --------------------------------------------------------

      if (onSubmit) {
        await onSubmit(response.data)
      }

      // --------------------------------------------------------
      // SHOW SUCCESS STATE
      // --------------------------------------------------------

      setPublished(true)

    } catch (error) {
      console.error(
        'Story publishing failed:',
        error.response?.data || error
      )

      setPublishError(
        error.response?.data?.detail ||
        'Failed to publish story. Please try again.'
      )

    } finally {
      setSubmitting(false)
    }
  }

  // ============================================================
  // PUBLISHED STATE
  // ============================================================

  if (published) {
    return (
      <div className="rounded-lg border border-[#2B7A4B]/40 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#2B7A4B] text-[#2B7A4B]">
          <IconCheck size={22} />
        </div>

        <h2 className="mt-4 font-display text-xl font-semibold">
          Story published
        </h2>

        <p className="mt-1 font-body text-sm text-sienna">
          "{data.title}" has been successfully published.
        </p>

        <p className="mt-3 font-mono text-[11px] text-sienna/70">
          Your story has been sent to the VisualUG backend.
        </p>

      </div>
    )
  }

  // ============================================================
  // CURRENT AUDIENCE
  // ============================================================

  const audience =
    data.audienceOptions?.find(
      (a) => a.id === data.audienceId
    )

  // ============================================================
  // INCLUDED FACTS
  // ============================================================

  const included =
    data.facts.filter(
      (fact) => fact.included
    ).length

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">

      {/* HEADER */}

      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">
        Stage 8 · Language Layer + Publish
      </p>

      <h2 className="mt-2 text-xl font-semibold text-slate-900">
        Final review
      </h2>

      <p className="mt-1 max-w-xl font-body text-sm text-sienna">
        Review your story before publishing it to VisualUG.
      </p>

      {/* ======================================================
          STORY SUMMARY
      ====================================================== */}

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 rounded-md border border-slate-200 bg-slate-50 p-4 font-mono text-xs">

        <dt className="text-slate-600">
          Title
        </dt>

        <dd className="text-slate-900">
          {data.title || 'Untitled'}
        </dd>

        <dt className="text-slate-600">
          Category · Tone
        </dt>

        <dd className="text-slate-900">
          {data.category} · {data.tone}
        </dd>

        <dt className="text-slate-600">
          Audience
        </dt>

        <dd className="text-slate-900">
          {audience?.label ||
            data.audienceId ||
            'General'}
        </dd>

        <dt className="text-slate-600">
          Facts grounded
        </dt>

        <dd className="text-slate-900">
          {included}
        </dd>

        <dt className="text-slate-600">
          Scenes
        </dt>

        <dd className="text-slate-900">
          {data.scenes.length}
        </dd>

      </dl>

      {/* ======================================================
          LANGUAGE + AUDIO
      ====================================================== */}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">

        {/* LANGUAGE */}

        <div>

          <div className="flex items-center gap-2">

            <IconLanguages
              size={14}
              className="text-[#2B7A4B]"
            />

            <label className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
              Narration language
            </label>

          </div>

          <div className="mt-2 flex flex-wrap gap-2">

            {LANGUAGES.map((lang) => (

              <button
                key={lang}
                type="button"
                onClick={() =>
                  update({
                    language: lang,
                  })
                }
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  data.language === lang
                    ? 'border-[#2B7A4B] bg-[#2B7A4B] text-white'
                    : 'border-slate-200 text-slate-600 hover:border-[#2B7A4B]/40'
                }`}
              >
                {lang}
              </button>

            ))}

          </div>

        </div>

        {/* AUDIO */}

        <div>

          <div className="flex items-center gap-2">

            <IconVolume
              size={14}
              className="text-[#2B7A4B]"
            />

            <label className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
              Audio narration
            </label>

          </div>

          <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">

            <input
              type="checkbox"
              checked={data.audioNarration}
              onChange={(e) =>
                update({
                  audioNarration:
                    e.target.checked,
                })
              }
              className="accent-[#2B7A4B]"
            />

            Generate a voiceover per panel in{' '}

            {data.language}

            {' '}

            <span className="text-sienna/60">
              (TTS not wired up yet)
            </span>

          </label>

        </div>

      </div>

      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {publishError && (
        <div className="mt-6 rounded-md border border-clay/40 bg-clay/10 px-4 py-3">

          <p className="font-mono text-xs text-clay">
            Publishing failed
          </p>

          <p className="mt-1 font-body text-sm text-sienna">
            {publishError}
          </p>

        </div>
      )}

      {/* ======================================================
          PUBLISH BUTTON
      ====================================================== */}

      <div className="mt-7 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 rounded-md bg-[#2B7A4B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2B7A4B]/90 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <IconRocket size={15} />

          {submitting
            ? 'Publishing…'
            : 'Publish story'}

        </button>

      </div>

    </div>
  )
}