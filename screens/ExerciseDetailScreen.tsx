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
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Svg, { Circle, Path, G, ClipPath, Defs, Rect } from 'react-native-svg';
import { Exercise, ExerciseStep, ExerciseProgress } from '../types/Exercise';
import ExerciseServiceAdapter from '../services/ExerciseServiceAdapter';
import authService from '../services/AuthService';
import DailyExerciseService from '../services/DailyExerciseService';
import { useAuth } from '../contexts/AuthContext';

interface ExerciseDetailScreenProps {
  exercise: Exercise;
  onBack: () => void;
  onClose: () => void;
  onComplete: () => void;
  onNavigateToDiary?: () => void;
}

const { width } = Dimensions.get('window');

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

const getMoodComponent = (mood: 'sad' | 'neutral' | 'happy', selected: boolean) => {
  switch (mood) {
    case 'sad':
      return <FaceSad selected={selected} />;
    case 'neutral':
      return <FaceNeutral selected={selected} />;
    case 'happy':
      return <FaceHappy selected={selected} />;
    default:
      return <FaceHappy selected={selected} />;
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

const imageMap: { [key: string]: any } = {
  './assets/exercises/body-scan.png': require('../assets/exercises/body-scan.png'),
  './assets/exercises/contrasta-compulsione.png': require('../assets/exercises/contrasta-compulsione.png'),
  './assets/exercises/contrasta-ossessione.png': require('../assets/exercises/contrasta-ossessione.png'),
  './assets/exercises/gratitudine-mattino.png': require('../assets/exercises/gratitudine-mattino.png'),
  './assets/exercises/scrittura.png': require('../assets/exercises/scrittura.png'),
  './assets/exercises/respirazione-consapevole.png': require('../assets/exercises/respirazione-consapevole.png'),
};
const getExerciseImagePNG = (imagePath: string) => {
  return imageMap[imagePath] || require('../assets/exercises/body-scan.png');
};

const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({
  exercise,
  onBack,
  onClose,
  onComplete,
  onNavigateToDiary,
}) => {
  const { setCurrentMood } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [stepResponses, setStepResponses] = useState<{ [stepId: string]: string }>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<'sad' | 'neutral' | 'happy' | null>(null);
  const audioRef = useRef<Audio.Sound | null>(null);
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(false);
  const breathingScale = useRef(new Animated.Value(1)).current;
  const breathingLoop = useRef<Animated.CompositeAnimation | null>(null);

  const startBreathingAnimation = () => {
    // Sequenza:
    // 1. Inspirazione (4s) -> Scale up
    // 2. Pausa (1s)
    // 3. Espirazione (6s) -> Scale down
    // 4. Pausa (1s)
    
    breathingLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(breathingScale, {
          toValue: 2.5, // Cerchio si ingrandisce
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.delay(1000), // Pausa inspirazione
        Animated.timing(breathingScale, {
          toValue: 1, // Cerchio si rimpicciolisce
          duration: 6000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.delay(1000), // Pausa espirazione
      ])
    );
    breathingLoop.current.start();
  };

  const stopBreathingAnimation = () => {
    if (breathingLoop.current) {
      breathingLoop.current.stop();
      breathingLoop.current = null;
    }
    // Reset scale
    breathingScale.setValue(1);
  };

  const handleStartExercise = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const handleNextStep = async () => {
    // Ferma l'audio e l'animazione quando si passa al prossimo step
    if (audioRef.current) {
      await audioRef.current.pauseAsync();
      setIsPlaying(false);
      await audioRef.current.unloadAsync();
      audioRef.current = null;
      setAudioProgress(0);
      setAudioDuration(0);
    }
    setShowBreathingAnimation(false);
    stopBreathingAnimation();
    
    if (currentStep < exercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteExercise();
    }
  };

  const handlePreviousStep = async () => {
    // Ferma l'audio e l'animazione quando si torna al step precedente
    if (audioRef.current) {
      await audioRef.current.pauseAsync();
      setIsPlaying(false);
      await audioRef.current.unloadAsync();
      audioRef.current = null;
      setAudioProgress(0);
      setAudioDuration(0);
    }
    setShowBreathingAnimation(false);
    stopBreathingAnimation();
    
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
    // Stop audio and animation if active
    if (audioRef.current) {
      await audioRef.current.stopAsync();
      setIsPlaying(false);
    }
    setShowBreathingAnimation(false);
    stopBreathingAnimation();

    setIsCompleting(true);
    try {
      const progress: ExerciseProgress = {
        exerciseId: exercise.id,
        userId: 'current-user',
        completedAt: new Date(),
        stepResponses,
      };
      
      await ExerciseServiceAdapter.saveExerciseProgress(progress);
      
      // Save exercise as diary activity
      const now = new Date();
      // Usa data locale (non UTC) per evitare sfasamento di fuso orario
      const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const userText = Object.values(stepResponses)
        .filter((t) => t && t.trim().length > 0)
        .join('\n\n');

      const activity = {
        id: `exercise_${exercise.id}_${Date.now()}`,
        date: localDate,
        time: now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false }),
        type: 'ossessione' as const,
        symptom: exercise.category || 'Esercizio',
        intensity: 'completato',
        description: userText
          ? `Esercizio completato: ${exercise.name}.\n\n${userText}`
          : `Esercizio completato: ${exercise.name}.`,
      };
      
      await authService.addActivity(activity);

      // Mark as completed in DailyExerciseService so home removes it immediately
      await DailyExerciseService.markExerciseCompleted(exercise.id, localDate);
      
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

  const handleSkip = async (seconds: number) => {
    if (audioRef.current) {
      try {
        const status = await audioRef.current.getStatusAsync();
        if (status.isLoaded) {
          const currentPosition = status.positionMillis || 0;
          const duration = status.durationMillis || 0;
          const newTime = Math.max(0, Math.min(
            currentPosition + (seconds * 1000),
            duration
          ));
          await audioRef.current.setPositionAsync(newTime);
        }
      } catch (error) {
        console.error('Errore nel skip audio:', error);
      }
    }
  };

  const handlePlayPause = async () => {
    try {
      if (!audioRef.current) {
        // Carica l'audio per lo step corrente
        const currentStepData = exercise.steps[currentStep];
        if (currentStepData.audioFile) {
          // Determina quale audio caricare basato sul currentStep
          const audioMap = {
            './assets/audio/breathing-guide.mp3': require('../assets/audio/breathing-guide.mp3'),
            './assets/audio/meditation-step1-preparation.mp3': require('../assets/audio/meditation-step1-preparation.mp3'),
            './assets/audio/meditation-step2-practice.mp3': require('../assets/audio/meditation-step2-practice.mp3'),
            './assets/audio/meditation-guided.mp3': require('../assets/audio/meditation-guided.mp3'),
          };
          const audioPath = audioMap[currentStepData.audioFile as keyof typeof audioMap];
          if (!audioPath) {
            console.error('Audio file not found in map:', currentStepData.audioFile);
            return;
          }
          
          const { sound } = await Audio.Sound.createAsync(audioPath);
          audioRef.current = sound;
          
          // Imposta i callback per il progresso
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded) {
              if (status.durationMillis) {
                setAudioDuration(status.durationMillis);
              }
              if (status.positionMillis !== undefined) {
                setAudioProgress(status.positionMillis);
              }
              if (status.didJustFinish) {
                setIsPlaying(false);
                setShowBreathingAnimation(false);
                stopBreathingAnimation();
              }
            }
          });
        }
      }
      
      if (audioRef.current) {
        if (isPlaying) {
          await audioRef.current.pauseAsync();
          setIsPlaying(false);
          // Ferma animazione se presente
          if (exercise.id === 'respirazione-consapevole') {
            setShowBreathingAnimation(false);
            stopBreathingAnimation();
          }
        } else {
          await audioRef.current.playAsync();
          setIsPlaying(true);
          // Avvia animazione se è l'esercizio corretto
          if (exercise.id === 'respirazione-consapevole' && exercise.steps[currentStep].audioFile) {
            setShowBreathingAnimation(true);
            startBreathingAnimation();
          }
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
        audioRef.current.unloadAsync();
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
          <Text style={styles.skipText}>-15s</Text>
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
          <Text style={styles.skipText}>+15s</Text>
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
      
      {(step.type === 'default' || step.type === 'withaudio') && step.content && (
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
          {step.placeholder && (
            <Text style={styles.inputLabel}>{step.placeholder}</Text>
          )}
          <TextInput
            style={styles.textArea}
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
                  borderColor: selectedMood === mood ? getMoodColor(mood) : '#E8E8E8',
                  borderWidth: 2,
                },
              ]}
              onPress={() => {
                setSelectedMood(mood);
                setCurrentMood(mood);
              }}
            >
              {getMoodComponent(mood, selectedMood === mood)}
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

  const renderBreathingAnimation = () => (
    <View style={styles.fullScreenAnimation}>
      <TouchableOpacity 
        style={styles.closeAnimationButton} 
        onPress={handlePlayPause}
      >
        <Ionicons name="close" size={32} color="white" />
      </TouchableOpacity>
      
      <Animated.View 
        style={[
          styles.breathingCircle,
          {
            transform: [{ scale: breathingScale }]
          }
        ]}
      />
      
      <View style={styles.breathingControls}>
        <TouchableOpacity style={styles.largePlayButton} onPress={handlePlayPause}>
          <Ionicons name="pause" size={48} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {showBreathingAnimation ? (
        renderBreathingAnimation()
      ) : showSuccessScreen ? (
        renderSuccessScreen()
      ) : !isStarted ? (
        <>
          <View style={styles.header}>
            <View style={styles.leftSection}>
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
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
          <View style={styles.exerciseStepHeader}>
            <View style={styles.leftSection}>
               <TouchableOpacity style={styles.backButton} onPress={onBack}>
                 <Ionicons name="arrow-back" size={24} color="white" />
               </TouchableOpacity>
             </View>
             <TouchableOpacity style={styles.closeButton} onPress={onClose}>
               <Ionicons name="close" size={24} color="white" />
             </TouchableOpacity>
          </View>
          <View style={styles.stepContentHeader}>
             {renderNavigationDots()}
             {exercise.steps[currentStep].audioFile ? renderAudioPlayer() : null}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#8B7CF6',
    borderBottomWidth: 0,
  },
  leftSection: {
    width: 40,
  },
  backButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
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
    borderWidth: 1,
    borderColor: '#FF7A00',
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
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontStyle: 'italic',
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
  exerciseStepHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 16,
      backgroundColor: '#8B7CF6',
      borderBottomWidth: 0,
      shadowOpacity: 0,
      elevation: 0,
    },
  stepContentHeader: {
    paddingHorizontal: 24,
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
  fullScreenAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#8B7CF6',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeAnimationButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1001,
  },
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'white',
  },
  breathingControls: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  largePlayButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExerciseDetailScreen;