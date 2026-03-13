// Adapter per la migrazione graduale da ExerciseService locale a Supabase
// Questo servizio permette di passare gradualmente a Supabase mantenendo la compatibilità

import { Exercise, ExerciseProgress } from '../types/Exercise';
import ExerciseService from './ExerciseService';
import { SupabaseExerciseService } from './SupabaseExerciseService';

type DataSource = 'local' | 'supabase' | 'hybrid';

class ExerciseServiceAdapter {
  private static dataSource: DataSource = 'local'; // Modalità predefinita - solo dati locali
  private static fallbackToLocal = true; // Fallback automatico in caso di errore

  // Configura la fonte dati
  static setDataSource(source: DataSource) {
    this.dataSource = source;
  }

  // Abilita/disabilita il fallback automatico
  static setFallbackToLocal(enabled: boolean) {
    this.fallbackToLocal = enabled;
  }

  // Ottieni tutti gli esercizi con strategia intelligente
  static async getAllExercises(): Promise<Exercise[]> {
    switch (this.dataSource) {
      case 'local':
        return this.getLocalExercises();
      
      case 'supabase':
        return this.getSupabaseExercises();
      
      case 'hybrid':
      default:
        return this.getHybridExercises();
    }
  }

  // Ottieni un esercizio specifico
  static async getExerciseById(id: string): Promise<Exercise | null> {
    switch (this.dataSource) {
      case 'local':
        return this.getLocalExerciseById(id);
      
      case 'supabase':
        return this.getSupabaseExerciseById(id);
      
      case 'hybrid':
      default:
        return this.getHybridExerciseById(id);
    }
  }

  // Ottieni esercizi per categoria
  static async getExercisesByCategory(category: string): Promise<Exercise[]> {
    switch (this.dataSource) {
      case 'local':
        return ExerciseService.getExercisesByCategory(category);
      
      case 'supabase':
        try {
          return await SupabaseExerciseService.getExercisesByCategory(category);
        } catch (error) {
          if (this.fallbackToLocal) {
            return ExerciseService.getExercisesByCategory(category);
          }
          return [];
        }
      
      case 'hybrid':
      default:
        try {
          const supabaseExercises = await SupabaseExerciseService.getExercisesByCategory(category);
          return supabaseExercises.length > 0 ? supabaseExercises : ExerciseService.getExercisesByCategory(category);
        } catch (error) {
          return ExerciseService.getExercisesByCategory(category);
        }
    }
  }

  // Ottieni raccomandazioni giornaliere
  static async getDailyRecommendations(): Promise<Exercise[]> {
    switch (this.dataSource) {
      case 'local':
        return ExerciseService.getDailyRecommendations();
      
      case 'supabase':
        try {
          return await SupabaseExerciseService.getDailyRecommendations();
        } catch (error) {
          if (this.fallbackToLocal) {
            return ExerciseService.getDailyRecommendations();
          }
          return [];
        }
      
      case 'hybrid':
      default:
        try {
          const supabaseExercises = await SupabaseExerciseService.getDailyRecommendations();
          // TEMPORANEO: Forza l'uso dei dati locali per le raccomandazioni giornaliere
          // finché Supabase non contiene tutti gli esercizi necessari
          if (supabaseExercises.length < 3) {
            console.log(`Supabase ha solo ${supabaseExercises.length} raccomandazioni, usando dati locali`);
            return ExerciseService.getDailyRecommendations();
          }
          return supabaseExercises;
        } catch (error) {
          return ExerciseService.getDailyRecommendations();
        }
    }
  }

  // Salva progresso esercizio
  static async saveExerciseProgress(progress: ExerciseProgress): Promise<void> {
    switch (this.dataSource) {
      case 'local':
        return ExerciseService.saveExerciseProgress(progress);
      
      case 'supabase':
        try {
          return await SupabaseExerciseService.saveExerciseProgress(progress);
        } catch (error) {
          if (this.fallbackToLocal) {
            return ExerciseService.saveExerciseProgress(progress);
          }
          throw error;
        }
      
      case 'hybrid':
      default:
        try {
          await SupabaseExerciseService.saveExerciseProgress(progress);
        } catch (error) {
          console.warn('Errore salvataggio su Supabase, usando locale:', error);
          return ExerciseService.saveExerciseProgress(progress);
        }
    }
  }

