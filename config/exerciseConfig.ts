/**
 * Configurazione per il servizio esercizi
 * 
 * Questo file gestisce la configurazione dell'ExerciseServiceAdapter
 * per determinare quale fonte dati utilizzare (locale, Supabase, o ibrida)
 */

import ExerciseServiceAdapter from '../services/ExerciseServiceAdapter';

// Configurazione predefinita
const EXERCISE_CONFIG = {
  // Modalità di funzionamento:
  // - 'local': usa solo dati locali
  // - 'supabase': usa solo Supabase
  // - 'hybrid': preferisce Supabase, fallback locale
  dataSource: 'local' as const,
  
  // Abilita fallback automatico ai dati locali in caso di errore
  fallbackToLocal: true,
  
  // Timeout per le richieste Supabase (ms)
  requestTimeout: 10000,
  
  // Numero massimo di tentativi per le richieste fallite
  maxRetries: 3,
  
  // Abilita logging dettagliato
  enableLogging: true,
};

/**
 * Inizializza la configurazione dell'ExerciseServiceAdapter
 */
export function initializeExerciseService() {
  // Configura la fonte dati
  ExerciseServiceAdapter.setDataSource(EXERCISE_CONFIG.dataSource);
  
  // Configura il fallback
  ExerciseServiceAdapter.setFallbackToLocal(EXERCISE_CONFIG.fallbackToLocal);
  
  if (EXERCISE_CONFIG.enableLogging) {
    console.log('🔧 ExerciseServiceAdapter configurato:');
    console.log(`   - Fonte dati: ${EXERCISE_CONFIG.dataSource}`);
    console.log(`   - Fallback locale: ${EXERCISE_CONFIG.fallbackToLocal}`);
  }
}

/**
 * Testa la connessione e fornisce statistiche
 */
export async function testExerciseServiceConnection() {
  try {
    console.log('🔍 Test connessione servizio esercizi...');
    
    // Test connessione Supabase
    const isSupabaseConnected = await ExerciseServiceAdapter.testSupabaseConnection();
    
    // Ottieni statistiche
    const stats = await ExerciseServiceAdapter.getDataSourceStats();
    
    console.log('📊 Statistiche servizio esercizi:');
    console.log(`   - Supabase disponibile: ${stats.supabaseAvailable ? '✅' : '❌'}`);
    console.log(`   - Esercizi Supabase: ${stats.supabaseCount}`);
    console.log(`   - Esercizi locali: ${stats.localCount}`);
    
    return {
      supabaseConnected: isSupabaseConnected,
      stats
    };
  } catch (error) {
    console.error('❌ Errore nel test connessione:', error);
    return {
      supabaseConnected: false,
      stats: {
        supabaseCount: 0,
        localCount: 0,
        supabaseAvailable: false
      }
    };
  }
}

/**
 * Cambia la modalità di funzionamento a runtime
 */
export function switchDataSource(source: 'local' | 'supabase' | 'hybrid') {
  ExerciseServiceAdapter.setDataSource(source);
  console.log(`🔄 Fonte dati cambiata a: ${source}`);
}

/**
 * Esegue la migrazione degli esercizi locali su Supabase
 */
export async function migrateExercisesToSupabase() {
  try {
    console.log('🚀 Avvio migrazione esercizi...');
    
    const result = await ExerciseServiceAdapter.migrateLocalToSupabase();
    
    console.log('📋 Risultato migrazione:');
    console.log(`   - Successo: ${result.success ? '✅' : '❌'}`);
    console.log(`   - Esercizi migrati: ${result.migrated}`);
    
    if (result.errors.length > 0) {
      console.log(`   - Errori: ${result.errors.length}`);
      result.errors.forEach((error: string, index: number) => {
        console.log(`     ${index + 1}. ${error}`);
      });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Errore durante la migrazione:', error);
    return {
      success: false,
      migrated: 0,
      errors: [`Errore generale: ${error}`]
    };
  }
}

export { EXERCISE_CONFIG };
export default {
  initialize: initializeExerciseService,
  test: testExerciseServiceConnection,
  switchDataSource,
  migrate: migrateExercisesToSupabase,
  config: EXERCISE_CONFIG
};

/*
USO DEL MODULO:

1. Inizializzazione (in App.tsx o main):
   import exerciseConfig from './config/exerciseConfig';
   exerciseConfig.initialize();

2. Test connessione:
   const result = await exerciseConfig.test();

3. Cambio modalità:
   exerciseConfig.switchDataSource('supabase');

4. Migrazione:
   const result = await exerciseConfig.migrate();
*/