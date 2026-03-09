import { useCallback, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Song, SongInsert, SongUpdate } from '../types/song'
import { useAuth } from '../contexts/AuthContext'
import { showToast } from '../components/ui/Toast'
import { getCached, setCache } from '../lib/cache'

function cacheKey(userId: string) {
  return `songs_${userId}`
}

export function useSongs() {
  const { user } = useAuth()
  const [songs, setSongs] = useState<Song[]>(() => {
    if (!user) return []
    const cached = getCached<Song[]>(cacheKey(user.id))
    return cached?.data ?? []
  })
  const [loading, setLoading] = useState(() => {
    if (!user) return true
    return !getCached<Song[]>(cacheKey(user.id))
  })
  const didSync = useRef(false)

  const fetchSongs = useCallback(async (forceNetwork = false) => {
    if (!user) return

    const key = cacheKey(user.id)
    const cached = getCached<Song[]>(key)

    // Always re-read from cache (it may have been updated by SongDetailPage)
    if (cached) {
      setSongs(cached.data)
      setLoading(false)
      if (!navigator.onLine || (didSync.current && !forceNetwork)) return
    } else {
      if (!navigator.onLine) {
        setLoading(false)
        return
      }
      setLoading(true)
    }

    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      if (!navigator.onLine) showToast('Sin conexión — mostrando datos guardados', 'warning')
      setLoading(false)
      return
    }

    if (data) {
      setSongs(data)
      setCache(key, data)
      didSync.current = true
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  const createSong = async (song: Omit<SongInsert, 'user_id'>) => {
    if (!user) return null
    if (!navigator.onLine) {
      showToast('Sin conexión — no se puede crear la canción', 'error')
      return null
    }
    const { data, error } = await supabase
      .from('songs')
      .insert({ ...song, user_id: user.id })
      .select()
      .single()
    if (error) {
      showToast('Error al crear la canción', 'error')
      return null
    }
    const updated = [data, ...songs]
    setSongs(updated)
    setCache(cacheKey(user.id), updated)
    return data
  }

  const updateSong = async (id: string, updates: SongUpdate) => {
    if (!user) return null
    if (!navigator.onLine) {
      showToast('Sin conexión — no se pueden guardar los cambios', 'error')
      return null
    }
    const { data, error } = await supabase
      .from('songs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) {
      showToast('Error al guardar los cambios', 'error')
      return null
    }
    const updated = songs.map(s => s.id === id ? data : s)
    setSongs(updated)
    setCache(cacheKey(user.id), updated)
    return data
  }

  const deleteSong = async (id: string) => {
    if (!user) return false
    if (!navigator.onLine) {
      showToast('Sin conexión — no se puede eliminar', 'error')
      return false
    }
    const { error } = await supabase.from('songs').delete().eq('id', id)
    if (error) {
      showToast('Error al eliminar la canción', 'error')
      return false
    }
    const updated = songs.filter(s => s.id !== id)
    setSongs(updated)
    setCache(cacheKey(user.id), updated)
    return true
  }

  return { songs, loading, createSong, updateSong, deleteSong, refetch: () => fetchSongs(true) }
}

const PUBLIC_CACHE_KEY = 'public_songs'

async function fetchPublicFromServer(search?: string): Promise<Song[] | null> {
  // Try with profiles join first (works if sql_profiles.sql was executed)
  let query = supabase
    .from('songs')
    .select('*, profiles(display_name)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50)
  if (search) query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%`)

  const { data, error } = await query
  if (!error && data) return data as unknown as Song[]

  // Fallback: fetch without join
  let fallback = supabase
    .from('songs')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50)
  if (search) fallback = fallback.or(`title.ilike.%${search}%,artist.ilike.%${search}%`)

  const { data: plain, error: err2 } = await fallback
  if (err2 || !plain) return null
  return plain
}

export function usePublicSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPublicSongs = useCallback(async (search?: string) => {
    // Offline: show cached data as fallback
    if (!navigator.onLine) {
      const cached = getCached<Song[]>(PUBLIC_CACHE_KEY)
      if (cached) {
        const data = cached.data
        if (search) {
          const q = search.toLowerCase()
          setSongs(data.filter(s =>
            s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
          ))
        } else {
          setSongs(data)
        }
      }
      setLoading(false)
      showToast('Sin conexión — mostrando datos guardados', 'warning')
      return
    }

    // Online: always fetch from server
    setLoading(true)
    const data = await fetchPublicFromServer(search)
    if (!data) {
      showToast('Error al cargar canciones', 'error')
      setLoading(false)
      return
    }
    setSongs(data)
    if (!search) setCache(PUBLIC_CACHE_KEY, data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPublicSongs()
  }, [fetchPublicSongs])

  return { songs, loading, search: fetchPublicSongs }
}

/* ── Saved Songs (offline-first library of other people's songs) ── */

const SAVED_SONGS_KEY = 'saved_songs'

export function useSavedSongs() {
  const [savedSongs, setSavedSongs] = useState<Song[]>(() => {
    const cached = getCached<Song[]>(SAVED_SONGS_KEY)
    return cached?.data ?? []
  })

  const isSaved = useCallback((songId: string) => {
    return savedSongs.some(s => s.id === songId)
  }, [savedSongs])

  const saveSong = useCallback((song: Song) => {
    if (savedSongs.some(s => s.id === song.id)) return
    const updated = [song, ...savedSongs]
    setSavedSongs(updated)
    setCache(SAVED_SONGS_KEY, updated)
    showToast('Canción guardada para offline', 'success')
  }, [savedSongs])

  const removeSavedSong = useCallback((songId: string) => {
    const updated = savedSongs.filter(s => s.id !== songId)
    setSavedSongs(updated)
    setCache(SAVED_SONGS_KEY, updated)
    showToast('Canción eliminada de guardados', 'success')
  }, [savedSongs])

  return { savedSongs, isSaved, saveSong, removeSavedSong }
}
