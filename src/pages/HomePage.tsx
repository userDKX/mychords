import { useState } from 'react'
import type { SVGProps } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSongs } from '../hooks/useSongs'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { supabase } from '../lib/supabase'

export function HomePage() {
  const { user, signOut } = useAuth()
  const { songs, loading } = useSongs()

  const initialName =
    (user?.user_metadata?.display_name as string) ||
    user?.email?.split('@')[0] ||
    ''

  const [isEditing, setIsEditing] = useState(false)
  const [nameInput, setNameInput] = useState(initialName)
  const [displayName, setDisplayName] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setShowSuccess] = useState(false)

  const handleEdit = () => {
    setNameInput(displayName)
    setIsEditing(true)
    setSaveError(null)
    setShowSuccess(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSaveError(null)
  }

  const handleSave = async () => {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    setSaving(true)
    setSaveError(null)
    const { error } = await supabase.auth.updateUser({
      data: { display_name: trimmed },
    })
    setSaving(false)
    if (error) {
      setSaveError('No se pudo guardar el nombre. Intenta de nuevo.')
    } else {
      setDisplayName(trimmed)
      setIsEditing(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="mt-2 pl-4 md:pl-0 border-l-4 border-brand-500 rounded-sm">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 pl-3">
          Mi Perfil
        </h1>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden mt-6">
        <div className="absolute right-0 top-0 w-40 h-40 bg-brand-500/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute left-[-10%] bottom-[-10%] w-40 h-40 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none" />

        {/* Avatar + Nombre */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-10 relative z-10">
          <div className="w-24 h-24 bg-brand-500/15 rounded-full flex items-center justify-center border border-brand-500/20 ring-1 ring-brand-500/10 shadow-inner mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-brand-400">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* Nombre editable */}
          {isEditing ? (
            <div className="w-full max-w-xs space-y-3">
              <input
                id="display-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
                maxLength={40}
                autoFocus
                placeholder="Tu nombre de usuario"
                className="w-full bg-white/5 border border-brand-500/30 focus:border-brand-500/70 rounded-xl px-4 py-2.5 text-center text-xl font-bold text-slate-50 outline-none transition-all placeholder:text-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-brand-500/20"
              />
              {saveError && (
                <p className="text-rose-400 text-xs font-medium">{saveError}</p>
              )}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
                >
                  Cancelar
                </button>
                <button
                  id="save-name-btn"
                  onClick={handleSave}
                  disabled={saving || !nameInput.trim()}
                  className="px-4 py-2 text-sm font-bold text-white bg-brand-500/80 hover:bg-brand-500 disabled:opacity-40 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:shadow-none"
                >
                  {saving ? <LoadingSpinner size={14} /> : <CheckIcon className="w-4 h-4" />}
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl font-extrabold text-slate-50 tracking-tight">
                  {displayName}
                </h2>
                <button
                  id="edit-name-btn"
                  onClick={handleEdit}
                  title="Editar nombre"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
              {saveSuccess && (
                <p className="text-emerald-400 text-xs font-medium animate-in fade-in duration-300">
                  ✓ Nombre actualizado correctamente
                </p>
              )}
              <p className="text-brand-300 font-medium mt-1">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Stats */}
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

        {/* Logout */}
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

function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
