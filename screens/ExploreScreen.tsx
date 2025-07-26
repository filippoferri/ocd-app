import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Exercise, ExerciseStep } from '../types/Exercise';
// import SupabaseExerciseService from '../services/SupabaseService';

// Mock data per lo sviluppo
const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Meditazione Guidata',
    introText: 'Una sessione di meditazione per rilassare mente e corpo attraverso la mindfulness',
    benefitsText: 'Riduce stress e ansia, migliora la concentrazione, favorisce il rilassamento',
    objectiveText: 'Ridurre stress e ansia attraverso la mindfulness',
    duration: 10,
    image: 'body-scan',
    audioGuide: 'meditation-guided.mp3', // Audio principale (non usato con step separati)
    steps: [
      { 
        id: '1', 
        type: 'default', 
        title: 'Preparazione', 
        content: ['Trova una posizione comoda', 'Chiudi gli occhi e respira profondamente'],
        audioFile: 'assets/audio/meditation-step1-preparation.mp3',
        duration: 1 // 1 minuto
      },
      { 
        id: '2', 
        type: 'default', 
        title: 'Pratica', 
        content: ['Segui la voce guida', 'Concentrati sul respiro'],
        audioFile: 'assets/audio/meditation-step2-practice.mp3',
        duration: 9 // 9 minuti
      }
    ],
    category: 'mindfulness',
    difficulty: 'easy'
  },
  {
    id: '2',
    name: 'Esercizio di Gratitudine',
    introText: 'Pratica quotidiana per coltivare la gratitudine e migliorare il benessere emotivo',
    benefitsText: 'Migliora l\'umore, aumenta la positività, riduce i pensieri negativi',
    objectiveText: 'Migliorare l\'umore e la prospettiva positiva',
    duration: 5,
    image: 'gratitudine-mattino',
    audioGuide: 'gratitude-exercise.mp3',
    steps: [
      { id: '1', type: 'withtextarea', title: 'Rifletti', placeholder: 'Scrivi tre cose per cui sei grato oggi...' },
      { id: '2', type: 'default', title: 'Pratica', content: ['Rifletti sul perché sono importanti', 'Senti la sensazione di gratitudine'] }
    ],
    category: 'positivity',
    difficulty: 'easy'
  },
  {
    id: '3',
    name: 'Respirazione Profonda',
    introText: 'Tecnica di respirazione per calmare il sistema nervoso e ridurre l\'ansia',
    benefitsText: 'Riduce l\'ansia, calma la mente, migliora la concentrazione',
    objectiveText: 'Ridurre l\'ansia e ritrovare la calma',
    duration: 8,
    image: 'contrasta-compulsione',
    audioGuide: 'deep-breathing.mp3',
    steps: [
      { id: '1', type: 'default', title: 'Tecnica 4-4-6', content: ['Inspira lentamente per 4 secondi', 'Trattieni il respiro per 4 secondi', 'Espira lentamente per 6 secondi', 'Ripeti il ciclo'] }
    ],
    category: 'breathing',
    difficulty: 'easy'
  },
  {
    id: '4',
    name: 'Body Scan Rilassante',
    introText: 'Scansione corporea per rilasciare le tensioni e aumentare la consapevolezza del corpo',
    benefitsText: 'Rilassa il corpo, riduce le tensioni muscolari, migliora la consapevolezza corporea',
    objectiveText: 'Rilassare il corpo e aumentare la consapevolezza',
    duration: 15,
    image: 'scrittura',
    audioGuide: 'body-scan-relaxation.mp3',
    steps: [
      { id: '1', type: 'default', title: 'Preparazione', content: ['Sdraiati in posizione comoda', 'Chiudi gli occhi e respira naturalmente'] },
      { id: '2', type: 'default', title: 'Scansione', content: ['Inizia dai piedi e sali verso la testa', 'Nota ogni sensazione senza giudicare', 'Rilascia le tensioni che trovi'] }
    ],
    category: 'relaxation',
    difficulty: 'medium'
  }
];

interface ExploreScreenProps {
  onExercisePress: (exercise: Exercise) => void;
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simula un caricamento asincrono
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setExercises(mockExercises);
    } catch (err) {
      console.error('Errore nel caricamento esercizi:', err);
      setError('Errore nel caricamento degli esercizi');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadExercises();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Esplora Esercizi</Text>
          <Text style={styles.subtitle}>Scopri esercizi per il benessere mentale</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Caricamento esercizi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
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
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>↻ Aggiorna</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.exercisesContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.exercisesGrid}>
          {exercises.map(renderExerciseCard)}
        </View>
        
        {exercises.length === 0 && !loading && !error && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Nessun esercizio trovato
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
  refreshButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  refreshButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
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
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    width: '48%',
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
    height: 120,
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