import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Exercise, ExerciseStep } from '../types/Exercise';
import ExerciseService from '../services/ExerciseService';
import ExerciseServiceAdapter from '../services/ExerciseServiceAdapter';



interface ExploreScreenProps {
  onExercisePress: (exercise: Exercise) => void;
}

const imageMap: { [key: string]: any } = {
  'body-scan': require('../assets/exercises/body-scan.png'),
  'contrasta-compulsione': require('../assets/exercises/contrasta-compulsione.png'),
  'contrasta-ossessione': require('../assets/exercises/contrasta-ossessione.png'),
  'gratitudine-mattino': require('../assets/exercises/gratitudine-mattino.png'),
  'scrittura': require('../assets/exercises/scrittura.png'),
  'respirazione-consapevole': require('../assets/exercises/respirazione-consapevole.png'),
  'gratitudine-sera': require('../assets/exercises/gratitudine-sera.png'),
  'meditazione-guidata': require('../assets/exercises/meditazione-guidata.png'),
};
const getExerciseImagePNG = (imagePath: string) => {
  const imageId = imagePath.split('/').pop()?.replace('.png', '') || '';
  return imageMap[imageId] || require('../assets/exercises/body-scan.png');
};

const ExploreScreen: React.FC<ExploreScreenProps> = ({ onExercisePress }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      // Carica gli esercizi dal servizio ufficiale
      const loadedExercises = ExerciseService.getAllExercises();
      setExercises(loadedExercises);
    } catch (err) {
      console.error('Errore nel caricamento esercizi:', err);
      setError('Errore nel caricamento degli esercizi');
      // Fallback al servizio base in caso di errore
      setExercises(ExerciseService.getAllExercises());
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadExercises();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Esplora Esercizi</Text>
          <Text style={styles.subtitle}>Scopri esercizi per il benessere mentale</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Caricamento esercizi...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Esplora Esercizi</Text>
          <Text style={styles.subtitle}>Scopri esercizi per il benessere mentale</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Riprova</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderExerciseCard = (exercise: Exercise) => (
    <TouchableOpacity
      key={exercise.id}
      style={styles.exerciseCard}
      onPress={() => onExercisePress(exercise)}
    >
      <View style={styles.cardImageContainer}>
        <Image 
          source={getExerciseImagePNG(exercise.image)}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{exercise.duration} min</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.exerciseTitle} numberOfLines={2}>
          {exercise.name}
        </Text>
        
        <Text style={styles.exerciseObjective} numberOfLines={3}>
          {exercise.objectiveText}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Esplora Esercizi</Text>
        <Text style={styles.subtitle}>
          Scopri esercizi per il benessere mentale
        </Text>

      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderExerciseCard(item)}
        numColumns={2}
        style={styles.exercisesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Nessun esercizio trovato
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },

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
  exercisesContainer: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardImageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 80,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#E8E8E8',
  },
  durationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 20,
  },
  exerciseObjective: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
});

export default ExploreScreen;