  // Ottieni progresso utente
  static async getUserExerciseProgress(userId?: string): Promise<ExerciseProgress[]> {
    switch (this.dataSource) {
      case 'local':
        return ExerciseService.getUserExerciseProgress();
      
      case 'supabase':
        if (!userId) {
          throw new Error('userId richiesto per Supabase');
        }
        try {
          return await SupabaseExerciseService.getUserExerciseProgress(userId);
        } catch (error) {
          if (this.fallbackToLocal) {
            return ExerciseService.getUserExerciseProgress();
          }
          throw error;
        }
      
      case 'hybrid':
      default:
        try {
          if (userId) {
            return await SupabaseExerciseService.getUserExerciseProgress(userId);
          } else {
            return ExerciseService.getUserExerciseProgress();
          }
        } catch (error) {
          return ExerciseService.getUserExerciseProgress();
        }
    }
  }

  // Strategia locale
  private static getLocalExercises(): Exercise[] {
    try {
      return ExerciseService.getAllExercises();
    } catch (error) {
      console.error('Errore nel caricamento esercizi locali:', error);
      return [];
    }
  }

  private static getLocalExerciseById(id: string): Exercise | null {
    try {
      const exercise = ExerciseService.getExerciseById(id);
      return exercise || null;
    } catch (error) {
      console.error('Errore nel caricamento esercizio locale:', error);
      return null;
    }
  }

  // Strategia Supabase
  private static async getSupabaseExercises(): Promise<Exercise[]> {
    try {
      const exercises = await SupabaseExerciseService.getAllExercises();
      
      if (exercises.length === 0 && this.fallbackToLocal) {
        console.log('Nessun esercizio su Supabase, usando dati locali');
        return this.getLocalExercises();
      }
      
      return exercises;
    } catch (error) {
      console.error('Errore nel caricamento esercizi da Supabase:', error);
      
      if (this.fallbackToLocal) {
        console.log('Fallback a dati locali');
        return this.getLocalExercises();
      }
      
      return [];
    }
  }

  private static async getSupabaseExerciseById(id: string): Promise<Exercise | null> {
    try {
      const exercise = await SupabaseExerciseService.getExerciseById(id);
      
      if (!exercise && this.fallbackToLocal) {
        console.log(`Esercizio ${id} non trovato su Supabase, usando dati locali`);
        return this.getLocalExerciseById(id);
      }
      
      return exercise;
    } catch (error) {
      console.error('Errore nel caricamento esercizio da Supabase:', error);
      
      if (this.fallbackToLocal) {
        console.log('Fallback a dati locali');
        return this.getLocalExerciseById(id);
      }
      
      return null;
    }
  }

  // Strategia ibrida (preferisce Supabase, fallback locale)
  private static async getHybridExercises(): Promise<Exercise[]> {
    try {
      // Prima prova Supabase
      const supabaseExercises = await SupabaseExerciseService.getAllExercises();
      
      // TEMPORANEO: Se Supabase ha meno di 7 esercizi, usa sempre i dati locali
      // Questo risolve il problema degli esercizi mancanti
      if (supabaseExercises.length < 7) {
        console.log(`Supabase ha solo ${supabaseExercises.length} esercizi, usando dati locali completi`);
        const localExercises = this.getLocalExercises();
        console.log(`Caricati ${localExercises.length} esercizi locali`);
        return localExercises;
      }
      
      if (supabaseExercises.length > 0) {
        console.log(`Caricati ${supabaseExercises.length} esercizi da Supabase`);
        return supabaseExercises;
      }
      
      // Se Supabase è vuoto, usa dati locali
      console.log('Supabase vuoto, usando dati locali');
      const localExercises = this.getLocalExercises();
      console.log(`Caricati ${localExercises.length} esercizi locali`);
      return localExercises;
      
    } catch (error) {
      console.error('Errore nella strategia ibrida:', error);
      
      // In caso di errore, usa sempre i dati locali
      console.log('Errore Supabase, usando dati locali');
      const localExercises = this.getLocalExercises();
      console.log(`Caricati ${localExercises.length} esercizi locali (fallback)`);
      return localExercises;
    }
  }

