interface SaveSongButtonProps {
  saved: boolean
  onToggle: () => void
}

export function SaveSongButton({ saved, onToggle }: SaveSongButtonProps) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle() }}
      className={`absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-xl backdrop-blur-md ring-1 transition-all duration-300 ${
        saved
          ? 'bg-amber-500/20 text-amber-400 ring-amber-500/30 hover:bg-rose-500/20 hover:text-rose-400 hover:ring-rose-500/30'
          : 'bg-black/60 text-slate-400 ring-white/10 hover:text-amber-400 hover:bg-amber-500/20 hover:ring-amber-500/30'
      }`}
      title={saved ? 'Quitar de guardados' : 'Guardar para offline'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
}
