import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '../types/Exercise';
import { supabase } from '../lib/supabase';
import RecommendationEngine from './RecommendationEngine';
import ExerciseServiceAdapter from './ExerciseServiceAdapter';

export interface DailySlotResult {
  exercises: Exercise[];
  mode: string;
  patterns: string[];
}

const STORAGE_KEY_COMPLETED = 'dailyExerciseCompleted';

class DailyExerciseService {
  /**
   * Recupera le raccomandazioni del giorno (3-4 esercizi)
   * Usa il database come cache persistente per la giornata
   */
  static async getDailyExercises(userId: string): Promise<DailySlotResult | null> {
    const today = new Date().toISOString().split('T')[0];

    try {
      // 1. Controlla se esistono già raccomandazioni per oggi nel DB
      const { data: existing, error: fetchError } = await supabase
        .from('daily_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching daily recommendations:', fetchError);
      }

      if (existing) {
        // Usa l'Adapter per ottenere le versioni più aggiornate (locali se Supabase non è allineato)
        const exercises = await Promise.all(
          existing.exercise_ids.map((id: string) => ExerciseServiceAdapter.getExerciseById(id))
        );
        
        // Verifica se la cache contiene esercizi che ora sono esclusi
        const hasExcludedExercises = existing.exercise_ids.includes('contrasta-compulsione') || 
                                     existing.exercise_ids.includes('contrasta-ossessione');
        
        if (!hasExcludedExercises) {
          return {
            exercises: exercises.filter((ex): ex is Exercise => ex !== null),
            mode: existing.generation_mode,
            patterns: existing.patterns_detected_json
          };
        } else {
          console.log('Cache invalidata: contiene esercizi esclusi. Rigenerazione in corso...');
          // Procedi a rigenerare e sovrascrivere
        }
      }

      // 2. Se non esistono o la cache è invalida, generane di nuove usando il motore
      const result = await RecommendationEngine.generateDailyRecommendations(userId);

      // 3. Salva/Aggiorna le nuove raccomandazioni nel DB
      if (existing) {
        const { error: updateError } = await supabase
          .from('daily_recommendations')
          .update({
            exercise_ids: result.exercises.map(ex => ex.id),
            generation_mode: result.mode,
            generated_scores_json: result.scores,
            patterns_detected_json: result.patterns
          })
          .eq('id', existing.id);
          
        if (updateError) console.error('Error updating daily recommendations:', updateError);
      } else {
        const { error: insertError } = await supabase
          .from('daily_recommendations')
          .insert({
            user_id: userId,
            date: today,
            exercise_ids: result.exercises.map(ex => ex.id),
            generation_mode: result.mode,
            generated_scores_json: result.scores,
            patterns_detected_json: result.patterns
          });

        if (insertError) console.error('Error saving daily recommendations:', insertError);
      }

      return {
        exercises: result.exercises,
        mode: result.mode,
        patterns: result.patterns
      };
    } catch (error) {
      console.error('DailyExerciseService.getDailyExercises error:', error);
      return null;
    }
  }

  // Returns IDs of exercises completed today
  static async getCompletedExercisesToday(date: string): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_COMPLETED);
      const data: Record<string, string[]> = raw ? JSON.parse(raw) : {};
      return data[date] ?? [];
    } catch (error) {
      console.error('DailyExerciseService.getCompletedExercisesToday error:', error);
      return [];
    }
  }

  // Marks an exercise as completed for the given date
  static async markExerciseCompleted(exerciseId: string, date: string): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_COMPLETED);
      const data: Record<string, string[]> = raw ? JSON.parse(raw) : {};

      if (!data[date]) data[date] = [];
      if (!data[date].includes(exerciseId)) {
        data[date].push(exerciseId);
      }

      await AsyncStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(data));
    } catch (error) {
      console.error('DailyExerciseService.markExerciseCompleted error:', error);
    }
  }

  static async isExerciseCompletedToday(exerciseId: string, date: string): Promise<boolean> {
    const completed = await this.getCompletedExercisesToday(date);
    return completed.includes(exerciseId);
  }
}

export default DailyExerciseService;
