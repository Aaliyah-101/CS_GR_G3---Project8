import { IconUsers } from './Icons.jsx'

const LANGUAGES = ['English', 'Luganda', 'Runyankole', 'Swahili']

export default function AudienceStep({ data, update, onVerify }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">Stage 3 · Audience / Context Model</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">Who is this story for?</h2>
      <p className="mt-1 max-w-xl text-sm text-slate-600">
        This changes vocabulary, pacing, and language — not just illustration style.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {data.audienceOptions.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => update({ audienceId: a.id })}
            className={`rounded-lg border p-4 text-left transition ${
              data.audienceId === a.id ? 'border-[#2B7A4B] bg-[#F0FAF3]' : 'border-slate-200 bg-slate-50 hover:border-[#2B7A4B]/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <IconUsers size={14} className={data.audienceId === a.id ? 'text-[#2B7A4B]' : 'text-slate-600'} />
              <span className="text-sm font-medium text-slate-900">{a.label}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-slate-600">{a.literacy} · {a.language}</p>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-900">Narration / caption language</label>
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

      <div className="mt-7 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={onVerify}
          className="rounded-md bg-[#2B7A4B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2B7A4B]/90"
        >
          Confirm audience & continue →
        </button>
      </div>
    </div>
  )
}
