import { IconBook, IconCheck } from './Icons.jsx'

export default function NarrativeStep({ data, update, onVerify }) {
  const includedFacts = data.facts.filter((f) => f.included)

  function toggleCovered(factId) {
    const covered = data.coveredFactIds.includes(factId)
    update({
      coveredFactIds: covered
        ? data.coveredFactIds.filter((id) => id !== factId)
        : [...data.coveredFactIds, factId],
    })
  }

  return (
    <div className="rounded-lg border border-panelLine bg-panel p-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Stage 4 · Narrative Planning</p>
      <h2 className="mt-2 font-display text-xl font-semibold">Turn the facts into a story arc</h2>
      <p className="mt-1 max-w-xl font-body text-sm text-sienna">
        A first draft is suggested below from your title, category, tone, and audience — rewrite as much
        as you like.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <IconBook size={14} className="text-amber" />
            <label className="font-mono text-[10px] uppercase tracking-widest text-sienna">Protagonist</label>
          </div>
          <input
            value={data.protagonist}
            onChange={(e) => update({ protagonist: e.target.value })}
            className="mt-2 w-full rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment focus:border-amber focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-sienna">Story arc</label>
          <textarea
            value={data.arc}
            onChange={(e) => update({ arc: e.target.value })}
            rows={4}
            className="mt-2 w-full resize-none rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment focus:border-amber focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-sienna">
          Does the arc account for each confirmed fact?
        </p>
        <p className="mt-1 font-body text-xs text-sienna">
          Check off facts your arc actually addresses — anything left unchecked is worth a look before
          you build the storyboard.
        </p>
        <ul className="mt-3 space-y-1.5">
          {includedFacts.map((f) => {
            const covered = data.coveredFactIds.includes(f.id)
            return (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => toggleCovered(f.id)}
                  className="flex w-full items-start gap-2.5 rounded-md border border-panelLine bg-ink px-3 py-2 text-left transition hover:border-amber/40"
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      covered ? 'border-amber bg-amber text-ink' : 'border-panelLine text-transparent'
                    }`}
                  >
                    <IconCheck size={10} />
                  </span>
                  <span className="font-body text-xs text-parchment">{f.text}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mt-7 border-t border-panelLine pt-6">
        <button
          type="button"
          onClick={onVerify}
          className="rounded-md bg-amber px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-amber/90"
        >
          Confirm narrative & continue →
        </button>
      </div>
    </div>
  )
}
