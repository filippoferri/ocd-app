import { createClient } from '@supabase/supabase-js';
import { Exercise, ExerciseStep } from '../types/Exercise';

import { supabase } from '../lib/supabase';

// Interfaccia per gli esercizi nel database
interface SupabaseExercise {
  id: string;
  name: string;
  intro_text: string;
  benefits_text: string;
  objective_text: string;
  duration: number;
  image: string;
  audio_guide?: string;
  steps: ExerciseStep[];
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  created_at: string;
}

class SupabaseExerciseService {
  // Ottieni tutti gli esercizi dal database
  static async getAllExercises(): Promise<Exercise[]> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Errore nel recupero esercizi:', error);
        return [];
      }

      // Converti da formato Supabase a formato app
      return data.map(this.mapSupabaseToExercise);
    } catch (error) {
      console.error('Errore nella chiamata Supabase:', error);
      return [];
    }
  }

  // Ottieni un esercizio specifico per ID
  static async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Errore nel recupero esercizio:', error);
        return null;
      }

      return this.mapSupabaseToExercise(data);
    } catch (error) {
      console.error('Errore nella chiamata Supabase:', error);
      return null;
    }
  }

  // Ottieni URL audio per un esercizio
  static getAudioUrl(audioPath: string): string {
    const { data } = supabase.storage
      .from('exercise-audio')
      .getPublicUrl(audioPath);
    
    return data.publicUrl;
  }

  // Converti da formato Supabase a formato Exercise dell'app
  private static mapSupabaseToExercise(supabaseExercise: SupabaseExercise): Exercise {
    return {
      id: supabaseExercise.id,
      name: supabaseExercise.name,
      introText: supabaseExercise.intro_text,
      benefitsText: supabaseExercise.benefits_text,
      objectiveText: supabaseExercise.objective_text,
      duration: supabaseExercise.duration,
      image: supabaseExercise.image,
      audioUrl: supabaseExercise.audio_guide,
      steps: supabaseExercise.steps,
      category: supabaseExercise.category,
      difficulty: supabaseExercise.difficulty
    };
  }

  // Metodi per admin (da usare nella piattaforma admin)
  static async createExercise(exercise: Omit<SupabaseExercise, 'id' | 'created_at'>): Promise<Exercise | null> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([exercise])
        .select()
        .single();

      if (error) {
        console.error('Errore nella creazione esercizio:', error);
        return null;
      }

      return this.mapSupabaseToExercise(data);
    } catch (error) {
      console.error('Errore nella chiamata Supabase:', error);
      return null;
    }
  }

  static async updateExercise(id: string, updates: Partial<SupabaseExercise>): Promise<Exercise | null> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Errore nell\'aggiornamento esercizio:', error);
        return null;
      }

      return this.mapSupabaseToExercise(data);
    } catch (error) {
      console.error('Errore nella chiamata Supabase:', error);
      return null;
    }
  }

  static async deleteExercise(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Errore nella cancellazione esercizio:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Errore nella chiamata Supabase:', error);
      return false;
    }
  }

  // Upload file audio
  static async uploadAudio(file: File, fileName: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from('exercise-audio')
        .upload(fileName, file);

      if (error) {
        console.error('Errore nell\'upload audio:', error);
        return null;
      }

      return data.path;
    } catch (error) {
      console.error('Errore nell\'upload:', error);
      return null;
    }
  }
}

export default SupabaseExerciseService;
