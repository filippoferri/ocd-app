import { supabase } from '../lib/supabase';
import { UserActivity } from '../types/Activity';
import { ExerciseProgress } from '../types/Exercise';

export type TrendStateType = 'bootstrap' | 'miglioramento' | 'stabile' | 'piu_difficile' | 'inattivo';

export interface TrendState {
  state: TrendStateType;
  color: string;
  bgColor: string;
  textColor: string;
  icon: 'sad' | 'neutral' | 'happy';
  label: string;
  message: string;
}

export class TrendService {
  private static readonly MESSAGES = {
    bootstrap: "Stiamo iniziando questo percorso insieme. Inizia da qui.",
    inattivo: "Bentornato. Riprendi da oggi o registra come ti senti.",
    miglioramento: "Stai andando nella direzione giusta. Prosegui con gli esercizi.",
    stabile: "Stai mantenendo l’equilibrio. Continua così.",
    piu_difficile: "È un momento più difficile, capita. Prenditi il tuo tempo."
  };

  private static readonly UI_MAPPING: Record<TrendStateType, Omit<TrendState, 'message' | 'state'>> = {
    bootstrap: { color: '#9381FF', bgColor: '#E4E2FD', textColor: '#4A3B99', icon: 'neutral', label: 'Iniziamo' },
    inattivo: { color: '#9381FF', bgColor: '#E4E2FD', textColor: '#4A3B99', icon: 'neutral', label: 'Inattivo' },
    miglioramento: { color: '#6BCF7F', bgColor: '#E8F8EC', textColor: '#2D6A3B', icon: 'happy', label: 'In miglioramento' },
    stabile: { color: '#FFD93D', bgColor: '#FFF9E6', textColor: '#806600', icon: 'neutral', label: 'Stabile' },
    piu_difficile: { color: '#FF6B6B', bgColor: '#FFEBEB', textColor: '#993333', icon: 'sad', label: 'Più difficile' }
  };

  /**
   * Calculate the user's OCD trend based on the latest 14 days of activity and progress.
   */
  static async getUserTrend(userId: string, createdAt?: string): Promise<TrendState> {
    try {
      const now = new Date();
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(now.getDate() - 14);

      // Fetch user activities
      const { data: rawActivities, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .gte('date', fourteenDaysAgo.toISOString().split('T')[0]);

      if (activitiesError) throw new Error(activitiesError.message);

      // Fetch user exercise progress
      const { data: rawProgress, error: progressError } = await supabase
        .from('exercise_progress')
        .select('*')
        .eq('user_id', userId)
        .gte('completed_at', fourteenDaysAgo.toISOString());

      if (progressError) throw new Error(progressError.message);

      const activities = rawActivities as any[];
      const progressList = rawProgress as any[];

      return this.calculateState(activities, progressList, createdAt);

    } catch (error) {
      console.error('Error calculating trend:', error);
      // Fallback
      return this.buildStateResponse('stabile');
    }
  }

  private static calculateState(activities: any[], progressList: any[], createdAt?: string): TrendState {
    const activeDays = new Set(activities.map(a => a.date)).size;
    const totalActivations = activities.filter(a => a.type === 'ossessione' || a.type === 'compulsione').length;
    const completedExercises = progressList.length;

    let isNewUser = true;
    if (createdAt) {
      const createdDate = new Date(createdAt);
      const now = new Date();
      const ageInDays = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
      isNewUser = ageInDays < 14;
    }

    if (activeDays === 0 && totalActivations === 0 && completedExercises === 0) {
      return isNewUser ? this.buildStateResponse('bootstrap') : this.buildStateResponse('inattivo');
    }

    // 1. Condizione Bootstrap
    if (activeDays < 3 || totalActivations < 5 || completedExercises < 5) {
      return this.buildStateResponse('bootstrap');
    }

    // 2. Calcolo Score Giornalieri
    const scoresByDate: Record<string, number> = {};
    const now = new Date();
    
    // Inizializza gli utlimi 14 giorni (da 0 a 13 giorni fa)
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      scoresByDate[dateStr] = 0;
    }

    const mapIntensity = (intensity: string) => {
      const lower = (intensity || '').toLowerCase();
      if (lower.includes('grave') || lower.includes('forte') || lower.includes('alta')) return 3;
      if (lower.includes('moderata') || lower.includes('media')) return 2;
      return 1; // lieve / bassa / default
    };

    // Raggruppa per data
    Object.keys(scoresByDate).forEach(date => {
      const dayActivities = activities.filter(a => a.date === date && (a.type === 'ossessione' || a.type === 'compulsione'));
      const dayProgress = progressList.filter(p => new Date(p.completed_at).toISOString().split('T')[0] === date);

      // Media intensità per il giorno
      let avgIntensity = 0;
      if (dayActivities.length > 0) {
        const sumIntensity = dayActivities.reduce((acc, a) => acc + mapIntensity(a.intensity), 0);
        avgIntensity = sumIntensity / dayActivities.length;
      }

      // Media esito per il giorno
      let avgFeeling = 0;
      if (dayProgress.length > 0) {
        // final_feeling_score scala da 0 (Male) a 2 (Bene)
        const validProgress = dayProgress.filter(p => p.final_feeling_score !== undefined && p.final_feeling_score !== null);
        if (validProgress.length > 0) {
          const sumFeeling = validProgress.reduce((acc, p) => acc + p.final_feeling_score, 0);
          avgFeeling = sumFeeling / validProgress.length;
        }
      }

      // Bonus completamento
      const completionBonus = dayProgress.length > 0 ? 1 : 0;

      // Score base giornaliero
      const dailyScore = -avgIntensity + avgFeeling + completionBonus;
      scoresByDate[date] = dailyScore;
    });

    // 3. Calcolo Trend (Ultimi 7 vs Precedenti 7)
    let sumRecent = 0;
    let sumPrevious = 0;

    for (let i = 0; i < 7; i++) {
       const d1 = new Date(now);
       d1.setDate(now.getDate() - i);
       sumRecent += scoresByDate[d1.toISOString().split('T')[0]] || 0;

       const d2 = new Date(now);
       d2.setDate(now.getDate() - (i + 7));
       sumPrevious += scoresByDate[d2.toISOString().split('T')[0]] || 0;
    }

    const avgRecent = sumRecent / 7;
    const avgPrevious = sumPrevious / 7;

    // Gestione delta
    let delta = 0;
    if (avgPrevious === 0) {
       // Se prima era 0 e ora c'è un punteggio positivo/negativo, diamo +100% o -100%
       delta = avgRecent > 0 ? 100 : (avgRecent < 0 ? -100 : 0);
    } else {
       // Delta percentuale normalizzato, ci assicuriamo che il segno del delta rifletta un "Miglioramento" o meno
       // Se score passa da -2 a -1, è un miglioramento (+50%)
       // Se avgPrevious è negativo, invertiamo il denominatore per matematicamente conservare il segno del delta come direzionale
       delta = ((avgRecent - avgPrevious) / Math.abs(avgPrevious)) * 100;
    }

    // 4. Mappatura Output
    if (delta > 10) {
      return this.buildStateResponse('miglioramento');
    } else if (delta < -10) {
      return this.buildStateResponse('piu_difficile');
    } else {
      return this.buildStateResponse('stabile');
    }
  }

  private static buildStateResponse(state: TrendStateType): TrendState {
    const ui = this.UI_MAPPING[state];
    return {
      state,
      color: ui.color,
      bgColor: ui.bgColor,
      textColor: ui.textColor,
      icon: ui.icon,
      label: ui.label,
      message: this.MESSAGES[state]
    };
  }
}

export default TrendService;
