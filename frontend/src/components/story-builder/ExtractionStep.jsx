import { IconSparkle, IconX } from './Icons.jsx'

export default function ExtractionStep({ data, update, onVerify }) {
  function updateFact(id, field, value) {
    update({ facts: data.facts.map((f) => (f.id === id ? { ...f, [field]: value } : f)) })
  }

  function removeFact(id) {
    update({ facts: data.facts.filter((f) => f.id !== id) })
  }

  function addFact() {
    update({ facts: [...data.facts, { id: `fact-manual-${Date.now()}`, text: '', weight: 'medium', included: true }] })
  }

  const includedCount = data.facts.filter((f) => f.included).length

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">Stage 2 · Semantic Extraction</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">What the story needs to stay true to</h2>
      <p className="mt-1 max-w-xl text-sm text-slate-600">
        Pulled from your source text. Edit anything that's wrong, uncheck anything you don't want the
        story grounded in, or add a fact by hand — confirming this list is what "verifies" this stage.
      </p>

      {data.facts.length === 0 && (
        <p className="mt-5 text-sm text-slate-600">
          No facts could be extracted — go back and add more source text.
        </p>
      )}

      <ul className="mt-5 space-y-2.5">
        {data.facts.map((fact) => (
          <li key={fact.id} className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              checked={fact.included}
              onChange={(e) => updateFact(fact.id, 'included', e.target.checked)}
              className="mt-1.5 accent-[#2B7A4B]"
              aria-label="Include this fact"
            />
            <textarea
              value={fact.text}
              onChange={(e) => updateFact(fact.id, 'text', e.target.value)}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-slate-900 focus:outline-none"
            />
            <select
              value={fact.weight}
              onChange={(e) => updateFact(fact.id, 'weight', e.target.value)}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] uppercase text-slate-600 focus:border-[#2B7A4B] focus:outline-none"
            >
              <option value="high">high</option>
              <option value="medium">medium</option>
            </select>
            <button
              type="button"
              onClick={() => removeFact(fact.id)}
              className="shrink-0 text-slate-600 transition hover:text-[#D62828]"
              aria-label="Remove fact"
            >
              <IconX size={14} />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={addFact}
        className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 transition hover:text-[#2B7A4B]"
      >
        <IconSparkle size={13} /> Add a fact manually
      </button>

      <div className="mt-7 flex items-center gap-4 border-t border-slate-200 pt-6">
        <button
          type="button"
          disabled={includedCount === 0}
          onClick={onVerify}
          className="rounded-md bg-[#2B7A4B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2B7A4B]/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm facts & continue →
        </button>
        <span className="text-xs text-slate-600">{includedCount} fact{includedCount === 1 ? '' : 's'} included</span>
      </div>
    </div>
  )
}
