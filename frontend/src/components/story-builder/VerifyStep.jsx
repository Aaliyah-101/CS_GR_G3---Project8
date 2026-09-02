import { useMemo } from 'react'
import PanelArt from './PanelArt.jsx'
import VerificationStamp from './VerificationStamp.jsx'
import { verifyPanel, colorForCharacter } from './storyEngine.js'
import { IconShield } from './Icons.jsx'


function parseCharacters(value) {
  if (Array.isArray(value)) {
    return value
  }

  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}


export default function VerifyStep({
  data,
  onVerify,
  goToStep,
}) {

  const includedFacts = data.facts.filter(
    (fact) => fact.included
  )


  /*
   * Use backend-generated panels if available.
   * Otherwise fall back to the storyboard scenes.
   */

  const panels =
    data.panels?.length > 0
      ? data.panels
      : data.scenes.map((scene) => ({
          scene_id: scene.id,
          caption: scene.caption,
          image_prompt: scene.imagePrompt,
          characters: parseCharacters(scene.characters),
          art_key: scene.artKey,
          image_url: null,
          status: 'ready',
        }))


  /*
   * Character consistency
   */

  const allCharacterNames = Array.from(
    new Set(
      panels.flatMap((panel) =>
        parseCharacters(panel.characters)
      )
    )
  )


  /*
   * Verification
   */

  const results = useMemo(() => {

    return panels.map((panel) => {

      const scene =
        data.scenes.find(
          (s) => s.id === panel.scene_id
        ) || {
          id: panel.scene_id,
          caption: panel.caption,
          imagePrompt: panel.image_prompt,
          characters: parseCharacters(panel.characters),
          artKey: panel.art_key,
        }


      const result = verifyPanel(
        scene,
        includedFacts
      )


      return {
        panel,
        scene,
        result,
      }

    })

  }, [panels, data.scenes, includedFacts])


  const flaggedCount = results.filter(
    (item) => item.result.status === 'flag'
  ).length


  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">Stage 7 · Visual-Semantic Verification</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">Does each panel still say what the source said?</h2>
      <p className="mt-1 max-w-xl text-sm text-slate-600">
        Every panel is checked against the facts you confirmed earlier — this is the safety net before
        anything publishes.
      </p>


      {/* PANELS */}

      <div className="mt-5 space-y-3">

        {results.map(
          ({ panel, scene, result }, i) => {

            const names =
              parseCharacters(panel.characters)

            const colors =
              names.map((name) =>
                colorForCharacter(
                  name,
                  allCharacterNames
                )
              )


            return (

              <div
                key={panel.scene_id}
                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
              >

                {/* IMAGE */}

                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-md border border-slate-200">

                  {panel.image_url ? (

                    <img
                      src={panel.image_url}
                      alt={panel.caption}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <PanelArt
                      artKey={
                        panel.art_key ||
                        scene.artKey ||
                        'village'
                      }
                      colors={colors}
                    />

                  )}

                </div>


                {/* INFORMATION */}

                <div className="min-w-0 flex-1">

                  <p className="text-sm font-medium text-slate-900">

                    Panel {i + 1}

                    {' · '}

                    {panel.caption ||
                      scene.caption ||
                      'Untitled scene'}

                  </p>


                  <p className="mt-0.5 text-xs text-slate-600">
                    {result.note}
                  </p>


                  {result.status === 'flag' && (

                    <button
                      type="button"
                      onClick={() =>
                        goToStep('storyboard')
                      }
                      className="mt-1.5 font-mono text-[11px] text-[#D62828] underline decoration-dotted underline-offset-2 hover:text-[#D62828]/80"
                    >
                      Edit this scene →
                    </button>

                  )}

                </div>


                {/* SCORE */}

                <VerificationStamp
                  status={result.status}
                  score={result.score}
                  size="sm"
                />

              </div>

            )

          }
        )}

      </div>


      {/* VERIFICATION SUMMARY */}

      <div
        className={`mt-5 flex items-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-xs ${
          flaggedCount > 0 ? 'border-[#D62828]/40 bg-[#D62828]/10 text-[#D62828]' : 'border-[#2B7A4B]/40 bg-[#2B7A4B]/10 text-[#2B7A4B]'
        }`}
      >

        <IconShield size={14} />

        {flaggedCount > 0

          ? `${flaggedCount} of ${results.length} panels flagged — fix them or continue anyway.`

          : `All ${results.length} panels are grounded in your confirmed facts.`

        }

      </div>


      {/* CONTINUE */}

      <div className="mt-7 border-t border-slate-200 pt-6">

        <button
          type="button"
          onClick={onVerify}
          className="rounded-md bg-[#2B7A4B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2B7A4B]/90"
        >
          Continue to publish →
        </button>

      </div>

    </div>

  )

}