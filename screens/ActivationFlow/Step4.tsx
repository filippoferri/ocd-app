import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Text as SvgText, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import ExerciseServiceAdapter from '../../services/ExerciseServiceAdapter';
import { Exercise } from '../../types/Exercise';

interface Step4Props {
  onFinish: () => void;
  activationData: {
    date: string;
    time: string;
    symptoms: string[];
    intensity: string;
    description: string;
    type: 'ossessione' | 'compulsione' | null;
  };
  onOpenExercise?: (exercise: Exercise) => void;
}

const symptomLabels: { [key: string]: string } = {
  'contamination': 'Paura di contaminazioni',
  'harm': 'Azioni o pensieri lesivi',
  'control': 'Perdita di controllo',
  'sexuality': 'Pensieri legati alla sessualità',
  'order': 'Controllo e ordine',
  'detachment': 'Difficoltà a distaccarsi',
  'error': 'Timore di errore',
  'superstition': 'Pensieri o azioni scaramantiche',
  'invasion': 'Invasione mente da fattori esterni',
  'hypochondria': 'Ipocondria',
  'rituals': 'Idee o azioni di rituali',
};

const intensityColors = {
  1: '#4CAF50', 2: '#8BC34A', 3: '#CDDC39', 4: '#FFEB3B', 5: '#FFC107',
  6: '#FF9800', 7: '#FF5722', 8: '#F44336', 9: '#E91E63', 10: '#9C27B0',
};

