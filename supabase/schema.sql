-- Schema per il database Supabase
-- Esegui questo script nel SQL Editor di Supabase

-- Tabella per gli esercizi
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  benefits_text TEXT NOT NULL,
  objective_text TEXT NOT NULL,
  duration INTEGER NOT NULL, -- durata in minuti
  image TEXT NOT NULL, -- path dell'immagine
  audio_guide TEXT, -- path del file audio nel storage
  steps JSONB NOT NULL DEFAULT '[]'::jsonb, -- array di ExerciseStep
  category TEXT DEFAULT 'generale',
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_created_at ON exercises(created_at);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabella per il progresso degli utenti (opzionale per il futuro)
CREATE TABLE IF NOT EXISTS exercise_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  user_id UUID, -- riferimento all'utente (se implementerai auth)
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  step_responses JSONB DEFAULT '{}'::jsonb, -- risposte ai passi
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercise_progress_exercise_id ON exercise_progress(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_user_id ON exercise_progress(user_id);

-- Politiche RLS (Row Level Security) - per ora permissive
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_progress ENABLE ROW LEVEL SECURITY;

-- Politica per lettura pubblica degli esercizi
CREATE POLICY "Exercises are viewable by everyone" ON exercises
  FOR SELECT USING (true);

-- Politica per inserimento/aggiornamento solo per utenti autenticati (admin)
CREATE POLICY "Exercises can be managed by authenticated users" ON exercises
  FOR ALL USING (auth.role() = 'authenticated');

-- Politica per il progresso degli esercizi
CREATE POLICY "Users can view and insert their own progress" ON exercise_progress
  FOR ALL USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Inserimento di alcuni esercizi di esempio
INSERT INTO exercises (name, intro_text, benefits_text, objective_text, duration, image, steps, category, difficulty) VALUES
(
  'Respirazione Consapevole',
  'Un esercizio di respirazione guidata per ridurre l''ansia e i pensieri ossessivi.',
  'Riduce l''ansia, calma la mente, migliora la concentrazione, diminuisce i pensieri intrusivi',
  'Raggiungere uno stato di calma mentale',
  10,
  'breathing.jpg',
  '[
    {
      "id": "step1",
      "type": "list",
      "title": "Preparazione",
      "content": ["Trova una posizione comoda", "Chiudi gli occhi", "Rilassa le spalle"]
    },
    {
      "id": "step2",
      "type": "textarea",
      "title": "Riflessione",
      "placeholder": "Come ti senti dopo l''esercizio?"
    }
  ]'::jsonb,
  'respirazione',
  'easy'
),
(
  'Mindfulness del Momento Presente',
  'Esercizio per ancorare l''attenzione al presente e ridurre i pensieri ossessivi.',
  'Aumenta la consapevolezza, riduce i pensieri ripetitivi, migliora l''autocontrollo',
  'Sviluppare presenza mentale',
  15,
  'mindfulness.jpg',
  '[
    {
      "id": "step1",
      "type": "list",
      "title": "Osservazione",
      "content": ["Nota 5 cose che vedi", "Nota 4 cose che senti", "Nota 3 cose che tocchi"]
    },
    {
      "id": "step2",
      "type": "textarea",
      "title": "Esperienza",
      "placeholder": "Descrivi la tua esperienza con questo esercizio"
    }
  ]'::jsonb,
  'mindfulness',
  'medium'
);

-- Creazione del bucket per i file audio (da eseguire nell'interfaccia Storage di Supabase)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('exercise-audio', 'exercise-audio', true);

-- Politiche per il bucket audio
-- CREATE POLICY "Audio files are publicly accessible" ON storage.objects
--   FOR SELECT USING (bucket_id = 'exercise-audio');

-- CREATE POLICY "Authenticated users can upload audio" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'exercise-audio' AND auth.role() = 'authenticated');