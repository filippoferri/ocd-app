# Configurazione Database Supabase

## 📋 Passi per completare la configurazione

### 1. Eseguire lo Schema SQL

1. **Apri il Dashboard Supabase**
   - Vai su: https://supabase.com/dashboard
   - Accedi al tuo account

2. **Seleziona il Progetto**
   - Clicca sul progetto: `pesercsmhpkrhvrrqlvr`

3. **Apri SQL Editor**
   - Nel menu laterale, clicca su "SQL Editor"
   - Clicca su "New query"

4. **Esegui lo Schema**
   - Copia tutto il contenuto del file `supabase/schema.sql`
   - Incollalo nell'editor SQL
   - Clicca su "Run" per eseguire lo script

### 2. Configurare il Bucket di Storage

1. **Vai alla sezione Storage**
   - Nel menu laterale, clicca su "Storage"

2. **Crea il Bucket**
   - Clicca su "New bucket"
   - Nome: `exercise-audio`
   - Seleziona "Public bucket" (per permettere l'accesso ai file audio)
   - Clicca su "Create bucket"

3. **Configura le Politiche (opzionale)**
   - Vai su "Policies" nella sezione Storage
   - Le politiche sono già definite nello schema SQL

### 3. Verificare la Configurazione

1. **Controlla le Tabelle**
   - Vai su "Table Editor"
   - Dovresti vedere le tabelle:
     - `exercises` (con 2 esercizi di esempio)
     - `exercise_progress`

2. **Controlla il Storage**
   - Vai su "Storage"
   - Dovresti vedere il bucket `exercise-audio`

### 4. Testare la Connessione

1. **Usa il Test Panel nell'App**
   - Avvia l'app: `npm start` o `npx expo start`
   - Vai alla sezione "Test Supabase"
   - Verifica che la connessione funzioni

2. **Controlla gli Esercizi**
   - Vai alla sezione "Esplora" nell'app
   - Dovresti vedere gli esercizi caricati dal database

## 🔧 Risoluzione Problemi

### Errore di Connessione
- Verifica che le credenziali in `.env` siano corrette
- Controlla che il progetto Supabase sia attivo

### Tabelle Non Create
- Ricontrolla che lo script SQL sia stato eseguito completamente
- Verifica eventuali errori nell'SQL Editor

### Storage Non Funziona
- Assicurati che il bucket sia pubblico
- Verifica le politiche di accesso

## 📁 File Coinvolti

- `supabase/schema.sql` - Schema del database
- `.env` - Credenziali Supabase (locale)
- `services/SupabaseService.ts` - Client Supabase
- `components/SupabaseTestPanel.tsx` - Panel di test

## 🚀 Prossimi Passi

Dopo aver completato questa configurazione:
1. Testare l'integrazione con l'app
2. Caricare file audio nel bucket (se necessario)
3. Implementare funzionalità aggiuntive
4. Configurare l'autenticazione (opzionale)