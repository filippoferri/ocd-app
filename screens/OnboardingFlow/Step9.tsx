import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import ButtonNav from '../../components/ButtonNav';
import OnboardingHeader from '../../components/OnboardingHeader';

interface Step9Props {
  onNext: (dailyImpact: number) => void;
  onBack: () => void;
}

export default function Step9({ onNext, onBack }: Step9Props) {
  const [selectedImpact, setSelectedImpact] = useState<number | null>(null);

  const handleContinue = () => {
    if (selectedImpact !== null) {
      onNext(selectedImpact);
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Quanto impatta nella tua giornata questa vulnerabilità da 1 a 5?</Text>
          
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/onboarding/onboarding-8.png')} 
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.scaleContainer}>
            <Text style={styles.helperText}>Scala 1–5: 1 è il minimo, 5 è il massimo.</Text>
            
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((number) => (
                <TouchableOpacity
                  key={number}
                  style={[
                    styles.ratingButton,
                    selectedImpact === number && styles.ratingButtonSelected
                  ]}
                  onPress={() => setSelectedImpact(number)}
                >
                  <Text style={[
                    styles.ratingText,
                    selectedImpact === number && styles.ratingTextSelected
                  ]}>
                    {number}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <ButtonNav 
        label="CONTINUA" 
        onPress={handleContinue}
        disabled={selectedImpact === null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scaleContainer: {
    width: '100%',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 24,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  ratingButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingButtonSelected: {
    borderColor: '#8B7CF6',
    backgroundColor: '#F3F4F6',
  },
  ratingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  ratingTextSelected: {
    color: '#8B7CF6',
  },
});