import AuthService from './AuthService';
import DailyExerciseService from './DailyExerciseService';
import ExerciseServiceAdapter from './ExerciseServiceAdapter';
import { UserActivity, ActivationEntry } from '../types/Activity';
import { Exercise } from '../types/Exercise';

class WorkoutService {
  private static instance: WorkoutService;

  static getInstance(): WorkoutService {
    if (!WorkoutService.instance) {
      WorkoutService.instance = new WorkoutService();
    }
    return WorkoutService.instance;
  }

  /**
   * Logs a completed exercise and updates the daily progress
   */
  async completeExercise(exercise: Exercise, notes?: string): Promise<void> {
    const today = new Date();
    const localDate = today.toISOString().split('T')[0];
    const timeStr = today.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });

    try {
      // 1. Mark as completed in DailyExerciseService
      await DailyExerciseService.markExerciseCompleted(exercise.id, localDate);

      // 2. Add to activities
      const activity: Omit<UserActivity, 'id'> = {
        date: localDate,
        time: timeStr,
        type: 'esercizio' as const,
        symptom: exercise.name,
        intensity: 'completato',
        description: notes || `Esercizio completato: ${exercise.name}`,
      };

      await AuthService.addActivity(activity);
      console.log(`✅ [WorkoutService] Esercizio "${exercise.name}" salvato.`);
    } catch (error) {
      console.error('❌ [WorkoutService] Errore salvataggio esercizio:', error);
      throw error;
    }
  }

  /**
   * Retrieves user stats (consolidated)
   */
  async getAggregatedStats() {
    return await AuthService.getUserStats();
  }

  /**
   * Gets all activities
   */
  async fetchActivities(): Promise<UserActivity[]> {
    return await AuthService.getUserActivities();
  }
}

export default WorkoutService.getInstance();
