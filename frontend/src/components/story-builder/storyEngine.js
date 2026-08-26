// Stand-in "pipeline" logic. Every function here is where a real backend call
// belongs eventually — each one is documented with what it should become.
// They're intentionally simple heuristics so the wizard behaves responsively
// against whatever the user actually types, instead of showing static content.

let idCounter = 1
export function nextLocalId() {
  return idCounter++
}

/**
 * Replace with: an LLM semantic-extraction call over the source document.
 * For now: splits into candidate sentences and scores them by simple signals
 * (numbers, imperative verbs) so longer/richer source text produces more and
 * higher-priority facts.
 */
export function extractFacts(sourceText) {
  const sentences = sourceText
    .replace(/([.!?])\s+/g, '$1|SPLIT|')
    .split('|SPLIT|')
    .map((s) => s.trim())
    .filter((s) => s.length > 12)

  if (sentences.length === 0) return []

  const highSignal = /\d|%|must|should|always|never|within|risk/i

  return sentences.slice(0, 8).map((text) => ({
    id: `fact-${nextLocalId()}`,
    text,
    weight: highSignal.test(text) ? 'high' : 'medium',
    included: true,
  }))
}

/**
 * Replace with: an audience/context-modeling call. For now: a small curated
 * set, biased by category, so the picker feels relevant rather than random.
 */
export function suggestAudiences(category) {
  const base = [
    { id: 'aud-1', label: 'Rural household, general public', literacy: 'Basic literacy, oral-first', language: 'Luganda' },
    { id: 'aud-2', label: 'Secondary/university students', literacy: 'Full literacy', language: 'English' },
    { id: 'aud-3', label: 'Urban commuters', literacy: 'Mixed literacy', language: 'English + Luganda' },
  ]
  if (category === 'Health') {
    base.unshift({ id: 'aud-0', label: 'Clinic waiting room, caregivers', literacy: 'Mixed literacy', language: 'Luganda' })
  }
  if (category === 'Culture') {
    base.unshift({ id: 'aud-0', label: 'Visitors & heritage-site guests', literacy: 'Full literacy', language: 'English' })
  }
  return base
}

/**
 * Replace with: a narrative-planning LLM call. For now: a light template
 * built from the metadata already collected, so it reads as a first draft
 * to edit rather than a finished script.
 */
export function suggestNarrative({ title, category, tone, audience }) {
  const protagonistByCategory = {
    'Public Awareness': 'a resident navigating an everyday risk',
    Health: 'a caregiver responding to a health decision',
    Education: 'a student encountering the topic for the first time',
    Culture: 'a visitor guided by someone who knows the place well',
  }
  const toneNote = {
    Hopeful: 'ends on the protagonist succeeding, without minimizing the risk that came before',
    Urgent: 'moves quickly, foregrounding the cost of inaction',
    Reflective: 'lingers on why the practice matters, not just what to do',
    Playful: 'keeps stakes light while still landing the key facts',
  }

  const protagonist = protagonistByCategory[category] || 'a member of the community'
  const audienceNote = audience ? ` for ${audience.label.toLowerCase()}` : ''

  return {
    protagonist: `${title || 'The story'}: ${protagonist}${audienceNote}`,
    arc: `Draft arc — edit freely: the story opens on an ordinary moment, introduces the information as something the protagonist must act on, and resolves by showing the correct behavior in practice rather than just stating it.`,
    toneNote: toneNote[tone] || '',
  }
}

/**
 * Replace with: routing the scene graph to a real generator. For now: crude
 * keyword matching onto the placeholder art templates in PanelArt.jsx.
 */
export function suggestArtKey(text = '') {
  const t = text.toLowerCase()
  if (/clinic|nurse|hospital|test|treatment/.test(t)) return 'clinic'
  if (/net|sleep|bed|home|house/.test(t)) return 'home'
  if (/road|boda|cross|traffic|helmet|junction/.test(t)) return 'road'
  if (/market|vendor|shop|stall/.test(t)) return 'market'
  if (/tomb|heritage|elder|tradition|craft/.test(t)) return 'heritage'
  return 'village'
}

/**
 * Replace with: a VLM call comparing the rendered panel image against the
 * grounded facts. For now: checks whether the scene's own text plausibly
 * covers at least one included fact, using naive word overlap, and flags
 * thin scenes outright.
 */
export function verifyPanel(scene, includedFacts) {
  const sceneWords = new Set(
    `${scene.caption} ${scene.imagePrompt}`.toLowerCase().match(/[a-z]{4,}/g) || []
  )

  if (sceneWords.size < 3) {
    return { status: 'flag', score: 0.42, note: 'Scene is too thin to verify — add more detail to the caption or visual description.' }
  }

  let bestOverlap = 0
  for (const fact of includedFacts) {
    const factWords = fact.text.toLowerCase().match(/[a-z]{4,}/g) || []
    const overlap = factWords.filter((w) => sceneWords.has(w)).length
    bestOverlap = Math.max(bestOverlap, overlap)
  }

  if (includedFacts.length === 0) {
    return { status: 'pass', score: 0.75, note: 'No facts were marked to ground this story — verification is checking coherence only.' }
  }

  if (bestOverlap === 0) {
    return { status: 'flag', score: 0.58, note: "This scene doesn't clearly connect to any confirmed fact — check it isn't drifting from the source." }
  }

  const score = Math.min(0.98, 0.68 + bestOverlap * 0.08)
  return { status: 'pass', score, note: 'Scene content lines up with at least one confirmed fact.' }
}

// A small warm-toned palette for character-consistency tags, kept inside the
// site's existing amber/clay/sienna family rather than introducing new hues.
const CHARACTER_PALETTE = ['#E8A33D', '#B85C1F', '#D9782B', '#C9A227', '#A89484']

export function colorForCharacter(name, allNames) {
  const idx = allNames.indexOf(name)
  return CHARACTER_PALETTE[idx % CHARACTER_PALETTE.length]
}
