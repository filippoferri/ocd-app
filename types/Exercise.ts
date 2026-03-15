export interface ExerciseStep {
  id: string;
  type: 'default' | 'withaudio' | 'withtextarea' | 'withbreath';
  title: string;
  content?: string[]; // Per i passi di tipo lista/linee guida
  placeholder?: string; // Per i passi di tipo withtextarea
  audioFile?: string; // Path del file audio per step withaudio e withbreath
  duration?: number; // Durata in minuti per questo step
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
}

export interface ExerciseProgress {
  exerciseId: string;
  userId: string;
  completedAt: Date;
  stepResponses?: { [stepId: string]: string }; // Risposte ai passi con textarea
}