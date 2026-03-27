import { Exercise, ExerciseProgress } from '../types/Exercise';
import { supabase } from '../lib/supabase';
import { SupabaseExerciseService } from './SupabaseExerciseService';
import ExerciseServiceAdapter from './ExerciseServiceAdapter';

export interface DailyRecommendation {
  exercises: Exercise[];
  mode: 'standard' | 'stabilization' | 'consolidation';
  patterns: string[];
  scores: Record<string, number>;
}

export interface Activation {
  id: string;
  user_id: string;
  created_at: string;
  time_slot: string;
  intensity_level: string;
}

class RecommendationEngine {
  private static WEIGHTS = {
    timeSlot: 3,
    recentIntensity: 2,
    historicalUtility: 3,
    variety: 2,
    pattern: 3,
    preventive: 2,
    repetitionPenalty: -5
  };

  /**
   * Genera le raccomandazioni del giorno per un utente
   */
  static async generateDailyRecommendations(userId: string): Promise<DailyRecommendation> {
    const allExercises = await ExerciseServiceAdapter.getAllExercises();
    
    // Filtriamo gli esercizi specifici legati al flusso di attivazione
    const exercises = allExercises.filter(
      ex => ex.id !== 'contrasta-compulsione' && ex.id !== 'contrasta-ossessione'
    );
    const recentActivations = await this.getRecentActivations(userId, 14);
    const recentProgress = await SupabaseExerciseService.getUserExerciseProgress(userId);
    
    // 1. Rileva i pattern
    const patterns = this.detectPatterns(recentActivations);
    
    // 2. Determina la modalità operativa
    const mode = this.determineMode(recentActivations, patterns);
    
    // 3. Calcola gli score per ogni esercizio
    const scores: Record<string, number> = {};
    const currentTimeSlot = this.getCurrentTimeSlot();

    for (const exercise of exercises) {
      scores[exercise.id] = this.calculateScore(
        exercise, 
        recentActivations, 
        recentProgress, 
        patterns, 
        currentTimeSlot,
        mode
      );
    }

    // 4. Selezione finale
    const selectedExercises = this.selectExercises(exercises, scores, mode);

    return {
      exercises: selectedExercises,
      mode,
      patterns,
      scores
    };
  }

