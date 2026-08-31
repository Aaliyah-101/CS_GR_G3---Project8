import { useEffect, useRef, useState } from 'react'
import api from '../apis/api'

import ebola from '../images/ebola.png'
import netcover from '../images/netcover.png'
import maternal from '../images/maternal.png'
import nutrition from '../images/nutrition.png'
import traditional from '../images/traditional.png'
import underthenet from '../assets/images/underthenet.png'

import PanelArt from '../components/story-builder/PanelArt.jsx'
import { colorForCharacter } from '../components/story-builder/storyEngine.js'

// EXISTING DEMO / COMMUNITY MEDIA


const seedItems = [
  {
    id: 'a1',
    src: ebola,
    source: 'community',
    caption: 'Fighting Ebola in the community',
    story: null,
  },
  {
    id: 'a2',
    src: netcover,
    source: 'community',
    caption: 'Sleeping under the net',
    story: null,
  },
  {
    id: 'a3',
    src: maternal,
    source: 'community',
    caption: 'Maternal health',
    story: null,
  },
  {
    id: 'a4',
    src: nutrition,
    source: 'foryou',
    caption: 'Nutrition is important',
    story: null,
  },
  {
    id: 'a5',
    src: traditional,
    source: 'folklore',
    caption: 'Traditional Practices',
    story: null,
  },
  {
    id: 'a6',
    src: underthenet,
    source: 'community',
    caption: 'Sleep Under the Net',
    story: null,
  },
]


const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'AI Generated', value: 'ai' },
  { label: 'Community Uploads', value: 'community' },
  { label: 'For You', value: 'foryou' },
  { label: 'Folklore', value: 'folklore' },
]


let nextId = 1


// ============================================================
// CHARACTER PARSER
// ============================================================

function parseCharacters(value) {

  if (Array.isArray(value)) {
    return value
  }

  return String(value || '')
    .split(',')
    .map((character) => character.trim())
    .filter(Boolean)
}


// ============================================================
// GALLERY
// ============================================================

