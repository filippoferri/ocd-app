import { UserActivity } from '../types/Activity';

export type UserTrendState = 'BOOTSTRAP' | 'IMPROVING' | 'STABLE' | 'HARDER' | 'POSITIVE' | 'NEUTRAL';

const MIN_DATA_THRESHOLD = 3;
const TREND_DAYS = 7;

function getIntensityValue(intensity?: string): number {
  if (intensity === 'alta') return 3;
  if (intensity === 'media') return 2;
  if (intensity === 'bassa') return 1;
  return 0; 
}

function getDaysDiff(dateStr: string) {
  const localDateStr = dateStr.split('T')[0];
  const itemDate = new Date(localDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  itemDate.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - itemDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function isRealActivation(activity: UserActivity) {
  return !(activity.id?.startsWith('exercise_') || activity.description.includes('Esercizio completato'));
}

export const calculateUserTrend = (
  userActivities: UserActivity[], 
  currentMood?: 'sad' | 'neutral' | 'happy' | null,
  completedExercisesTodayCount: number = 0
): UserTrendState => {
  const realActivities = userActivities.filter(isRealActivation);
  
  if (realActivities.length < MIN_DATA_THRESHOLD) {
    return 'BOOTSTRAP';
  }

  const recentActivations = realActivities.filter(a => {
    const daysDiff = getDaysDiff(a.date);
    return daysDiff >= 0 && daysDiff < TREND_DAYS;
  });

  const pastActivations = realActivities.filter(a => {
    const daysDiff = getDaysDiff(a.date);
    return daysDiff >= TREND_DAYS && daysDiff < TREND_DAYS * 2;
  });

  const getActivationsScore = (activs: UserActivity[]) => {
    return activs.reduce((sum, act) => sum + getIntensityValue(act.intensity), 0);
  };

  const recentScore = getActivationsScore(recentActivations);
  const pastScore = getActivationsScore(pastActivations);

  // LOGICA POSITIVA: 0 attivazioni recenti (7gg) + esercizi fatti
  if (recentActivations.length === 0 && (completedExercisesTodayCount > 0 || currentMood === 'happy')) {
    return 'POSITIVE';
  }

  // LOGICA DIFFICOLTÀ: Intensità alta recente O frequenza elevata
  const highIntensityRecent = recentActivations.some(a => a.intensity === 'alta');
  const frequentActivations = recentActivations.length >= 5;
  if (highIntensityRecent || frequentActivations || (recentScore > pastScore + 1) || currentMood === 'sad') {
    return 'HARDER';
  }

  // LOGICA MIGLIORAMENTO: Intensità in calo O esercizi fatti recenti
  const exercisesDoneRecent = userActivities.some(a => {
    const isEx = a.id?.startsWith('exercise_') || a.description.includes('Esercizio completato');
    return isEx && getDaysDiff(a.date) < 3;
  });
  if (recentScore < pastScore - 1 || exercisesDoneRecent) {
    return 'IMPROVING';
  }

  return 'NEUTRAL';
};

// Logica per il Profilo (Andamento Recente)
export const getTrendCopy = (state: UserTrendState) => {
  switch (state) {
    case 'IMPROVING':
    case 'POSITIVE':
      return { 
        title: 'In miglioramento', 
        insight: 'Negli ultimi giorni le attivazioni sono più leggere' 
      };
    case 'HARDER':
      return { 
        title: 'Più intenso', 
        insight: 'Negli ultimi giorni è stato più intenso del solito' 
      };
    case 'BOOTSTRAP':
      return { 
        title: 'Andamento recente', 
        insight: 'Stiamo iniziando a costruire il tuo andamento' 
      };
    case 'NEUTRAL':
    case 'STABLE':
    default:
      return { 
        title: 'Stabile', 
        insight: 'La situazione è stabile negli ultimi giorni' 
      };
  }
};

// Logica specifica per la HOME
const homePhrases: Record<string, string[]> = {
  BOOTSTRAP: [
    "Inizia con poco, va benissimo così.",
    "Facciamo un piccolo passo, insieme.",
    "Non serve fare tanto, basta iniziare."
  ],
  NEUTRAL: [
    "Prenditi un momento, senza fretta.",
    "Puoi partire da qualcosa di semplice.",
    "Anche poco oggi è già abbastanza."
  ],
  IMPROVING: [
    "Continua così, stai andando bene.",
    "Quello che stai facendo sta funzionando.",
    "Rimani su questa strada, passo dopo passo."
  ],
  HARDER: [
    "Respira, non devi risolvere tutto adesso.",
    "Puoi rallentare, va bene così.",
    "Anche fermarti un attimo è già utile."
  ],
  POSITIVE: [
    "Questo è un buon momento per te.",
    "Approfitta di questo spazio per te.",
    "Segui questo momento, senza forzare."
  ]
};

export const getHomeStatusPhrase = (state: UserTrendState) => {
  const currentState = (state === 'STABLE' || state === 'NEUTRAL') ? 'NEUTRAL' : state;
  const phrases = homePhrases[currentState] || homePhrases.NEUTRAL;
  
  // Rotazione basata sul giorno per non cambiare frase ad ogni reload ma variare quotidianamente
  const today = new Date();
  const seed = today.getDate() + today.getMonth();
  return phrases[seed % phrases.length];
};
