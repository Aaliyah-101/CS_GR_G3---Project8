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
    <div className="rounded-lg border border-panelLine bg-panel p-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Stage 2 · Semantic Extraction</p>
      <h2 className="mt-2 font-display text-xl font-semibold">What the story needs to stay true to</h2>
      <p className="mt-1 max-w-xl font-body text-sm text-sienna">
        Pulled from your source text. Edit anything that's wrong, uncheck anything you don't want the
        story grounded in, or add a fact by hand — confirming this list is what "verifies" this stage.
      </p>

      {data.facts.length === 0 && (
        <p className="mt-5 font-body text-sm text-sienna">
          No facts could be extracted — go back and add more source text.
        </p>
      )}

      <ul className="mt-5 space-y-2.5">
        {data.facts.map((fact) => (
          <li key={fact.id} className="flex items-start gap-3 rounded-md border border-panelLine bg-ink px-4 py-3">
            <input
              type="checkbox"
              checked={fact.included}
              onChange={(e) => updateFact(fact.id, 'included', e.target.checked)}
              className="mt-1.5 accent-amber"
              aria-label="Include this fact"
            />
            <textarea
              value={fact.text}
              onChange={(e) => updateFact(fact.id, 'text', e.target.value)}
              rows={1}
              className="flex-1 resize-none bg-transparent font-body text-sm text-parchment focus:outline-none"
            />
            <select
              value={fact.weight}
              onChange={(e) => updateFact(fact.id, 'weight', e.target.value)}
              className="shrink-0 rounded-full border border-panelLine bg-panel px-2 py-1 font-mono text-[10px] uppercase text-sienna focus:border-amber focus:outline-none"
            >
              <option value="high">high</option>
              <option value="medium">medium</option>
            </select>
            <button
              type="button"
              onClick={() => removeFact(fact.id)}
              className="shrink-0 text-sienna transition hover:text-clay"
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
        className="mt-3 flex items-center gap-1.5 font-body text-xs text-sienna transition hover:text-amber"
      >
        <IconSparkle size={13} /> Add a fact manually
      </button>

      <div className="mt-7 flex items-center gap-4 border-t border-panelLine pt-6">
        <button
          type="button"
          disabled={includedCount === 0}
          onClick={onVerify}
          className="rounded-md bg-amber px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm facts & continue →
        </button>
        <span className="font-mono text-xs text-sienna">{includedCount} fact{includedCount === 1 ? '' : 's'} included</span>
      </div>
    </div>
  )
}
