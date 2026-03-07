import type { ChordEntry } from './chord'

export interface Song {
  id: string
  user_id: string
  title: string
  artist: string
  notes: string
  capo: number // 0 = sin capo, 1-12 = traste del capo
  chords: ChordEntry[]
  is_public: boolean
  created_at: string
  updated_at: string
  // Joined from profiles table (only on public queries)
  profiles?: { display_name: string } | null
}

export type SongInsert = Omit<Song, 'id' | 'created_at' | 'updated_at'>
export type SongUpdate = Partial<Omit<Song, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
