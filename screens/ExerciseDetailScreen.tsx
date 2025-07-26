import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { SvgXml } from 'react-native-svg';
import { Exercise, ExerciseStep, ExerciseProgress } from '../types/Exercise';
import ExerciseServiceAdapter from '../services/ExerciseServiceAdapter';
import authService from '../services/AuthService';

interface ExerciseDetailScreenProps {
  exercise: Exercise;
  onBack: () => void;
  onComplete: () => void;
  onNavigateToDiary?: () => void;
}

const { width } = Dimensions.get('window');

const faceSadSvg = `<svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill="#F8F7FF"/>
<path d="M32.5 3.83787C28.6975 3.83787 25.0096 4.58225 21.5386 6.05024C18.1855 7.46857 15.1733 9.49941 12.5864 12.0864C9.99948 14.6734 7.96845 17.6853 6.55051 21.0386C5.08266 24.5094 4.33774 28.1976 4.33774 32.0001C4.33774 35.8025 5.08266 39.4905 6.55051 42.9614C7.96845 46.3145 9.99948 49.3268 12.5864 51.9137C15.1733 54.5006 18.1855 56.5316 21.5386 57.9502C25.0096 59.4181 28.6975 60.1623 32.5 60.1623C36.3031 60.1623 39.9911 59.4181 43.4613 57.9502C46.8151 56.5316 49.8267 54.5006 52.4136 51.9137C55.0012 49.3268 57.0316 46.3145 58.4502 42.9614C59.918 39.4905 60.6623 35.8025 60.6623 32.0001C60.6623 28.1976 59.918 24.5094 58.4502 21.0386C57.0316 17.6853 55.0012 14.6734 52.4136 12.0864C49.8267 9.49941 46.8151 7.46857 43.4613 6.05024C39.9911 4.58225 36.3031 3.83787 32.5 3.83787ZM32.5 64.0001C28.181 64.0001 23.9904 63.154 20.0435 61.4844C16.2331 59.8727 12.8107 57.5654 9.873 54.6277C6.93461 51.6893 4.62731 48.267 3.01566 44.4566C1.34676 40.5103 0.5 36.3191 0.5 32.0001C0.5 27.681 1.34676 23.4899 3.01566 19.5436C4.62731 15.7328 6.93461 12.3108 9.873 9.3726C12.8107 6.43435 16.2331 4.12731 20.0435 2.51553C23.9904 0.846297 28.181 0 32.5 0C36.819 0 41.0103 0.846297 44.9565 2.51553C48.7676 4.12731 52.1893 6.43435 55.1277 9.3726C58.066 12.3108 60.3727 15.7328 61.985 19.5436C63.6539 23.4899 64.5 27.681 64.5 32.0001C64.5 36.3191 63.6539 40.5103 61.985 44.4566C60.3727 48.267 58.066 51.6893 55.1277 54.6277C52.1893 57.5654 48.7676 59.8727 44.9565 61.4844C41.0103 63.154 36.819 64.0001 32.5 64.0001Z" fill="#B8B8FF"/>
<path d="M42.7525 39.834C43.0176 39.834 43.2863 39.9026 43.5318 40.0463C44.267 40.4764 44.5129 41.4236 44.0826 42.1585C44.0412 42.2297 43.0475 43.9085 41.1564 45.5701C38.613 47.8047 35.6185 48.9863 32.4967 48.9863C29.3748 48.9863 26.3803 47.8047 23.8369 45.5701C21.9458 43.9085 20.9521 42.2297 20.9108 42.1585C20.4804 41.4236 20.7275 40.4783 21.4628 40.0483C22.1967 39.6183 23.1393 39.8639 23.5708 40.5962C23.5805 40.6122 24.4032 41.9814 25.9457 43.3161C27.9281 45.0309 30.1322 45.9009 32.4967 45.9009C34.8611 45.9009 37.0652 45.0309 39.0476 43.3161C40.5915 41.9801 41.4144 40.6095 41.4226 40.5962C41.7093 40.1062 42.2236 39.834 42.7525 39.834Z" fill="#B8B8FF"/>
<path d="M17.7855 29.2964C16.9723 28.7046 16.9343 27.4978 17.7188 26.8687C18.7268 26.0606 20.2591 25.1992 22.2119 25.1992C24.1636 25.1992 25.6952 26.0593 26.7031 26.8674C27.4888 27.4964 27.4506 28.7053 26.6364 29.2977C26.0768 29.7045 25.3156 29.6852 24.7746 29.2538C24.1785 28.7792 23.2883 28.2693 22.2119 28.2693C21.1279 28.2693 20.2388 28.7779 19.6451 29.2531C19.1053 29.6845 18.3444 29.7031 17.7855 29.2964Z" fill="#B8B8FF"/>
<path d="M38.3597 29.2964C37.5465 28.7046 37.5085 27.4978 38.293 26.8687C39.301 26.0606 40.8332 25.1992 42.7861 25.1992C44.7378 25.1992 46.2693 26.0593 47.2774 26.8674C48.063 27.4964 48.0248 28.7053 47.2106 29.2977C46.651 29.7045 45.8898 29.6852 45.3487 29.2538C44.7526 28.7792 43.8624 28.2693 42.7861 28.2693C41.7021 28.2693 40.813 28.7779 40.2192 29.2531C39.6795 29.6845 38.9186 29.7031 38.3597 29.2964Z" fill="#B8B8FF"/>
</svg>`;

