// Adapter per la migrazione graduale da ExerciseService locale a Supabase
// Questo servizio permette di passare gradualmente a Supabase mantenendo la compatibilità

import { Exercise, ExerciseProgress } from '../types/Exercise';
import ExerciseService from './ExerciseService';
import { SupabaseExerciseService } from './SupabaseExerciseService';

type DataSource = 'local' | 'supabase' | 'hybrid';

class ExerciseServiceAdapter {
  private static dataSource: DataSource = 'supabase'; // Cambiato in supabase per abilitare il motore di raccomandazione
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

  // Ottieni esercizio per ID
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
    try {
      const allExercises = await this.getAllExercises();
      return allExercises.filter(exercise => exercise.category === category);
    } catch (error) {
      console.error('Errore nel caricamento esercizi per categoria:', error);
      if (this.fallbackToLocal) {
        const localExercises = this.getLocalExercises();
        return localExercises.filter(exercise => exercise.category === category);
      }
      return [];
    }
  }

  // Ottieni raccomandazioni giornaliere
  static async getDailyRecommendations(): Promise<Exercise[]> {
    try {
      const allExercises = await this.getAllExercises();
      // Logica per raccomandazioni (esempio: primi 3 esercizi)
      return allExercises.slice(0, 3);
    } catch (error) {
      console.error('Errore nel caricamento raccomandazioni:', error);
      if (this.fallbackToLocal) {
        const localExercises = this.getLocalExercises();
        return localExercises.slice(0, 3);
      }
      return [];
    }
  }

  // Salva progresso esercizio
  static async saveExerciseProgress(progress: ExerciseProgress): Promise<void> {
    try {
      await SupabaseExerciseService.saveExerciseProgress(progress);
      console.log('Progresso salvato su Supabase:', progress.exerciseId);
    } catch (error) {
      console.error('Errore nel salvataggio progresso su Supabase:', error);
    }
  }

  // Aggiorna il feedback dell'ultimo esercizio completato
  static async updateExerciseFeedback(exerciseId: string, userId: string, score: number): Promise<void> {
    try {
      await SupabaseExerciseService.updateExerciseFeedback(exerciseId, userId, score);
      console.log('Feedback aggiornato su Supabase:', score);
    } catch (error) {
      console.error('Errore nell\'aggiornamento feedback:', error);
    }
  }

  // Ottieni progressi utente
  static async getUserExerciseProgress(userId?: string): Promise<ExerciseProgress[]> {
    try {
      // Per ora ritorna array vuoto
      console.log('Caricamento progressi per utente:', userId);
      return [];
    } catch (error) {
      console.error('Errore nel caricamento progressi:', error);
      return [];
    }
  }

  // === METODI PRIVATI ===

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
      const exercises = ExerciseService.getAllExercises();
      return exercises.find(ex => ex.id === id) || null;
    } catch (error) {
      console.error('Errore nel caricamento esercizio locale:', error);
      return null;
    }
  }

  // Strategia Supabase
  private static async getSupabaseExercises(): Promise<Exercise[]> {
    // Supabase temporaneamente disabilitato per evitare errori Hermes
    console.log('Supabase disabilitato, usando dati locali');
    return this.getLocalExercises();
  }

  private static async getSupabaseExerciseById(id: string): Promise<Exercise | null> {
    // Supabase temporaneamente disabilitato per evitare errori Hermes
    console.log(`Supabase disabilitato, usando dati locali per esercizio ${id}`);
    return this.getLocalExerciseById(id);
  }

  // Strategia ibrida (preferisce Supabase, fallback locale)
  private static async getHybridExercises(): Promise<Exercise[]> {
    // Supabase temporaneamente disabilitato per evitare errori Hermes
    console.log('Modalità ibrida: Supabase disabilitato, usando dati locali');
    return this.getLocalExercises();
  }

  private static async getHybridExerciseById(id: string): Promise<Exercise | null> {
    // Supabase temporaneamente disabilitato per evitare errori Hermes
    console.log(`Modalità ibrida: Supabase disabilitato, usando dati locali per esercizio ${id}`);
    return this.getLocalExerciseById(id);
  }

  // Utilità per verificare la connessione Supabase
  static async testSupabaseConnection(): Promise<boolean> {
    // Supabase temporaneamente disabilitato per evitare errori Hermes
    console.log('Test connessione Supabase disabilitato');
    return false;
  }

  // Statistiche sui dati
  static async getDataSourceStats(): Promise<{
    supabaseCount: number;
    localCount: number;
    supabaseAvailable: boolean;
  }> {
    const localCount = this.getLocalExercises().length;
    
    // Supabase temporaneamente disabilitato per evitare errori Hermes
    return {
      supabaseCount: 0,
      localCount,
      supabaseAvailable: false
    };
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
      errors: ['Migrazione disabilitata: Supabase temporaneamente non disponibile per evitare errori Hermes']
    };

    console.log('Migrazione a Supabase disabilitata');
    return result;
  }
}

export default ExerciseServiceAdapter;