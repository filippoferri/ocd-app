# Pianificazione Esercizi OCD App

Questo documento definisce tutti gli esercizi che verranno implementati nell'app OCD, con i dettagli completi per il caricamento su Supabase.

## 🎯 Strategia di Implementazione

1. **Definizione Esercizi**: Creare la struttura completa di ogni esercizio
2. **File Audio**: Caricare i file audio su Supabase Storage
3. **Migrazione Database**: Caricare gli esercizi su Supabase
4. **Test e Verifica**: Verificare che tutto funzioni correttamente

## 📚 Lista Esercizi da Implementare

### 1. Respirazione Consapevole
- **Categoria**: respirazione
- **Difficoltà**: easy
- **Durata**: 10 minuti
- **Audio necessari**: 
  - `breathing-guide.mp3` (guida respirazione)
- **Steps**:
  1. Preparazione (default)
  2. Pratica di Respirazione (withbreath + audio)
  3. Riflessione (withtextarea)

### 2. Meditazione Guidata (Body Scan)
- **Categoria**: mindfulness
- **Difficoltà**: medium
- **Durata**: 15 minuti
- **Audio necessari**:
  - `meditation-step1-preparation.mp3` (già esistente)
  - `meditation-step2-practice.mp3` (già esistente)
- **Steps**:
  1. Preparazione (withaudio)
  2. Pratica Body Scan (withaudio)
  3. Riflessione (withtextarea)

### 3. Contrasta la Compulsione
- **Categoria**: exposure
- **Difficoltà**: medium
- **Durata**: 20 minuti
- **Audio necessari**:
  - `resistance-techniques.mp3` (tecniche di resistenza)
- **Steps**:
  1. Identifica il Trigger (withtextarea)
  2. Tecniche di Resistenza (withaudio)
  3. Valutazione Risultato (withtextarea)

### 4. Esercizio di Gratitudine
- **Categoria**: mindfulness
- **Difficoltà**: easy
- **Durata**: 10 minuti
- **Audio necessari**:
  - `gratitude-guide.mp3` (guida gratitudine)
- **Steps**:
  1. Introduzione (default)
  2. Riflessione Guidata (withaudio)
  3. Scrittura Gratitudine (withtextarea)

### 5. Tecnica del Grounding 5-4-3-2-1
- **Categoria**: grounding
- **Difficoltà**: easy
- **Durata**: 8 minuti
- **Audio necessari**:
  - `grounding-guide.mp3` (guida grounding)
- **Steps**:
  1. Spiegazione Tecnica (default)
  2. Pratica Guidata (withaudio)
  3. Riflessione (withtextarea)

### 6. Esposizione Graduale
- **Categoria**: exposure
- **Difficoltà**: hard
- **Durata**: 25 minuti
- **Audio necessari**:
  - `exposure-preparation.mp3` (preparazione)
  - `exposure-support.mp3` (supporto durante esposizione)
- **Steps**:
  1. Preparazione (withaudio)
  2. Pianificazione Esposizione (withtextarea)
  3. Esposizione Guidata (withaudio)
  4. Valutazione Post-Esposizione (withtextarea)

### 7. Mindfulness del Momento Presente
- **Categoria**: mindfulness
- **Difficoltà**: easy
- **Durata**: 12 minuti
- **Audio necessari**:
  - `present-moment-guide.mp3` (guida momento presente)
- **Steps**:
  1. Centratura (default)
  2. Pratica Mindfulness (withaudio)
  3. Integrazione (withtextarea)

### 8. Ristrutturazione Cognitiva
- **Categoria**: cognitive
- **Difficoltà**: medium
- **Durata**: 18 minuti
- **Audio necessari**:
  - `cognitive-restructuring.mp3` (guida ristrutturazione)
- **Steps**:
  1. Identificazione Pensiero (withtextarea)
  2. Analisi Guidata (withaudio)
  3. Pensiero Alternativo (withtextarea)
  4. Valutazione (withtextarea)

## 🎵 File Audio da Creare/Caricare

### Audio Esistenti (da verificare)
- ✅ `meditation-step1-preparation.mp3`
- ✅ `meditation-step2-practice.mp3`

### Audio da Creare
- 🔄 `breathing-guide.mp3` (5 min)
- 🔄 `resistance-techniques.mp3` (8 min)
- 🔄 `gratitude-guide.mp3` (6 min)
- 🔄 `grounding-guide.mp3` (5 min)
- 🔄 `exposure-preparation.mp3` (4 min)
- 🔄 `exposure-support.mp3` (10 min)
- 🔄 `present-moment-guide.mp3` (8 min)
- 🔄 `cognitive-restructuring.mp3` (10 min)

## 📝 Prossimi Passi

1. **Conferma Lista**: Verificare con te se questa lista è completa e corretta
2. **Creazione Audio**: Decidere come gestire i file audio mancanti
3. **Implementazione**: Creare gli esercizi nel formato corretto
4. **Upload Supabase**: Caricare tutto su Supabase
5. **Test**: Verificare che tutto funzioni

## 🔧 Configurazione Supabase Storage

### Bucket Configuration
- **Nome bucket**: `exercise-audio`
- **Tipo**: Public (per accesso diretto)
- **Struttura cartelle**:
  ```
  exercise-audio/
  ├── breathing/
  ├── meditation/
  ├── exposure/
  ├── mindfulness/
  ├── grounding/
  └── cognitive/
  ```

### URL Pattern
```
https://[project-id].supabase.co/storage/v1/object/public/exercise-audio/[category]/[filename]
```

---

**Nota**: Questo documento verrà aggiornato man mano che procediamo con l'implementazione.