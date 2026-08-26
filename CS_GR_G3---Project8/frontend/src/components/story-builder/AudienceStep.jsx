import { IconUsers } from './Icons.jsx'

const LANGUAGES = ['English', 'Luganda', 'Runyankole', 'Swahili']

export default function AudienceStep({ data, update, onVerify }) {
  return (
    <div className="rounded-lg border border-panelLine bg-panel p-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Stage 3 · Audience / Context Model</p>
      <h2 className="mt-2 font-display text-xl font-semibold">Who is this story for?</h2>
      <p className="mt-1 max-w-xl font-body text-sm text-sienna">
        This changes vocabulary, pacing, and language — not just illustration style.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {data.audienceOptions.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => update({ audienceId: a.id })}
            className={`rounded-lg border p-4 text-left transition ${
              data.audienceId === a.id ? 'border-amber bg-ink' : 'border-panelLine bg-ink/60 hover:border-amber/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <IconUsers size={14} className={data.audienceId === a.id ? 'text-amber' : 'text-sienna'} />
              <span className="font-body text-sm font-medium text-parchment">{a.label}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-sienna">{a.literacy} · {a.language}</p>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <label className="block font-body text-sm font-medium text-parchment">Narration / caption language</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => update({ language: lang })}
              className={`rounded-full border px-3 py-1.5 font-body text-xs font-medium transition ${
                data.language === lang ? 'border-amber bg-amber text-ink' : 'border-panelLine text-sienna hover:border-amber/40'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 border-t border-panelLine pt-6">
        <button
          type="button"
          onClick={onVerify}
          className="rounded-md bg-amber px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-amber/90"
        >
          Confirm audience & continue →
        </button>
      </div>
    </div>
  )
}
