-- ============================================
-- MyChords - SQL Migration
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Crear la tabla songs
CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  capo SMALLINT NOT NULL DEFAULT 0,
  chords JSONB NOT NULL DEFAULT '[]',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Índices
CREATE INDEX idx_songs_user_id ON songs(user_id);
CREATE INDEX idx_songs_is_public ON songs(is_public) WHERE is_public = true;

-- 3. Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER songs_updated_at
  BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. Activar Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS
CREATE POLICY "Users can view own songs and public songs"
  ON songs FOR SELECT
  USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert own songs"
  ON songs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own songs"
  ON songs FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own songs"
  ON songs FOR DELETE
  USING (user_id = auth.uid());
