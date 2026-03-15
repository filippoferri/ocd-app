import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseService from './ExerciseService';
import { Exercise } from '../types/Exercise';

export interface DailySlotResult {
  morning: Exercise;
  day: Exercise;
  evening: Exercise;
}

// Exercise pools per slot
const MORNING_POOL = ['gratitudine-mattino'];
const DAY_POOL = ['scrittura', 'respirazione-consapevole', 'meditazione-guidata'];
const EVENING_POOL = ['gratitudine-sera'];

const STORAGE_KEY_SELECTION = 'dailyExerciseSelection';
const STORAGE_KEY_COMPLETED = 'dailyExerciseCompleted';

// Deterministic hash from a date string to pick a consistent random index
function pickIndexForDate(date: string, poolSize: number): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash) % poolSize;
}

class DailyExerciseService {
  // Returns today's daily exercises (one per slot), consistent for the whole day
  static async getDailyExercises(date: string): Promise<DailySlotResult | null> {
    try {
      const cached = await this.getCachedSelection(date);
      if (cached) return cached;

      const morningId = MORNING_POOL[pickIndexForDate(date + 'M', MORNING_POOL.length)];
      const dayId = DAY_POOL[pickIndexForDate(date + 'D', DAY_POOL.length)];
      const eveningId = EVENING_POOL[pickIndexForDate(date + 'E', EVENING_POOL.length)];

      const morning = ExerciseService.getExerciseById(morningId);
      const day = ExerciseService.getExerciseById(dayId);
      const evening = ExerciseService.getExerciseById(eveningId);

      if (!morning || !day || !evening) {
        console.error('DailyExerciseService: uno o più esercizi non trovati');
        return null;
      }

      const result: DailySlotResult = { morning, day, evening };
      await this.cacheSelection(date, { morningId, dayId, eveningId });
      return result;
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

  // === Private helpers ===

  private static async getCachedSelection(date: string): Promise<DailySlotResult | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_SELECTION);
      const data: Record<string, { morningId: string; dayId: string; eveningId: string }> =
        raw ? JSON.parse(raw) : {};

      const cached = data[date];
      if (!cached) return null;

      const morning = ExerciseService.getExerciseById(cached.morningId);
      const day = ExerciseService.getExerciseById(cached.dayId);
      const evening = ExerciseService.getExerciseById(cached.eveningId);

      if (!morning || !day || !evening) return null;
      return { morning, day, evening };
    } catch {
      return null;
    }
  }

  private static async cacheSelection(
    date: string,
    ids: { morningId: string; dayId: string; eveningId: string }
  ): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_SELECTION);
      const data: Record<string, typeof ids> = raw ? JSON.parse(raw) : {};
      data[date] = ids;
      await AsyncStorage.setItem(STORAGE_KEY_SELECTION, JSON.stringify(data));
    } catch (error) {
      console.error('DailyExerciseService.cacheSelection error:', error);
    }
  }
}

export default DailyExerciseService;
