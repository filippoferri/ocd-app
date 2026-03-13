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
  private static isConfigured(): boolean {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
    const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
    return !!url && !!key;
  }

  /**
   * Recupera tutti gli esercizi attivi da Supabase
   */
  static async getAllExercises(): Promise<Exercise[]> {
    if (!this.isConfigured()) {
      return [];
    }
    try {
      const { data, error } = await this.supabase
        .from('exercises')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching exercises:', error);
        return [];
      }

      return this.mapSupabaseToExercise(data || []);
    } catch (error) {
      console.error('Error in getAllExercises:', error);
      return [];
    }
  }

  /**
   * Recupera un esercizio specifico per ID
   */
  static async getExerciseById(id: string): Promise<Exercise | null> {
    if (!this.isConfigured()) {
      return null;
    }
    try {
      const { data, error } = await this.supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching exercise by ID:', error);
        return null;
      }

      return this.mapSupabaseToExercise([data])[0];
    } catch (error) {
      console.error('Error in getExerciseById:', error);
      return null;
    }
  }

  /**
   * Recupera esercizi per categoria
   */
  static async getExercisesByCategory(category: string): Promise<Exercise[]> {
    if (!this.isConfigured()) {
      return [];
    }
    try {
      const { data, error } = await this.supabase
        .from('exercises')
        .select('*')
        .eq('category', category)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching exercises by category:', error);
        return [];
      }

      return this.mapSupabaseToExercise(data || []);
    } catch (error) {
      console.error('Error in getExercisesByCategory:', error);
      return [];
    }
  }

  /**
   * Recupera raccomandazioni giornaliere (primi 3 esercizi)
   */
  static async getDailyRecommendations(): Promise<Exercise[]> {
    if (!this.isConfigured()) {
      return [];
    }
    try {
      const { data, error } = await this.supabase
        .from('exercises')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error fetching daily recommendations:', error);
        return [];
      }

      return this.mapSupabaseToExercise(data || []);
    } catch (error) {
      console.error('Error in getDailyRecommendations:', error);
      return [];
    }
  }

  /**
   * Salva il progresso di un esercizio
   */
  static async saveExerciseProgress(progress: ExerciseProgress): Promise<void> {
    if (!this.isConfigured()) {
      return;
    }
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
        return;
      }
    } catch (error) {
      console.error('Error in saveExerciseProgress:', error);
    }
  }

  /**
   * Recupera il progresso degli esercizi per un utente
   */
  static async getUserExerciseProgress(userId: string): Promise<ExerciseProgress[]> {
    if (!this.isConfigured()) {
      return [];
    }
    try {
      const { data, error } = await this.supabase
        .from('exercise_progress')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching user exercise progress:', error);
        return [];
      }

      return (data || []).map(item => ({
        exerciseId: item.exercise_id,
        userId: item.user_id,
        completedAt: new Date(item.completed_at),
        stepResponses: item.step_responses || {}
      }));
    } catch (error) {
      console.error('Error in getUserExerciseProgress:', error);
      return [];
    }
  }

  /**
   * Crea un nuovo esercizio (solo per admin)
   */
  static async createExercise(exercise: Omit<Exercise, 'id'>): Promise<Exercise> {
    if (!this.isConfigured()) {
      throw new Error('Supabase non configurato');
    }
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
          
          steps: exercise.steps,
          category: exercise.category || 'generale',
          difficulty: exercise.difficulty || 'easy'
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
    if (!this.isConfigured()) {
      throw new Error('Supabase non configurato');
    }
    try {
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.introText) updateData.intro_text = updates.introText;
      if (updates.benefitsText) updateData.benefits_text = updates.benefitsText;
      if (updates.objectiveText) updateData.objective_text = updates.objectiveText;
      if (updates.duration) updateData.duration = updates.duration;
      if (updates.image) updateData.image = updates.image;
      
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
   * Elimina un esercizio
   */
  static async deleteExercise(id: string): Promise<void> {
    if (!this.isConfigured()) {
      return;
    }
    try {
      const { error } = await this.supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting exercise:', error);
        return;
      }
    } catch (error) {
      console.error('Error in deleteExercise:', error);
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
