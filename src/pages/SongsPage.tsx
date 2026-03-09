import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSongs, useSavedSongs } from '../hooks/useSongs'
import { SongList } from '../components/song/SongList'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

type Tab = 'mine' | 'saved'

export function SongsPage() {
  const { songs, loading } = useSongs()
  const { savedSongs, removeSavedSong } = useSavedSongs()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<Tab>('mine')

  const currentSongs = tab === 'mine' ? songs : savedSongs

  const filtered = currentSongs.filter(s =>
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

      {/* Tabs */}
      <div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
        <button
          onClick={() => setTab('mine')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
            tab === 'mine'
              ? 'bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/20 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          Mías
        </button>
        <button
          onClick={() => setTab('saved')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
            tab === 'saved'
              ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
          Guardadas
          {savedSongs.length > 0 && (
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">{savedSongs.length}</span>
          )}
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

      {tab === 'mine' && loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : (
        <SongList
          songs={filtered}
          showAuthor={tab === 'saved'}
          onRemoveSaved={tab === 'saved' ? removeSavedSong : undefined}
          emptyMessage={
            tab === 'saved'
              ? 'No tienes canciones guardadas. Ve a la comunidad y guarda las que te gusten.'
              : search
                ? 'No se encontraron resultados para tu búsqueda.'
                : 'Aún no tienes canciones. ¡Crea tu primera obra de arte!'
          }
        />
      )}
    </div>
  )
}
