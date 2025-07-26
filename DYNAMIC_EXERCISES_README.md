# Sistema di Esercizi Dinamici con Supabase

Questo documento descrive l'implementazione del sistema di esercizi dinamici che utilizza Supabase come database per rendere gli esercizi configurabili e aggiornabili senza modificare il codice.

## 🏗️ Architettura

### Componenti Principali

1. **SupabaseExerciseService** - Servizio per interagire con Supabase
2. **ExerciseServiceAdapter** - Adapter per migrazione graduale
3. **ExerciseService** - Servizio locale originale (mantenuto per fallback)
4. **Script di migrazione** - Per caricare esercizi esistenti su Supabase

### Schema Database

```sql
-- Tabella exercises
CREATE TABLE exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  benefits_text TEXT,
  objective_text TEXT,
  duration INTEGER NOT NULL,
  image TEXT,
  audio_guide TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  category TEXT DEFAULT 'generale',
  difficulty TEXT DEFAULT 'easy',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📝 Tipi di Step Supportati

### 1. Step Default (`default`)
- **Descrizione**: Step con solo contenuto testuale/lista
- **Campi**: `title`, `content` (array di stringhe)
- **Audio**: Non presente

```json
{
  "id": "step-1",
  "type": "default",
  "title": "Preparazione",
  "content": [
    "Trova una posizione comoda",
    "Chiudi gli occhi",
    "Fai 3 respiri profondi"
  ]
}
```

### 2. Step con Audio (`withaudio`)
- **Descrizione**: Step con audio e linee guida
- **Campi**: `title`, `content`, `audioFile`, `duration`
- **Audio**: Presente e riproducibile

```json
{
  "id": "step-2",
  "type": "withaudio",
  "title": "Pratica Guidata",
  "content": [
    "Segui la guida audio",
    "Concentrati sul respiro"
  ],
  "audioFile": "./assets/audio/breathing-guide.mp3",
  "duration": 300
}
```

### 3. Step con Textarea (`withtextarea`)
- **Descrizione**: Step per input utente con linee guida
- **Campi**: `title`, `content`, `placeholder`
- **Audio**: Disabilitato (opacity ridotta)

```json
{
  "id": "step-3",
  "type": "withtextarea",
  "title": "Riflessione",
  "content": [
    "Rifletti sull'esperienza",
    "Scrivi i tuoi pensieri"
  ],
  "placeholder": "Descrivi cosa hai notato durante la pratica..."
}
```

### 4. Step Respirazione (`withbreath`)
- **Descrizione**: Step con cerchio animato per respirazione
- **Campi**: `title`, `audioFile`, `duration`
- **UI**: Cerchio che si espande/contrae con l'audio

```json
{
  "id": "step-4",
  "type": "withbreath",
  "title": "Respirazione Guidata",
  "audioFile": "./assets/audio/breath-rhythm.mp3",
  "duration": 180
}
```

## 🚀 Configurazione e Utilizzo

### 1. Inizializzazione

```typescript
import exerciseConfig from './config/exerciseConfig';

// Inizializza il servizio (in App.tsx)
exerciseConfig.initialize();

// Test connessione
const result = await exerciseConfig.test();
console.log('Connessione Supabase:', result.supabaseConnected);
```

### 2. Modalità di Funzionamento

```typescript
// Modalità ibrida (predefinita) - preferisce Supabase, fallback locale
exerciseConfig.switchDataSource('hybrid');

// Solo Supabase
exerciseConfig.switchDataSource('supabase');

// Solo locale
exerciseConfig.switchDataSource('local');
```

### 3. Utilizzo nei Componenti

```typescript
import ExerciseServiceAdapter from '../services/ExerciseServiceAdapter';

// Ottieni tutti gli esercizi
const exercises = await ExerciseServiceAdapter.getAllExercises();

// Ottieni esercizi per categoria
const mindfulnessExercises = await ExerciseServiceAdapter.getExercisesByCategory('mindfulness');

// Ottieni raccomandazioni giornaliere
const dailyExercises = await ExerciseServiceAdapter.getDailyRecommendations();

// Salva progresso
await ExerciseServiceAdapter.saveExerciseProgress(progress);
```

## 📦 Migrazione Dati

### Script Automatico

```bash
# Migrazione completa
npx ts-node scripts/migrateExercises.ts

