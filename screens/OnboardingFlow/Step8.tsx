import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';

interface Step8Props {
  onNext: (fragilityLevel: number) => void;
  onBack: () => void;
}

export default function Step8({ onNext, onBack }: Step8Props) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleContinue = () => {
    if (selectedLevel !== null) {
      onNext(selectedLevel);
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
        <Text style={styles.title}>Quanto valuteresti la tua fragilità da 1 a 10?</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/onboarding/onboarding-8.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.scaleContainer}>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Minima</Text>
            <Text style={styles.scaleLabel}>Massima</Text>
          </View>
          
          <View style={styles.numbersContainer}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
              <TouchableOpacity
                key={number}
                style={[
                  styles.numberButton,
                  selectedLevel === number && styles.numberButtonSelected
                ]}
                onPress={() => setSelectedLevel(number)}
              >
                <Text style={[
                  styles.numberText,
                  selectedLevel === number && styles.numberTextSelected
                ]}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ButtonNav 
        label="CONTINUA" 
        onPress={handleContinue}
        disabled={selectedLevel === null}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 30,
  },
  imageContainer: {
    width: 120,
    height: 120,
    marginBottom: 60,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scaleContainer: {
    width: '100%',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  scaleLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  numberButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  numberButtonSelected: {
    borderColor: '#8B7CF6',
    backgroundColor: '#8B7CF6',
  },
  numberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  numberTextSelected: {
    color: 'white',
  },
});