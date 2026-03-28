export interface ExerciseStep {
  id: string;
  type: 'default' | 'withaudio' | 'withtextarea' | 'withbreath' | 'preparation';
  title: string;
  content?: string[]; // Per i passi di tipo lista/linee guida
  placeholder?: string; // Per i passi di tipo withtextarea
  audioFile?: string; // Path del file audio per step withaudio e withbreath
  duration?: number; // Durata in minuti per questo step
  description?: string; // Per descrizione aggiuntiva
  instruction?: string; // Per istruzioni specifiche
}

export interface Exercise {
  id: string;
  name: string;
  introText: string; // Descrizione - In cosa consiste l'esercizio
  benefitsText: string; // Perché - Lista di benefit
  objectiveText: string; // Obiettivo (molto corto)
  duration: number; // in minuti
  image: string; // path dell'immagine square
  audioUrl?: string; // URL dell'audio su Supabase Storage
  steps: ExerciseStep[];
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isGuided?: boolean;

  // Nuovi campi per il motore di raccomandazione e ordinamento
  primaryCategory?: string;
  tags?: string[];
  recommendedTimeSlots?: ('morning' | 'afternoon' | 'evening' | 'night' | 'anytime')[];
  recommendedIntensityLevels?: ('bassa' | 'media' | 'alta')[];
  usageType?: 'preventive' | 'regulation' | 'decompression' | 'emergency' | 'reflection';
  repetitionCooldownDays?: number;
  mentalLoad?: 'low' | 'medium' | 'high';
  journeyRole?: 'daily_ritual' | 'rescue_tool' | 'post_log_tool';
  
  // Campi specifici per l'ordinamento automatico
  journeyPhase?: 'start_day' | 'support_anytime' | 'end_day';
  defaultDisplayOrder?: number;
  priorityInCriticalMode?: 'low' | 'medium' | 'high';
}

export interface ExerciseProgress {
  exerciseId: string;
  userId: string;
  completedAt: Date;
  stepResponses?: { [stepId: string]: string }; // Risposte ai passi con textarea
  finalFeelingScore?: number; // 0, 1, 2
  startedAt?: Date;
  durationSeconds?: number;
}