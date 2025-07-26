import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Exercise } from '../types/Exercise';
import ExerciseService from '../services/ExerciseService';

interface ExploreScreenProps {
  onExercisePress: (exercise: Exercise) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2; // 2 colonne con margini laterali

const getExerciseImagePNG = (imageId: string) => {
  switch (imageId) {
    case 'body-scan':
      return require('../assets/exercises/body-scan.png');
    case 'contrasta-compulsione':
      return require('../assets/exercises/contrasta-compulsione.png');
    case 'gratitudine-mattino':
      return require('../assets/exercises/gratitudine-mattino.png');
    case 'scrittura':
      return require('../assets/exercises/scrittura.png');
    default:
      return require('../assets/exercises/body-scan.png');
  }
};

const ExploreScreen: React.FC<ExploreScreenProps> = ({ onExercisePress }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = () => {
    const allExercises = ExerciseService.getAllExercises();
    setExercises(allExercises);
  };

  const filteredExercises = exercises;





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
        
        <Text style={styles.exerciseObjective} numberOfLines={2}>
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

      <ScrollView 
        style={styles.exercisesContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.exercisesGrid}>
          {filteredExercises.map(renderExerciseCard)}
        </View>
        
        {filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Nessun esercizio trovato per questa categoria
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
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

  exercisesContainer: {
    flex: 1,
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 100,
    justifyContent: 'space-between',
  },
  exerciseCard: {
    width: cardWidth,
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
    color: '#666666',
    textAlign: 'center',
  },
});

export default ExploreScreen;