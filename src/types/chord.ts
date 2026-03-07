/** Un acorde embebido en una canción */
export interface ChordEntry {
  frets: number[] // 6 valores: -1=muted, 0=open, 1-24=traste real
  name?: string   // opcional
  section?: string // "Intro", "Verso", "Coro", etc.
}

/** Calcula el traste base para el diagrama */
export function calcBaseFret(frets: number[]): number {
  const pressed = frets.filter(f => f > 0)
  if (pressed.length === 0) return 1
  const max = Math.max(...pressed)
  if (max <= 5) return 1
  return Math.min(...pressed)
}
