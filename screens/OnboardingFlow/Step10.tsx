import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';

interface Step10Props {
  onNext: (wantsOCDTest: boolean) => void;
  onBack: () => void;
}

export default function Step10({ onNext, onBack }: Step10Props) {
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
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Vuoi scoprire ora se soffri di disturbo ossessivo compulsivo?</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/onboarding/onboarding-1.png')} 
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 30,
    minHeight: 80,
    textAlignVertical: 'center',
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