import { useEffect, useState } from 'react'
import api from '../../apis/api'
import PanelArt from './PanelArt.jsx'
import { colorForCharacter } from './storyEngine.js'


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


export default function PanelGenStep({ data,update, onVerify }) {

  const [panels, setPanels] = useState([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)


  // ============================================================
  // ALL CHARACTER NAMES
  // ============================================================

  const allCharacterNames = Array.from(
    new Set(
      data.scenes.flatMap((scene) =>
        parseCharacters(scene.characters)
      )
    )
  )


  // ============================================================
  // GENERATE PANELS
  // ============================================================

  async function generatePanels() {

    if (!data.scenes || data.scenes.length === 0) {
      setError('There are no scenes available to generate.')
      return
    }

    setGenerating(true)
    setError(null)
    setPanels([])

    try {

      const results = await Promise.all(

        data.scenes.map(async (scene) => {

          const response = await api.post(
            '/api/story/generate-panel',
            {
              scene_id: scene.id,

              caption: scene.caption,

              image_prompt: scene.imagePrompt,

              characters: parseCharacters(
                scene.characters
              ),

              art_key: scene.artKey || 'village',
            }
          )

          return response.data.panel
        })
      )


      console.log('Generated panels:', results)

      setPanels(results)
      update({ panels: results })

    } catch (err) {

      console.error(
        'Panel generation failed:',
        err.response?.data || err
      )

      setError(
        err.response?.data?.detail ||
        'Something went wrong while generating the panels.'
      )

    } finally {

      setGenerating(false)

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
          {data.scenes.length} panels in progress
        </p>

      </div>

    )

  }


  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {

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


      {/* PANEL GRID */}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">

        {data.scenes.map((scene, i) => {

          // Match panel to scene using scene_id
          const panel = panels.find(
            (item) => item.scene_id === scene.id
          )


          const names = parseCharacters(
            scene.characters
          )


          const colors = names.map((name) =>
            colorForCharacter(
              name,
              allCharacterNames
            )
          )


          return (

            <div
              key={scene.id}
              className="overflow-hidden rounded-lg border border-panelLine bg-ink"
            >

              {/* IMAGE */}

              <div className="relative aspect-[4/3]">

                {panel?.image_url ? (

                  <img
                    src={panel.image_url}
                    alt={scene.caption}
                    className="h-full w-full object-cover"
                  />

                ) : (

                  <PanelArt
                    artKey={scene.artKey || 'village'}
                    colors={colors}
                  />

                )}


                {/* IMAGE STATUS */}

                <div className="absolute right-2 top-2">

                  <span className="rounded-full bg-ink/80 px-2 py-1 font-mono text-[9px] uppercase tracking-wide text-amber">

                    {panel?.image_url
                      ? 'Generated image'
                      : 'Preview illustration'}

                  </span>

                </div>

              </div>


              {/* PANEL INFORMATION */}

              <div className="p-3">

                <div className="flex items-center justify-between">

                  <span className="font-mono text-[10px] text-sienna/70">
                    Panel {i + 1}
                  </span>

                  <span className="rounded-full bg-amber/10 px-2 py-0.5 font-mono text-[9px] uppercase text-amber">
                    {panel?.status || 'ready'}
                  </span>

                </div>


                <p className="mt-1 font-body text-xs font-medium text-parchment">
                  {scene.caption}
                </p>


                {panel?.image_prompt && (

                  <p className="mt-2 line-clamp-2 font-mono text-[9px] leading-relaxed text-sienna/70">
                    {panel.image_prompt}
                  </p>

                )}

              </div>

            </div>

          )

        })}

      </div>


      {/* CHARACTER CONSISTENCY */}

      {allCharacterNames.length > 0 && (

        <div className="mt-5">

          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-sienna">
            Character consistency
          </p>

          <div className="flex flex-wrap gap-2">

            {allCharacterNames.map((name) => (

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

            ))}

          </div>

        </div>

      )}


      {/* PANEL SUMMARY */}

      <div className="mt-6 rounded-md border border-panelLine bg-ink p-4">

        <div className="flex items-center justify-between">

          <span className="font-mono text-[10px] uppercase tracking-widest text-sienna">
            Panel status
          </span>

          <span className="font-mono text-xs text-amber">
            {panels.length} / {data.scenes.length}
          </span>

        </div>

        <p className="mt-2 font-body text-xs text-sienna">
          {panels.every((panel) => panel?.image_url)
            ? 'All panels have generated images.'
            : 'Panels are ready for image generation. Preview illustrations are being used until the image generation service is connected.'}
        </p>

      </div>


      {/* VERIFY */}

      <div className="mt-7 border-t border-panelLine pt-6">

        <button
          type="button"
          onClick={onVerify}
          disabled={panels.length === 0}
          className="rounded-md bg-amber px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Run verification →
        </button>

      </div>

    </div>

  )
}