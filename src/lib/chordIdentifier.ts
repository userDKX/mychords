/**
 * Chord identifier — detects chord name from guitar fret positions.
 *
 * Standard tuning: E2 A2 D3 G3 B3 E4
 * Each fret = +1 semitone from the open string note.
 *
 * We compute the pitch classes (0-11) of all sounding notes,
 * then match against known chord formulas trying each note as potential root.
 */

// Semitone offsets for standard tuning (E A D G B E)
const TUNING = [4, 9, 2, 7, 11, 4] // E=4, A=9, D=2, G=7, B=11, E=4

// English note names (short, used in dots and note labels)
const NOTE_NAMES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si']

// Spanish suffix names for chord types
const SUFFIX_ES: Record<string, string> = {
  '':       ' Mayor',
  'm':      ' Menor',
  '5':      ' 5ta',
  'dim':    ' Disminuido',
  'aug':    ' Aumentado',
  'sus2':   ' sus2',
  'sus4':   ' sus4',
  '7':      ' 7',
  'maj7':   ' maj7',
  'm7':     ' Menor 7',
  'dim7':   ' Disminuido 7',
  'm7b5':   ' Menor 7b5',
  '7sus4':  ' 7sus4',
  'add9':   ' add9',
  '6':      ' 6',
  'm6':     ' Menor 6',
  '9':      ' 9',
  'm9':     ' Menor 9',
  'maj9':   ' maj9',
  '11':     ' 11',
  '13':     ' 13',
}

// Interval sets (relative to root) for chord types, ordered by priority
const CHORD_FORMULAS: [string, number[]][] = [
  // Power chords
  ['5', [0, 7]],

  // Triads
  ['', [0, 4, 7]],           // Major
  ['m', [0, 3, 7]],          // Minor
  ['dim', [0, 3, 6]],        // Diminished
  ['aug', [0, 4, 8]],        // Augmented
  ['sus2', [0, 2, 7]],       // Suspended 2
  ['sus4', [0, 5, 7]],       // Suspended 4

  // Seventh chords
  ['7', [0, 4, 7, 10]],      // Dominant 7
  ['maj7', [0, 4, 7, 11]],   // Major 7
  ['m7', [0, 3, 7, 10]],     // Minor 7
  ['dim7', [0, 3, 6, 9]],    // Diminished 7
  ['m7b5', [0, 3, 6, 10]],   // Half-diminished 7
  ['7sus4', [0, 5, 7, 10]],  // Dominant 7 sus4
  ['add9', [0, 4, 7, 14]],   // Add 9 (= add 2 an octave up, but we use mod 12)

  // Extended
  ['6', [0, 4, 7, 9]],       // Major 6
  ['m6', [0, 3, 7, 9]],      // Minor 6
  ['9', [0, 4, 7, 10, 2]],   // Dominant 9
  ['m9', [0, 3, 7, 10, 2]],  // Minor 9
  ['maj9', [0, 4, 7, 11, 2]],// Major 9
  ['11', [0, 4, 7, 10, 2, 5]],
  ['13', [0, 4, 7, 10, 2, 5, 9]],
]

export interface ChordMatch {
  /** Short name: "Do Mayor", "La Menor", "Fa#m7" */
  short: string
  /** Full Spanish name: "Do Mayor", "La Menor", "Fa Sostenido Menor 7" */
  full: string
}

/**
 * Given guitar fret positions, identify the chord.
 * Returns null if no match found.
 *
 * frets: array of 6 numbers (-1=muted, 0=open, 1+=fret number)
 */
export function identifyChord(frets: number[]): ChordMatch | null {
  const pitchClasses = new Set<number>()
  const bassNote = getBassNote(frets)

  for (let i = 0; i < 6; i++) {
    if (frets[i] < 0) continue
    const pitch = (TUNING[i] + frets[i]) % 12
    pitchClasses.add(pitch)
  }

  if (pitchClasses.size < 2) return null

  const notes = [...pitchClasses]

  let bestMatch: { root: number; suffix: string; score: number } | null = null

  for (const root of notes) {
    const intervals = new Set(notes.map(n => (n - root + 12) % 12))

    for (const [suffix, formula] of CHORD_FORMULAS) {
      const formulaSet = new Set(formula.map(f => f % 12))

      const allFormulaPresent = [...formulaSet].every(f => intervals.has(f))
      if (!allFormulaPresent) continue

      const extraNotes = [...intervals].filter(i => !formulaSet.has(i)).length

      let score = 100 - extraNotes * 20 - formula.length

      if (bassNote === root) score += 30
      if (suffix === '' || suffix === 'm') score += 10

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { root, suffix, score }
      }
    }
  }

  if (!bestMatch) return null

  const noteName = NOTE_NAMES[bestMatch.root]
  const suffixEs = SUFFIX_ES[bestMatch.suffix] ?? bestMatch.suffix

  return {
    short: noteName + suffixEs,
    full: noteName + suffixEs,
  }
}

/**
 * Get the bass note (lowest sounding string) pitch class
 */
function getBassNote(frets: number[]): number | null {
  for (let i = 0; i < 6; i++) {
    if (frets[i] >= 0) {
      return (TUNING[i] + frets[i]) % 12
    }
  }
  return null
}

/**
 * Get the note name for a specific string and fret (Spanish)
 */
export function getNoteName(stringIdx: number, fret: number): string {
  if (fret < 0) return ''
  const pitch = (TUNING[stringIdx] + fret) % 12
  return NOTE_NAMES[pitch]
}
