import { useOnline } from '../../hooks/useOnline'

export function OfflineBanner() {
  const online = useOnline()

  if (online) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] flex items-center justify-center gap-2 px-4 bg-amber-500/20 border-b border-amber-500/30 backdrop-blur-xl text-amber-300 text-sm font-medium" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 10px)', paddingBottom: 10 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
      </svg>
      Sin conexión — solo puedes ver datos guardados
    </div>
  )
}
