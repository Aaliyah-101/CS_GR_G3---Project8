import { useEffect, useRef, useState } from 'react'
import api from '../apis/api'
import { API_BASE_URL, resolveImageUrl } from '../apis/api'
import ebola from '../images/ebola.png'
import netcover from '../images/netcover.png'
import maternal from '../images/maternal.png'
import nutrition from '../images/nutrition.png'
import traditional from '../images/traditional.png'
import underthenet from '../assets/images/underthenet.png'

import PanelArt from '../components/story-builder/PanelArt.jsx'
import { colorForCharacter } from '../components/story-builder/storyEngine.js'


// SEED / DEMO MEDIA

const seedItems = [
  { id: 'a1', src: ebola, source: 'community', caption: 'Fighting Ebola in the community' },
  { id: 'a2', src: netcover, source: 'community', caption: 'Sleeping under the net' },
  { id: 'a3', src: maternal, source: 'community', caption: 'Maternal health' },
  { id: 'a4', src: nutrition, source: 'foryou', caption: 'Nutrition is important' },
  { id: 'a5', src: traditional, source: 'folklore', caption: 'Traditional Practices' },
  { id: 'a6', src: underthenet, source: 'community', caption: 'Sleep Under the Net' },
]

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'AI Generated', value: 'ai' },
  { label: 'Community Uploads', value: 'community' },
  { label: 'For You', value: 'foryou' },
  { label: 'Folklore', value: 'folklore' },
]

let nextId = 1

// HELPERS

function parseCharacters(value) {
  if (Array.isArray(value)) return value
  return String(value || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
}

function slugify(value) {
  return String(value || 'story')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function pickSupportedMime() {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return null
  }
  const candidates = [
    { mime: 'video/mp4;codecs=h264', ext: 'mp4' },
    { mime: 'video/mp4', ext: 'mp4' },
    { mime: 'video/webm;codecs=vp9', ext: 'webm' },
    { mime: 'video/webm;codecs=vp8', ext: 'webm' },
    { mime: 'video/webm', ext: 'webm' },
  ]
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c.mime)) return c
  }
  return null
}

/**
 * Load an image safely by first fetching it as a Blob.
 * Avoids CORS / canvas-taint issues entirely.
 */
