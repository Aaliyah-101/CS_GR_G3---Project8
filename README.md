# CS_GR_G3---LVM_Powered-Visual-Storytelling-for-Ugandan-Public-Communication-

## Story creation flow

`Create a Story` now runs as an 8-step verified pipeline instead of a single
form: **Source → Extraction → Audience → Narrative → Storyboard → Panel Gen →
Verify → Publish**. Each step has its own confirm action, and the step rail on
the left only lets you jump ahead to steps you've already verified (you can
always go back).

All new pipeline UI lives in `frontend/src/components/story-builder/`:

- `storyEngine.js` — the mock logic standing in for real backend calls
  (fact extraction, audience suggestion, narrative drafting, art-key guessing,
  panel verification). Every function has a comment on what it should call
  instead once the real services exist.
- `SourceStep.jsx` — story metadata + three input methods: type, upload
  (.txt/.md parsed client-side; other formats attached with a note that
  server-side extraction is needed), and record (browser mic capture via
  `useVoiceRecorder.js` — no speech-to-text is wired up yet, so you type the
  transcript after recording).
- `ExtractionStep.jsx` — editable, includable facts; confirming this list is
  the "verification" for this stage.
- `AudienceStep.jsx` — audience presets (biased by category) + narration
  language.
- `NarrativeStep.jsx` — auto-drafted protagonist/arc with a fact-coverage
  checklist.
- `StoryboardStep.jsx` — the original scene builder (add/reorder/remove),
  plus an auto-suggested visual setting per scene and a character-name field.
- `PanelGenStep.jsx` / `PanelArt.jsx` — placeholder illustrations (swap for
  real generated/retrieved images later); characters get a consistent colour
  tag across every panel they appear in.
- `VerifyStep.jsx` / `VerificationStamp.jsx` — heuristic pass/flag check per
  panel against the confirmed facts, with a jump-back link to fix flagged
  scenes.
- `PublishStep.jsx` — final review, language/audio settings, and the submit
  payload (still just `console.log`s — wire up the real endpoint here).

Colours and type all reuse the existing Tailwind tokens in
`tailwind.config.js` (`ink`/`panel`/`panelLine`/`parchment`/`sienna`/`amber`/
`clay`) — nothing new was introduced to the palette.
