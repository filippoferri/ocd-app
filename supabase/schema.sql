-- Schema per il database Supabase
-- Esegui questo script nel SQL Editor di Supabase

-- 1. Tabella per gli ESERCIZI (Contenuto dell'app)
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  benefits_text TEXT NOT NULL,
  objective_text TEXT NOT NULL,
  duration INTEGER NOT NULL,
  image TEXT NOT NULL,
  audio_guide TEXT,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'generale',
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici Esercizi
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);

-- 2. Tabella PROFILI UTENTE (Estende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'user',
  onboarding_data JSONB DEFAULT '{}'::jsonb, -- Dati dell'onboarding salvati qui
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger per creare automaticamente il profilo alla registrazione
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Tabella ATTIVITÀ UTENTE (Diario: Ossessioni, Compulsioni, Test)
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type TEXT NOT NULL, -- 'ossessione', 'compulsione', 'test'
  symptom TEXT NOT NULL,
  intensity TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON user_activities(date);

-- 4. Tabella PROGRESSO ESERCIZI
CREATE TABLE IF NOT EXISTS exercise_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  step_responses JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercise_progress_user_id ON exercise_progress(user_id);

-- 5. POLITICHE DI SICUREZZA (RLS)

-- Abilita RLS su tutte le tabelle
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_progress ENABLE ROW LEVEL SECURITY;

-- ESERCIZI: Lettura pubblica, Modifica solo admin (qui semplificato a authenticated per demo)
CREATE POLICY "Exercises are viewable by everyone" ON exercises FOR SELECT USING (true);
CREATE POLICY "Exercises managed by auth users" ON exercises FOR ALL USING (auth.role() = 'authenticated');

-- PROFILI: Utenti vedono e modificano solo il proprio
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ATTIVITÀ: Utenti vedono e modificano solo le proprie
CREATE POLICY "Users view own activities" ON user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own activities" ON user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own activities" ON user_activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own activities" ON user_activities FOR DELETE USING (auth.uid() = user_id);

-- PROGRESSO: Utenti vedono e modificano solo il proprio
CREATE POLICY "Users view own progress" ON exercise_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progress" ON exercise_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Dati iniziali Esercizi (Se servono)
-- ... (inserire qui gli INSERT se necessario)
