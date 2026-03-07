import { calcBaseFret } from '../../types/chord'

interface ChordDiagramProps {
  frets: number[]
  name?: string
  size?: number
}

const NUM_STRINGS = 6
const NUM_FRETS = 5

export function ChordDiagram({ frets, name, size = 120 }: ChordDiagramProps) {
  const baseFret = calcBaseFret(frets)
  const scale = size / 120
  const padTop = 28 * scale
  const padLeft = 20 * scale
  const padRight = 10 * scale
  const stringSpacing = 16 * scale
  const fretSpacing = 18 * scale
  const gridWidth = (NUM_STRINGS - 1) * stringSpacing
  const gridHeight = NUM_FRETS * fretSpacing
  const totalWidth = padLeft + gridWidth + padRight
  const totalHeight = padTop + gridHeight + 20 * scale
  const dotRadius = 5.5 * scale
  const nutHeight = 3 * scale

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="block"
    >
      {/* Name */}
      {name && (
        <text
          x={padLeft + gridWidth / 2}
          y={10 * scale}
          textAnchor="middle"
          fill="currentColor"
          className="text-white"
          fontSize={12 * scale}
          fontWeight="700"
        >
          {name}
        </text>
      )}

      {/* Nut or fret number */}
      {baseFret === 1 ? (
        <rect
          x={padLeft}
          y={padTop - nutHeight}
          width={gridWidth}
          height={nutHeight}
          fill="currentColor"
          className="text-white font-bold"
          rx={1}
        />
      ) : (
        <text
          x={padLeft - 9 * scale}
          y={padTop + fretSpacing / 2 + 3 * scale}
          textAnchor="middle"
          fill="currentColor"
          className="text-brand-300"
          fontSize={9 * scale}
          fontWeight="bold"
        >
          {baseFret}
        </text>
      )}

      {/* Fret lines */}
      {Array.from({ length: NUM_FRETS + 1 }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={padLeft}
          y1={padTop + i * fretSpacing}
          x2={padLeft + gridWidth}
          y2={padTop + i * fretSpacing}
          stroke="currentColor"
          className="text-white"
          strokeWidth={i === 0 ? 1.5 * scale : 0.5 * scale}
          opacity={i === 0 ? 0.8 : 0.3}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: NUM_STRINGS }, (_, i) => (
        <line
          key={`string-${i}`}
          x1={padLeft + i * stringSpacing}
          y1={padTop}
          x2={padLeft + i * stringSpacing}
          y2={padTop + gridHeight}
          stroke="currentColor"
          className="text-white"
          strokeWidth={0.5 * scale}
          opacity={0.3}
        />
      ))}

      {/* Dots and open/muted markers */}
      {frets.map((fret, stringIdx) => {
        const x = padLeft + stringIdx * stringSpacing

        if (fret === -1) {
          const y = padTop - 8 * scale
          const s = 3.5 * scale
          return (
            <g key={`marker-${stringIdx}`} className="text-slate-500">
              <line x1={x - s} y1={y - s} x2={x + s} y2={y + s} stroke="currentColor" strokeWidth={1.5 * scale} strokeLinecap="round" />
              <line x1={x + s} y1={y - s} x2={x - s} y2={y + s} stroke="currentColor" strokeWidth={1.5 * scale} strokeLinecap="round" />
            </g>
          )
        }

        if (fret === 0) {
          return (
            <circle
              key={`marker-${stringIdx}`}
              cx={x}
              cy={padTop - 8 * scale}
              r={3.5 * scale}
              fill="none"
              stroke="currentColor"
              className="text-brand-400"
              strokeWidth={1.5 * scale}
            />
          )
        }

        const fretIdx = fret - baseFret + 1
        if (fretIdx < 1 || fretIdx > NUM_FRETS) return null
        const y = padTop + (fretIdx - 0.5) * fretSpacing

        return <circle key={`dot-${stringIdx}`} cx={x} cy={y} r={dotRadius} fill="currentColor" className="text-brand-500 drop-shadow-[0_0_4px_rgba(99,102,241,0.5)]" />
      })}
    </svg>
  )
}
