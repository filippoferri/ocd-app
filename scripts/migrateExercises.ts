/**
 * Script per migrare gli esercizi locali su Supabase
 * 
 * Questo script:
 * 1. Carica tutti gli esercizi dal servizio locale
 * 2. Li inserisce nella tabella exercises di Supabase
 * 3. Fornisce un report dettagliato della migrazione
 */

import ExerciseServiceAdapter from '../services/ExerciseServiceAdapter';
import { SupabaseExerciseService } from '../services/SupabaseExerciseService';

async function migrateExercises() {
  console.log('🚀 Inizio migrazione esercizi su Supabase...');
  
  try {
    // Test connessione Supabase
    console.log('🔍 Test connessione Supabase...');
    const isConnected = await ExerciseServiceAdapter.testSupabaseConnection();
    
    if (!isConnected) {
      console.error('❌ Impossibile connettersi a Supabase');
      return;
    }
    
    console.log('✅ Connessione Supabase OK');
    
    // Ottieni statistiche pre-migrazione
    const statsBefore = await ExerciseServiceAdapter.getDataSourceStats();
    console.log('📊 Statistiche pre-migrazione:');
    console.log(`   - Esercizi locali: ${statsBefore.localCount}`);
    console.log(`   - Esercizi Supabase: ${statsBefore.supabaseCount}`);
    
    // Esegui migrazione
    console.log('\n🔄 Avvio migrazione...');
    const result = await ExerciseServiceAdapter.migrateLocalToSupabase();
    
    // Report risultati
    console.log('\n📋 Report migrazione:');
    console.log(`   - Successo: ${result.success ? '✅' : '❌'}`);
    console.log(`   - Esercizi migrati: ${result.migrated}`);
    
    if (result.errors.length > 0) {
      console.log(`   - Errori: ${result.errors.length}`);
      result.errors.forEach((error: string, index: number) => {
        console.log(`     ${index + 1}. ${error}`);
      });
    }
    
    // Statistiche post-migrazione
    const statsAfter = await ExerciseServiceAdapter.getDataSourceStats();
    console.log('\n📊 Statistiche post-migrazione:');
    console.log(`   - Esercizi locali: ${statsAfter.localCount}`);
    console.log(`   - Esercizi Supabase: ${statsAfter.supabaseCount}`);
    
    if (result.success) {
      console.log('\n🎉 Migrazione completata con successo!');
      console.log('💡 Ora puoi configurare l\'app per usare Supabase:');
      console.log('   ExerciseServiceAdapter.setDataSource(\'supabase\');');
    } else {
      console.log('\n⚠️  Migrazione completata con errori');
      console.log('💡 Controlla gli errori sopra e riprova se necessario');
    }
    
  } catch (error) {
    console.error('💥 Errore durante la migrazione:', error);
  }
}

// Funzione per verificare e mostrare gli esercizi migrati
async function verifyMigration() {
  console.log('\n🔍 Verifica esercizi migrati...');
  
  try {
    const exercises = await SupabaseExerciseService.getAllExercises();
    
    console.log(`\n📚 Trovati ${exercises.length} esercizi su Supabase:`);
    exercises.forEach((exercise, index) => {
      console.log(`   ${index + 1}. ${exercise.name} (${exercise.category}, ${exercise.difficulty})`);
      console.log(`      - Steps: ${exercise.steps.length}`);
      console.log(`      - Durata: ${exercise.duration} min`);
    });
    
  } catch (error) {
    console.error('❌ Errore nella verifica:', error);
  }
}

// Funzione per pulire la tabella (solo per test)
async function cleanSupabaseExercises() {
  console.log('\n🧹 Pulizia tabella exercises...');
  console.log('⚠️  ATTENZIONE: Questa operazione eliminerà tutti gli esercizi da Supabase!');
  
  // Qui dovresti implementare la logica per eliminare tutti gli esercizi
  // Per sicurezza, non implemento questa funzione automaticamente
  console.log('💡 Per pulire la tabella, esegui manualmente:');
  console.log('   DELETE FROM exercises WHERE true;');
}

// Esecuzione script
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--verify')) {
    verifyMigration();
  } else if (args.includes('--clean')) {
    cleanSupabaseExercises();
  } else {
    migrateExercises();
  }
}

export { migrateExercises, verifyMigration, cleanSupabaseExercises };

/*
USO DELLO SCRIPT:

1. Migrazione completa:
   npx ts-node scripts/migrateExercises.ts

2. Solo verifica:
   npx ts-node scripts/migrateExercises.ts --verify

3. Informazioni pulizia:
   npx ts-node scripts/migrateExercises.ts --clean

4. Da codice:
   import { migrateExercises } from './scripts/migrateExercises';
   await migrateExercises();
*/