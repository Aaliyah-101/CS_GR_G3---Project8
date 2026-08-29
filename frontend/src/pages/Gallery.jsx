import { useRef, useState } from 'react'
import ebola from '../images/ebola.png'
import netcover from '../images/netcover.png'
import maternal from '../images/maternal.png'
import nutrition from '../images/nutrition.png'
import traditional from '../images/traditional.png'
import underthenet from '../assets/images/underthenet.png'


// Seed data representing AI-generated media already in the system.
// Swap this for a fetch to your backend once it exists.
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
  }
]

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'AI Generated', value: 'ai' },
  { label: 'Community Uploads', value: 'community' },
  { label: 'For You', value: 'foryou' },
  { label: 'Folklore', value: 'folklore' },
]

let nextId = 1

export default function Gallery() {
  const [items, setItems] = useState(seedItems)
  const [filter, setFilter] = useState('all')
  const [dragActive, setDragActive] = useState(false)
  const [selected, setSelected] = useState(null) // item shown in the lightbox
  const fileInputRef = useRef(null)

  const visibleItems =
    filter === 'all' ? items : items.filter((it) => it.source === filter)

  function addFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    const newItems = files.map((file) => ({
      id: `u${nextId++}`,
      src: URL.createObjectURL(file),
      source: 'community',
      caption: file.name.replace(/\.[^/.]+$/, ''),
      story: null,
    }))
    setItems((prev) => [...newItems, ...prev])
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">
          Share & Discover
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Media from Pearl Visual stories
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-[#94A3B8]">
          Browse visuals generated for published stories, or share your own
          photos for the community to draw on.
        </p>
      </div>

      {/* Upload dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-10 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition ${
          dragActive ? 'border-[#2DD4BF] bg-[#2DD4BF]/5' : 'border-[#164E4A] hover:border-[#2DD4BF]/40'
        }`}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#2DD4BF]">
          <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-3 font-body text-sm text-[#F0FDFA]">
          Drag photos here, or click to upload
        </p>
        <p className="mt-1 font-mono text-xs text-[#94A3B8]">PNG, JPG — shared to the community gallery</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files?.length && addFiles(e.target.files)}
        />
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition ${
              filter === f.value
                ? 'bg-[#2DD4BF] text-[#071A1D]'
                : 'border border-[#164E4A] text-[#94A3B8] hover:text-parchment'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {visibleItems.length === 0 ? (
        <p className="py-16 text-center font-body text-sm text-[#94A3B8]">
          Nothing here yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="group relative aspect-square overflow-hidden rounded-lg border border-panelLine"
            >
              <img
                src={item.src}
                alt={item.caption}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span
                className={`absolute left-2 top-2 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                  item.source === 'ai' ? 'bg-[#2DD4BF]/80 text-[#071A1D]' : 'bg-[#071A1D]/80 text-[#2DD4BF]'
                }`}
              >
                {item.source === 'ai' ? 'AI' : 'Community'}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg overflow-hidden rounded-lg border border-[#164E4A] bg-[#0D2929]"
          >
            <img src={selected.src} alt={selected.caption} className="w-full" />
            <div className="p-4">
              <p className="font-body text-sm text-parchment">{selected.caption}</p>
              {selected.story && (
                <p className="mt-1 font-mono text-xs text-sienna">
                  From: {selected.story}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
