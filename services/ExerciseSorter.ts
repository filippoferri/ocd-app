import { Exercise } from '../types/Exercise';

export interface UserContext {
  isCriticalMode: boolean;
  todayTimeContext?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export class ExerciseSorter {
  // Configurable thresholds/orders
  private static readonly PHASE_ORDER = {
    start_day: 1,
    support_anytime: 2,
    end_day: 3,
  };

  /**
   * Sorts the selected exercises based on standard and critical mode rules.
   */
  static orderDailyExercises(exercises: Exercise[], context: UserContext): Exercise[] {
    if (!exercises || exercises.length === 0) return [];

    let ordered = [...exercises];

    // 1. Critical Mode Handling
    if (context.isCriticalMode) {
      const promotionIndex = ordered.findIndex(ex => 
        (ex.usageType === 'regulation' || ex.usageType === 'emergency') &&
        ex.priorityInCriticalMode === 'high' &&
        ex.mentalLoad === 'low'
      );

      if (promotionIndex !== -1) {
        const [promoted] = ordered.splice(promotionIndex, 1);
        // Place promoted exercise at the top
        return [promoted, ...this.sortStandard(ordered)];
      }
    }

    // 2. Standard Sorting
    return this.sortStandard(ordered);
  }

  /**
   * Standard sorting logic based on journeyPhase and secondary tie-breakers.
   */
  private static sortStandard(exercises: Exercise[]): Exercise[] {
    return [...exercises].sort((a, b) => {
      // Primary: journeyPhase
      const phaseA = this.PHASE_ORDER[a.journeyPhase || 'support_anytime'];
      const phaseB = this.PHASE_ORDER[b.journeyPhase || 'support_anytime'];

      if (phaseA !== phaseB) {
        return phaseA - phaseB;
      }

      // Secondary: defaultDisplayOrder
      const orderA = a.defaultDisplayOrder ?? 999;
      const orderB = b.defaultDisplayOrder ?? 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Tertiary: Shortest duration first
      if (a.duration !== b.duration) {
        return a.duration - b.duration;
      }

      // Fallback: Stable sort by ID
      return a.id.localeCompare(b.id);
    });
  }
}

export default ExerciseSorter;
