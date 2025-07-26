import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';

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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

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
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginBottom: 60,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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