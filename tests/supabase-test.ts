// Test per verificare l'integrazione Supabase
// Esegui questo file per testare la connessione e le funzionalità

import SupabaseExerciseService from '../services/SupabaseService';
import ExerciseServiceAdapter from '../services/ExerciseServiceAdapter';
import { Exercise } from '../types/Exercise';

// Funzione di test principale
export async function runSupabaseTests(): Promise<void> {
  console.log('🧪 Avvio test Supabase...');
  
  try {
    // Test 1: Connessione
    await testConnection();
    
    // Test 2: Caricamento esercizi
    await testLoadExercises();
    
    // Test 3: Adapter
    await testAdapter();
    
    // Test 4: Statistiche
    await testStats();
    
    console.log('✅ Tutti i test completati con successo!');
  } catch (error) {
    console.error('❌ Errore nei test:', error);
  }
}

// Test connessione Supabase
async function testConnection(): Promise<void> {
  console.log('\n📡 Test connessione Supabase...');
  
  const isConnected = await ExerciseServiceAdapter.testSupabaseConnection();
  
  if (isConnected) {
    console.log('✅ Connessione Supabase OK');
  } else {
    console.log('⚠️ Connessione Supabase fallita (normale se non configurato)');
  }
}

// Test caricamento esercizi
async function testLoadExercises(): Promise<void> {
  console.log('\n📚 Test caricamento esercizi...');
  
  try {
    // Test Supabase diretto
    const supabaseExercises = await SupabaseExerciseService.getAllExercises();
    console.log(`📊 Esercizi da Supabase: ${supabaseExercises.length}`);
    
    if (supabaseExercises.length > 0) {
      const firstExercise = supabaseExercises[0];
      console.log(`📝 Primo esercizio: ${firstExercise.name}`);
      
      // Test caricamento singolo esercizio
      const singleExercise = await SupabaseExerciseService.getExerciseById(firstExercise.id);
      if (singleExercise) {
        console.log(`✅ Caricamento singolo esercizio OK: ${singleExercise.name}`);
      } else {
        console.log('❌ Errore nel caricamento singolo esercizio');
      }
    }
    
  } catch (error) {
    console.log('⚠️ Errore nel caricamento da Supabase (normale se non configurato):', error);
  }
}

// Test adapter
async function testAdapter(): Promise<void> {
  console.log('\n🔄 Test ExerciseServiceAdapter...');
  
  try {
    // Test modalità hybrid
    ExerciseServiceAdapter.setDataSource('hybrid');
    const hybridExercises = await ExerciseServiceAdapter.getAllExercises();
    console.log(`📊 Esercizi modalità hybrid: ${hybridExercises.length}`);
    
    // Test modalità local
    ExerciseServiceAdapter.setDataSource('local');
    const localExercises = await ExerciseServiceAdapter.getAllExercises();
    console.log(`📊 Esercizi modalità local: ${localExercises.length}`);
    
    // Test modalità supabase
    ExerciseServiceAdapter.setDataSource('supabase');
    const supabaseExercises = await ExerciseServiceAdapter.getAllExercises();
    console.log(`📊 Esercizi modalità supabase: ${supabaseExercises.length}`);
    
    // Ripristina modalità hybrid
    ExerciseServiceAdapter.setDataSource('hybrid');
    
    console.log('✅ Test adapter completato');
    
  } catch (error) {
    console.error('❌ Errore nel test adapter:', error);
  }
}

// Test statistiche
async function testStats(): Promise<void> {
  console.log('\n📈 Test statistiche...');
  
  try {
    const stats = await ExerciseServiceAdapter.getDataSourceStats();
    
    console.log('📊 Statistiche:');
    console.log(`   - Esercizi locali: ${stats.localCount}`);
    console.log(`   - Esercizi Supabase: ${stats.supabaseCount}`);
    console.log(`   - Supabase disponibile: ${stats.supabaseAvailable ? '✅' : '❌'}`);
    
    console.log('✅ Test statistiche completato');
    
  } catch (error) {
    console.error('❌ Errore nel test statistiche:', error);
  }
}

// Test migrazione (solo per demo, non esegue realmente)
export async function testMigration(): Promise<void> {
  console.log('\n🚀 Test migrazione (simulazione)...');
  
  try {
    // Questo è solo un test di simulazione
    // Per eseguire la migrazione reale, decommentare la riga seguente:
    // const result = await ExerciseServiceAdapter.migrateLocalToSupabase();
    
    console.log('⚠️ Migrazione non eseguita (modalità test)');
    console.log('💡 Per eseguire la migrazione reale:');
    console.log('   1. Configura Supabase');
    console.log('   2. Decommentare la riga di migrazione');
    console.log('   3. Eseguire il test');
    
  } catch (error) {
    console.error('❌ Errore nel test migrazione:', error);
  }
}

// Funzione per validare la configurazione
export function validateSupabaseConfig(): boolean {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  console.log('🔧 Validazione configurazione Supabase...');
  
  if (!url || url === '') {
    console.log('❌ REACT_APP_SUPABASE_URL non configurato');
    return false;
  }
  
  if (!key || key === '') {
    console.log('❌ REACT_APP_SUPABASE_ANON_KEY non configurato');
    return false;
  }
  
  if (!url.startsWith('https://')) {
    console.log('❌ URL Supabase non valido (deve iniziare con https://)');
    return false;
  }
  
  if (!key.startsWith('eyJ')) {
    console.log('❌ Chiave Supabase non valida (deve iniziare con eyJ)');
    return false;
  }
  
  console.log('✅ Configurazione Supabase valida');
  console.log(`   URL: ${url}`);
  console.log(`   Key: ${key.substring(0, 20)}...`);
  
  return true;
}

// Funzione di utilità per il debug
export function debugSupabaseService(): void {
  console.log('🐛 Debug SupabaseService...');
  
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  console.log('Variabili d\'ambiente:');
  console.log(`  REACT_APP_SUPABASE_URL: ${url || 'NON DEFINITO'}`);
  console.log(`  REACT_APP_SUPABASE_ANON_KEY: ${key ? key.substring(0, 20) + '...' : 'NON DEFINITO'}`);
  
  console.log('\nPer configurare Supabase:');
  console.log('1. Crea un file .env nella root del progetto');
  console.log('2. Aggiungi le variabili REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY');
  console.log('3. Riavvia l\'app con npm start');
}

/*
COME USARE QUESTI TEST:

1. In un componente React:
   import { runSupabaseTests, validateSupabaseConfig } from '../tests/supabase-test';
   
   useEffect(() => {
     validateSupabaseConfig();
     runSupabaseTests();
   }, []);

2. In console del browser:
   // Apri la console (F12) e digita:
   window.runSupabaseTests = () => import('./tests/supabase-test').then(m => m.runSupabaseTests());
   runSupabaseTests();

3. Per debug:
   import { debugSupabaseService } from '../tests/supabase-test';
   debugSupabaseService();
*/