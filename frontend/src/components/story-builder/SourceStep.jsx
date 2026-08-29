import { useRef, useState } from 'react'
import { IconType, IconUpload, IconMic, IconSquare, IconFile } from './Icons.jsx'
import { useVoiceRecorder } from './useVoiceRecorder.js'

const CATEGORIES = ['Public Health Awareness', 'Mental Health', 'Reproductive Health', 'Nutrition', 'Environmental Health', 'Other']
const TONES = ['Hopeful', 'Urgent', 'Reflective', 'Playful']
const TEXT_READABLE = ['text/plain', 'text/markdown']

function formatSeconds(total) {
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function SourceStep({ data, update, onVerify }) {
  const [inputMethod, setInputMethod] = useState('type')
  const [fileError, setFileError] = useState('')
  const fileInputRef = useRef(null)
  const recorder = useVoiceRecorder()

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileError('')

    if (TEXT_READABLE.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader()
      reader.onload = () => update({ sourceText: String(reader.result), fileName: file.name })
      reader.onerror = () => setFileError('Could not read that file.')
      reader.readAsText(file)
    } else {
      // PDFs, docx, images: no client-side parser here. Store the name and
      // flag it clearly — a real document-extraction endpoint (OCR / PDF
      // text extraction) should populate sourceText from this file server-side.
      update({ fileName: file.name, sourceText: data.sourceText })
      setFileError(`"${file.name}" attached — text extraction for this file type happens server-side once that endpoint exists. Paste the text manually for now if you want to continue in this prototype.`)
    }
  }

  const canVerify = data.title.trim().length > 0 && data.sourceText.trim().length > 20

  return (
    <div className="rounded-lg border border-panelLine bg-panel p-6">
      <label className="block font-body text-sm font-medium text-parchment">Story title</label>
      <input
        value={data.title}
        onChange={(e) => update({ title: e.target.value })}
        placeholder="e.g. Malaria Fighters"
        className="mt-2 w-full rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment placeholder:text-sienna/60 focus:border-amber focus:outline-none"
      />

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-sm font-medium text-parchment">Category</label>
          <select
            value={data.category}
            onChange={(e) => update({ category: e.target.value })}
            className="mt-2 w-full rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment focus:border-amber focus:outline-none"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-parchment">Tone</label>
          <select
            value={data.tone}
            onChange={(e) => update({ tone: e.target.value })}
            className="mt-2 w-full rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment focus:border-amber focus:outline-none"
          >
            {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-7">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber">Source material</p>
        <p className="mt-1 font-body text-xs text-sienna">
          The document facts will be extracted from. Type it, upload a file, or record a voice note.
        </p>

        <div className="mt-3 inline-flex rounded-md border border-panelLine p-0.5">
          {[
            { id: 'type', label: 'Type', icon: IconType },
            { id: 'upload', label: 'Upload', icon: IconUpload },
            { id: 'record', label: 'Record', icon: IconMic },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setInputMethod(id)}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 font-body text-xs font-medium transition ${
                inputMethod === id ? 'bg-amber text-ink' : 'text-sienna hover:text-parchment'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {inputMethod === 'type' && (
          <textarea
            value={data.sourceText}
            onChange={(e) => update({ sourceText: e.target.value })}
            placeholder="Paste or type the source information here…"
            rows={8}
            className="mt-3 w-full resize-none rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment placeholder:text-sienna/60 focus:border-amber focus:outline-none"
          />
        )}

        {inputMethod === 'upload' && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-panelLine py-8 font-body text-sm text-sienna transition hover:border-amber/50 hover:text-amber"
            >
              <IconUpload size={16} />
              {data.fileName ? `Replace "${data.fileName}"` : 'Choose a file (.txt, .md, .pdf, .docx)'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf,.docx"
              onChange={handleFile}
              className="hidden"
            />
            {data.fileName && (
              <div className="mt-2 flex items-center gap-2 font-mono text-xs text-sienna">
                <IconFile size={13} /> {data.fileName}
              </div>
            )}
            {fileError && <p className="mt-2 font-body text-xs text-clay">{fileError}</p>}
            {data.sourceText && (
              <textarea
                value={data.sourceText}
                onChange={(e) => update({ sourceText: e.target.value })}
                rows={6}
                className="mt-3 w-full resize-none rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment focus:border-amber focus:outline-none"
              />
            )}
          </div>
        )}

        {inputMethod === 'record' && (
          <div className="mt-3 rounded-lg border border-panelLine p-5">
            <div className="flex items-center gap-4">
              {!recorder.recording ? (
                <button
                  type="button"
                  onClick={recorder.start}
                  className="flex items-center gap-2 rounded-full bg-clay px-4 py-2 font-body text-sm font-semibold text-ink transition hover:bg-clay/90"
                >
                  <IconMic size={15} /> Start recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={recorder.stop}
                  className="flex items-center gap-2 rounded-full bg-amber px-4 py-2 font-body text-sm font-semibold text-ink transition hover:bg-amber/90"
                >
                  <IconSquare size={15} /> Stop ({formatSeconds(recorder.seconds)})
                </button>
              )}
              {recorder.recording && (
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-clay" aria-hidden="true" />
              )}
            </div>

            {recorder.error && <p className="mt-3 font-body text-xs text-clay">{recorder.error}</p>}

            {recorder.audioUrl && (
              <div className="mt-4 space-y-3">
                <audio controls src={recorder.audioUrl} className="w-full" />
                <div>
                  <label className="block font-body text-xs font-medium text-parchment">
                    Transcript
                  </label>
                  <p className="mt-0.5 font-body text-[11px] text-sienna">
                    Speech-to-text isn't connected in this prototype — type what you said so the
                    pipeline has text to work with. (Swap this for real ASR, e.g. Whisper, later.)
                  </p>
                  <textarea
                    value={data.sourceText}
                    onChange={(e) => update({ sourceText: e.target.value })}
                    rows={5}
                    placeholder="Type the transcript of your recording…"
                    className="mt-2 w-full resize-none rounded-md border border-panelLine bg-ink px-3 py-2 font-body text-sm text-parchment placeholder:text-sienna/60 focus:border-amber focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-7 flex items-center gap-4">
        <button
          type="button"
          disabled={!canVerify}
          onClick={onVerify}
          className="rounded-md bg-amber px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Extract key facts →
        </button>
        {!canVerify && (
          <span className="font-body text-xs text-sienna">Add a title and at least a couple of sentences of source text.</span>
        )}
      </div>
    </div>
  )
}
