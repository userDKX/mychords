import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSongs } from '../hooks/useSongs'
import { SongForm } from '../components/song/SongForm'

export function SongCreatePage() {
  const { createSong } = useSongs()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="mt-2 pl-4 md:pl-0 border-l-4 border-brand-500 rounded-sm">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 pl-3">Nueva Canción</h1>
      </div>
      <SongForm
        saving={saving}
        onCancel={() => navigate('/songs')}
        onSave={async data => {
          setSaving(true)
          const result = await createSong({ ...data, chords: [], capo: data.capo ?? 0 })
          if (result) navigate(`/songs/${result.id}`)
          setSaving(false)
        }}
      />
    </div>
  )
}
