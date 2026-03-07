-- ==========================================
-- Tabla de perfiles de usuario
-- ==========================================

-- 1. Crear tabla profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Cualquiera puede leer perfiles
CREATE POLICY "Perfiles visibles para todos"
  ON profiles FOR SELECT
  USING (true);

-- 4. Solo el dueño puede actualizar su perfil
CREATE POLICY "Usuario actualiza su perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. Crear perfiles para usuarios ya existentes
INSERT INTO profiles (id, display_name)
SELECT id, split_part(email, '@', 1)
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 7. FK para que Supabase haga join automático songs <-> profiles
ALTER TABLE songs
  ADD CONSTRAINT songs_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id);