async function loadImage(src) {
  const response = await fetch(src, { mode: 'cors' })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${src}`)
  }
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ img, objectUrl })
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error(`Failed to decode ${src}`))
    }
    img.src = objectUrl
  })
}

function drawPanelArtFallback(ctx, w, h, label) {
  ctx.fillStyle = '#0D2929'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#2DD4BF'
  ctx.font = 'bold 42px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label || 'Panel', w / 2, h / 2)
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = String(text).split(/\s+/)
  let line = ''
  let lines = 0
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y)
      line = words[n] + ' '
      y += lineHeight
      lines++
      if (maxLines && lines >= maxLines - 1) {
        const remaining = words.slice(n).join(' ')
        let truncated = remaining
        while (
          ctx.measureText(truncated + '…').width > maxWidth &&
          truncated.length > 1
        ) {
          truncated = truncated.slice(0, -2)
        }
        ctx.fillText(truncated + '…', x, y)
        return
      }
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, y)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function exportStoryJson(story) {
  const payload = {
    title: story.title,
    category: story.category,
    tone: story.tone,
    language: story.language,
    audience: story.audience,
    exportedAt: new Date().toISOString(),
    scenes: (story.scenes || []).map((scene, index) => ({
      index: index + 1,
      caption: scene.caption,
      characters: parseCharacters(scene.characters),
      artKey: scene.artKey || null,
      imageUrl: scene.imageUrl ? resolveImageUrl(scene.imageUrl) : null,
    })),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  downloadBlob(blob, `${slugify(story.title)}.json`)
}
 
// RECORD STORY TO VIDEO
// RECORD STORY TO VIDEO — cinematic edition

async function recordStoryToVideo(story, opts = {}) {
  const {
    secondsPerScene = 5,
    transitionMs = 500,     // fade between scenes
    onProgress,
  } = opts

  const support = pickSupportedMime()
  if (!support) {
    throw new Error('Video recording is not supported in this browser.')
  }

  const scenes = story.scenes || []
  if (!scenes.length) throw new Error('Story has no scenes to export.')

  const W = 1280
  const H = 720
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const stream = canvas.captureStream(30)
  const recorder = new MediaRecorder(stream, {
    mimeType: support.mime,
    videoBitsPerSecond: 5_000_000,
  })

  const chunks = []
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data)
  }
  const stopped = new Promise((resolve) => {
    recorder.onstop = resolve
  })
  recorder.start()

  //  Preload images 
  const loadedEntries = await Promise.all(
    scenes.map(async (scene) => {
      if (!scene.imageUrl) return null
      const url = resolveImageUrl(scene.imageUrl)
      if (!url) return null
      try {
        return await loadImage(url)
      } catch (err) {
        console.warn('[export] image failed to load:', url, err)
        return null
      }
    })
  )
  const images = loadedEntries.map((e) => (e ? e.img : null))
  const objectUrls = loadedEntries.filter(Boolean).map((e) => e.objectUrl)

  // Layout constants
  const CAPTION_BAR_H = 180
  const IMAGE_AREA_H = H - CAPTION_BAR_H
  const IMAGE_PADDING = 32
  const PANEL_W = W - IMAGE_PADDING * 2
  const PANEL_H = IMAGE_AREA_H - IMAGE_PADDING * 2

  const frameDelay = 1000 / 30

  // Helper — draw a single frame for scene i at local time t 
  // t = milliseconds into this scene (0 .. sceneDuration)
  // prevImg = image of previous scene (for fade-in overlay), may be null
  function drawFrame(i, t, prevImg) {
    const scene = scenes[i]
    const sceneDuration = secondsPerScene * 1000
    const img = images[i]

    // Fade in from black (or from prev scene)
    const fadeIn = Math.min(1, t / transitionMs)
    const fadeOut = Math.min(1, (sceneDuration - t) / transitionMs)
    const sceneAlpha = Math.min(fadeIn, fadeOut)

    // Background
    ctx.fillStyle = '#071A1D'
    ctx.fillRect(0, 0, W, H)

    //Image area 
    ctx.save()
    ctx.beginPath()
    ctx.rect(
      IMAGE_PADDING,
      IMAGE_PADDING,
      PANEL_W,
      PANEL_H
    )
    ctx.clip()

    // Subtle zoom (Ken Burns) across the scene
    const zoomT = t / sceneDuration // 0..1
    const zoom = 1 + 0.04 * zoomT // 1.00 -> 1.04

    // Fade previous scene out behind (crossfade feel)
    if (prevImg && t < transitionMs && i > 0) {
      ctx.globalAlpha = 1 - fadeIn
      drawImageContained(
        ctx,
        prevImg,
        IMAGE_PADDING,
        IMAGE_PADDING,
        PANEL_W,
        PANEL_H,
        1 + 0.04 // prev zoom fixed
      )
    }

    ctx.globalAlpha = sceneAlpha

    if (img && img.complete && img.naturalWidth > 0) {
      drawImageContained(
        ctx,
        img,
        IMAGE_PADDING,
        IMAGE_PADDING,
        PANEL_W,
        PANEL_H,
        zoom
      )
    } else {
      drawPanelArtFallback(
        ctx,
        PANEL_W,
        PANEL_H,
        `Panel ${i + 1} — image unavailable`
      )
    }

    // Dark gradient at bottom of image so caption flows nicely
    const grad = ctx.createLinearGradient(
      0,
      IMAGE_PADDING + PANEL_H * 0.55,
      0,
      IMAGE_PADDING + PANEL_H
    )
    grad.addColorStop(0, 'rgba(7,26,29,0)')
    grad.addColorStop(1, 'rgba(7,26,29,0.55)')
    ctx.globalAlpha = sceneAlpha
    ctx.fillStyle = grad
    ctx.fillRect(
      IMAGE_PADDING,
      IMAGE_PADDING,
      PANEL_W,
      PANEL_H
    )

    ctx.restore()

    //Scene number chip (top-left of image)
    ctx.globalAlpha = sceneAlpha
    const chipText = `PANEL ${i + 1} / ${scenes.length}`
    ctx.font = 'bold 14px monospace'
    const chipW = ctx.measureText(chipText).width + 28
    const chipH = 32
    const chipX = IMAGE_PADDING + 20
    const chipY = IMAGE_PADDING + 20
    roundRect(ctx, chipX, chipY, chipW, chipH, 16)
    ctx.fillStyle = 'rgba(7,26,29,0.85)'
    ctx.fill()
    ctx.fillStyle = '#2DD4BF'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(chipText, chipX + 14, chipY + chipH / 2 + 1)

    // Caption bar 
    const barY = H - CAPTION_BAR_H
    ctx.globalAlpha = 1
    ctx.fillStyle = '#0D2929'
    ctx.fillRect(0, barY, W, CAPTION_BAR_H)

    // Accent strip on the left
    ctx.fillStyle = '#2DD4BF'
    ctx.fillRect(0, barY, 6, CAPTION_BAR_H)

    // Story title (small, above caption) — always visible
    ctx.fillStyle = '#94A3B8'
    ctx.font = 'bold 13px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(
      String(story.title || '').toUpperCase().slice(0, 70),
      40,
      barY + 20
    )

    // Caption text — animated reveal
    ctx.fillStyle = '#F0FDFA'
    ctx.font = 'bold 30px sans-serif'
    const caption = String(scene.caption || '')
    // Type-on effect: reveal progressively over first 700ms of the scene
    const revealT = Math.min(1, t / 700)
    const revealChars = Math.floor(caption.length * revealT)
    const visibleCaption = caption.slice(0, revealChars)

    wrapText(
      ctx,
      visibleCaption,
      40,
      barY + 46,
      W - 80,
      38,
      2
    )

    // Overall progress bar
    const totalDuration = scenes.length * secondsPerScene * 1000
    // Compute absolute progress from scene index + t
    const absoluteT = i * secondsPerScene * 1000 + t
    const prog = Math.min(1, absoluteT / totalDuration)
    ctx.fillStyle = '#164E4A'
    ctx.fillRect(0, H - 4, W, 4)
    ctx.fillStyle = '#2DD4BF'
    ctx.fillRect(0, H - 4, W * prog, 4)

    // Scene tick marks
    ctx.fillStyle = 'rgba(45,212,191,0.35)'
    for (let k = 1; k < scenes.length; k++) {
      const x = (k / scenes.length) * W
      ctx.fillRect(x - 1, H - 4, 2, 4)
    }
  }

  // Main loop
  const totalDuration = scenes.length * secondsPerScene * 1000
  const startTime = performance.now()

  try {
    for (let i = 0; i < scenes.length; i++) {
      const sceneStart = performance.now()
      const sceneDuration = secondsPerScene * 1000
      const prevImg = i > 0 ? images[i - 1] : null

      while (performance.now() - sceneStart < sceneDuration) {
        const t = performance.now() - sceneStart
        drawFrame(i, t, prevImg)

        if (onProgress) {
          const absoluteT = i * secondsPerScene * 1000 + t
          onProgress(Math.min(1, absoluteT / totalDuration))
        }

        await new Promise((r) => setTimeout(r, frameDelay))
      }
    }

    // Hold the final frame for a moment
    await new Promise((r) => setTimeout(r, 300))
    recorder.stop()
    await stopped
  } finally {
    objectUrls.forEach((u) => URL.revokeObjectURL(u))
  }

  const blob = new Blob(chunks, { type: support.mime })
  return { blob, ext: support.ext }
}

// Helpers used by the video renderer

function drawImageContained(ctx, img, x, y, w, h, zoom = 1) {
  const scale = Math.min(w / img.width, h / img.height) * zoom
  const drawW = img.width * scale
  const drawH = img.height * scale
  const dx = x + (w - drawW) / 2
  const dy = y + (h - drawH) / 2
  ctx.drawImage(img, dx, dy, drawW, drawH)
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// GALLERY

export default function Gallery() {
  const [items, setItems] = useState(seedItems)
  const [filter, setFilter] = useState('all')
  const [dragActive, setDragActive] = useState(false)
  const [selected, setSelected] = useState(null)
  const [loadingStories, setLoadingStories] = useState(true)
  const [storyError, setStoryError] = useState(null)
  const fileInputRef = useRef(null)

  // refreshKey triggers refetches (on focus, visibility change, manual click)
  const [refreshKey, setRefreshKey] = useState(0)

  // Load published stories (re-runs whenever refreshKey changes) ----
  useEffect(() => {
    let cancelled = false

    async function fetchPublishedStories() {
      try {
        setLoadingStories(true)
        setStoryError(null)

        // cache-bust so Render/CDN never serves stale data
        const response = await api.get(`/api/story/stories?t=${Date.now()}`)
        const stories = response.data?.stories || []

        console.log('Published stories received:', stories)

        const storyItems = stories.map((story) => {
          const firstScene = story.scenes?.[0]
          return {
            id: `story-${story.id}`,
            src: resolveImageUrl(firstScene?.imageUrl) || null,
            source: 'ai',
            caption: story.title,
            storyData: story,
          }
        })

        if (!cancelled) {
          setItems([...storyItems, ...seedItems])
        }
      } catch (error) {
        console.error('Failed to load published stories:', error)
        if (!cancelled) {
          setStoryError('Could not load published stories.')
          setItems(seedItems)
        }
      } finally {
        if (!cancelled) setLoadingStories(false)
      }
    }

    fetchPublishedStories()
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  // Refetch when tab regains focus / visibility
  useEffect(() => {
    function onFocus() {
      setRefreshKey((k) => k + 1)
    }
    function onVisibility() {
      if (document.visibilityState === 'visible') {
        setRefreshKey((k) => k + 1)
      }
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const visibleItems =
    filter === 'all' ? items : items.filter((item) => item.source === filter)

  function addFiles(fileList) {
    const files = Array.from(fileList).filter((file) =>
      file.type.startsWith('image/')
    )
    const newItems = files.map((file) => ({
      id: `u${nextId++}`,
      src: URL.createObjectURL(file),
      source: 'community',
      caption: file.name.replace(/\.[^/.]+$/, ''),
    }))
    setItems((previous) => [...newItems, ...previous])
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragActive(false)
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files)
    }
  }

  function closeViewer() {
    setSelected(null)
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {/* HEADER */}
      <div className="mb-8">
        <p className="eyebrow text-[#2B7A4B]">Share & Discover</p>
        <h1 className="mt-3 section-heading text-slate-900">
          Media from <span className="gradient-text">Pearl Visual</span> stories
        </h1>
        <p className="mt-4 max-w-xl text-base text-slate-600">
          Browse visuals generated for published stories or share your own
          photos for the community to draw on.
        </p>
      </div>

      {/* UPLOAD DROPZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`glass-panel mb-10 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center transition ${
          dragActive
            ? 'border-[#2B7A4B]/60 bg-[#F0FAF3] shadow-glow'
            : 'border-slate-200 hover:border-[#F5C400]'
        }`}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="text-[#2B7A4B]"
        >
          <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-4 text-lg font-semibold text-slate-900">
          Drag photos here, or click to upload
        </p>
        <p className="mt-2 text-sm text-slate-600">
          PNG, JPG — shared to the community gallery
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files)
          }}
        />
      </div>

      {/* BACKEND STATUS */}
      {loadingStories && (
        <div className="mb-6 rounded-lg border border-[#164E4A] bg-[#0D2929] px-4 py-3">
          <p className="font-mono text-xs text-[#94A3B8]">
            Loading published stories...
          </p>
        </div>
      )}
      {storyError && (
        <div className="mb-6 rounded-lg border border-[#164E4A] bg-[#0D2929] px-4 py-3">
          <p className="font-mono text-xs text-[#94A3B8]">{storyError}</p>
        </div>
      )}

      {/* FILTERS + REFRESH */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((filterItem) => (
          <button
            key={filterItem.value}
            onClick={() => setFilter(filterItem.value)}
            className={`rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] transition ${
              filter === filterItem.value
                ? 'bg-gradient-to-r from-[#F5C400] to-[#2B7A4B] text-slate-950 shadow-glow'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#F5C400] hover:text-[#2B7A4B]'
            }`}
          >
            {filterItem.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setRefreshKey((k) => k + 1)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-600 hover:border-[#2B7A4B] hover:text-[#2B7A4B]"
        >
          ↻ Refresh
        </button>
      </div>

      {/* GRID */}
      {visibleItems.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-600">
          Nothing here yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="group relative flex aspect-square flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition-shadow hover:shadow-lg"
            >
              <div className="relative flex-1 overflow-hidden bg-slate-900">
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                ) : item.storyData ? (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-[#0D2929] px-5 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2DD4BF]/40 text-xl text-[#2DD4BF]">
                      ▶
                    </div>
                    <p className="mt-3 font-mono text-[9px] uppercase tracking-wide text-[#94A3B8]">
                      {item.storyData.scenes?.length || 0} panels
                    </p>
                  </div>
                ) : null}

                {/* STRONG FOREGROUND GRADIENT */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                {/* EXTRA HOVER DARKENING */}
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

                {/* SOURCE BADGE */}
                <span
                  className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-md backdrop-blur-sm ${
                    item.source === 'ai'
                      ? 'bg-[#2B7A4B]/95 text-white'
                      : 'bg-[#F5C400]/95 text-slate-950'
                  }`}
                >
                  {item.source === 'ai' ? 'AI' : 'Community'}
                </span>

                {/* TITLE OVERLAY (bottom of the image) */}
                <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-6">
                  <p
                    className="overflow-hidden font-display text-[13px] font-semibold uppercase tracking-wide leading-tight text-white drop-shadow-md"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                    title={item.caption}
                  >
                    {item.caption}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* VIEWER */}
      {selected &&
        (selected.storyData ? (
          <StoryViewer story={selected.storyData} onClose={closeViewer} />
        ) : (
          <div
            onClick={closeViewer}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft"
            >
              <img src={selected.src} alt={selected.caption} className="w-full" />
              <div className="p-4">
                <p className="font-body text-sm text-slate-700">
                  {selected.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
    </section>
  )
}

// STORY VIEWER
function StoryViewer({ story, onClose }) {
  const [currentScene, setCurrentScene] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportError, setExportError] = useState(null)

  const scenes = story.scenes || []
  const scene = scenes[currentScene]

  const allCharacterNames = Array.from(
    new Set(scenes.flatMap((s) => parseCharacters(s.characters)))
  )
  const names = parseCharacters(scene?.characters)
  const colors = names.map((name) => colorForCharacter(name, allCharacterNames))

  // Auto-advance
  useEffect(() => {
    if (!playing || scenes.length <= 1) return
    const timer = setInterval(() => {
      setCurrentScene((prev) => {
        if (prev >= scenes.length - 1) {
          setPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [playing, scenes.length])

  // Keyboard
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight')
        setCurrentScene((p) => Math.min(p + 1, scenes.length - 1))
      if (e.key === 'ArrowLeft')
        setCurrentScene((p) => Math.max(p - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scenes.length, onClose])

  if (!scene) return null

  function nextScene() {
    setCurrentScene((p) => Math.min(p + 1, scenes.length - 1))
  }
  function previousScene() {
    setCurrentScene((p) => Math.max(p - 1, 0))
  }
  function togglePlay() {
    if (currentScene >= scenes.length - 1) {
      setCurrentScene(0)
      setPlaying(true)
      return
    }
    setPlaying((p) => !p)
  }

  async function handleExportVideo() {
    try {
      setExportError(null)
      setExporting(true)
      setExportProgress(0)

      const { blob, ext } = await recordStoryToVideo(story, {
        secondsPerScene: 4,
        onProgress: setExportProgress,
      })

      downloadBlob(blob, `${slugify(story.title)}.${ext}`)
    } catch (err) {
      console.error('Video export failed:', err)
      setExportError(err.message || 'Video export failed.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md sm:p-8"
      onClick={onClose}
    >
      <div
        className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[#164E4A] bg-[#071A1D] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#164E4A] px-5 py-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2DD4BF]">
              Pearl Visual Story
            </p>
            <h2 className="mt-1 truncate font-display text-xl font-semibold text-[#F0FDFA]">
              {story.title}
            </h2>
          </div>

          <div className="ml-4 flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => exportStoryJson(story)}
              className="hidden h-9 items-center gap-2 rounded-full border border-[#164E4A] px-3 font-mono text-[10px] uppercase tracking-wide text-[#94A3B8] transition hover:border-[#2DD4BF] hover:text-[#2DD4BF] sm:flex"
              title="Download story data as JSON"
            >
              ⬇ JSON
            </button>

            <button
              type="button"
              onClick={handleExportVideo}
              disabled={exporting}
              className="flex h-9 items-center gap-2 rounded-full border border-[#2DD4BF]/50 bg-[#2DD4BF]/10 px-3 font-mono text-[10px] uppercase tracking-wide text-[#2DD4BF] transition hover:bg-[#2DD4BF]/20 disabled:cursor-wait disabled:opacity-60"
              title="Export story as video"
            >
              {exporting ? (
                <>⏺ {Math.round(exportProgress * 100)}%</>
              ) : (
                <>⬇ Video</>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#164E4A] text-[#94A3B8] transition hover:border-[#2DD4BF] hover:text-[#2DD4BF]"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>
        </div>

        {/* Export status */}
        {exporting && (
          <div className="border-b border-[#164E4A] bg-[#0D2929] px-5 py-2">
            <div className="flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#164E4A]">
                <div
                  className="h-full bg-[#2DD4BF] transition-all"
                  style={{ width: `${Math.round(exportProgress * 100)}%` }}
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wide text-[#94A3B8]">
                Recording {Math.round(exportProgress * 100)}%
              </span>
            </div>
          </div>
        )}
        {exportError && (
          <div className="border-b border-red-500/30 bg-red-500/10 px-5 py-2">
            <p className="font-mono text-[10px] text-red-300">{exportError}</p>
          </div>
        )}

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="relative flex items-center justify-center bg-[#0D2929] p-4 sm:p-6">
            <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-[#164E4A] bg-black">
              <div className="relative flex aspect-[4/3] items-center justify-center">
                {scene.imageUrl ? (
                  <img
                    src={resolveImageUrl(scene.imageUrl)}
                    alt={scene.caption}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full">
                    <PanelArt artKey={scene.artKey || 'village'} colors={colors} />
                  </div>
                )}
              </div>
            </div>

            <div className="absolute left-6 top-6 rounded-full bg-[#071A1D]/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-[#2DD4BF]">
              Panel {currentScene + 1} / {scenes.length}
            </div>
          </div>

          <div className="border-t border-[#164E4A] px-5 py-4 sm:px-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]">
              Scene {currentScene + 1}
            </p>
            <p className="mt-2 font-display text-base leading-relaxed text-[#F0FDFA] sm:text-lg">
              {scene.caption}
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-[#164E4A] px-5 py-4 sm:px-8">
          <div className="flex justify-center gap-1.5">
            {scenes.map((s, index) => (
              <button
                key={s.id || index}
                type="button"
                onClick={() => setCurrentScene(index)}
                aria-label={`Go to panel ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentScene
                    ? 'w-8 bg-[#2DD4BF]'
                    : 'w-1.5 bg-[#164E4A] hover:bg-[#2DD4BF]/50'
                }`}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={previousScene}
              disabled={currentScene === 0}
              className="rounded-md border border-[#164E4A] px-4 py-2 font-mono text-xs uppercase tracking-wide text-[#94A3B8] transition hover:border-[#2DD4BF] hover:text-[#2DD4BF] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← Previous
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center gap-2 rounded-md bg-[#2DD4BF] px-5 py-2.5 font-body text-sm font-semibold text-[#071A1D] transition hover:bg-[#2DD4BF]/90"
            >
              {playing ? (
                <>
                  <span>Ⅱ</span> Pause
                </>
              ) : (
                <>
                  <span>▶</span> Play story
                </>
              )}
            </button>

            <button
              type="button"
              onClick={nextScene}
              disabled={currentScene >= scenes.length - 1}
              className="rounded-md border border-[#164E4A] px-4 py-2 font-mono text-xs uppercase tracking-wide text-[#94A3B8] transition hover:border-[#2DD4BF] hover:text-[#2DD4BF] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next →
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-[9px] uppercase tracking-wide text-[#64748B]">
            <span>{story.category}</span>
            <span>{story.tone}</span>
            <span>{story.language}</span>
            <span>{story.audience}</span>
          </div>
        </div>
      </div>
    </div>
  )
}