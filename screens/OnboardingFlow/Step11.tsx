import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import ButtonNav from '../../components/ButtonNav';

interface Step11Props {
  onNext: (currentMood: 'sad' | 'neutral' | 'happy') => void;
  onBack: () => void;
}

const sadFaceSvg = `
<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="30" cy="30" r="30" fill="#FF6B6B"/>
  <circle cx="20" cy="22" r="3" fill="white"/>
  <circle cx="40" cy="22" r="3" fill="white"/>
  <path d="M20 40 Q30 32 40 40" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>
`;

const neutralFaceSvg = `
<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="30" cy="30" r="30" fill="#FFD93D"/>
  <circle cx="20" cy="22" r="3" fill="white"/>
  <circle cx="40" cy="22" r="3" fill="white"/>
  <line x1="22" y1="38" x2="38" y2="38" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>
`;

const happyFaceSvg = `
<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="30" cy="30" r="30" fill="#6BCF7F"/>
  <circle cx="20" cy="22" r="3" fill="white"/>
  <circle cx="40" cy="22" r="3" fill="white"/>
  <path d="M20 35 Q30 45 40 35" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>
`;

export default function Step11({ onNext, onBack }: Step11Props) {
  const [selectedMood, setSelectedMood] = useState<'sad' | 'neutral' | 'happy' | null>(null);

  const handleContinue = () => {
    if (selectedMood) {
      onNext(selectedMood);
    }
  };

  const moodOptions = [
    { id: 'sad' as const, svg: sadFaceSvg, label: 'Triste' },
    { id: 'neutral' as const, svg: neutralFaceSvg, label: 'Neutrale' },
    { id: 'happy' as const, svg: happyFaceSvg, label: 'Felice' },
  ];

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
        <Text style={styles.title}>Come ti senti ora?</Text>
        
        <View style={styles.moodContainer}>
          {moodOptions.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodOption,
                selectedMood === mood.id && styles.moodOptionSelected
              ]}
              onPress={() => setSelectedMood(mood.id)}
            >
              <View style={styles.moodIcon}>
                <SvgXml xml={mood.svg} width={60} height={60} />
              </View>
              <Text style={[
                styles.moodLabel,
                selectedMood === mood.id && styles.moodLabelSelected
              ]}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ButtonNav 
        label="COMPLETA" 
        onPress={handleContinue}
        disabled={selectedMood === null}
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
    marginBottom: 60,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  moodOption: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodOptionSelected: {
    borderColor: '#8B7CF6',
    backgroundColor: '#F3F4F6',
  },
  moodIcon: {
    marginBottom: 12,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  moodLabelSelected: {
    color: '#8B7CF6',
  },
});