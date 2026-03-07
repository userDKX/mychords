import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSongs } from '../hooks/useSongs'
import { SongList } from '../components/song/SongList'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export function SongsPage() {
  const { songs, loading } = useSongs()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = songs.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.artist.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4 flex-wrap mt-2">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">Mis Canciones</h1>
        <button onClick={() => navigate('/songs/new')} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-medium transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-brand-400/50 active:scale-95 shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          Nueva
        </button>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-400 group-focus-within:text-brand-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          placeholder="Buscar canciones..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 py-3.5 text-slate-100 placeholder:text-slate-500 backdrop-blur-md focus:border-brand-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-300"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : (
        <SongList
          songs={filtered}
          emptyMessage={search ? 'No se encontraron resultados para tu búsqueda.' : 'Aún no tienes canciones. ¡Crea tu primera obra de arte!'}
        />
      )}
    </div>
  )
}
