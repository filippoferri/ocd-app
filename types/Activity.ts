export interface ActivationEntry {
  id: string;
  date: string;
  time: string;
  type: 'ossessione' | 'compulsione' | 'test' | 'exercise';
  symptom: string;
  intensity: string;
  description: string;
}

export type UserActivity = ActivationEntry;
