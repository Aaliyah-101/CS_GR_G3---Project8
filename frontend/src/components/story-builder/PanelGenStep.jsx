import { useEffect, useState } from 'react'
import api, { API_BASE_URL } from '../../apis/api'
import PanelArt from './PanelArt.jsx'
import { colorForCharacter } from './storyEngine.js'


// ============================================================
// IMAGE URL HELPER
// ============================================================

function getImageUrl(imageUrl) {

  if (!imageUrl) return null

  if (imageUrl.startsWith('http')) {
    return imageUrl
  }

  return `${API_BASE_URL}${imageUrl}`
}


// ============================================================
// CHARACTER PARSER
// ============================================================

function parseCharacters(value) {

  if (Array.isArray(value)) {

    return value
      .map((character) => String(character).trim())
      .filter(Boolean)

  }

  return String(value || '')
    .split(',')
    .map((character) => character.trim())
    .filter(Boolean)
}


// ============================================================
// PANEL GENERATION COMPONENT
// ============================================================

export default function PanelGenStep({
  data,
  update,
  onVerify
}) {

  const [panels, setPanels] = useState([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)


  // ============================================================
  // ALL CHARACTER NAMES
  // ============================================================

  const allCharacterNames = Array.from(
    new Set(
      (data.scenes || []).flatMap((scene) =>
        parseCharacters(scene.characters)
      )
    )
  )


  // ============================================================
  // GENERATE PANELS
  // ============================================================

  async function generatePanels() {

    if (!data.scenes || data.scenes.length === 0) {

      setError(
        'There are no scenes available to generate.'
      )

      return
    }


    setGenerating(true)
    setError(null)
    setPanels([])


    const results = []


    // ==========================================================
    // GENERATE EACH SCENE INDEPENDENTLY
    // ==========================================================

    for (const scene of data.scenes) {

      try {

        console.log(
          `Generating panel for ${scene.id}...`
        )


        const response = await api.post(
          '/api/story/generate-panel',
          {
            scene_id: scene.id,

            caption: scene.caption,

            image_prompt: scene.imagePrompt,

            characters: parseCharacters(
              scene.characters
            ),

            art_key:
              scene.artKey || 'village',
          }
        )


        const panel = response.data.panel


        results.push(panel)


        // Update immediately after every successful panel
        setPanels([...results])

        update({
          panels: [...results]
        })


        console.log(
          `Panel generated successfully: ${scene.id}`
        )

      } catch (err) {

        console.error(
          `Panel generation failed for ${scene.id}:`,
          err.response?.data || err
        )


        // ======================================================
        // KEEP FAILED PANEL IN RESULTS
        // ======================================================

        const failedPanel = {

          scene_id: scene.id,

          caption: scene.caption,

          image_prompt: scene.imagePrompt,

          characters: parseCharacters(
            scene.characters
          ),

          art_key:
            scene.artKey || 'village',

          status: 'failed',

          error:
            err.response?.data?.detail ||
            'Image generation failed.'

        }


        results.push(failedPanel)


        // Continue with remaining scenes
        setPanels([...results])

        update({
          panels: [...results]
        })

      }

    }


    // ==========================================================
    // FINISHED
    // ==========================================================

    setGenerating(false)


    // Check whether at least one panel succeeded
    const successfulPanels = results.filter(
      (panel) => panel?.image_url
    )


    if (successfulPanels.length === 0) {

      setError(
        'No panels could be generated. The image generation service may be unavailable or out of credits.'
      )

    }

  }


  // ============================================================
  // GENERATE WHEN STEP OPENS
  // ============================================================

  useEffect(() => {

    if (data.scenes?.length > 0) {
      generatePanels()
    }

  }, [])


  // ============================================================
  // LOADING STATE
  // ============================================================

  if (generating) {

    return (

      <div className="rounded-lg border border-panelLine bg-panel p-8 text-center">

        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-panelLine border-t-amber" />


        <h2 className="mt-5 font-display text-xl font-semibold">
          Generating visual panels
        </h2>


        <p className="mx-auto mt-2 max-w-md font-body text-sm text-sienna">

          The storyboard is being translated into visual
          scenes. Each panel is being prepared from its
          image prompt and character information.

        </p>


        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-sienna/70">

          {panels.filter(
            (panel) => panel?.image_url
          ).length}{' '}

          of {data.scenes.length} panels generated

        </p>

      </div>

    )

  }


  // ============================================================
  // COMPLETE FAILURE STATE
  // ============================================================

  if (error && panels.length === 0) {

    return (

      <div className="rounded-lg border border-panelLine bg-panel p-6">

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">

          Stage 6 · Character/Object Generation

        </p>


        <h2 className="mt-2 font-display text-xl font-semibold">

          Panel generation failed

        </h2>


        <p className="mt-2 font-body text-sm text-sienna">

          {error}

        </p>


        <button
          type="button"
          onClick={generatePanels}
          className="mt-5 rounded-md bg-amber px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-amber/90"
        >

          Try again

        </button>

      </div>

    )

  }


  // ============================================================
  // PANEL DISPLAY
  // ============================================================

  return (

    <div className="rounded-lg border border-panelLine bg-panel p-6">


      {/* ========================================================
          HEADER
      ======================================================== */}

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">

        Stage 6 · Character/Object Generation

      </p>


      <h2 className="mt-2 font-display text-xl font-semibold">

        Generated panels

      </h2>


      <p className="mt-1 max-w-xl font-body text-sm text-sienna">

        Each scene has been translated into a visual panel
        using its storyboard prompt, setting and characters.

      </p>


      {/* ========================================================
          PANEL GRID
      ======================================================== */}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">


        {data.scenes.map((scene, i) => {


          // ------------------------------------------------------
          // MATCH PANEL TO SCENE
          // ------------------------------------------------------

          const panel = panels.find(
            (item) =>
              item.scene_id === scene.id
          )


          // ------------------------------------------------------
          // CHARACTERS
          // ------------------------------------------------------

          const names = parseCharacters(
            scene.characters
          )


          const colors = names.map(
            (name) =>
              colorForCharacter(
                name,
                allCharacterNames
              )
          )


          // ------------------------------------------------------
          // PANEL STATUS
          // ------------------------------------------------------

          const isGenerated =
            Boolean(panel?.image_url)


          const isFailed =
            panel?.status === 'failed'


          return (

            <div
              key={scene.id}
              className="overflow-hidden rounded-lg border border-panelLine bg-ink"
            >


              {/* ==================================================
                  IMAGE
              ================================================== */}

              <div className="relative aspect-[4/3]">


                {isGenerated ? (

                  <img
                    src={getImageUrl(
                      panel.image_url
                    )}
                    alt={scene.caption}
                    className="h-full w-full object-cover"
                  />

                ) : (

                  <PanelArt
                    artKey={
                      scene.artKey ||
                      'village'
                    }
                    colors={colors}
                  />

                )}


                {/* =================================================
                    IMAGE STATUS
                ================================================= */}

                <div className="absolute right-2 top-2">

                  <span className="rounded-full bg-ink/80 px-2 py-1 font-mono text-[9px] uppercase tracking-wide text-amber">

                    {isGenerated
                      ? 'Generated image'
                      : isFailed
                        ? 'Generation failed'
                        : 'Preview illustration'}

                  </span>

                </div>


              </div>


              {/* ==================================================
                  PANEL INFORMATION
              ================================================== */}

              <div className="p-3">


                <div className="flex items-center justify-between">


                  <span className="font-mono text-[10px] text-sienna/70">

                    Panel {i + 1}

                  </span>


                  <span className="rounded-full bg-amber/10 px-2 py-0.5 font-mono text-[9px] uppercase text-amber">

                    {isFailed
                      ? 'Failed'
                      : panel?.status ||
                        'ready'}

                  </span>


                </div>


                {/* CAPTION */}

                <p className="mt-1 font-body text-xs font-medium text-parchment">

                  {scene.caption}

                </p>


                {/* IMAGE PROMPT */}

                {panel?.image_prompt && (

                  <p className="mt-2 line-clamp-2 font-mono text-[9px] leading-relaxed text-sienna/70">

                    {panel.image_prompt}

                  </p>

                )}


                {/* FAILURE MESSAGE */}

                {isFailed && (

                  <p className="mt-2 font-mono text-[9px] leading-relaxed text-amber/80">

                    {panel.error ||
                      'This panel could not be generated.'}

                  </p>

                )}


              </div>


            </div>

          )

        })}


      </div>


      {/* ========================================================
          CHARACTER CONSISTENCY
      ======================================================== */}

      {allCharacterNames.length > 0 && (

        <div className="mt-5">


          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-sienna">

            Character consistency

          </p>


          <div className="flex flex-wrap gap-2">


            {allCharacterNames.map(
              (name) => (

                <span
                  key={name}
                  className="flex items-center gap-1.5 rounded-full border border-panelLine px-2.5 py-1 font-mono text-[11px] text-sienna"
                >


                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background:
                        colorForCharacter(
                          name,
                          allCharacterNames
                        )
                    }}
                  />


                  {name}


                </span>

              )
            )}


          </div>


        </div>

      )}


      {/* ========================================================
          PANEL SUMMARY
      ======================================================== */}

      <div className="mt-6 rounded-md border border-panelLine bg-ink p-4">


        <div className="flex items-center justify-between">


          <span className="font-mono text-[10px] uppercase tracking-widest text-sienna">

            Panel status

          </span>


          <span className="font-mono text-xs text-amber">

            {
              panels.filter(
                (panel) =>
                  panel?.image_url
              ).length
            }{' '}

            / {data.scenes.length}

          </span>


        </div>


        <p className="mt-2 font-body text-xs text-sienna">


          {panels.length === data.scenes.length &&
           panels.every(
             (panel) =>
               panel?.image_url
           )

            ? 'All panels have generated images.'

            : panels.some(
                (panel) =>
                  panel?.image_url
              )

              ? `${panels.filter(
                  (panel) =>
                    panel?.image_url
                ).length} of ${
                  data.scenes.length
                } panels have generated images. Some panels could not be generated.`

              : 'No generated images are currently available. Preview illustrations are being used.'}


        </p>


      </div>


      {/* ========================================================
          PARTIAL GENERATION WARNING
      ======================================================== */}

      {panels.some(
        (panel) =>
          panel?.status === 'failed'
      ) && (

        <div className="mt-4 rounded-md border border-amber/30 bg-amber/5 p-3">

          <p className="font-mono text-[10px] uppercase tracking-widest text-amber">

            Some panels could not be generated

          </p>


          <p className="mt-1 font-body text-xs text-sienna">

            Generated panels are still available. Failed
            panels are showing preview illustrations instead.

          </p>

        </div>

      )}


      {/* ========================================================
          VERIFY
      ======================================================== */}

      <div className="mt-7 border-t border-panelLine pt-6">


        <button
          type="button"
          onClick={onVerify}
          disabled={
            panels.filter(
              (panel) =>
                panel?.image_url
            ).length === 0
          }
          className="rounded-md bg-amber px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-50"
        >

          Run verification →

        </button>


      </div>


    </div>

  )

}