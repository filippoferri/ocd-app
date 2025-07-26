# Configurazione Supabase per OCD App

Questa guida ti aiuterà a configurare Supabase per gestire i dati degli esercizi e i file audio.

## 1. Creazione del Progetto Supabase

1. Vai su [supabase.com](https://supabase.com) e crea un account
2. Clicca su "New Project"
3. Scegli un nome per il progetto (es. "ocd-app")
4. Imposta una password sicura per il database
5. Seleziona una regione vicina a te
6. Clicca "Create new project"

## 2. Configurazione del Database

1. Nel dashboard di Supabase, vai su "SQL Editor"
2. Copia tutto il contenuto del file `supabase/schema.sql`
3. Incolla nel SQL Editor e clicca "Run"
4. Questo creerà:
   - Tabella `exercises` per gli esercizi
   - Tabella `exercise_progress` per il progresso utenti
   - Indici per le performance
   - Politiche di sicurezza RLS
   - Alcuni esercizi di esempio

## 3. Configurazione dello Storage

1. Vai su "Storage" nel menu laterale
2. Clicca "Create a new bucket"
3. Nome bucket: `exercise-audio`
4. Seleziona "Public bucket" (per accesso diretto ai file audio)
5. Clicca "Create bucket"

### Politiche Storage (opzionale)
Se vuoi maggiore controllo, puoi configurare politiche personalizzate:

```sql
-- Lettura pubblica dei file audio
CREATE POLICY "Audio files are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'exercise-audio');

-- Upload solo per utenti autenticati
CREATE POLICY "Authenticated users can upload audio" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'exercise-audio' AND auth.role() = 'authenticated');
```

## 4. Configurazione dell'App

1. Nel dashboard Supabase, vai su "Settings" > "API"
2. Copia:
   - **Project URL** (es. `https://xyzcompany.supabase.co`)
   - **anon public key** (la chiave lunga che inizia con `eyJ...`)

3. Crea un file `.env` nella root del progetto:
```bash
cp .env.example .env
```

4. Modifica il file `.env` con le tue credenziali:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. Test della Connessione

Per testare che tutto funzioni:

1. Avvia l'app: `npm start`
2. Apri la console del browser (F12)
3. Vai nella sezione "Esplora"
4. Dovresti vedere gli esercizi di esempio caricati da Supabase

## 6. Migrazione dei Dati Esistenti

### Opzione A: Migrazione Manuale
1. Vai su Supabase Dashboard > "Table Editor" > "exercises"
2. Clicca "Insert" > "Insert row"
3. Compila i campi per ogni esercizio esistente

### Opzione B: Script di Migrazione
Puoi creare uno script per migrare automaticamente i dati esistenti:

```typescript
// scripts/migrate-exercises.ts
import SupabaseExerciseService from '../services/SupabaseService';
import ExerciseService from '../services/ExerciseService';

async function migrateExercises() {
  const localExercises = ExerciseService.getAllExercises();
  
  for (const exercise of localExercises) {
    await SupabaseExerciseService.createExercise({
      name: exercise.name,
      intro_text: exercise.introText,
      benefits_text: exercise.benefitsText,
      objective_text: exercise.objectiveText,
      duration: exercise.duration,
      image: exercise.image,
      audio_guide: exercise.audioGuide,
      steps: exercise.steps,
      category: exercise.category,
      difficulty: exercise.difficulty
    });
  }
}
```

## 7. Upload dei File Audio

### Via Dashboard (Manuale)
1. Vai su "Storage" > "exercise-audio"
2. Clicca "Upload file"
3. Seleziona i file MP3
4. I file saranno accessibili via URL pubblico

### Via Codice (Programmatico)
```typescript
// Esempio di upload
const audioFile = new File([audioBlob], 'exercise-1.mp3', { type: 'audio/mpeg' });
const audioPath = await SupabaseExerciseService.uploadAudio(audioFile, 'exercise-1.mp3');
```

## 8. Sostituzione del Service Esistente

Quando sei pronto, sostituisci l'ExerciseService esistente:

```typescript
// In ExploreScreen.tsx o dove usi gli esercizi
import SupabaseExerciseService from '../services/SupabaseService';

// Sostituisci
// const exercises = ExerciseService.getAllExercises();
// Con
const exercises = await SupabaseExerciseService.getAllExercises();
```

## 9. Vantaggi della Migrazione

✅ **Scalabilità**: Database PostgreSQL professionale
✅ **Storage**: CDN globale per file audio
✅ **Backup**: Backup automatici
✅ **Real-time**: Aggiornamenti in tempo reale
✅ **Admin**: Dashboard per gestire contenuti
✅ **API**: REST e GraphQL automatiche
✅ **Sicurezza**: Row Level Security

## 10. Prossimi Passi

1. **Piattaforma Admin**: Crea un'interfaccia web per gestire esercizi
2. **Autenticazione**: Aggiungi login utenti
3. **Analytics**: Traccia l'uso degli esercizi
4. **Sincronizzazione**: Sync offline/online
5. **Notifiche**: Push notifications

## Supporto

Se hai problemi:
1. Controlla la console del browser per errori
2. Verifica le credenziali nel file `.env`
3. Controlla i log in Supabase Dashboard > "Logs"
4. Consulta la [documentazione Supabase](https://supabase.com/docs)