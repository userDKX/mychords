import { useState } from 'react'
import { usePublicSongs, useSavedSongs } from '../hooks/useSongs'
import { SongList } from '../components/song/SongList'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { SaveSongButton } from '../components/song/SaveSongButton'
import type { Song } from '../types/song'

export function CommunityPage() {
  const { songs, loading, search: searchSongs } = usePublicSongs()
  const { isSaved, saveSong, removeSavedSong } = useSavedSongs()
  const [search, setSearch] = useState('')

  const handleSearch = (value: string) => {
    setSearch(value)
    searchSongs(value)
  }

  const handleToggleSave = (song: Song) => {
    if (isSaved(song.id)) {
      removeSavedSong(song.id)
    } else {
      saveSong(song)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="mt-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-2">Comunidad</h1>
        <p className="text-slate-400">Descubre acordes compartidos por otros músicos.</p>
      </div>

      <div className="relative group max-w-2xl mx-auto mt-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-400 group-focus-within:text-brand-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          placeholder="Buscar por título o artista..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 py-3.5 text-slate-100 placeholder:text-slate-500 backdrop-blur-md focus:border-brand-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-300 shadow-xl"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : (
        <div className="pt-4 pb-10">
          <SongList
            songs={songs}
            showAuthor
            emptyMessage={search ? 'No se encontraron resultados en la comunidad.' : 'No hay canciones públicas aún. ¡Sé el primero en compartir!'}
            renderOverlay={(song) => (
              <SaveSongButton
                saved={isSaved(song.id)}
                onToggle={() => handleToggleSave(song)}
              />
            )}
          />
        </div>
      )}
    </div>
  )
}