# Solo verifica
npx ts-node scripts/migrateExercises.ts --verify
```

### Migrazione Programmatica

```typescript
import exerciseConfig from './config/exerciseConfig';

const result = await exerciseConfig.migrate();
if (result.success) {
  console.log(`Migrati ${result.migrated} esercizi`);
} else {
  console.error('Errori:', result.errors);
}
```

## 🎨 Interfaccia Utente

### Rendering Step Dinamico

Il componente `ExerciseDetailScreen` gestisce automaticamente i diversi tipi di step:

- **Default**: Mostra lista di contenuti
- **WithAudio**: Player audio + contenuti
- **WithTextarea**: Input area + linee guida
- **WithBreath**: Cerchio animato + audio

### Gestione Audio

- Audio caricato da Supabase Storage
- Controlli play/pause
- Progress bar
- Auto-stop al cambio step

### Animazioni Respirazione

- Cerchio SVG animato
- Sincronizzazione con audio
- Velocità configurabile

## 🔧 Amministrazione

### Aggiungere Nuovi Esercizi

```typescript
const newExercise = {
  name: "Nuovo Esercizio",
  introText: "Descrizione introduttiva...",
  benefitsText: "Benefici dell'esercizio...",
  objectiveText: "Obiettivo dell'esercizio",
  duration: 15,
  image: "new-exercise",
  audioGuide: "./assets/audio/new-exercise.mp3",
  steps: [
    {
      id: "step-1",
      type: "default",
      title: "Preparazione",
      content: ["Istruzione 1", "Istruzione 2"]
    }
  ],
  category: "mindfulness",
  difficulty: "easy"
};

await SupabaseExerciseService.createExercise(newExercise);
```

### Aggiornare Esercizi

```typescript
await SupabaseExerciseService.updateExercise(exerciseId, {
  name: "Nome Aggiornato",
  duration: 20
});
```

### Disattivare Esercizi

```typescript
// Soft delete
await SupabaseExerciseService.deactivateExercise(exerciseId);
```

## 📊 Monitoraggio

### Statistiche

```typescript
const stats = await ExerciseServiceAdapter.getDataSourceStats();
console.log('Esercizi Supabase:', stats.supabaseCount);
console.log('Esercizi locali:', stats.localCount);
console.log('Supabase disponibile:', stats.supabaseAvailable);
```

### Logging

Il sistema include logging dettagliato per:
- Connessioni Supabase
- Fallback ai dati locali
- Errori di caricamento
- Statistiche di utilizzo

## 🔒 Sicurezza

### Row Level Security (RLS)

```sql
-- Solo lettura per utenti autenticati
CREATE POLICY "Users can read active exercises" ON exercises
  FOR SELECT USING (is_active = true);

-- Solo admin possono modificare
CREATE POLICY "Only admins can modify exercises" ON exercises
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Validazione Dati

- Validazione schema JSON per steps
- Controllo tipi step supportati
- Sanitizzazione input utente

## 🚨 Gestione Errori

### Strategia Fallback

1. **Tentativo Supabase**: Prima prova a caricare da Supabase
2. **Fallback Locale**: Se fallisce, usa dati locali
3. **Logging**: Registra tutti gli errori
4. **Retry**: Riprova automaticamente le richieste fallite

### Errori Comuni

- **Connessione Supabase**: Fallback automatico a dati locali
- **Esercizio non trovato**: Ritorna null, gestito dall'UI
- **Audio non disponibile**: Player disabilitato, esercizio continua
- **Step malformato**: Skip step, continua con il successivo

## 📱 Compatibilità

- ✅ iOS
- ✅ Android
- ✅ Web (Expo)
- ✅ Offline (con dati locali)
- ✅ Migrazione graduale

## 🔄 Roadmap

### Prossime Funzionalità

- [ ] Editor visuale per esercizi
- [ ] Versioning degli esercizi
- [ ] A/B testing per varianti
- [ ] Analytics avanzate
- [ ] Sincronizzazione offline
- [ ] Esportazione/importazione esercizi

### Miglioramenti Tecnici

- [ ] Cache intelligente
- [ ] Preload audio
- [ ] Compressione dati
- [ ] Ottimizzazione performance
- [ ] Test automatizzati

---

**Nota**: Questo sistema è progettato per essere retrocompatibile. Gli esercizi locali continueranno a funzionare anche dopo l'implementazione di Supabase.