  private static async getHybridExerciseById(id: string): Promise<Exercise | null> {
    try {
      // Prima prova Supabase
      const supabaseExercise = await SupabaseExerciseService.getExerciseById(id);
      
      if (supabaseExercise) {
        console.log(`Esercizio ${id} caricato da Supabase`);
        return supabaseExercise;
      }
      
      // Se non trovato su Supabase, prova locale
      console.log(`Esercizio ${id} non trovato su Supabase, provando locale`);
      const localExercise = this.getLocalExerciseById(id);
      
      if (localExercise) {
        console.log(`Esercizio ${id} caricato da dati locali`);
      }
      
      return localExercise;
      
    } catch (error) {
      console.error('Errore nella strategia ibrida per esercizio:', error);
      
      // In caso di errore, usa sempre i dati locali
      console.log(`Errore Supabase per esercizio ${id}, usando dati locali`);
      return this.getLocalExerciseById(id);
    }
  }

  // Utilità per verificare la connessione Supabase
  static async testSupabaseConnection(): Promise<boolean> {
    try {
      const exercises = await SupabaseExerciseService.getAllExercises();
      console.log('Connessione Supabase OK');
      return true;
    } catch (error) {
      console.error('Connessione Supabase fallita:', error);
      return false;
    }
  }

  // Statistiche sui dati
  static async getDataSourceStats(): Promise<{
    supabaseCount: number;
    localCount: number;
    supabaseAvailable: boolean;
  }> {
    const localCount = this.getLocalExercises().length;
    
    try {
      const supabaseExercises = await SupabaseExerciseService.getAllExercises();
      return {
        supabaseCount: supabaseExercises.length,
        localCount,
        supabaseAvailable: true
      };
    } catch (error) {
      return {
        supabaseCount: 0,
        localCount,
        supabaseAvailable: false
      };
    }
  }

  // Migrazione: copia esercizi locali su Supabase
  static async migrateLocalToSupabase(): Promise<{
    success: boolean;
    migrated: number;
    errors: string[];
  }> {
    const result = {
      success: false,
      migrated: 0,
      errors: [] as string[]
    };

    try {
      const localExercises = this.getLocalExercises();
      
      for (const exercise of localExercises) {
        try {
          await SupabaseExerciseService.createExercise({
            name: exercise.name,
            introText: exercise.introText,
            benefitsText: exercise.benefitsText,
            objectiveText: exercise.objectiveText,
            duration: exercise.duration,
            image: exercise.image,
            steps: exercise.steps,
            category: exercise.category,
            difficulty: exercise.difficulty
          });
          
          result.migrated++;
          console.log(`Migrato esercizio: ${exercise.name}`);
        } catch (error) {
          const errorMsg = `Errore migrazione ${exercise.name}: ${error}`;
          result.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
      
      result.success = result.errors.length === 0;
      console.log(`Migrazione completata: ${result.migrated}/${localExercises.length} esercizi`);
      
    } catch (error) {
      result.errors.push(`Errore generale migrazione: ${error}`);
      console.error('Errore nella migrazione:', error);
    }

    return result;
  }
}

export default ExerciseServiceAdapter;

/*
USO DELL'ADAPTER:

1. Sostituzione graduale:
   // Invece di: ExerciseService.getAllExercises()
   // Usa: await ExerciseServiceAdapter.getAllExercises()

2. Configurazione modalità:
   ExerciseServiceAdapter.setDataSource('hybrid'); // Predefinito
   ExerciseServiceAdapter.setDataSource('supabase'); // Solo Supabase
   ExerciseServiceAdapter.setDataSource('local'); // Solo locale

3. Test connessione:
   const isConnected = await ExerciseServiceAdapter.testSupabaseConnection();

4. Migrazione dati:
   const result = await ExerciseServiceAdapter.migrateLocalToSupabase();

5. Statistiche:
   const stats = await ExerciseServiceAdapter.getDataSourceStats();
*/