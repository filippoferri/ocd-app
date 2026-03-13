import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';
import Select from '../../components/Select';

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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.placeholder} />
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
});