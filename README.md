# 🧠 OCD Help App

Un'app mobile per il supporto e la gestione del Disturbo Ossessivo-Compulsivo (DOC), sviluppata con React Native ed Expo.

## 📱 Caratteristiche

- **Esercizi Guidati**: Collezione di esercizi terapeutici per gestire sintomi OCD
- **Tracciamento Umore**: Monitoraggio giornaliero dello stato emotivo
- **Diario Personale**: Spazio per riflessioni e progressi
- **Test OCD**: Valutazione dei sintomi
- **Audio Guidati**: Esercizi con supporto audio
- **Interfaccia Intuitiva**: Design moderno e accessibile

## 🚀 Tecnologie

- **Frontend**: React Native + Expo
- **Backend**: Supabase (PostgreSQL + Storage)
- **Linguaggio**: TypeScript
- **Navigazione**: Custom navigation system
- **Storage**: AsyncStorage + Supabase
- **Audio**: Expo AV

## 📦 Installazione

### Prerequisiti
- Node.js (v16 o superiore)
- npm o yarn
- Expo CLI
- Account Supabase (opzionale)

### Setup Locale

```bash
# Clona il repository
git clone https://github.com/your-username/ocd-app.git
cd ocd-app

# Installa le dipendenze
npm install

# Avvia l'app
npm start
```

### Setup Supabase (Opzionale)

Per utilizzare il backend cloud:

1. Segui la guida completa in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)
2. Crea un file `.env` basato su `.env.example`
3. Configura le credenziali Supabase

```bash
# Copia il template
cp .env.example .env

# Modifica .env con le tue credenziali
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
```

## 🏗️ Architettura

```
📁 OCDAPP/
├── 📁 components/          # Componenti riutilizzabili
│   ├── BottomNav.tsx       # Navigazione inferiore
│   ├── TopNav.tsx          # Navigazione superiore
│   └── MoodFlow.tsx        # Flusso tracciamento umore
├── 📁 screens/             # Schermate principali
│   ├── HomePage.tsx        # Schermata home
│   ├── ExploreScreen.tsx   # Esplora esercizi
│   ├── DiaryScreen.tsx     # Diario personale
│   └── ProfileScreen.tsx   # Profilo utente
├── 📁 services/            # Logica business
│   ├── ExerciseService.ts  # Gestione esercizi (locale)
│   ├── SupabaseService.ts  # Integrazione Supabase
│   └── ExerciseServiceAdapter.ts # Adapter per migrazione
├── 📁 types/               # Definizioni TypeScript
└── 📁 assets/              # Risorse statiche
```

## 🔧 Sviluppo

### Comandi Disponibili

```bash
# Avvia in modalità sviluppo
npm start

# Avvia per iOS
npm run ios

# Avvia per Android
npm run android

# Avvia per Web
npm run web

# Build per produzione
npm run build
```

### Branch Strategy

- `main`: Codice stabile in produzione
- `develop`: Sviluppo attivo
- `feature/*`: Nuove funzionalità
- `hotfix/*`: Correzioni urgenti
- `supabase-integration`: Integrazione Supabase

### Workflow Git

```bash
# Crea un nuovo branch per una feature
git checkout -b feature/nome-feature

# Lavora sulla feature
git add .
git commit -m "feat: descrizione della feature"

# Push del branch
git push origin feature/nome-feature

# Crea una Pull Request su GitHub
```

## 📋 Roadmap

### ✅ Completato
- [x] Interfaccia utente base
- [x] Sistema di navigazione
- [x] Esercizi locali
- [x] Tracciamento umore
- [x] Integrazione Supabase
- [x] Sistema di migrazione dati

### 🚧 In Sviluppo
- [ ] Autenticazione utenti
- [ ] Sincronizzazione cloud
- [ ] Notifiche push
- [ ] Analytics avanzate

### 🔮 Futuro
- [ ] Piattaforma admin web
- [ ] Supporto offline avanzato
- [ ] Integrazione wearables
- [ ] AI per raccomandazioni personalizzate

## 🧪 Testing

### Test Supabase

Per testare l'integrazione Supabase:

```typescript
// Importa il pannello di test
import SupabaseTestPanel from './components/SupabaseTestPanel';

// Usa temporaneamente in App.tsx
return <SupabaseTestPanel />;
```

### Test Manuali

1. **Navigazione**: Testa tutti i tab e le transizioni
2. **Esercizi**: Verifica caricamento e riproduzione audio
3. **Umore**: Controlla il salvataggio dei dati
4. **Offline**: Testa funzionalità senza connessione

## 🔒 Sicurezza

- **Dati Sensibili**: Crittografati con AsyncStorage
- **API Keys**: Gestite tramite variabili d'ambiente
- **Supabase**: Row Level Security (RLS) abilitato
- **HTTPS**: Tutte le comunicazioni sono crittografate

## 📊 Performance

- **Bundle Size**: Ottimizzato con tree shaking
- **Images**: Compresse e ottimizzate
- **Database**: Indici per query veloci
- **Caching**: Strategia di cache intelligente

## 🤝 Contribuire

1. Fork del repository
2. Crea un branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push del branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

### Convenzioni

- **Commits**: Usa [Conventional Commits](https://www.conventionalcommits.org/)
- **Code Style**: Segui le regole ESLint/Prettier
- **TypeScript**: Tipizzazione forte obbligatoria
- **Documentazione**: Commenta codice complesso

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per dettagli.

## 👥 Team

- **Sviluppatore**: Filippo Ferri
- **Design**: [Nome Designer]
- **Consulenza Clinica**: [Nome Psicologo]

## 📞 Supporto

Per supporto o domande:

- 📧 Email: support@ocdapp.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/ocd-app/issues)
- 📖 Docs: [Documentazione Completa](./docs/)

## 🙏 Ringraziamenti

- [Expo Team](https://expo.dev/) per l'eccellente framework
- [Supabase](https://supabase.com/) per il backend-as-a-service
- [React Native Community](https://reactnative.dev/) per le librerie
- Tutti i beta tester e contributori

---

**Nota**: Questa app è destinata a scopi educativi e di supporto. Non sostituisce il trattamento professionale. Consulta sempre un professionista della salute mentale per problemi clinici.