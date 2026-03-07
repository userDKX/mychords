import { useEffect, useRef, useState } from 'react'
import type { ChordEntry } from '../../types/chord'
import { ChordDiagram } from './ChordDiagram'

interface ChordFullscreenViewerProps {
  chords: ChordEntry[]
  songTitle: string
  capo: number
  onClose: () => void
}

export function ChordFullscreenViewer({ chords, songTitle, capo, onClose }: ChordFullscreenViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

  // Lock body scroll and force landscape hint
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    // Try to lock to landscape on mobile
    ;(screen.orientation as any)?.lock?.('landscape').catch(() => {})
    return () => {
      document.body.style.overflow = ''
      ;(screen.orientation as any)?.unlock?.()
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrent(c => Math.min(c + 1, chords.length - 1))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setCurrent(c => Math.max(c - 1, 0))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [chords.length, onClose])

  // Scroll to current chord
  useEffect(() => {
    const el = scrollRef.current?.children[current] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [current])

  // Snap scroll detection
  const handleScroll = () => {
    const container = scrollRef.current
    if (!container) return
    const scrollLeft = container.scrollLeft
    const itemWidth = container.children[0]?.clientWidth ?? 1
    const gap = 24
    const idx = Math.round(scrollLeft / (itemWidth + gap))
    if (idx !== current) setCurrent(idx)
  }

  const currentChord = chords[current]
  const sectionLabel = currentChord?.section

  return (
    <div className="fixed inset-0 z-[200] bg-[#030712] flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-200 truncate">{songTitle}</h2>
            {capo > 0 && <span className="text-xs text-amber-400 font-medium">Capo {capo}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sectionLabel && (
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-500/20">
              {sectionLabel}
            </span>
          )}
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {current + 1}/{chords.length}
          </span>
        </div>
      </div>

      {/* Chord carousel */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Nav arrows - desktop */}
        <button
          onClick={() => setCurrent(c => Math.max(c - 1, 0))}
          className={`absolute left-4 z-10 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center ${current === 0 ? 'opacity-20 pointer-events-none' : ''}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          onClick={() => setCurrent(c => Math.min(c + 1, chords.length - 1))}
          className={`absolute right-4 z-10 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center ${current === chords.length - 1 ? 'opacity-20 pointer-events-none' : ''}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>

        {/* Scrollable chord strip */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-center gap-6 overflow-x-auto snap-x snap-mandatory px-[calc(50vw-100px)] h-full scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {chords.map((chord, i) => (
            <div
              key={i}
              className={`snap-center shrink-0 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
                ${i === current ? 'scale-100 opacity-100' : 'scale-75 opacity-30'}`}
              onClick={() => setCurrent(i)}
            >
              <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <ChordDiagram frets={chord.frets} name={chord.name} size={220} />
              </div>
              {chord.section && i === current && (
                <span className="mt-4 text-sm text-slate-500 font-medium">{chord.section}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom dots */}
      {chords.length > 1 && chords.length <= 20 && (
        <div className="flex items-center justify-center gap-1.5 pb-4 shrink-0">
          {chords.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current
                ? 'w-6 h-2 bg-brand-500'
                : 'w-2 h-2 bg-white/15 hover:bg-white/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
