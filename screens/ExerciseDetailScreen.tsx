import React, { useState, useEffect } from 'react';
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
import { Exercise, ExerciseStep, ExerciseProgress } from '../types/Exercise';
import ExerciseService from '../services/ExerciseService';

interface ExerciseDetailScreenProps {
  exercise: Exercise;
  onBack: () => void;
  onComplete: () => void;
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
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [stepResponses, setStepResponses] = useState<{ [stepId: string]: string }>({});
  const [isCompleting, setIsCompleting] = useState(false);

  const handleStartExercise = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < exercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteExercise();
    }
  };

  const handlePreviousStep = () => {
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
      
      await ExerciseService.saveExerciseProgress(progress);
      
      Alert.alert(
        'Esercizio Completato!',
        'Ottimo lavoro! Hai completato l\'esercizio con successo.',
        [
          {
            text: 'OK',
            onPress: onComplete,
          },
        ]
      );
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

  const renderStep = (step: ExerciseStep) => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepCounter}>
          {currentStep + 1} di {exercise.steps.length}
        </Text>
      </View>
      
      {step.type === 'list' && step.content && (
        <View style={styles.stepContent}>
          {step.content.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listBullet} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
      
      {step.type === 'textarea' && (
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
      
      <View style={styles.stepNavigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.secondaryButton,
            currentStep === 0 && styles.disabledButton
          ]}
          onPress={handlePreviousStep}
          disabled={currentStep === 0}
        >
          <Text style={[
            styles.navButtonText,
            styles.secondaryButtonText,
            currentStep === 0 && styles.disabledButtonText
          ]}>
            Indietro
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, styles.primaryButton]}
          onPress={handleNextStep}
          disabled={isCompleting}
        >
          <Text style={[styles.navButtonText, styles.primaryButtonText]}>
            {currentStep === exercise.steps.length - 1 ? 'Completa' : 'Avanti'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        {isStarted && (
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${((currentStep + 1) / exercise.steps.length) * 100}%` }
              ]} 
            />
          </View>
        )}
      </View>
      
      {!isStarted ? (
        <>
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
        <ScrollView style={styles.stepScrollView} showsVerticalScrollIndicator={false}>
          {renderStep(exercise.steps[currentStep])}
        </ScrollView>
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
    backgroundColor: '#4A90E2',
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
});

export default ExerciseDetailScreen;