export default function Gallery() {

  const [items, setItems] = useState(seedItems)

  const [filter, setFilter] = useState('all')

  const [dragActive, setDragActive] = useState(false)

  const [selected, setSelected] = useState(null)

  const [loadingStories, setLoadingStories] = useState(true)

  const [storyError, setStoryError] = useState(null)

  const fileInputRef = useRef(null)


  // ============================================================
  // LOAD PUBLISHED STORIES
  // ============================================================

  useEffect(() => {

    async function fetchPublishedStories() {

      try {

        setLoadingStories(true)
        setStoryError(null)

        const response = await api.get(
          '/api/story/stories'
        )

        console.log(
          'Published stories received:',
          response.data
        )


        const stories =
          response.data?.stories || []


        const storyItems = stories.map(
          (story) => {

            const firstScene =
              story.scenes?.[0]


            return {

              id: `story-${story.id}`,

              src:
                firstScene?.imageUrl ||
                null,

              source: 'ai',

              caption: story.title,

              story: story.title,

              storyData: story,

            }

          }
        )


        setItems([
          ...storyItems,
          ...seedItems,
        ])

      } catch (error) {

        console.error(
          'Failed to load published stories:',
          error
        )

        setStoryError(
          'Could not load published stories.'
        )

        setItems(seedItems)

      } finally {

        setLoadingStories(false)

      }

    }


    fetchPublishedStories()

  }, [])


  // ============================================================
  // FILTER
  // ============================================================

  const visibleItems =
    filter === 'all'
      ? items
      : items.filter(
          (item) =>
            item.source === filter
        )


  // ============================================================
  // COMMUNITY UPLOAD
  // ============================================================

  function addFiles(fileList) {

    const files = Array.from(fileList)
      .filter((file) =>
        file.type.startsWith('image/')
      )


    const newItems = files.map(
      (file) => ({

        id: `u${nextId++}`,

        src: URL.createObjectURL(file),

        source: 'community',

        caption:
          file.name.replace(
            /\.[^/.]+$/,
            ''
          ),

        story: null,

      })
    )


    setItems((previous) => [
      ...newItems,
      ...previous,
    ])

  }


  // ============================================================
  // DROP
  // ============================================================

  function handleDrop(event) {

    event.preventDefault()

    setDragActive(false)


    if (
      event.dataTransfer.files?.length
    ) {

      addFiles(
        event.dataTransfer.files
      )

    }

  }


  // ============================================================
  // CLOSE MODAL
  // ============================================================

  function closeViewer() {

    setSelected(null)

  }


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <section className="mx-auto max-w-6xl px-6 py-16">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-8">

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">
          Share & Discover
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold">
          Media from Pearl Visual stories
        </h1>

        <p className="mt-2 max-w-xl font-body text-sm text-[#94A3B8]">
          Browse visuals generated for published stories,
          or share your own photos for the community to draw on.
        </p>

      </div>


      {/* ======================================================
          UPLOAD DROPZONE
      ====================================================== */}

      <div
        onDragOver={(event) => {

          event.preventDefault()

          setDragActive(true)

        }}

        onDragLeave={() =>
          setDragActive(false)
        }

        onDrop={handleDrop}

        onClick={() =>
          fileInputRef.current?.click()
        }

        className={`mb-10 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition ${
          dragActive
            ? 'border-[#2DD4BF] bg-[#2DD4BF]/5'
            : 'border-[#164E4A] hover:border-[#2DD4BF]/40'
        }`}
      >

        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[#2DD4BF]"
        >

          <path
            d="M12 16V4M12 4l-4 4M12 4l4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

        </svg>


        <p className="mt-3 font-body text-sm text-[#F0FDFA]">
          Drag photos here, or click to upload
        </p>


        <p className="mt-1 font-mono text-xs text-[#94A3B8]">
          PNG, JPG — shared to the community gallery
        </p>


        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"

          onChange={(event) => {

            if (
              event.target.files?.length
            ) {

              addFiles(
                event.target.files
              )

            }

          }}
        />

      </div>


      {/* ======================================================
          BACKEND STATUS
      ====================================================== */}

      {loadingStories && (

        <div className="mb-6 rounded-lg border border-[#164E4A] bg-[#0D2929] px-4 py-3">

          <p className="font-mono text-xs text-[#94A3B8]">
            Loading published stories...
          </p>

        </div>

      )}


      {storyError && (

        <div className="mb-6 rounded-lg border border-[#164E4A] bg-[#0D2929] px-4 py-3">

          <p className="font-mono text-xs text-[#94A3B8]">
            {storyError}
          </p>

        </div>

      )}


      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="mb-6 flex flex-wrap gap-2">

        {FILTERS.map((filterItem) => (

          <button
            key={filterItem.value}
            type="button"

            onClick={() =>
              setFilter(
                filterItem.value
              )
            }

            className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition ${
              filter === filterItem.value
                ? 'bg-[#2DD4BF] text-[#071A1D]'
                : 'border border-[#164E4A] text-[#94A3B8] hover:text-parchment'
            }`}
          >

            {filterItem.label}

          </button>

        ))}

      </div>


      {/* ======================================================
          GALLERY GRID
      ====================================================== */}

      {visibleItems.length === 0 ? (

        <p className="py-16 text-center font-body text-sm text-[#94A3B8]">
          Nothing here yet.
        </p>

      ) : (

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

          {visibleItems.map((item) => (

            <button
              key={item.id}
              type="button"

              onClick={() =>
                setSelected(item)
              }

              className="group relative aspect-square overflow-hidden rounded-lg border border-panelLine bg-[#0D2929]"
            >

              {/* ==================================================
                  IMAGE / STORY PLACEHOLDER
              ================================================== */}

              {item.src ? (

                <img
                  src={item.src}
                  alt={item.caption}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />

              ) : item.storyData ? (

                <div className="flex h-full w-full flex-col items-center justify-center bg-[#0D2929] px-5 text-center">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2DD4BF]/40 text-xl text-[#2DD4BF]">
                    ▶
                  </div>

                  <p className="mt-4 font-display text-sm font-semibold text-[#F0FDFA]">
                    {item.caption}
                  </p>

                  <p className="mt-1 font-mono text-[9px] uppercase tracking-wide text-[#94A3B8]">
                    {item.storyData.scenes?.length || 0} panels · Click to watch
                  </p>

                </div>

              ) : (

                <img
                  src={item.src}
                  alt={item.caption}
                  className="h-full w-full object-cover"
                />

              )}


              {/* ==================================================
                  SOURCE BADGE
              ================================================== */}

              <span
                className={`absolute left-2 top-2 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                  item.source === 'ai'
                    ? 'bg-[#2DD4BF]/90 text-[#071A1D]'
                    : 'bg-[#071A1D]/80 text-[#2DD4BF]'
                }`}
              >

                {item.source === 'ai'
                  ? 'AI'
                  : 'Community'}

              </span>

            </button>

          ))}

        </div>

      )}


      {/* ======================================================
          PUBLISHED STORY VIEWER
      ====================================================== */}

      {selected?.storyData && (

        <StoryViewer
          story={selected.storyData}
          onClose={closeViewer}
        />

      )}


      {/* ======================================================
          COMMUNITY IMAGE LIGHTBOX
      ====================================================== */}

      {selected && !selected.storyData && (

        <div
          onClick={closeViewer}

          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6 backdrop-blur-sm"
        >

          <div
            onClick={(event) =>
              event.stopPropagation()
            }

            className="max-w-lg overflow-hidden rounded-lg border border-[#164E4A] bg-[#0D2929]"
          >

            <img
              src={selected.src}
              alt={selected.caption}
              className="w-full"
            />

            <div className="p-4">

              <p className="font-body text-sm text-parchment">
                {selected.caption}
              </p>

            </div>

          </div>

        </div>

      )}

    </section>

  )
}


// ============================================================
// STORY VIEWER
// ============================================================

function StoryViewer({
  story,
  onClose,
}) {

  const [currentScene, setCurrentScene] =
    useState(0)

  const [playing, setPlaying] =
    useState(false)


  const scenes =
    story.scenes || []


  const scene =
    scenes[currentScene]


  // ============================================================
  // CHARACTER CONSISTENCY
  // ============================================================

  const allCharacterNames =
    Array.from(
      new Set(
        scenes.flatMap(
          (sceneItem) =>
            parseCharacters(
              sceneItem.characters
            )
        )
      )
    )


  const names =
    parseCharacters(
      scene?.characters
    )


  const colors =
    names.map(
      (name) =>
        colorForCharacter(
          name,
          allCharacterNames
        )
    )


  // ============================================================
  // PLAYBACK
  // ============================================================

  useEffect(() => {

    if (!playing || scenes.length <= 1) {
      return
    }


    const timer =
      setInterval(() => {

        setCurrentScene(
          (previous) => {

            if (
              previous >=
              scenes.length - 1
            ) {

              setPlaying(false)

              return previous

            }

            return previous + 1

          }
        )

      }, 5000)


    return () =>
      clearInterval(timer)

  }, [
    playing,
    scenes.length,
  ])


  // ============================================================
  // KEYBOARD CONTROLS
  // ============================================================

  useEffect(() => {

    function handleKeyDown(event) {

      if (event.key === 'Escape') {

        onClose()

      }

      if (event.key === 'ArrowRight') {

        setCurrentScene(
          (previous) =>
            Math.min(
              previous + 1,
              scenes.length - 1
            )
        )

      }

      if (event.key === 'ArrowLeft') {

        setCurrentScene(
          (previous) =>
            Math.max(
              previous - 1,
              0
            )
        )

      }

    }


    window.addEventListener(
      'keydown',
      handleKeyDown
    )


    return () =>
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )

  }, [
    scenes.length,
    onClose,
  ])


  if (!scene) {
    return null
  }


  // ============================================================
  // NEXT
  // ============================================================

  function nextScene() {

    setCurrentScene(
      (previous) =>
        Math.min(
          previous + 1,
          scenes.length - 1
        )
    )

  }


  // ============================================================
  // PREVIOUS
  // ============================================================

  function previousScene() {

    setCurrentScene(
      (previous) =>
        Math.max(
          previous - 1,
          0
        )
    )

  }


  // ============================================================
  // TOGGLE PLAY
  // ============================================================

  function togglePlay() {

    if (
      currentScene >=
      scenes.length - 1
    ) {

      setCurrentScene(0)

      setPlaying(true)

      return

    }


    setPlaying(
      (previous) => !previous
    )

  }


  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"

      onClick={onClose}
    >

      <div
        className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[#164E4A] bg-[#071A1D] shadow-2xl"

        onClick={(event) =>
          event.stopPropagation()
        }
      >


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between border-b border-[#164E4A] px-5 py-4">

          <div className="min-w-0">

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2DD4BF]">
              Pearl Visual Story
            </p>

            <h2 className="mt-1 truncate font-display text-xl font-semibold text-[#F0FDFA]">
              {story.title}
            </h2>

          </div>


          <button
            type="button"
            onClick={onClose}

            className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#164E4A] text-[#94A3B8] transition hover:border-[#2DD4BF] hover:text-[#2DD4BF]"
          >

            <span className="text-xl leading-none">
              ×
            </span>

          </button>

        </div>


        {/* ==================================================
            STORY CONTENT
        ================================================== */}

        <div className="flex-1 overflow-y-auto">


          {/* PANEL */}

          <div className="relative flex min-h-[350px] items-center justify-center bg-[#0D2929] p-4 sm:min-h-[500px] sm:p-8">

            <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-[#164E4A]">

              {scene.imageUrl ? (

                <img
                  src={scene.imageUrl}
                  alt={scene.caption}
                  className="max-h-[60vh] w-full object-contain"
                />

              ) : (

                <div className="aspect-[4/3] w-full">

                  <PanelArt
                    artKey={
                      scene.artKey ||
                      'village'
                    }

                    colors={colors}
                  />

                </div>

              )}

            </div>


            {/* PANEL NUMBER */}

            <div className="absolute left-6 top-6 rounded-full bg-[#071A1D]/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-[#2DD4BF]">

              Panel {currentScene + 1} / {scenes.length}

            </div>

          </div>


          {/* ==================================================
              CAPTION
          ================================================== */}

          <div className="px-5 py-5 sm:px-8">

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]">
              Scene {currentScene + 1}
            </p>

            <p className="mt-2 font-display text-lg leading-relaxed text-[#F0FDFA]">
              {scene.caption}
            </p>

          </div>

        </div>


        {/* ==================================================
            PROGRESS DOTS
        ================================================== */}

        <div className="border-t border-[#164E4A] px-5 pt-4">

          <div className="flex justify-center gap-1.5">

            {scenes.map(
              (sceneItem, index) => (

                <button
                  key={sceneItem.id || index}
                  type="button"

                  onClick={() =>
                    setCurrentScene(index)
                  }

                  aria-label={`Go to panel ${index + 1}`}

                  className={`h-1.5 rounded-full transition-all ${
                    index === currentScene
                      ? 'w-8 bg-[#2DD4BF]'
                      : 'w-1.5 bg-[#164E4A] hover:bg-[#2DD4BF]/50'
                  }`}
                />

              )
            )}

          </div>

        </div>


        {/* ==================================================
            CONTROLS
        ================================================== */}

        <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-8">

          {/* PREVIOUS */}

          <button
            type="button"

            onClick={previousScene}

            disabled={
              currentScene === 0
            }

            className="rounded-md border border-[#164E4A] px-4 py-2 font-mono text-xs uppercase tracking-wide text-[#94A3B8] transition hover:border-[#2DD4BF] hover:text-[#2DD4BF] disabled:cursor-not-allowed disabled:opacity-30"
          >

            ← Previous

          </button>


          {/* PLAY */}

          <button
            type="button"

            onClick={togglePlay}

            className="flex items-center gap-2 rounded-md bg-[#2DD4BF] px-5 py-2.5 font-body text-sm font-semibold text-[#071A1D] transition hover:bg-[#2DD4BF]/90"
          >

            {playing ? (
              <>
                <span>Ⅱ</span>
                Pause
              </>
            ) : (
              <>
                <span>▶</span>
                Play story
              </>
            )}

          </button>


          {/* NEXT */}

          <button
            type="button"

            onClick={nextScene}

            disabled={
              currentScene >=
              scenes.length - 1
            }

            className="rounded-md border border-[#164E4A] px-4 py-2 font-mono text-xs uppercase tracking-wide text-[#94A3B8] transition hover:border-[#2DD4BF] hover:text-[#2DD4BF] disabled:cursor-not-allowed disabled:opacity-30"
          >

            Next →

          </button>

        </div>


        {/* ==================================================
            STORY INFO
        ================================================== */}

        <div className="border-t border-[#164E4A] px-5 py-3 sm:px-8">

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-[9px] uppercase tracking-wide text-[#64748B]">

            <span>
              {story.category}
            </span>

            <span>
              {story.tone}
            </span>

            <span>
              {story.language}
            </span>

            <span>
              {story.audience}
            </span>

          </div>

        </div>

      </div>

    </div>

  )

}