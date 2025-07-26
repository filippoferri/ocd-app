import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';

interface Step7Props {
  onNext: (fragilityDuration: string) => void;
  onBack: () => void;
}

const durationOptions = [
  'Meno di 6 mesi',
  '6 mesi - 1 anno',
  '1 - 2 anni',
  '2 - 5 anni',
  'Più di 5 anni',
  'Non lo so'
];

export default function Step7({ onNext, onBack }: Step7Props) {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedDuration) {
      onNext(selectedDuration);
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
        <Text style={styles.title}>Da quanto tempo credi di soffrire di avere fragilità?</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/onboarding/onboarding-7.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.optionsContainer}>
          {durationOptions.map((option) => (
            <TouchableOpacity 
              key={option}
              style={[
                styles.optionButton,
                selectedDuration === option && styles.optionButtonSelected
              ]}
              onPress={() => setSelectedDuration(option)}
            >
              <Text style={[
                styles.optionText,
                selectedDuration === option && styles.optionTextSelected
              ]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ButtonNav 
        label="CONTINUA" 
        onPress={handleContinue}
        disabled={selectedDuration === null}
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
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 30,
  },
  imageContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    flex: 1,
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#8B7CF6',
  },
});