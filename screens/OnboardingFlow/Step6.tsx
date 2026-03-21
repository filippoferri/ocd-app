import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ButtonNav from '../../components/ButtonNav';
import Select from '../../components/Select';
import OnboardingHeader from '../../components/OnboardingHeader';

interface Step6Props {
  onNext: (gender: 'Maschio' | 'Femmina' | 'Altro') => void;
  onBack: () => void;
}

const genderOptions = [
  { label: 'Maschio', value: 'Maschio' },
  { label: 'Femmina', value: 'Femmina' },
  { label: 'Altro', value: 'Altro' },
];

export default function Step6({ onNext, onBack }: Step6Props) {
  const [selectedGender, setSelectedGender] = useState<'Maschio' | 'Femmina' | 'Altro' | null>(null);

  const handleContinue = () => {
    if (selectedGender) {
      onNext(selectedGender);
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader onBack={onBack} />

      <View style={styles.content}>
        <Text style={styles.title}>Sesso</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/onboarding/onboarding-5.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <Select 
          options={genderOptions}
          selectedValue={selectedGender}
          onSelect={(val) => setSelectedGender(val as any)}
        />
      </View>

      <ButtonNav 
        label="CONTINUA" 
        onPress={handleContinue}
        disabled={selectedGender === null}
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
});