const FaceSad = ({ selected }: { selected?: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill={selected ? "#FFEBEB" : "#F8F7FF"}/>
    <Path d="M32.5 64.0001C14.8266 64.0001 0.5 49.6735 0.5 32.0001C0.5 14.3267 14.8266 0 32.5 0C50.1734 0 64.5 14.3267 64.5 32.0001C64.5 49.6735 50.1734 64.0001 32.5 64.0001ZM32.5 3.83787C16.9416 3.83787 4.33774 16.4417 4.33774 32.0001C4.33774 47.5585 16.9416 60.1623 32.5 60.1623C48.0583 60.1623 60.6623 47.5585 60.6623 32.0001C60.6623 16.4417 48.0583 3.83787 32.5 3.83787Z" fill={selected ? "#FF6B6B" : "#B8B8FF"}/>
    <Path d="M21.5 46C21.5 46 25 40 32.5 40C40 40 43.5 46 43.5 46" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M22 25.1992C23 25.1992 24.5 26.5 24.5 28" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M43 25.1992C42 25.1992 40.5 26.5 40.5 28" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const FaceNeutral = ({ selected }: { selected?: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill={selected ? "#FFFBEB" : "#F8F7FF"}/>
    <Path d="M32.5 64.0001C14.8266 64.0001 0.5 49.6735 0.5 32.0001C0.5 14.3267 14.8266 0 32.5 0C50.1734 0 64.5 14.3267 64.5 32.0001C64.5 49.6735 50.1734 64.0001 32.5 64.0001ZM32.5 3.83787C16.9416 3.83787 4.33774 16.4417 4.33774 32.0001C4.33774 47.5585 16.9416 60.1623 32.5 60.1623C48.0583 60.1623 60.6623 47.5585 60.6623 32.0001C60.6623 16.4417 48.0583 3.83787 32.5 3.83787Z" fill={selected ? "#FFD93D" : "#B8B8FF"}/>
    <Path d="M21 44H44" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M20 27H26" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M39 27H45" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const FaceHappy = ({ selected }: { selected?: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5777 31.9983C62.5777 48.6108 49.1105 62.0779 32.4979 62.0779C15.8852 62.0779 2.41797 48.6108 2.41797 31.9983C2.41797 15.3857 15.8852 1.91846 32.4979 1.91846C49.1105 1.91846 62.5777 15.3857 62.5777 31.9983Z" fill={selected ? "#EEF9EF" : "#F8F7FF"}/>
    <Path d="M32.4987 63.9974C14.8253 63.9974 0.5 49.6721 0.5 31.9987C0.5 14.3253 14.8253 0 32.4987 0C50.1721 0 64.4974 14.3253 64.4974 31.9987C64.4974 49.6721 50.1721 63.9974 32.4987 63.9974ZM32.4987 3.83771C16.9403 3.83771 4.33771 16.4403 4.33771 31.9987C4.33771 47.5571 16.9403 60.1597 32.4987 60.1597C48.057 60.1597 60.6596 47.5571 60.6596 31.9987C60.6596 16.4403 48.057 3.83771 32.4987 3.83771Z" fill={selected ? "#6BCF7F" : "#B8B8FF"}/>
    <Path d="M21.5 40C21.5 40 25 46 32.5 46C40 46 43.5 40 43.5 40" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M20 28C20 28 22 25 25 25C28 25 30 28 30 28" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M35 28C35 28 37 25 40 25C43 25 45 28 45 28" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const getMoodComponent = (mood: 'bad' | 'neutral' | 'good', selected: boolean) => {
  switch (mood) {
    case 'bad':
      return <FaceSad selected={selected} />;
    case 'neutral':
      return <FaceNeutral selected={selected} />;
    case 'good':
      return <FaceHappy selected={selected} />;
    default:
      return <FaceHappy selected={selected} />;
  }
};

const getMoodColor = (mood: 'bad' | 'neutral' | 'good') => {
  switch (mood) {
    case 'bad':
      return '#FF6B6B';
    case 'neutral':
      return '#FFD93D';
    case 'good':
      return '#6BCF7F';
    default:
      return '#E8E8E8';
  }
};

export default function Step4({ onFinish, activationData, onOpenExercise }: Step4Props) {
  const insets = useSafeAreaInsets();
  const { date, time, symptoms, intensity, description, type } = activationData;
  const [selectedMood, setSelectedMood] = useState<'bad' | 'neutral' | 'good' | null>(null);

  const [recommendedExercise, setRecommendedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    const loadRecommendedExercise = async () => {
      try {
        const allExercises = await ExerciseServiceAdapter.getAllExercises();
        const exerciseName = type === 'ossessione' ? 'Contrasta l\'ossessione' : 'Contrasta la compulsione';
        const foundExercise = allExercises.find(ex => ex.name === exerciseName);
        setRecommendedExercise(foundExercise || null);
      } catch (error) {
        console.error('Error loading recommended exercise:', error);
      }
    };
    loadRecommendedExercise();
  }, [type]);

  if (!recommendedExercise) {
    return <View><Text>Loading...</Text></View>;
  }

  const imageMap: { [key: string]: any } = {
    'contrasta-ossessione': require('../../assets/exercises/contrasta-ossessione.png'),
    'contrasta-compulsione': require('../../assets/exercises/contrasta-compulsione.png'),
  };

  const getExerciseImage = (imagePath: string) => {
  const imageId = imagePath.split('/').pop()?.replace('.png', '') || '';
  return imageMap[imageId] || require('../../assets/exercises/body-scan.png');
};

  

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        
        <Text style={styles.title}>Salvato nel tuo diario</Text>
        <Text style={styles.subtitle}>
          I tuoi pensieri sono ora registrati e disponibili nel tuo diario con il
          tuo terapeuta
        </Text>

        <Text style={styles.exerciseTitle}>Esercizio consigliato</Text>
        
        <TouchableOpacity style={styles.exerciseCard} onPress={() => onOpenExercise?.(recommendedExercise)}>
          <View style={styles.cardImageContainer}>
            <Image 
  source={getExerciseImage(recommendedExercise.image)} 
  style={{ width: '100%', height: '100%', resizeMode: 'cover' }} 
/>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.exerciseLabel}>
              {recommendedExercise.name}
            </Text>
            <Text style={styles.exerciseDescription}>
              {recommendedExercise.objectiveText || ''}
            </Text>
            <Text style={styles.durationText}>
              • {recommendedExercise.duration || 0} min
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.questionTitle}>Come ti senti ora?</Text>
        
        <View style={styles.moodContainer}>
          {(['bad', 'neutral', 'good'] as const).map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodButton,
                selectedMood === mood && {
                  backgroundColor: mood === 'bad' ? '#FEE2E2' : mood === 'neutral' ? '#FEF3C7' : '#D1FAE5',
                  borderColor: mood === 'bad' ? '#EF4444' : mood === 'neutral' ? '#F59E0B' : '#10B981',
                  borderWidth: 3,
                }
              ]}
              onPress={() => setSelectedMood(mood)}
            >
              {getMoodComponent(mood, selectedMood === mood)}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom + 15) }]}>
        <TouchableOpacity style={styles.diaryButton} onPress={onFinish}>
          <Text style={styles.diaryButtonText}>TORNA ALLA HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingTop handled dynamically
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e3fd',
    borderRadius: 16,
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 40,
  },
  cardImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  exerciseLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },

  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  moodButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginHorizontal: 10,
  },
  footer: {
    padding: 20,
  },
  diaryButton: {
    backgroundColor: '#8B7CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  diaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});