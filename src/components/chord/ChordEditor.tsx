import { useState } from 'react'
import { ChordDiagram } from './ChordDiagram'
import { Button } from '../ui/Button'
import { calcBaseFret } from '../../types/chord'

interface ChordEditorProps {
  initialFrets?: number[]
  onSave: (frets: number[]) => void
  onCancel: () => void
  saving?: boolean
}

const NUM_STRINGS = 6
const NUM_FRETS = 5
const EMPTY_FRETS = [-1, -1, -1, -1, -1, -1]

export function ChordEditor({ initialFrets, onSave, onCancel, saving }: ChordEditorProps) {
  const [frets, setFrets] = useState<number[]>(initialFrets ?? [...EMPTY_FRETS])
  const [baseFret, setBaseFret] = useState(() => calcBaseFret(initialFrets ?? EMPTY_FRETS))

  const handleFretClick = (stringIdx: number, fretIdx: number) => {
    const actualFret = baseFret + fretIdx
    const newFrets = [...frets]
    newFrets[stringIdx] = newFrets[stringIdx] === actualFret ? -1 : actualFret
    setFrets(newFrets)
  }

  const handleOpenMuted = (stringIdx: number) => {
    const newFrets = [...frets]
    newFrets[stringIdx] = newFrets[stringIdx] === 0 ? -1 : 0
    setFrets(newFrets)
  }

  const hasAnyDot = frets.some(f => f > 0) || frets.some(f => f === 0)

  // Editor grid dimensions
  const padTop = 30
  const padLeft = 30
  const stringSpacing = 32
  const fretSpacing = 36
  const gridWidth = (NUM_STRINGS - 1) * stringSpacing
  const gridHeight = NUM_FRETS * fretSpacing
  const totalWidth = padLeft + gridWidth + 20
  const totalHeight = padTop + gridHeight + 20
  const dotRadius = 11

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/[0.03] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold tracking-wide text-slate-300 uppercase text-[11px]">Traste:</label>
          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-xl border border-white/[0.05]">
            <button onClick={() => setBaseFret(Math.max(1, baseFret - 1))} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg min-h-[40px] min-w-[40px] text-lg font-bold transition-colors border border-white/5 text-slate-300">-</button>
            <span className="text-brand-300 w-8 text-center font-bold">{baseFret}</span>
            <button onClick={() => setBaseFret(Math.min(20, baseFret + 1))} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg min-h-[40px] min-w-[40px] text-lg font-bold transition-colors border border-white/5 text-slate-300">+</button>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setFrets([...EMPTY_FRETS])} className="ring-1 ring-white/10">Limpiar</Button>
      </div>

      <p className="text-xs text-slate-400 font-medium">Toca <span className="text-brand-400">arriba de cuerda</span> = abierta/silenciada.<br />Toca <span className="text-brand-400">en traste</span> = poner/quitar punto.</p>

      <div className="flex gap-8 items-start flex-wrap justify-center">
        <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`} className="touch-none select-none drop-shadow-lg">
          {baseFret === 1 && <rect x={padLeft} y={padTop - 4} width={gridWidth} height={4} fill="currentColor" className="text-white" rx={1} />}
          {baseFret > 1 && (
            <text x={padLeft - 18} y={padTop + fretSpacing / 2 + 5} textAnchor="middle" fill="currentColor" className="text-brand-300" fontSize={13} fontWeight="bold">{baseFret}</text>
          )}

          {Array.from({ length: NUM_FRETS + 1 }, (_, i) => (
            <line key={`f-${i}`} x1={padLeft} y1={padTop + i * fretSpacing} x2={padLeft + gridWidth} y2={padTop + i * fretSpacing}
              stroke="currentColor" className="text-white" strokeWidth={i === 0 ? 2 : 0.5} opacity={i === 0 ? 0.8 : 0.25} />
          ))}

          {Array.from({ length: NUM_STRINGS }, (_, i) => (
            <line key={`s-${i}`} x1={padLeft + i * stringSpacing} y1={padTop} x2={padLeft + i * stringSpacing} y2={padTop + gridHeight}
              stroke="currentColor" className="text-white" strokeWidth={0.5} opacity={0.3} />
          ))}

          {Array.from({ length: NUM_STRINGS }, (_, si) => {
            const x = padLeft + si * stringSpacing
            return (
              <g key={`om-${si}`}>
                <rect x={x - 16} y={padTop - 30} width={32} height={26} fill="transparent" className="cursor-pointer" onPointerDown={() => handleOpenMuted(si)} />
                {frets[si] === 0 && <circle cx={x} cy={padTop - 15} r={8} fill="none" stroke="currentColor" className="text-brand-400" strokeWidth={2} />}
                {frets[si] === -1 && (
                  <g className="text-slate-500">
                    <line x1={x - 6} y1={padTop - 21} x2={x + 6} y2={padTop - 9} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    <line x1={x + 6} y1={padTop - 21} x2={x - 6} y2={padTop - 9} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                  </g>
                )}
              </g>
            )
          })}

          {Array.from({ length: NUM_FRETS }, (_, fi) =>
            Array.from({ length: NUM_STRINGS }, (_, si) => {
              const x = padLeft + si * stringSpacing
              const y = padTop + (fi + 0.5) * fretSpacing
              const actualFret = baseFret + fi
              const isActive = frets[si] === actualFret
              return (
                <g key={`cell-${si}-${fi}`}>
                  <rect x={x - 16} y={y - 18} width={32} height={36} fill="transparent" className="cursor-pointer" onPointerDown={() => handleFretClick(si, fi)} />
                  {isActive && <circle cx={x} cy={y} r={dotRadius} fill="currentColor" className="text-brand-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" />}
                </g>
              )
            })
          )}
        </svg>

        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Vista previa</span>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <ChordDiagram frets={frets} size={130} />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/[0.05]">
        <Button onClick={() => onSave(frets)} disabled={!hasAnyDot || saving} className="sm:flex-1 py-3.5 shadow-[0_0_20px_rgba(99,102,241,0.2)] text-base">
          {saving ? 'Guardando...' : 'Guardar Acorde'}
        </Button>
        <Button variant="secondary" onClick={onCancel} className="sm:w-32 py-3.5">Cancelar</Button>
      </div>
    </div>
  )
}
