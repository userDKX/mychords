import { useState } from 'react'
import type { Song } from '../../types/song'
import type { ChordEntry } from '../../types/chord'
import { ChordDiagram } from '../chord/ChordDiagram'
import { ChordEditor } from '../chord/ChordEditor'
import { ChordFullscreenViewer } from '../chord/ChordFullscreenViewer'
import { Modal } from '../ui/Modal'

interface SongViewProps {
  song: Song
  isOwner: boolean
  onUpdateChords?: (chords: ChordEntry[]) => void
}

export function SongView({ song, isOwner, onUpdateChords }: SongViewProps) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const chords = song.chords || []

  // Group by section
  const sections = [...new Set(chords.map(c => c.section || '').filter(Boolean))]
  const unsectioned = chords.filter(c => !c.section)
  const grouped: Record<string, ChordEntry[]> = {}
  for (const s of sections) grouped[s] = chords.filter(c => c.section === s)
  if (unsectioned.length > 0) grouped[''] = unsectioned

  const handleAddChord = (frets: number[]) => {
    const newChord: ChordEntry = { frets }
    if (currentSection.trim()) newChord.section = currentSection.trim()
    onUpdateChords?.([...chords, newChord])
    setEditorOpen(false)
  }

  const handleRemoveChord = (index: number) => {
    onUpdateChords?.(chords.filter((_, i) => i !== index))
  }

  return (
    <>
      <div className="space-y-10 animate-in fade-in duration-500 pb-12">
        {/* Header */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-brand-500/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="absolute top-6 right-6 lg:top-8 lg:right-8 flex flex-col items-center gap-3">
            {/* Edit toggle */}
            {isOwner && onUpdateChords && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ring-1 shadow-lg ${isEditing
                  ? 'bg-brand-500 text-white ring-brand-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 ring-white/10'
                  }`}
                title={isEditing ? "Finalizar edición" : "Editar acordes"}
              >
                {isEditing ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                )}
              </button>
            )}

            {/* Fullscreen viewer button */}
            {chords.length > 0 && (
              <button
                onClick={() => setFullscreen(true)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ring-1 shadow-lg bg-emerald-500/10 text-emerald-400 hover:text-white hover:bg-emerald-500 ring-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                title="Ver acordes a pantalla completa"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              </button>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-50 tracking-tight leading-tight mb-4 pr-32">{song.title}</h1>
          {song.artist && <p className="text-xl text-brand-300 font-medium mb-2">{song.artist}</p>}
          {song.capo > 0 && (
            <div className="mt-6 mb-2">
              <span className="inline-flex px-4 py-2 bg-brand-500/15 text-brand-300 text-sm font-bold uppercase tracking-widest rounded-xl border border-brand-500/20 ring-1 ring-brand-500/10">
                Capo en traste {song.capo}
              </span>
            </div>
          )}
          {song.notes && <p className="text-lg text-slate-300 mt-8 whitespace-pre-wrap leading-relaxed bg-black/20 p-6 rounded-2xl border border-white/5">{song.notes}</p>}
        </div>

        {/* Chords by section */}
        <div className="space-y-12 mt-10">
          {Object.entries(grouped).map(([section, sectionChords]) => (
            <div key={section} className="relative">
              {section && <h2 className="text-sm font-bold text-brand-400 uppercase tracking-widest mb-6 flex items-center gap-4"><span className="w-12 h-[1px] bg-brand-400/30" />{section}<span className="flex-1 h-[1px] bg-white/5" /></h2>}
              <div className="flex flex-wrap gap-5">
                {sectionChords.map((chord) => {
                  const idx = chords.indexOf(chord)
                  return (
                    <div key={idx} className="relative group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-brand-500/30 rounded-3xl p-5 transition-all duration-300 shadow-xl hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] backdrop-blur-sm">
                      <ChordDiagram frets={chord.frets} name={chord.name} size={110} />
                      {isOwner && onUpdateChords && isEditing && (
                        <button
                          onClick={() => handleRemoveChord(idx)}
                          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-400 text-white shadow-lg flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 scale-100 md:scale-90 md:group-hover:scale-100 border-2 border-[#030712] hover:rotate-90 ring-2 ring-[#030712]"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {chords.length === 0 && (
          <div className="flex flex-col items-center justify-center p-14 mt-6 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] backdrop-blur-md">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-inner">
              <svg className="w-10 h-10 text-slate-500 mb-0 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
            </div>
            <p className="text-slate-400 text-lg text-center font-medium">No hay acordes aún.{isOwner && ' ¡Activa la edición para agregar!'}</p>
          </div>
        )}

        {/* Add chord controls */}
        {isOwner && onUpdateChords && isEditing && (
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 md:p-8 backdrop-blur-md mt-12 w-full">
            <input
              type="text"
              placeholder="Sección (ej. Intro, Coro)"
              value={currentSection}
              onChange={e => setCurrentSection(e.target.value)}
              className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-slate-100 placeholder:text-slate-500 focus:border-brand-500/50 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-300 h-[52px]"
            />
            <button onClick={() => setEditorOpen(true)} className="flex items-center justify-center w-[52px] h-[52px] rounded-2xl bg-brand-500 hover:bg-brand-400 text-white transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-brand-400/50 active:scale-95 shrink-0" title="Agregar acorde">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>
        )}

        <Modal open={editorOpen} onClose={() => setEditorOpen(false)}>
          <ChordEditor
            onCancel={() => setEditorOpen(false)}
            onSave={handleAddChord}
          />
        </Modal>
      </div>

      {/* Fullscreen chord viewer */}
      {fullscreen && (
        <ChordFullscreenViewer
          chords={chords}
          songTitle={song.title}
          capo={song.capo}
          onClose={() => setFullscreen(false)}
        />
      )}
    </>
  )
}
