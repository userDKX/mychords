import { useState, type FormEvent } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Toggle } from '../ui/Toggle'

interface SongFormProps {
  initialData?: { title: string; artist: string; notes: string; capo: number; isPublic: boolean }
  onSave: (data: { title: string; artist: string; notes: string; capo: number; is_public: boolean }) => void
  onCancel: () => void
  saving?: boolean
}

export function SongForm({ initialData, onSave, onCancel, saving }: SongFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [artist, setArtist] = useState(initialData?.artist ?? '')
  const [notes, setNotes] = useState(initialData?.notes ?? '')
  const [capo, setCapo] = useState(initialData?.capo ?? 0)
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), artist: artist.trim(), notes: notes.trim(), capo, is_public: isPublic })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[60px] rounded-full pointer-events-none" />

      <div className="space-y-5 relative z-10">
        <Input label="Título" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nombre de la canción" required />
        <Input label="Artista" value={artist} onChange={e => setArtist(e.target.value)} placeholder="Artista o banda" />

        {/* Capo */}
        <div>
          <label className="block text-sm font-semibold tracking-wide text-slate-300 mb-2 pl-1 uppercase text-[11px]">Capotraste</label>
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-2 rounded-2xl w-max backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setCapo(Math.max(0, capo - 1))}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl min-h-[44px] min-w-[44px] text-lg transition-colors border border-white/5 text-slate-300 active:scale-95 flex items-center justify-center font-bold"
            >-</button>
            <span className="text-brand-300 w-20 text-center font-bold tracking-wide">
              {capo === 0 ? 'Sin capo' : `Traste ${capo}`}
            </span>
            <button
              type="button"
              onClick={() => setCapo(Math.min(12, capo + 1))}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl min-h-[44px] min-w-[44px] text-lg transition-colors border border-white/5 text-slate-300 active:scale-95 flex items-center justify-center font-bold"
            >+</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold tracking-wide text-slate-300 mb-2 pl-1 uppercase text-[11px]">Notas</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notas sobre la canción, ritmo, acordes extra, etc."
            rows={4}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-slate-100 backdrop-blur-md placeholder:text-slate-500 focus:border-brand-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-300 resize-y"
          />
        </div>

        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 mt-4">
          <Toggle checked={isPublic} onChange={setIsPublic} label="Compartir con la comunidad" />
          <p className="text-xs text-slate-500 mt-2 pl-14">Si activas esto, otros usuarios podrán buscar y ver tu canción.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/[0.05] relative z-10 mt-6">
        <Button type="submit" disabled={!title.trim() || saving} className="sm:flex-1 py-3.5 text-base shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          {saving ? 'Guardando...' : 'Guardar Canción'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="sm:w-32 py-3.5">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
