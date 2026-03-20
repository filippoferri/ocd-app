import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ButtonNav from '../../components/ButtonNav';

interface Step2Props {
  onNext: (intensity: string) => void;
  onBack: () => void;
  onClose: () => void;
}



type IntensityLevel = 'bassa' | 'media' | 'alta';

const intensityColors: Record<IntensityLevel, string> = {
  bassa: '#fcefc6',
  media: '#FBD49B',
  alta: '#EFB3AA',
};

const intensityTextColors: Record<IntensityLevel, string> = {
  bassa: '#E0A500',
  media: '#EF9A43',
  alta: '#990809',
};

const intensityData: { level: IntensityLevel; label: string }[] = [
  { level: 'bassa', label: 'Bassa' },
  { level: 'media', label: 'Media' },
  { level: 'alta', label: 'Alta' },
];

export default function Step2({ onNext, onBack, onClose }: Step2Props) {
  const insets = useSafeAreaInsets();
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel>('media');

  const handleContinue = () => {
    onNext(selectedIntensity);
  };

  return (
    <View style={[styles.container, { backgroundColor: intensityColors[selectedIntensity] }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: 'black' }]}>Con che intensità?</Text>
        
        <View style={styles.intensityDisplay}>
          <Text style={[
            styles.intensityLabel,
            { color: intensityTextColors[selectedIntensity] }
          ]}>
            {intensityData.find(item => item.level === selectedIntensity)?.label}
          </Text>
        </View>

        <View style={styles.toggleContainer}>
          <View style={styles.toggle}>
            {intensityData.map((item, index) => (
              <TouchableOpacity
                key={item.level}
                style={[
                  styles.toggleOption,
                  selectedIntensity === item.level && styles.toggleOptionActive,
                  index === 0 && styles.toggleOptionFirst,
                  index === intensityData.length - 1 && styles.toggleOptionLast,
                ]}
                onPress={() => setSelectedIntensity(item.level)}
              >
                <Text style={[
                  styles.toggleText,
                  selectedIntensity === item.level && styles.toggleTextActive
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ButtonNav label="CONTINUA" onPress={handleContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingTop handled dynamically
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 60,
    textAlign: 'center',
  },
  intensityDisplay: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  intensityLabel: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toggleContainer: {
    width: '80%',
    alignItems: 'center',
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 25,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
  },
  toggleOptionFirst: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  toggleOptionLast: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  toggleOptionActive: {
    backgroundColor: 'white',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.7)',
  },
  toggleTextActive: {
    color: '#333',
  },
});