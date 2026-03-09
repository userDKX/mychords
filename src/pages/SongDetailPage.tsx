import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useOnline } from '../hooks/useOnline'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { SongView } from '../components/song/SongView'
import { SongForm } from '../components/song/SongForm'
import { Modal } from '../components/ui/Modal'
import { FullPageSpinner } from '../components/ui/LoadingSpinner'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { showToast } from '../components/ui/Toast'
import { extractId } from '../lib/slugify'
import { useSavedSongs } from '../hooks/useSongs'
import { getCached, updateSongInCache, deleteSongFromCache, invalidatePublicCache } from '../lib/cache'
import type { Song } from '../types/song'
import type { ChordEntry } from '../types/chord'

function findSongInCaches(songId: string): Song | null {
  // Check user songs caches
  const userCaches = Object.keys(localStorage).filter(k => k.startsWith('mychords_songs_'))
  for (const k of userCaches) {
    try {
      const entry = JSON.parse(localStorage.getItem(k)!)
      const found = entry?.data?.find?.((s: Song) => s.id === songId)
      if (found) return found
    } catch { /* skip */ }
  }
  // Check public songs cache
  const pub = getCached<Song[]>('public_songs')
  if (pub) {
    const found = pub.data.find(s => s.id === songId)
    if (found) return found
  }
  // Check saved songs cache
  const saved = getCached<Song[]>('saved_songs')
  if (saved) {
    const found = saved.data.find(s => s.id === songId)
    if (found) return found
  }
  return null
}

export function SongDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { isSaved, saveSong, removeSavedSong } = useSavedSongs()
  const online = useOnline()

  useEffect(() => {
    if (!slug) return
    const songId = extractId(slug)

    if (!navigator.onLine) {
      setSong(findSongInCaches(songId))
      setLoading(false)
      return
    }

    // Show cached data instantly
    const cached = findSongInCaches(songId)
    if (cached) {
      setSong(cached)
      setLoading(false)
    }

    supabase.from('songs').select('*').eq('id', songId).single()
      .then(({ data }) => {
        if (data) setSong(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) return <FullPageSpinner />
  if (!song) return <div className="p-12 text-center text-slate-500 font-medium tracking-wide">Canción no encontrada</div>

  const isOwner = user?.id === song.user_id

  const syncCache = (updated: Song, prev: Song) => {
    if (!user) return
    updateSongInCache(user.id, updated)
    // If public status changed, invalidate public cache
    if (updated.is_public !== prev.is_public) {
      invalidatePublicCache()
    }
  }

  const handleUpdateChords = async (chords: ChordEntry[]) => {
    if (!navigator.onLine) {
      showToast('Sin conexión — no se pueden guardar los acordes', 'error')
      return
    }
    const { data, error } = await supabase
      .from('songs')
      .update({ chords })
      .eq('id', song.id)
      .select()
      .single()
    if (error) {
      showToast('Error al guardar los acordes', 'error')
      return
    }
    if (data) {
      syncCache(data, song)
      setSong(data)
    }
  }

  const handleUpdateInfo = async (info: { title: string; artist: string; notes: string; capo: number; is_public: boolean }) => {
    if (!navigator.onLine) {
      showToast('Sin conexión — no se pueden guardar los cambios', 'error')
      return
    }
    setSaving(true)
    const { data, error } = await supabase
      .from('songs')
      .update(info)
      .eq('id', song.id)
      .select()
      .single()
    setSaving(false)
    if (error) {
      showToast('Error al guardar los cambios', 'error')
      return
    }
    if (data) {
      syncCache(data, song)
      setSong(data)
      setEditOpen(false)
      showToast('Canción actualizada', 'success')
    }
  }

  const handleDelete = async () => {
    if (!navigator.onLine) {
      showToast('Sin conexión — no se puede eliminar', 'error')
      return
    }
    const { error } = await supabase.from('songs').delete().eq('id', song.id)
    if (error) {
      showToast('Error al eliminar la canción', 'error')
      return
    }
    if (user) {
      deleteSongFromCache(user.id, song.id)
      if (song.is_public) invalidatePublicCache()
    }
    navigate('/songs')
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-6">
      <div className="flex items-center justify-between gap-3 mb-8 px-2 md:px-0">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-11 h-11 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl" title="Volver">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-3">
          {/* Save/unsave button for non-owner songs */}
          {!isOwner && song && (
            isSaved(song.id) ? (
              <button
                onClick={() => removeSavedSong(song.id)}
                className="flex items-center justify-center w-11 h-11 text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 hover:bg-amber-500/20 rounded-xl ring-1 ring-amber-500/20"
                title="Quitar de guardados"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
              </button>
            ) : (
              <button
                onClick={() => saveSong(song)}
                className="flex items-center justify-center w-11 h-11 text-slate-400 hover:text-amber-400 transition-colors bg-white/5 hover:bg-amber-500/10 rounded-xl ring-1 ring-white/10 hover:ring-amber-500/20"
                title="Guardar para offline"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
              </button>
            )
          )}
          {isOwner && online && (
            <>
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center justify-center w-11 h-11 text-brand-300 hover:text-brand-200 transition-colors bg-brand-500/10 hover:bg-brand-500/20 rounded-xl ring-1 ring-brand-500/20"
                title="Editar Información"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex items-center justify-center w-11 h-11 text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 hover:bg-rose-500/20 rounded-xl ring-1 ring-rose-500/20"
                title="Eliminar Canción"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </>
          )}
        </div>
      </div>

      <SongView
        song={song}
        isOwner={isOwner}
        onUpdateChords={isOwner && online ? handleUpdateChords : undefined}
      />

      {/* Edit song info modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar canción">
        <SongForm
          initialData={{
            title: song.title,
            artist: song.artist,
            notes: song.notes,
            capo: song.capo,
            isPublic: song.is_public,
          }}
          saving={saving}
          onCancel={() => setEditOpen(false)}
          onSave={handleUpdateInfo}
        />
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Eliminar canción"
        message={`¿Estás seguro de que quieres eliminar "${song.title}"? Esta acción no se puede deshacer.`}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