const faceNeutralSvg = `<svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill="#F8F7FF"/>
<path d="M43.0825 45.6988H21.9181C21.066 45.6988 20.375 45.0078 20.375 44.1557C20.375 43.3043 21.066 42.6133 21.9181 42.6133H43.0825C43.9346 42.6133 44.625 43.3043 44.625 44.1557C44.625 45.0078 43.9346 45.6988 43.0825 45.6988Z" fill="#B8B8FF"/>
<path d="M32.5 3.83787C28.6975 3.83787 25.0096 4.58225 21.5386 6.05024C18.1855 7.46857 15.1733 9.49941 12.5864 12.0864C9.99948 14.6734 7.96845 17.6853 6.55051 21.0386C5.08266 24.5094 4.33774 28.1976 4.33774 32.0001C4.33774 35.8025 5.08266 39.4905 6.55051 42.9614C7.96845 46.3145 9.99948 49.3268 12.5864 51.9137C15.1733 54.5006 18.1855 56.5316 21.5386 57.9502C25.0096 59.4181 28.6975 60.1623 32.5 60.1623C36.3031 60.1623 39.9911 59.4181 43.4613 57.9502C46.8151 56.5316 49.8267 54.5006 52.4136 51.9137C55.0012 49.3268 57.0316 46.3145 58.4502 42.9614C59.918 39.4905 60.6623 35.8025 60.6623 32.0001C60.6623 28.1976 59.918 24.5094 58.4502 21.0386C57.0316 17.6853 55.0012 14.6734 52.4136 12.0864C49.8267 9.49941 46.8151 7.46857 43.4613 6.05024C39.9911 4.58225 36.3031 3.83787 32.5 3.83787ZM32.5 64.0001C28.181 64.0001 23.9904 63.154 20.0435 61.4844C16.2331 59.8727 12.8107 57.5654 9.873 54.6277C6.93461 51.6893 4.62731 48.267 3.01566 44.4566C1.34676 40.5103 0.5 36.3191 0.5 32.0001C0.5 27.681 1.34676 23.4899 3.01566 19.5436C4.62731 15.7328 6.93461 12.3108 9.873 9.3726C12.8107 6.43435 16.2331 4.12731 20.0435 2.51553C23.9904 0.846297 28.181 0 32.5 0C36.819 0 41.0103 0.846297 44.9565 2.51553C48.7676 4.12731 52.1893 6.43435 55.1277 9.3726C58.066 12.3108 60.3727 15.7328 61.985 19.5436C63.6539 23.4899 64.5 27.681 64.5 32.0001C64.5 36.3191 63.6539 40.5103 61.985 44.4566C60.3727 48.267 58.066 51.6893 55.1277 54.6277C52.1893 57.5654 48.7676 59.8727 44.9565 61.4844C41.0103 63.154 36.819 64.0001 32.5 64.0001Z" fill="#B8B8FF"/>
<path d="M25.5847 28.8023H20.7458C19.9689 28.8023 19.3398 28.1726 19.3398 27.3964C19.3398 26.6195 19.9689 25.9897 20.7458 25.9897H25.5847C26.3616 25.9897 26.9913 26.6195 26.9913 27.3964C26.9913 28.1726 26.3616 28.8023 25.5847 28.8023Z" fill="#B8B8FF"/>
<path d="M44.2573 28.8023H39.4177C38.6415 28.8023 38.0117 28.1726 38.0117 27.3964C38.0117 26.6195 38.6415 25.9897 39.4177 25.9897H44.2573C45.0335 25.9897 45.6632 26.6195 45.6632 27.3964C45.6632 28.1726 45.0335 28.8023 44.2573 28.8023Z" fill="#B8B8FF"/>
</svg>`;

