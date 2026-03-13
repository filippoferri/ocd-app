import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';
import Select from '../../components/Select';

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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Sesso</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/onboarding/onboarding-6.png')} 
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
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
});