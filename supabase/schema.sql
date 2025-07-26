-- Schema per il database Supabase
-- Esegui questo script nel SQL Editor di Supabase

-- Tabella per gli esercizi
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  intro_text TEXT NOT NULL, -- Descrizione - In cosa consiste l'esercizio
  benefits_text TEXT NOT NULL, -- Perché - Lista di benefit
  objective_text TEXT NOT NULL, -- Obiettivo (molto corto)
  duration INTEGER NOT NULL, -- durata in minuti
  image TEXT NOT NULL, -- path dell'immagine square
  audio_guide TEXT, -- path del file audio principale nel storage
  steps JSONB NOT NULL DEFAULT '[]'::jsonb, -- array di ExerciseStep con tipi: default, withaudio, withtextarea, withbreath
  category TEXT DEFAULT 'generale',
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_active BOOLEAN DEFAULT true, -- per abilitare/disabilitare esercizi
  sort_order INTEGER DEFAULT 0, -- per ordinare gli esercizi
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

-- Inserimento di alcuni esercizi di esempio con i nuovi tipi di step
INSERT INTO exercises (name, intro_text, benefits_text, objective_text, duration, image, steps, category, difficulty, sort_order) VALUES
(
  'Respirazione Consapevole',
  'Un esercizio di respirazione guidata per ridurre l''ansia e i pensieri ossessivi.',
  '• Riduce l''ansia e lo stress\n• Calma la mente\n• Migliora la concentrazione\n• Diminuisce i pensieri intrusivi',
  'Raggiungere uno stato di calma mentale',
  10,
  'breathing.jpg',
  '[
    {
      "id": "preparation",
      "type": "default",
      "title": "Preparazione",
      "content": ["Trova una posizione comoda", "Chiudi gli occhi", "Rilassa le spalle", "Porta l''attenzione al respiro"]
    },
    {
      "id": "breathing-practice",
      "type": "withbreath",
      "title": "Pratica di Respirazione",
      "content": ["Segui il ritmo del cerchio", "Inspira quando si espande", "Espira quando si contrae"],
      "audioFile": "breathing-guide.mp3",
      "duration": 5
    },
    {
      "id": "reflection",
      "type": "withtextarea",
      "title": "Riflessione",
      "placeholder": "Come ti senti dopo l''esercizio? Hai notato cambiamenti nel tuo stato d''animo?"
    }
  ]'::jsonb,
  'respirazione',
  'easy',
  1
),
(
  'Meditazione Guidata',
  'Il Body Scan è una tecnica di mindfulness che ti aiuta a sviluppare consapevolezza del tuo corpo e delle sensazioni fisiche.',
  '• Aumenta la consapevolezza\n• Riduce i pensieri ripetitivi\n• Migliora l''autocontrollo\n• Favorisce il rilassamento profondo',
  'Sviluppare presenza mentale',
  15,
  'mindfulness.jpg',
  '[
    {
      "id": "preparation",
      "type": "default",
      "title": "Preparazione",
      "content": ["Trova una posizione comoda, seduto o sdraiato", "Chiudi gli occhi o abbassa lo sguardo", "Fai 3 respiri profondi per rilassarti"]
    },
    {
      "id": "guided-meditation",
      "type": "withaudio",
      "title": "Meditazione Guidata",
      "content": ["Segui la guida audio", "Porta l''attenzione al momento presente", "Osserva senza giudicare"],
      "audioFile": "meditation-step2-practice.mp3",
      "duration": 10
    },
    {
      "id": "experience",
      "type": "withtextarea",
      "title": "Esperienza",
      "placeholder": "Descrivi la tua esperienza con questo esercizio. Quali sensazioni hai percepito?"
    }
  ]'::jsonb,
  'mindfulness',
  'medium',
  2
),
(
  'Contrasta la Compulsione',
  'Questo esercizio ti aiuta a riconoscere e resistere alle compulsioni attraverso tecniche di esposizione graduale.',
  '• Riduce la forza delle compulsioni\n• Aumenta la tolleranza all''ansia\n• Migliora il senso di controllo\n• Sviluppa strategie di coping',
  'Resistere alle compulsioni e tollerare l''ansia',
  20,
  'contrasta-compulsione.jpg',
  '[
    {
      "id": "identify-trigger",
      "type": "withtextarea",
      "title": "Identifica il Trigger",
      "placeholder": "Descrivi la situazione o il pensiero che ha scatenato l''impulso compulsivo..."
    },
    {
      "id": "resistance-techniques",
      "type": "withaudio",
      "title": "Tecniche di Resistenza",
      "content": ["Riconosci l''impulso senza agire", "Respira profondamente", "Ricorda che l''ansia è temporanea", "Usa la tecnica del surfing"],
      "audioFile": "resistance-techniques.mp3",
      "duration": 8
    },
    {
      "id": "outcome-reflection",
      "type": "withtextarea",
      "title": "Risultato",
      "placeholder": "Come è andata? Sei riuscito a resistere? Cosa hai imparato da questa esperienza?"
    }
  ]'::jsonb,
  'exposure',
  'medium',
  3
);

-- Creazione del bucket per i file audio (da eseguire nell'interfaccia Storage di Supabase)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('exercise-audio', 'exercise-audio', true);

-- Politiche per il bucket audio
-- CREATE POLICY "Audio files are publicly accessible" ON storage.objects
--   FOR SELECT USING (bucket_id = 'exercise-audio');

-- CREATE POLICY "Authenticated users can upload audio" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'exercise-audio' AND auth.role() = 'authenticated');