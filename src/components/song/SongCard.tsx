import { Link } from 'react-router-dom'
import type { Song } from '../../types/song'
import { songPath } from '../../lib/slugify'

interface SongCardProps {
  song: Song
  showAuthor?: boolean
}

export function SongCard({ song, showAuthor }: SongCardProps) {
  return (
    <Link
      to={songPath(song)}
      className="group relative flex flex-col justify-between overflow-hidden bg-slate-900/40 border border-white/10 hover:border-brand-500/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(99,102,241,0.3)] backdrop-blur-xl"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute -inset-x-8 -top-8 aspect-square bg-gradient-to-br from-brand-500/20 to-purple-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none z-0" />

      <div className="relative z-10 flex-col flex h-full">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-xl text-slate-50 truncate tracking-tight drop-shadow-md group-hover:text-brand-300 transition-colors duration-300">{song.title}</h3>
            {song.artist ? (
              <p className="text-brand-300/80 font-semibold text-sm truncate mt-1">{song.artist}</p>
            ) : (
              <p className="text-slate-500 font-medium text-sm truncate mt-1">Artista desconocido</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-black/40 p-2.5 rounded-2xl ring-1 ring-white/10 shadow-inner">
            {song.is_public ? (
              <div className="relative" title="Pública">
                <div className="absolute inset-0 bg-emerald-400 blur-md opacity-40"></div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative text-emerald-400">
                  <circle cx="12" cy="12" r="10" /><path d="M2 12h20" />
                </svg>
              </div>
            ) : (
              <div title="Privada">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          {song.notes && <p className="text-sm text-slate-400 mt-1 line-clamp-3 leading-relaxed font-medium">{song.notes}</p>}
        </div>

        <div className="mt-6 flex items-center justify-between pt-5 border-t border-white/10">
          <div className="flex items-center gap-2">
            {song.capo > 0 ? (
              <span className="inline-flex items-center px-3 py-1.5 bg-brand-500/15 text-brand-300 text-[10px] font-bold uppercase tracking-widest rounded-xl ring-1 ring-brand-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                Capo {song.capo}
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 bg-white/[0.03] text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/5">
                Sin Capo
              </span>
            )}
          </div>

          {showAuthor && song.profiles?.display_name && <span className="text-xs text-slate-500 bg-black/20 px-2 py-1 rounded-md font-medium">Por {song.profiles.display_name}</span>}

          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] group-hover:-rotate-12 group-hover:scale-110">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
