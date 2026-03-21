import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import ButtonNav from '../../components/ButtonNav';
import OnboardingHeader from '../../components/OnboardingHeader';

interface Step2Props {
  onNext: (knowsOCD: boolean) => void;
  onBack: () => void;
}

export default function Step2({ onNext, onBack }: Step2Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const handleContinue = () => {
    if (selectedAnswer !== null) {
      onNext(selectedAnswer);
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader onBack={onBack} />

      <View style={styles.content}>
        <Text style={styles.title}>Conosci il DOC?</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/onboarding/onboarding-2.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[
              styles.optionButton,
              selectedAnswer === true && styles.optionButtonSelected
            ]}
            onPress={() => setSelectedAnswer(true)}
          >
            <Text style={[
              styles.optionText,
              selectedAnswer === true && styles.optionTextSelected
            ]}>Sì</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.optionButton,
              selectedAnswer === false && styles.optionButtonSelected
            ]}
            onPress={() => setSelectedAnswer(false)}
          >
            <Text style={[
              styles.optionText,
              selectedAnswer === false && styles.optionTextSelected
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ButtonNav 
        label="CONTINUA" 
        onPress={handleContinue}
        disabled={selectedAnswer === null}
      />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    minHeight: 80,
    textAlignVertical: 'center',
  },
  imageContainer: {
    width: 220,
    height: 220,
    marginBottom: 60,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
  },
  optionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonSelected: {
    borderColor: '#8B7CF6',
    backgroundColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#8B7CF6',
  },
});