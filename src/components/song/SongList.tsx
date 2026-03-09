import type { ReactNode } from 'react'
import type { Song } from '../../types/song'
import { SongCard } from './SongCard'

interface SongListProps {
  songs: Song[]
  showAuthor?: boolean
  emptyMessage?: string
  onRemoveSaved?: (songId: string) => void
  renderOverlay?: (song: Song) => ReactNode
}

export function SongList({ songs, showAuthor, emptyMessage = 'No hay canciones', onRemoveSaved, renderOverlay }: SongListProps) {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-4 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-md">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/10 shadow-inner">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
        </div>
        <p className="text-slate-400 font-medium text-center">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {songs.map(song => (
        <SongCard
          key={song.id}
          song={song}
          showAuthor={showAuthor}
          onRemoveSaved={onRemoveSaved}
          overlay={renderOverlay?.(song)}
        />
      ))}
    </div>
  )
}
