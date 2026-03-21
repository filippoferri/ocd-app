import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ButtonNav from '../../components/ButtonNav';
import Select from '../../components/Select';
import OnboardingHeader from '../../components/OnboardingHeader';

interface Step7Props {
  onNext: (fragilityDuration: string) => void;
  onBack: () => void;
}

const durationOptions = [
  { label: 'Da pochi mesi', value: 'Da pochi mesi' },
  { label: 'Da un anno', value: 'Da un anno' },
  { label: 'Da anni', value: 'Da anni' },
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
      <OnboardingHeader onBack={onBack} />

      <View style={styles.content}>
        <Text style={styles.title}>Da quanto tempo credi di soffrire di avere fragilità?</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/onboarding/onboarding-6.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <Select 
          options={durationOptions}
          selectedValue={selectedDuration}
          onSelect={setSelectedDuration}
        />
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
    width: 220,
    height: 220,
    marginBottom: 60,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});