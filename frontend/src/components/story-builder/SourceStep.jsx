import { useRef, useState } from 'react'
import {
  IconType,
  IconUpload,
  IconMic,
  IconSquare,
  IconFile
} from './Icons.jsx'

import { useVoiceRecorder } from './useVoiceRecorder.js'


const CATEGORIES = [
  'Public Health Awareness',
  'Mental Health',
  'Reproductive Health',
  'Nutrition',
  'Environmental Health',
  'Other'
]

const TONES = [
  'Hopeful',
  'Urgent',
  'Reflective',
  'Playful'
]

const TEXT_READABLE = [
  'text/plain',
  'text/markdown'
]


function formatSeconds(total) {
  const m = String(
    Math.floor(total / 60)
  ).padStart(2, '0')

  const s = String(
    total % 60
  ).padStart(2, '0')

  return `${m}:${s}`
}


export default function SourceStep({
  data,
  update,
  onVerify,
  isLoading,
  generationError,
}) {

  const [inputMethod, setInputMethod] = useState('type')

  const [fileError, setFileError] = useState('')

  const fileInputRef = useRef(null)

  const recorder = useVoiceRecorder()


  // --------------------------------
  // File handling
  // --------------------------------

  function handleFile(e) {

    const file = e.target.files?.[0]

    if (!file) return

    setFileError('')


    if (
      TEXT_READABLE.includes(file.type) ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md')
    ) {

      const reader = new FileReader()


      reader.onload = () => {

        update({
          sourceText: String(reader.result),
          fileName: file.name,
        })

      }


      reader.onerror = () => {

        setFileError(
          'Could not read that file.'
        )

      }


      reader.readAsText(file)

    } else {

      // PDFs, docx, images:
      // no client-side parser here.

      update({
        fileName: file.name,
        sourceText: data.sourceText
      })

      setFileError(
        `"${file.name}" attached — text extraction for this file type happens server-side once that endpoint exists. Paste the text manually for now if you want to continue in this prototype.`
      )
    }
  }


  // --------------------------------
  // Validation
  // --------------------------------

  const canVerify =
    data.title.trim().length > 0 &&
    data.sourceText.trim().length > 20


  return (

    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">


      {/* -------------------------------- */}
      {/* Story title */}
      {/* -------------------------------- */}

      <label className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">
        Story title
      </label>

      <input
        value={data.title}
        onChange={(e) =>
          update({
            title: e.target.value
          })
        }
        placeholder="e.g. Malaria Fighters"
        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2B7A4B] focus:outline-none"
      />


      {/* -------------------------------- */}
      {/* Category + Tone */}
      {/* -------------------------------- */}

      <div className="mt-5 grid grid-cols-2 gap-4">

        <div>

          <label className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">
            Category
          </label>

          <select
            value={data.category}
            onChange={(e) =>
              update({
                category: e.target.value
              })
            }
            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#2B7A4B] focus:outline-none"
          >

            {CATEGORIES.map((c) => (

              <option
                key={c}
                value={c}
              >
                {c}
              </option>

            ))}

          </select>

        </div>


        <div>

          <label className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">
            Tone
          </label>

          <select
            value={data.tone}
            onChange={(e) =>
              update({
                tone: e.target.value
              })
            }
            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#2B7A4B] focus:outline-none"
          >

            {TONES.map((t) => (

              <option
                key={t}
                value={t}
              >
                {t}
              </option>

            ))}

          </select>

        </div>

      </div>


      {/* -------------------------------- */}
      {/* Source material */}
      {/* -------------------------------- */}

      <div className="mt-7">

        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">
          Source material
        </p>

        <p className="mt-1 text-xs text-slate-600">
          The document facts will be extracted from.
          Type it, upload a file, or record a voice note.
        </p>


        {/* Input method selector */}

        <div className="mt-3 inline-flex rounded-md border border-slate-200 p-0.5">

          {[
            {
              id: 'type',
              label: 'Type',
              icon: IconType
            },
            {
              id: 'upload',
              label: 'Upload',
              icon: IconUpload
            },
            {
              id: 'record',
              label: 'Record',
              icon: IconMic
            },
          ].map(
            ({ id, label, icon: Icon }) => (

              <button
                key={id}
                type="button"
                onClick={() =>
                  setInputMethod(id)
                }
                className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition ${
                  inputMethod === id
                    ? 'bg-[#2B7A4B] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >

                <Icon size={13} />

                {label}

              </button>

            )
          )}

        </div>


        {/* -------------------------------- */}
        {/* Type */}
        {/* -------------------------------- */}

        {inputMethod === 'type' && (

          <textarea
            value={data.sourceText}
            onChange={(e) =>
              update({
                sourceText: e.target.value
              })
            }
            placeholder="Paste or type the source information here…"
            rows={8}
            className="mt-3 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2B7A4B] focus:outline-none"
          />

        )}


        {/* -------------------------------- */}
        {/* Upload */}
        {/* -------------------------------- */}

        {inputMethod === 'upload' && (

          <div className="mt-3">

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 py-8 text-sm text-slate-600 transition hover:border-[#2B7A4B]/50 hover:text-[#2B7A4B]"
            >

              <IconUpload size={16} />

              {data.fileName
                ? `Replace "${data.fileName}"`
                : 'Choose a file (.txt, .md, .pdf, .docx)'
              }

            </button>


            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf,.docx"
              onChange={handleFile}
              className="hidden"
            />


            {data.fileName && (

              <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-600">

                <IconFile size={13} />

                {data.fileName}

              </div>

            )}


            {fileError && (

              <p className="mt-2 text-xs text-[#D62828]">
                {fileError}
              </p>

            )}


            {data.sourceText && (

              <textarea
                value={data.sourceText}
                onChange={(e) =>
                  update({
                    sourceText: e.target.value
                  })
                }
                rows={6}
                className="mt-3 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#2B7A4B] focus:outline-none"
              />

            )}

          </div>

        )}


        {/* -------------------------------- */}
        {/* Record */}
        {/* -------------------------------- */}

        {inputMethod === 'record' && (

          <div className="mt-3 rounded-lg border border-slate-200 p-5">

            <div className="flex items-center gap-4">

              {!recorder.recording ? (

                <button
                  type="button"
                  onClick={recorder.start}
                  className="flex items-center gap-2 rounded-full bg-[#2B7A4B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2B7A4B]/90"
                >

                  <IconMic size={15} />

                  Start recording

                </button>

              ) : (

                <button
                  type="button"
                  onClick={recorder.stop}
                  className="flex items-center gap-2 rounded-full bg-[#F5C400] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[#F5C400]/90"
                >

                  <IconSquare size={15} />

                  Stop ({formatSeconds(recorder.seconds)})

                </button>

              )}


              {recorder.recording && (

                <span
                  className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#D62828]"
                  aria-hidden="true"
                />

              )}

            </div>


            {recorder.error && (

              <p className="mt-3 text-xs text-[#D62828]">
                {recorder.error}
              </p>

            )}


            {recorder.audioUrl && (

              <div className="mt-4 space-y-3">

                <audio
                  controls
                  src={recorder.audioUrl}
                  className="w-full"
                />


                <div>

                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">
                    Transcript
                  </label>

                  <p className="mt-0.5 text-[11px] text-slate-600">
                    Speech-to-text isn't connected in this prototype —
                    type what you said so the pipeline has text to work with.
                    (Swap this for real ASR, e.g. Whisper, later.)
                  </p>


                  <textarea
                    value={data.sourceText}
                    onChange={(e) =>
                      update({
                        sourceText: e.target.value
                      })
                    }
                    rows={5}
                    placeholder="Type the transcript of your recording…"
                    className="mt-2 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2B7A4B] focus:outline-none"
                  />

                </div>

              </div>

            )}

          </div>

        )}

      </div>


      {/* -------------------------------- */}
      {/* Action area */}
      {/* -------------------------------- */}

      <div className="mt-7">

        <div className="flex items-center gap-4">

          <button
            type="button"

            disabled={
              !canVerify ||
              isLoading
            }

            onClick={onVerify}

            className="flex min-w-[170px] items-center justify-center gap-2 rounded-md bg-[#2B7A4B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2B7A4B]/90 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {isLoading ? (

              <>

                {/* Spinner */}

                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden="true"
                />

                Generating story...

              </>

            ) : (

              <>
                Extract key facts →
              </>

            )}

          </button>


          {!canVerify && !isLoading && (

            <span className="text-xs text-slate-600">
              Add a title and at least a couple of sentences of source text.
            </span>

          )}

        </div>


        {/* -------------------------------- */}
        {/* API error */}
        {/* -------------------------------- */}

        {generationError && (

          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3">

            <p className="text-sm font-semibold text-[#D62828]">
              Something went wrong
            </p>

            <p className="mt-1 text-xs text-red-700">
              {generationError}
            </p>

          </div>

        )}

      </div>

    </div>
  )
}