const faceHappySvg = `<svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M62.5777 31.9983C62.5777 48.6108 49.1105 62.0779 32.4979 62.0779C15.8852 62.0779 2.41797 48.6108 2.41797 31.9983C2.41797 15.3857 15.8852 1.91846 32.4979 1.91846C49.1105 1.91846 62.5777 15.3857 62.5777 31.9983Z" fill="#F8F7FF"/>
<path d="M32.4987 3.83771C28.6962 3.83771 25.0084 4.58206 21.5378 6.04999C18.1847 7.46827 15.1728 9.49902 12.5859 12.0859C9.99902 14.6728 7.96827 17.6846 6.54999 21.0378C5.08199 24.5084 4.33771 28.1964 4.33771 31.9987C4.33771 35.801 5.08199 39.4888 6.54999 42.9596C7.96827 46.3126 9.99902 49.3248 12.5859 51.9115C15.1728 54.4983 18.1847 56.5293 21.5378 57.9478C25.0084 59.4156 28.6962 60.1598 32.4987 60.1598C36.3013 60.1598 39.9891 59.4156 43.4597 57.9478C46.8129 56.5293 49.8247 54.4983 52.4116 51.9115C54.9985 49.3248 57.0293 46.3126 58.4475 42.9596C59.9154 39.4888 60.6598 35.801 60.6598 31.9987C60.6598 28.1964 59.9154 24.5084 58.4475 21.0378C57.0293 17.6846 54.9985 14.6728 52.4116 12.0859C49.8247 9.49902 46.8129 7.46827 43.4597 6.04999C39.9891 4.58206 36.3013 3.83771 32.4987 3.83771ZM32.4987 63.9974C28.1798 63.9974 23.989 63.1514 20.0428 61.4819C16.2322 59.8703 12.8103 57.5631 9.87221 54.6255C6.93408 51.6872 4.62714 48.265 3.01543 44.4547C1.34626 40.5086 0.5 36.3176 0.5 31.9987C0.5 27.6799 1.34626 23.489 3.01543 19.5428C4.62714 15.7321 6.93408 12.3103 9.87221 9.37221C12.8103 6.43408 16.2322 4.12714 20.0428 2.51543C23.989 0.846262 28.1798 0 32.4987 0C36.8177 0 41.0085 0.846262 44.9547 2.51543C48.7653 4.12714 52.1872 6.43408 55.1253 9.37221C58.0633 12.3103 60.3703 15.7321 61.9821 19.5428C63.6512 23.489 64.4975 27.6799 64.4975 31.9987C64.4975 36.3176 63.6512 40.5086 61.9821 44.4547C60.3703 48.265 58.0633 51.6872 55.1253 54.6255C52.1872 57.5631 48.7653 59.8703 44.9547 61.4819C41.0085 63.1514 36.8177 63.9974 32.4987 63.9974Z" fill="#B8B8FF"/>
<path d="M42.7525 39.834C43.0176 39.834 43.2863 39.9026 43.5318 40.0463C44.267 40.4764 44.5129 41.4236 44.0826 42.1585C44.0412 42.2297 43.0475 43.9085 41.1564 45.5701C38.613 47.8047 35.6185 48.9863 32.4967 48.9863C29.3748 48.9863 26.3803 47.8047 23.8369 45.5701C21.9458 43.9085 20.9521 42.2297 20.9108 42.1585C20.4804 41.4236 20.7275 40.4783 21.4628 40.0483C22.1967 39.6183 23.1393 39.8639 23.5708 40.5962C23.5805 40.6122 24.4032 41.9814 25.9457 43.3161C27.9281 45.0309 30.1322 45.9009 32.4967 45.9009C34.8611 45.9009 37.0652 45.0309 39.0476 43.3161C40.5915 41.9801 41.4144 40.6095 41.4226 40.5962C41.7093 40.1062 42.2236 39.834 42.7525 39.834Z" fill="#B8B8FF"/>
<path d="M17.7855 29.2964C16.9723 28.7046 16.9343 27.4978 17.7188 26.8687C18.7268 26.0606 20.2591 25.1992 22.2119 25.1992C24.1636 25.1992 25.6952 26.0593 26.7031 26.8674C27.4888 27.4964 27.4506 28.7053 26.6364 29.2977C26.0768 29.7045 25.3156 29.6852 24.7746 29.2538C24.1785 28.7792 23.2883 28.2693 22.2119 28.2693C21.1279 28.2693 20.2388 28.7779 19.6451 29.2531C19.1053 29.6845 18.3444 29.7031 17.7855 29.2964Z" fill="#B8B8FF"/>
<path d="M38.3597 29.2964C37.5465 28.7046 37.5085 27.4978 38.293 26.8687C39.301 26.0606 40.8332 25.1992 42.7861 25.1992C44.7378 25.1992 46.2693 26.0593 47.2774 26.8674C48.063 27.4964 48.0248 28.7053 47.2106 29.2977C46.651 29.7045 45.8898 29.6852 45.3487 29.2538C44.7526 28.7792 43.8624 28.2693 42.7861 28.2693C41.7021 28.2693 40.813 28.7779 40.2192 29.2531C39.6795 29.6845 38.9186 29.7031 38.3597 29.2964Z" fill="#B8B8FF"/>
</svg>`;

