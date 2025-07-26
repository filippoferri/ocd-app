export interface ExerciseStep {
  id: string;
  type: 'list' | 'textarea';
  title: string;
  content?: string[]; // Per i passi di tipo lista
  placeholder?: string; // Per i passi di tipo textarea
}

export interface Exercise {
  id: string;
  name: string;
  introText: string; // Descrizione - In cosa consiste l'esercizio
  benefitsText: string; // Perché - Lista di benefit
  objectiveText: string; // Obiettivo (molto corto)
  duration: number; // in minuti
  image: string; // path dell'immagine square
  audioGuide: string; // path del file .mp3
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