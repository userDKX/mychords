import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Song, SongInsert, SongUpdate } from '../types/song'
import { useAuth } from '../contexts/AuthContext'
import { showToast } from '../components/ui/Toast'

export function useSongs() {
  const { user } = useAuth()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSongs = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) {
      if (!navigator.onLine) showToast('Sin conexión — mostrando datos guardados', 'warning')
    }
    if (!error && data) setSongs(data)
    setLoading(false)
  }, [user])

  useEffect(() => { fetchSongs() }, [fetchSongs])

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
    setSongs(prev => [data, ...prev])
    return data
  }

  const updateSong = async (id: string, updates: SongUpdate) => {
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
    setSongs(prev => prev.map(s => s.id === id ? data : s))
    return data
  }

  const deleteSong = async (id: string) => {
    if (!navigator.onLine) {
      showToast('Sin conexión — no se puede eliminar', 'error')
      return false
    }
    const { error } = await supabase.from('songs').delete().eq('id', id)
    if (error) {
      showToast('Error al eliminar la canción', 'error')
      return false
    }
    setSongs(prev => prev.filter(s => s.id !== id))
    return true
  }

  return { songs, loading, createSong, updateSong, deleteSong, refetch: fetchSongs }
}

export function usePublicSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPublicSongs = useCallback(async (search?: string) => {
    setLoading(true)
    let query = supabase
      .from('songs')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(50)
    if (search) {
      query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%`)
    }
    const { data, error } = await query
    if (error && !navigator.onLine) {
      showToast('Sin conexión — mostrando datos guardados', 'warning')
    }
    if (!error && data) setSongs(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchPublicSongs() }, [fetchPublicSongs])

  return { songs, loading, search: fetchPublicSongs }
}
