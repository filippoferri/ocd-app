import { Exercise, ExerciseProgress } from '../types/Exercise';
import { supabase } from './SupabaseService';

// Interfaccia per i dati grezzi di Supabase
interface SupabaseExerciseData {
  id: string;
  name: string;
  intro_text: string;
  benefits_text: string;
  objective_text: string;
  duration: number;
  image: string;
  audio_guide?: string;
  steps: any;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  is_active?: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

class SupabaseExerciseService {
  private static supabase = supabase;

  /**
   * Recupera tutti gli esercizi attivi da Supabase
   */
  static async getAllExercises(): Promise<Exercise[]> {
    try {
      const { data, error } = await this.supabase
        .from('exercises')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      return this.mapSupabaseToExercise(data || []);
    } catch (error) {
      console.error('Error in getAllExercises:', error);
      throw error;
    }
  }

  /**
   * Recupera un esercizio specifico per ID
   */
  static async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const { data, error } = await this.supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Nessun risultato trovato
        }
        console.error('Error fetching exercise by ID:', error);
        throw error;
      }

      return this.mapSupabaseToExercise([data])[0];
    } catch (error) {
      console.error('Error in getExerciseById:', error);
      throw error;
    }
  }

  /**
   * Recupera esercizi per categoria
   */
  static async getExercisesByCategory(category: string): Promise<Exercise[]> {
    try {
      const { data, error } = await this.supabase
        .from('exercises')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching exercises by category:', error);
        throw error;
      }

      return this.mapSupabaseToExercise(data || []);
    } catch (error) {
      console.error('Error in getExercisesByCategory:', error);
      throw error;
    }
  }

  /**
   * Recupera raccomandazioni giornaliere (primi 3 esercizi)
   */
  static async getDailyRecommendations(): Promise<Exercise[]> {
    try {
      const { data, error } = await this.supabase
        .from('exercises')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error fetching daily recommendations:', error);
        throw error;
      }

      return this.mapSupabaseToExercise(data || []);
    } catch (error) {
      console.error('Error in getDailyRecommendations:', error);
      throw error;
    }
  }

  /**
   * Salva il progresso di un esercizio
   */
  static async saveExerciseProgress(progress: ExerciseProgress): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('exercise_progress')
        .insert({
          exercise_id: progress.exerciseId,
          user_id: progress.userId,
          completed_at: progress.completedAt.toISOString(),
          step_responses: progress.stepResponses || {}
        });

      if (error) {
        console.error('Error saving exercise progress:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in saveExerciseProgress:', error);
      throw error;
    }
  }

  /**
   * Recupera il progresso degli esercizi per un utente
   */
  static async getUserExerciseProgress(userId: string): Promise<ExerciseProgress[]> {
    try {
      const { data, error } = await this.supabase
        .from('exercise_progress')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching user exercise progress:', error);
        throw error;
      }

      return (data || []).map(item => ({
        exerciseId: item.exercise_id,
        userId: item.user_id,
        completedAt: new Date(item.completed_at),
        stepResponses: item.step_responses || {}
      }));
    } catch (error) {
      console.error('Error in getUserExerciseProgress:', error);
      throw error;
    }
  }

  /**
   * Crea un nuovo esercizio (solo per admin)
   */
  static async createExercise(exercise: Omit<Exercise, 'id'>): Promise<Exercise> {
    try {
      const { data, error } = await this.supabase
        .from('exercises')
        .insert({
          name: exercise.name,
          intro_text: exercise.introText,
          benefits_text: exercise.benefitsText,
          objective_text: exercise.objectiveText,
          duration: exercise.duration,
          image: exercise.image,
          audio_guide: exercise.audioGuide,
          steps: exercise.steps,
          category: exercise.category || 'generale',
          difficulty: exercise.difficulty || 'easy',
          is_active: true,
          sort_order: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating exercise:', error);
        throw error;
      }

      return this.mapSupabaseToExercise([data])[0];
    } catch (error) {
      console.error('Error in createExercise:', error);
      throw error;
    }
  }

  /**
   * Aggiorna un esercizio esistente (solo per admin)
   */
  static async updateExercise(id: string, updates: Partial<Exercise>): Promise<Exercise> {
    try {
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.introText) updateData.intro_text = updates.introText;
      if (updates.benefitsText) updateData.benefits_text = updates.benefitsText;
      if (updates.objectiveText) updateData.objective_text = updates.objectiveText;
      if (updates.duration) updateData.duration = updates.duration;
      if (updates.image) updateData.image = updates.image;
      if (updates.audioGuide) updateData.audio_guide = updates.audioGuide;
      if (updates.steps) updateData.steps = updates.steps;
      if (updates.category) updateData.category = updates.category;
      if (updates.difficulty) updateData.difficulty = updates.difficulty;

      const { data, error } = await this.supabase
        .from('exercises')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating exercise:', error);
        throw error;
      }

      return this.mapSupabaseToExercise([data])[0];
    } catch (error) {
      console.error('Error in updateExercise:', error);
      throw error;
    }
  }

  /**
   * Disattiva un esercizio (soft delete)
   */
  static async deactivateExercise(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('exercises')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deactivating exercise:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deactivateExercise:', error);
      throw error;
    }
  }

  /**
   * Mappa i dati di Supabase al formato Exercise
   */
  private static mapSupabaseToExercise(data: SupabaseExerciseData[]): Exercise[] {
    return data.map((item: SupabaseExerciseData) => ({
      id: item.id,
      name: item.name,
      introText: item.intro_text,
      benefitsText: item.benefits_text,
      objectiveText: item.objective_text,
      duration: item.duration,
      image: item.image,
      audioGuide: item.audio_guide || '',
      steps: item.steps || [],
      category: item.category,
      difficulty: item.difficulty
    }));
  }

  /**
   * Verifica la connessione a Supabase
   */
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('exercises')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }
}

export { SupabaseExerciseService };