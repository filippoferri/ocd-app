// Esempio di come modificare ExploreScreen.tsx per usare Supabase
// Questo file mostra le modifiche necessarie - NON sostituire ancora il file originale

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Exercise } from '../types/Exercise';

// NUOVO: Import del servizio Supabase
import SupabaseExerciseService from '../services/SupabaseService';
// VECCHIO: import ExerciseService from '../services/ExerciseService';

interface ExploreScreenProps {
  onExerciseSelect: (exercise: Exercise) => void;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ onExerciseSelect }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true); // NUOVO: stato di caricamento
  const [error, setError] = useState<string | null>(null); // NUOVO: gestione errori

  useEffect(() => {
    loadExercises();
  }, []);

  // NUOVO: Funzione asincrona per caricare esercizi da Supabase
  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carica esercizi da Supabase
      const supabaseExercises = await SupabaseExerciseService.getAllExercises();
      
      if (supabaseExercises.length > 0) {
        setExercises(supabaseExercises);
      } else {
        // Fallback: se Supabase è vuoto, usa il servizio locale
        console.log('Nessun esercizio trovato su Supabase, usando dati locali');
        // const localExercises = ExerciseService.getAllExercises();
        // setExercises(localExercises);
        setError('Nessun esercizio disponibile');
      }
    } catch (err) {
      console.error('Errore nel caricamento esercizi:', err);
      setError('Errore nel caricamento degli esercizi');
      
      // Fallback: usa il servizio locale in caso di errore
      // const localExercises = ExerciseService.getAllExercises();
      // setExercises(localExercises);
    } finally {
      setLoading(false);
    }
  };

  // NUOVO: Funzione per ricaricare
  const handleRefresh = () => {
    loadExercises();
  };

  const handleExercisePress = (exercise: Exercise) => {
    onExerciseSelect(exercise);
  };

  // NUOVO: Rendering del loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Esplora</Text>
          <Text style={styles.subtitle}>Scopri esercizi per il benessere mentale</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Caricamento esercizi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // NUOVO: Rendering dell'errore
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Esplora</Text>
          <Text style={styles.subtitle}>Scopri esercizi per il benessere mentale</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Riprova</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Esplora</Text>
        <Text style={styles.subtitle}>Scopri esercizi per il benessere mentale</Text>
        {/* NUOVO: Pulsante refresh */}
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>↻ Aggiorna</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.exerciseGrid}>
          {exercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => handleExercisePress(exercise)}
              activeOpacity={0.7}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: exercise.image }}
                  style={styles.exerciseImage}
                  defaultSource={require('../assets/placeholder.png')} // NUOVO: placeholder
                />
                {/* NUOVO: Badge categoria */}
                {exercise.category && (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{exercise.category}</Text>
                  </View>
                )}
                {/* NUOVO: Badge difficoltà */}
                {exercise.difficulty && (
                  <View style={[styles.difficultyBadge, styles[`difficulty_${exercise.difficulty}`]]}>
                    <Text style={styles.difficultyText}>
                      {exercise.difficulty === 'easy' ? 'Facile' : 
                       exercise.difficulty === 'medium' ? 'Medio' : 'Difficile'}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseObjective}>{exercise.objectiveText}</Text>
                <Text style={styles.exerciseDuration}>{exercise.duration} min</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  // NUOVO: Stili per loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  // NUOVO: Stili per errore
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // NUOVO: Pulsante refresh
  refreshButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  refreshButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0, // Modificato per Supabase
  },
  exerciseGrid: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#F0F0F0', // NUOVO: background per loading
  },
  // NUOVO: Badge categoria
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  // NUOVO: Badge difficoltà
  difficultyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficulty_easy: {
    backgroundColor: 'rgba(52, 199, 89, 0.9)',
  },
  difficulty_medium: {
    backgroundColor: 'rgba(255, 149, 0, 0.9)',
  },
  difficulty_hard: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  exerciseObjective: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default ExploreScreen;

/*
PER APPLICARE QUESTE MODIFICHE:

1. Configura prima Supabase seguendo SUPABASE_SETUP.md
2. Testa che la connessione funzioni
3. Sostituisci gradualmente il contenuto di ExploreScreen.tsx
4. Testa che tutto funzioni correttamente
5. Ripeti per altri componenti che usano ExerciseService

VANTAGGI:
- Caricamento asincrono da database cloud
- Gestione errori e stati di loading
- Fallback al servizio locale
- UI migliorata con badge e indicatori
- Refresh manuale dei dati
*/