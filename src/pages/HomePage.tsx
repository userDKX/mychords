import { useAuth } from '../contexts/AuthContext'
import { useSongs } from '../hooks/useSongs'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export function HomePage() {
  const { user, signOut } = useAuth()
  const { songs, loading } = useSongs()

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="mt-2 pl-4 md:pl-0 border-l-4 border-brand-500 rounded-sm">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 pl-3">Mi Perfil</h1>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden mt-6">
        <div className="absolute right-0 top-0 w-40 h-40 bg-brand-500/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute left-[-10%] bottom-[-10%] w-40 h-40 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-10 relative z-10">
          <div className="w-24 h-24 bg-brand-500/15 rounded-full flex items-center justify-center border border-brand-500/20 ring-1 ring-brand-500/10 shadow-inner mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-brand-400">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-50 tracking-tight">{user?.email?.split('@')[0]}</h2>
            <p className="text-brand-300 font-medium mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 relative z-10">
          <div className="bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center shadow-inner">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Canciones creadas</span>
            {loading ? <LoadingSpinner size={24} /> : <span className="text-5xl font-black text-white">{songs.length}</span>}
          </div>
          <div className="bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center shadow-inner">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Estado de cuenta</span>
            <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-5 py-2 rounded-xl border border-emerald-500/20 ring-1 ring-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]">Activa</span>
          </div>
        </div>

        <div className="relative z-10">
          <Button
            onClick={signOut}
            variant="secondary"
            className="w-full py-4 text-rose-400 hover:text-white hover:bg-rose-500 hover:border-rose-400/50 bg-rose-500/10 border-rose-500/20 font-bold transition-all shadow-[0_0_20px_rgba(244,63,94,0.1)] text-base"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  )
}