  private static async getRecentActivations(userId: string, days: number): Promise<Activation[]> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', dateLimit.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recent activations:', error);
      return [];
    }

    // Mappa i dati grezzi alla nostra interfaccia Activation
    return (data || []).map(d => ({
      id: d.id,
      user_id: d.user_id,
      created_at: d.created_at,
      time_slot: this.getTimeSlotFromDate(new Date(d.created_at)),
      intensity_level: d.intensity
    }));
  }

  private static detectPatterns(activations: Activation[]): string[] {
    const patterns: string[] = [];
    if (activations.length === 0) return patterns;

    // Pattern orario (picco > 50% in una fascia negli ultimi 7 giorni)
    const last7Days = activations.filter(a => {
      const date = new Date(a.created_at);
      const now = new Date();
      return (now.getTime() - date.getTime()) < (7 * 24 * 60 * 60 * 1000);
    });

    if (last7Days.length >= 3) {
      const slotsCount: Record<string, number> = {};
      last7Days.forEach(a => {
        slotsCount[a.time_slot] = (slotsCount[a.time_slot] || 0) + 1;
      });

      for (const [slot, count] of Object.entries(slotsCount)) {
        if (count / last7Days.length > 0.5) {
          patterns.push(`picco_${slot}`);
        }
      }
    }

    // Pattern escalation (2+ attivazioni alte consecutive)
    if (activations.length >= 2) {
      if (activations[0].intensity_level === 'alta' && activations[1].intensity_level === 'alta') {
        patterns.push('escalation');
      }
    }

    // Pattern frequenza (aumento numero attivazioni negli ultimi 3 giorni vs baseline 14)
    const last3Days = activations.filter(a => {
      const date = new Date(a.created_at);
      const now = new Date();
      return (now.getTime() - date.getTime()) < (3 * 24 * 60 * 60 * 1000);
    });

    const baselineDaily = activations.length / 14;
    const currentDaily = last3Days.length / 3;
    if (currentDaily > baselineDaily * 1.5 && last3Days.length >= 2) {
      patterns.push('frequenza_alta');
    }

    return patterns;
  }

  private static determineMode(activations: Activation[], patterns: string[]): 'standard' | 'stabilization' | 'consolidation' {
    if (patterns.includes('escalation') || patterns.includes('frequenza_alta')) {
      return 'stabilization';
    }

    // Se poche attivazioni o esiti positivi (sempliicazione per ora)
    if (activations.length < 2) {
      return 'consolidation';
    }

    return 'standard';
  }

  private static calculateScore(
    exercise: Exercise,
    activations: Activation[],
    progress: ExerciseProgress[],
    patterns: string[],
    currentTimeSlot: string,
    mode: 'standard' | 'stabilization' | 'consolidation'
  ): number {
    let score = 0;

    // 1. Score momento giornata
    if (exercise.recommendedTimeSlots?.includes(currentTimeSlot)) {
      score += 3;
    } else if (exercise.recommendedTimeSlots?.includes('anytime')) {
      score += 1;
    }

    // 2. Score intensità recente
    const recentIntensity = activations.length > 0 ? activations[0].intensity_level : 'bassa';
    if (exercise.recommendedIntensityLevels?.includes(recentIntensity)) {
      score += 2;
    }

    // 3. Score utilità storica (efficacia media)
    const historicalSessions = progress.filter(p => p.exerciseId === exercise.id && p.finalFeelingScore !== undefined);
    if (historicalSessions.length > 0) {
      const averageFeeling = historicalSessions.reduce((acc, curr) => acc + (curr.finalFeelingScore || 0), 0) / historicalSessions.length;
      score += averageFeeling * 1.5; // Scale to max ~3
    }

    // 4. Score varietà (non proposto di recente)
    const lastDone = progress.find(p => p.exerciseId === exercise.id);
    if (!lastDone) {
      score += 2;
    } else {
      const daysSince = (new Date().getTime() - new Date(lastDone.completedAt).getTime()) / (24 * 60 * 60 * 1000);
      if (daysSince > 7) score += 2;
      else if (daysSince > 3) score += 1;
    }

    // 5. Score pattern
    for (const pattern of patterns) {
      if (pattern.startsWith('picco_')) {
        const slot = pattern.replace('picco_', '');
        if (exercise.recommendedTimeSlots?.includes(slot) && exercise.usageType === 'preventive') {
          score += 3;
        }
      }
    }

    // 6. Score preventivo (in modalità consolidation)
    if (mode === 'consolidation' && exercise.usageType === 'preventive') {
      score += 2;
    }

    // 7. Penalità ripetizione
    if (lastDone) {
      const daysSince = (new Date().getTime() - new Date(lastDone.completedAt).getTime()) / (24 * 60 * 60 * 1000);
      if (daysSince < 1) score -= 5;
      else if (daysSince < 2) score -= 3;
      else if (daysSince < 3) score -= 1;
    }

    // Adjustments for Stabilization mode
    if (mode === 'stabilization') {
      if (['corporeo', 'respirazione'].includes(exercise.primaryCategory || '')) {
        score += 3;
      }
      if (exercise.mentalLoad === 'low') {
        score += 2;
      }
      if (exercise.mentalLoad === 'high') {
        score -= 4;
      }
    }

    return score;
  }

  private static selectExercises(exercises: Exercise[], scores: Record<string, number>, mode: 'standard' | 'stabilization' | 'consolidation'): Exercise[] {
    // Ordina esercizi per score decrescente
    const sorted = [...exercises].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
    
    const count = mode === 'stabilization' ? 4 : 3;
    const selected: Exercise[] = [];
    const usedCategories = new Set<string>();

    for (const ex of sorted) {
      if (selected.length >= count) break;

      // Vincoli di composizione
      if (usedCategories.has(ex.primaryCategory || '')) {
        if (mode !== 'stabilization') continue; // In stabilizzazione possiamo ripetere categorie
      }
      
      // Vincolo durata: max 1 lungo
      if (ex.duration > 15 && selected.some(s => s.duration > 15)) continue;

      selected.push(ex);
      usedCategories.add(ex.primaryCategory || '');
    }

    // Fallback se non abbiamo abbastanza esercizi
    if (selected.length < count) {
      for (const ex of sorted) {
        if (selected.length >= count) break;
        if (!selected.find(s => s.id === ex.id)) {
          selected.push(ex);
        }
      }
    }

    return selected;
  }

  private static getCurrentTimeSlot(): string {
    return this.getTimeSlotFromDate(new Date());
  }

  private static getTimeSlotFromDate(date: Date): string {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'mattina';
    if (hour >= 12 && hour < 18) return 'pomeriggio';
    if (hour >= 18 && hour < 23) return 'sera';
    return 'notte';
  }
}

export default RecommendationEngine;