const getMoodSvg = (mood: 'sad' | 'neutral' | 'happy') => {
  switch (mood) {
    case 'sad':
      return faceSadSvg;
    case 'neutral':
      return faceNeutralSvg;
    case 'happy':
      return faceHappySvg;
    default:
      return faceHappySvg;
  }
};

const getMoodColor = (mood: 'sad' | 'neutral' | 'happy') => {
  switch (mood) {
    case 'sad':
      return '#FF6B6B';
    case 'neutral':
      return '#FFD93D';
    case 'happy':
      return '#6BCF7F';
    default:
      return '#E8E8E8';
  }
};

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

const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({
  exercise,
  onBack,
  onComplete,
  onNavigateToDiary,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [stepResponses, setStepResponses] = useState<{ [stepId: string]: string }>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<'sad' | 'neutral' | 'happy'>('happy');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStartExercise = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    // Ferma l'audio quando si passa al prossimo step
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current = null;
      setAudioProgress(0);
      setAudioDuration(0);
    }
    
    if (currentStep < exercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteExercise();
    }
  };

  const handlePreviousStep = () => {
    // Ferma l'audio quando si torna al step precedente
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current = null;
      setAudioProgress(0);
      setAudioDuration(0);
    }
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepResponse = (stepId: string, response: string) => {
    setStepResponses(prev => ({
      ...prev,
      [stepId]: response,
    }));
  };

  const handleCompleteExercise = async () => {
    setIsCompleting(true);
    try {
      const progress: ExerciseProgress = {
        exerciseId: exercise.id,
        userId: 'current-user', // Sostituire con l'ID utente reale
        completedAt: new Date(),
        stepResponses,
      };
      
      await ExerciseServiceAdapter.saveExerciseProgress(progress);
      
      // Salva l'esercizio anche come attività nel diario
      const now = new Date();
      const activity = {
        id: `exercise_${exercise.id}_${Date.now()}`,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false }),
        type: 'ossessione' as const, // Usiamo un tipo esistente
        symptom: exercise.category || 'Esercizio',
        intensity: 'completato',
        description: `Esercizio completato: ${exercise.name}. Durata: ${exercise.duration} minuti.`,
      };
      
      await authService.addActivity(activity);
      
      // Mostra la schermata di successo invece dell'alert
      setShowSuccessScreen(true);
    } catch (error) {
      console.error('Error completing exercise:', error);
      Alert.alert(
        'Errore',
        'Si è verificato un errore nel salvare il progresso. Riprova.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const renderIntroduction = () => (
    <ScrollView 
      style={styles.introContainer} 
      contentContainerStyle={styles.introContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.introContent}>
        <Text style={styles.durationText}>{exercise.duration} minuti</Text>
        <Text style={styles.exerciseTitle}>{exercise.name}</Text>
        
        <Text style={styles.introText}>{exercise.introText}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perché</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>• Riduzione dello stress e dell'ansia</Text>
            <Text style={styles.benefitItem}>• Migliore connessione con il corpo</Text>
            <Text style={styles.benefitItem}>• Miglioramento del sonno</Text>
          </View>
        </View>
        
      </View>
    </ScrollView>
  );

  const renderNavigationDots = () => (
    <View style={styles.navigationDots}>
      {exercise.steps.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentStep ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      try {
        const newTime = Math.max(0, Math.min(
          audioRef.current.currentTime + seconds,
          audioRef.current.duration || 0
        ));
        audioRef.current.currentTime = newTime;
      } catch (error) {
        console.error('Errore nel skip audio:', error);
      }
    }
  };

  const handlePlayPause = () => {
    try {
      if (!audioRef.current) {
        // Carica l'audio per lo step corrente
        const currentStepData = exercise.steps[currentStep];
        if (currentStepData.audioFile) {
          // Determina quale audio caricare basato sul currentStep
          const audioPath = currentStep === 0 
            ? require('../assets/audio/meditation-step1-preparation.mp3')
            : require('../assets/audio/meditation-step2-practice.mp3');
          
          const audio = new Audio(audioPath);
          audioRef.current = audio;
          
          // Imposta i callback per il progresso
          audio.addEventListener('loadedmetadata', () => {
            setAudioDuration(audio.duration * 1000); // Converti in millisecondi
          });
          
          audio.addEventListener('timeupdate', () => {
            setAudioProgress(audio.currentTime * 1000); // Converti in millisecondi
          });
          
          audio.addEventListener('ended', () => {
            setIsPlaying(false);
          });
          
          audio.addEventListener('error', (e) => {
            console.error('Errore nel caricamento audio:', e);
          });
        }
      }
      
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().catch(error => {
            console.error('Errore nella riproduzione:', error);
          });
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Errore nella riproduzione audio:', error);
    }
  };
  
  useEffect(() => {
    return () => {
      // Cleanup audio quando il componente viene smontato
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const renderAudioPlayer = () => {
    const progressPercentage = audioDuration > 0 ? (audioProgress / audioDuration) * 100 : 0;
    const circumference = 2 * Math.PI * 28; // raggio 28
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
    
    return (
      <View style={styles.audioPlayerContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={() => handleSkip(-15)}>
          <Ionicons name="play-skip-back" size={24} color="white" />
          <Text style={styles.skipText}>15s</Text>
        </TouchableOpacity>
        
        <View style={styles.playButtonContainer}>
          <Svg width="64" height="64" style={styles.progressCircle}>
            <Circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
              fill="none"
            />
            <Circle
              cx="32"
              cy="32"
              r="28"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </Svg>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.skipButton} onPress={() => handleSkip(15)}>
          <Ionicons name="play-skip-forward" size={24} color="white" />
          <Text style={styles.skipText}>15s</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStep = (step: ExerciseStep) => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepCounter}>
          {currentStep + 1} di {exercise.steps.length}
        </Text>
      </View>
      
      {step.type === 'default' && step.content && (
        <View style={styles.stepContent}>
          {step.content.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listBullet} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
      
      {step.type === 'withtextarea' && (
        <View style={styles.stepContent}>
          <TextInput
            style={styles.textArea}
            placeholder={step.placeholder}
            value={stepResponses[step.id] || ''}
            onChangeText={(text) => handleStepResponse(step.id, text)}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>
      )}
    </View>
  );

  const renderSuccessScreen = () => (
    <View style={styles.successContainer}>
      <View style={styles.successHeader}>
        <TouchableOpacity style={styles.closeButton} onPress={onComplete}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.successContent}>
        <Text style={styles.successTitle}>Salvato nel tuo diario</Text>
        <Text style={styles.successSubtitle}>
          L'esercizio è ora registrato nel diario e condivisibile con il tuo terapista
        </Text>
        
        <Image 
          source={require('../assets/exercises/success.png')}
          style={styles.successImage}
          resizeMode="contain"
        />
        
        <Text style={styles.successQuestion}>Come ti senti ora?</Text>
        
        <View style={styles.moodContainer}>
          {(['sad', 'neutral', 'happy'] as const).map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodButton,
                {
                  backgroundColor: selectedMood === mood ? getMoodColor(mood) : '#E8E8E8',
                },
              ]}
              onPress={() => setSelectedMood(mood)}
            >
              <SvgXml xml={getMoodSvg(mood)} width={50} height={50} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.successButtonContainer}>
        <TouchableOpacity style={styles.diaryButton} onPress={onNavigateToDiary || onComplete}>
          <Text style={styles.diaryButtonText}>DIARIO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {showSuccessScreen ? (
        renderSuccessScreen()
      ) : !isStarted ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {renderIntroduction()}
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStartExercise}
            >
              <Text style={styles.startButtonText}>INIZIA</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.purpleHeader}>
             <TouchableOpacity style={styles.backButton} onPress={onBack}>
               <Ionicons name="arrow-back" size={24} color="white" />
             </TouchableOpacity>
             
             {renderNavigationDots()}
             {renderAudioPlayer()}
           </View>
          
          <ScrollView 
            style={styles.stepScrollView} 
            contentContainerStyle={styles.stepScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderStep(exercise.steps[currentStep])}
          </ScrollView>
          
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={[
                styles.bottomNavButton,
                styles.secondaryBottomButton,
                currentStep === 0 && styles.disabledButton
              ]}
              onPress={handlePreviousStep}
              disabled={currentStep === 0}
            >
              <Text style={[
                styles.bottomNavButtonText,
                styles.secondaryBottomButtonText,
                currentStep === 0 && styles.disabledButtonText
              ]}>
                Indietro
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.bottomNavButton, styles.primaryBottomButton]}
              onPress={handleNextStep}
              disabled={isCompleting}
            >
              <Text style={[styles.bottomNavButtonText, styles.primaryBottomButtonText]}>
                {currentStep === exercise.steps.length - 1 ? 'Completa' : 'Avanti'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#8B7CF6',
    borderBottomWidth: 0,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },

  progressBar: {
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  introContainer: {
    flex: 1,
  },
  introContentContainer: {
    paddingBottom: 100, // Spazio per il pulsante ancorato
  },

  introContent: {
    padding: 24,
    paddingTop: 40,
  },
  durationText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  exerciseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 24,
  },
  metaInfo: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  metaItem: {
    flex: 1,
    marginRight: 16,
  },
  metaLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  benefitsList: {
    marginTop: 8,
  },
  benefitItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  startButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF9500',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  stepScrollView: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  stepCounter: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
    marginBottom: 32,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  listBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B7CF6',
    marginTop: 6,
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    minHeight: 120,
  },
  stepNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E8E8E8',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#333333',
  },
  disabledButtonText: {
    color: '#999999',
  },
  purpleHeader: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#8B7CF6',
    borderBottomWidth: 0,
  },
  navigationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  audioPlayerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  skipText: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
  },
  stepScrollContent: {
    paddingBottom: 120,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomNavButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  primaryBottomButton: {
    backgroundColor: '#FF9500',
  },
  secondaryBottomButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  bottomNavButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryBottomButtonText: {
    color: '#FFFFFF',
  },
  secondaryBottomButtonText: {
     color: '#333333',
   },
   playButtonContainer: {
     position: 'relative',
     justifyContent: 'center',
     alignItems: 'center',
   },
   progressCircle: {
     position: 'absolute',
   },
   successContainer: {
     flex: 1,
     backgroundColor: '#F8F9FA',
   },
   successHeader: {
     paddingHorizontal: 24,
     paddingTop: 60,
     paddingBottom: 16,
     alignItems: 'flex-end',
   },
   closeButton: {
     padding: 8,
   },
   successContent: {
     flex: 1,
     paddingHorizontal: 24,
     alignItems: 'center',
     justifyContent: 'center',
   },
   successTitle: {
     fontSize: 24,
     fontWeight: 'bold',
     color: '#1A1A1A',
     textAlign: 'center',
     marginBottom: 12,
   },
   successSubtitle: {
     fontSize: 16,
     color: '#666666',
     textAlign: 'center',
     lineHeight: 24,
     marginBottom: 40,
   },
   successImage: {
     width: 200,
     height: 200,
     marginBottom: 40,
   },
   successQuestion: {
     fontSize: 20,
     fontWeight: '600',
     color: '#1A1A1A',
     textAlign: 'center',
     marginBottom: 24,
   },
   moodContainer: {
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 40,
   },
   moodButton: {
     width: 80,
     height: 80,
     borderRadius: 40,
     justifyContent: 'center',
     alignItems: 'center',
     marginHorizontal: 10,
   },
   successButtonContainer: {
     paddingHorizontal: 24,
     paddingBottom: 34,
   },
   diaryButton: {
     backgroundColor: '#FF9500',
     paddingVertical: 16,
     borderRadius: 12,
     alignItems: 'center',
   },
   diaryButtonText: {
     color: '#FFFFFF',
     fontSize: 16,
     fontWeight: '600',
   },
 });

export default ExerciseDetailScreen;