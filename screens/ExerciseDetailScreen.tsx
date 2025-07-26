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
          <TouchableOpacity style={styles.moodOption}>
            <View style={[styles.moodCircle, styles.sadMood]}>
              <Text style={styles.moodEmoji}>😔</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.moodOption}>
            <View style={[styles.moodCircle, styles.neutralMood]}>
              <Text style={styles.moodEmoji}>😐</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.moodOption, styles.selectedMood]}>
            <View style={[styles.moodCircle, styles.happyMood]}>
              <Text style={styles.moodEmoji}>😊</Text>
            </View>
            <Text style={styles.moodLabel}>Bene</Text>
          </TouchableOpacity>
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
   moodOption: {
     alignItems: 'center',
     marginHorizontal: 16,
   },
   moodCircle: {
     width: 60,
     height: 60,
     borderRadius: 30,
     justifyContent: 'center',
     alignItems: 'center',
     borderWidth: 2,
   },
   sadMood: {
     borderColor: '#E8E8E8',
     backgroundColor: '#F8F9FA',
   },
   neutralMood: {
     borderColor: '#E8E8E8',
     backgroundColor: '#F8F9FA',
   },
   happyMood: {
     borderColor: '#4CAF50',
     backgroundColor: '#E8F5E8',
   },
   selectedMood: {
     // Stile per l'opzione selezionata
   },
   moodEmoji: {
     fontSize: 24,
   },
   moodLabel: {
     fontSize: 14,
     color: '#4CAF50',
     fontWeight: '600',
     marginTop: 8,
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