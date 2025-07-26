# 🌿 Git Workflow Guide - OCD App

Guida completa per gestire il progetto con Git e GitHub in modo sicuro e professionale.

## 📋 Struttura Branch

### Branch Principali

```
master (main)
├── develop
│   ├── feature/supabase-integration ⭐ (attuale)
│   ├── feature/authentication
│   ├── feature/offline-sync
│   └── feature/push-notifications
├── hotfix/critical-bug-fix
└── release/v1.0.0
```

### Descrizione Branch

- **`master`**: Codice stabile in produzione
- **`develop`**: Branch di sviluppo principale
- **`feature/*`**: Nuove funzionalità
- **`hotfix/*`**: Correzioni urgenti
- **`release/*`**: Preparazione release

## 🚀 Workflow Completo

### 1. Setup Iniziale (Già Fatto)

```bash
# Repository già inizializzato
git init
git add .
git commit -m "feat: initial commit with OCD app and Supabase integration"

# Branch creati
git checkout -b develop
git checkout -b feature/supabase-integration
```

### 2. Collegamento a GitHub

```bash
# Crea repository su GitHub (tramite web)
# Poi collega il repository locale
git remote add origin https://github.com/your-username/ocd-app.git

# Push del branch master
git checkout master
git push -u origin master

# Push di tutti i branch
git checkout develop
git push -u origin develop

git checkout feature/supabase-integration
git push -u origin feature/supabase-integration
```

### 3. Workflow Quotidiano

#### Lavorare su una Feature

```bash
# 1. Assicurati di essere aggiornato
git checkout develop
git pull origin develop

# 2. Crea nuovo branch feature
git checkout -b feature/nome-feature

# 3. Lavora sulla feature
# ... modifica file ...

# 4. Commit frequenti
git add .
git commit -m "feat: aggiungi funzionalità X"

# 5. Push del branch
git push -u origin feature/nome-feature
```

#### Merge della Feature

```bash
# 1. Aggiorna develop
git checkout develop
git pull origin develop

# 2. Merge della feature
git merge feature/nome-feature

# 3. Push develop aggiornato
git push origin develop

# 4. Elimina branch feature (opzionale)
git branch -d feature/nome-feature
git push origin --delete feature/nome-feature
```

## 🛡️ Sicurezza e Best Practices

### Protezione Branch Master

**Su GitHub:**
1. Vai su Settings → Branches
2. Aggiungi regola per `master`:
   - ✅ Require pull request reviews
   - ✅ Require status checks
   - ✅ Restrict pushes

### Commit Conventions

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipi di commit
feat:     # Nuova funzionalità
fix:      # Correzione bug
docs:     # Documentazione
style:    # Formattazione
refactor: # Refactoring
test:     # Test
chore:    # Manutenzione

# Esempi
git commit -m "feat: aggiungi integrazione Supabase"
git commit -m "fix: risolvi crash su iOS"
git commit -m "docs: aggiorna README con setup"
```

### Pre-commit Hooks (Opzionale)

```bash
# Installa husky per hooks
npm install --save-dev husky
npx husky install

# Aggiungi hook pre-commit
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-commit "npm run test"
```

## 🔄 Scenari Comuni

### Scenario 1: Lavorare su Supabase

```bash
# Sei già sul branch giusto
git status  # Conferma: feature/supabase-integration

# Lavora normalmente
# ... modifica SupabaseService.ts ...
git add services/SupabaseService.ts
git commit -m "feat: aggiungi upload audio a Supabase"

# Push sicuro
git push origin feature/supabase-integration
```

### Scenario 2: Testare in Sicurezza

```bash
# Crea branch di test
git checkout -b test/supabase-experiment

# Sperimenta liberamente
# ... modifica file ...
git add .
git commit -m "test: esperimento con nuova API"

# Se funziona, merge in feature
git checkout feature/supabase-integration
git merge test/supabase-experiment

# Se non funziona, elimina
git branch -D test/supabase-experiment
```

### Scenario 3: Hotfix Urgente

```bash
# Crea hotfix da master
git checkout master
git checkout -b hotfix/critical-fix

# Correggi il bug
# ... fix ...
git add .
git commit -m "fix: risolvi crash critico"

# Merge in master E develop
git checkout master
git merge hotfix/critical-fix
git push origin master

git checkout develop
git merge hotfix/critical-fix
git push origin develop

# Elimina hotfix
git branch -d hotfix/critical-fix
```

## 📊 Monitoraggio e Backup

### Controllo Stato

```bash
# Stato attuale
git status
git log --oneline -10
git branch -a

# Differenze
git diff
git diff --staged
git diff develop..feature/supabase-integration
```

### Backup Locale

```bash
# Crea backup completo
git bundle create backup-$(date +%Y%m%d).bundle --all

# Ripristina da backup
git clone backup-20231201.bundle restored-repo
```

### Stash per Lavoro Temporaneo

```bash
# Salva lavoro in corso
git stash push -m "WIP: lavoro su audio player"

# Cambia branch per urgenza
git checkout develop
# ... lavoro urgente ...

# Torna al lavoro precedente
git checkout feature/supabase-integration
git stash pop
```

## 🎯 Workflow Supabase Specifico

### Fasi di Integrazione

```bash
# Fase 1: Setup base (✅ Completato)
git add services/SupabaseService.ts
git commit -m "feat: setup base Supabase service"

# Fase 2: Test integrazione
git add tests/supabase-test.ts
git commit -m "test: aggiungi test Supabase"

# Fase 3: Migrazione graduale
git add services/ExerciseServiceAdapter.ts
git commit -m "feat: adapter per migrazione graduale"

# Fase 4: Aggiornamento UI
git add screens/ExploreScreen-with-supabase.tsx
git commit -m "feat: UI con supporto Supabase"
```

### Test Prima del Merge

```bash
# 1. Test locale
npm start
# Verifica che tutto funzioni

# 2. Test build
npm run build
# Verifica che compili

# 3. Merge solo se tutto OK
git checkout develop
git merge feature/supabase-integration
```

## 🚨 Risoluzione Problemi

### Annullare Commit

```bash
# Annulla ultimo commit (mantieni modifiche)
git reset --soft HEAD~1

# Annulla ultimo commit (elimina modifiche)
git reset --hard HEAD~1

# Annulla commit specifico
git revert <commit-hash>
```

### Conflitti di Merge

```bash
# Durante merge con conflitti
git status  # Vedi file in conflitto

# Risolvi manualmente i conflitti
# Poi:
git add .
git commit -m "resolve: merge conflicts"
```

### Recupero File

```bash
# Ripristina file specifico
git checkout HEAD -- path/to/file.ts

# Ripristina da commit specifico
git checkout <commit-hash> -- path/to/file.ts
```

## 📱 GitHub Mobile

Per monitorare il progetto da mobile:

1. Installa GitHub Mobile
2. Abilita notifiche per:
   - Pull requests
   - Issues
   - Actions (CI/CD)

## 🎉 Vantaggi di Questo Workflow

✅ **Sicurezza**: Master sempre stabile
✅ **Flessibilità**: Lavoro parallelo su feature
✅ **Tracciabilità**: Storia completa delle modifiche
✅ **Collaborazione**: Pull request per review
✅ **Backup**: Tutto su GitHub
✅ **Rollback**: Facile tornare indietro
✅ **Testing**: Branch isolati per esperimenti

## 📞 Comandi Rapidi

```bash
# Status veloce
alias gs='git status'
alias gl='git log --oneline -10'
alias gb='git branch -a'

# Commit veloce
alias gac='git add . && git commit -m'

# Push veloce
alias gp='git push origin $(git branch --show-current)'

# Aggiorna branch
alias gu='git pull origin $(git branch --show-current)'
```

---

**Ricorda**: Con questo workflow, puoi sperimentare liberamente senza mai rischiare di rompere il codice principale! 🛡️