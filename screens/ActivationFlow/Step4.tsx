import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Step4Props {
  onFinish: () => void;
  activationData: {
    date: string;
    time: string;
    symptoms: string[];
    intensity: string;
    description: string;
  };
}

const symptomLabels: { [key: string]: string } = {
  'contamination': 'Paura di contaminazioni',
  'harm': 'Azioni o pensieri lesivi',
  'control': 'Perdita di controllo',
  'sexuality': 'Pensieri legati alla sessualità',
  'order': 'Controllo e ordine',
  'detachment': 'Difficoltà a distaccarsi',
  'error': 'Timore di errore',
  'superstition': 'Pensieri o azioni scaramantiche',
  'invasion': 'Invasione mente da fattori esterni',
  'hypochondria': 'Ipocondria',
  'rituals': 'Idee o azioni di rituali',
};

const intensityColors = {
  1: '#4CAF50', 2: '#8BC34A', 3: '#CDDC39', 4: '#FFEB3B', 5: '#FFC107',
  6: '#FF9800', 7: '#FF5722', 8: '#F44336', 9: '#E91E63', 10: '#9C27B0',
};

export default function Step4({ onFinish, activationData }: Step4Props) {
  const { date, time, symptoms, intensity, description } = activationData;
  const [selectedMood, setSelectedMood] = useState<'bad' | 'neutral' | 'good' | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        
        <Text style={styles.title}>Salvato nel tuo diario</Text>
        <Text style={styles.subtitle}>
          I tuoi pensieri sono ora registrati e disponibili nel tuo diario con il
          tuo terapeuta
        </Text>

        <Text style={styles.exerciseTitle}>Esercizio consigliato</Text>
        
        <View style={styles.exerciseCard}>
          <View style={styles.exerciseIcon}>
            <View style={styles.iconBackground}>
              <Ionicons name="body" size={24} color="#FF9800" />
            </View>
          </View>
          <View style={styles.exerciseContent}>
            <Text style={styles.exerciseLabel}>Contrasta la compulsione</Text>
            <Text style={styles.exerciseDescription}>
              Riduci la tolleranza all'ansia
            </Text>
            <View style={styles.exerciseTime}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.timeText}>5 min</Text>
            </View>
          </View>
        </View>

        <Text style={styles.questionTitle}>Come ti senti ora?</Text>
        
        <View style={styles.moodContainer}>
          <TouchableOpacity 
            style={[styles.moodButton, selectedMood === 'bad' && styles.moodButtonSelected]}
            onPress={() => setSelectedMood('bad')}
          >
            <Text style={styles.moodEmoji}>😔</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.moodButton, selectedMood === 'neutral' && styles.moodButtonSelected]}
            onPress={() => setSelectedMood('neutral')}
          >
            <Text style={styles.moodEmoji}>😐</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.moodButton, selectedMood === 'good' && styles.moodButtonSelected]}
            onPress={() => setSelectedMood('good')}
          >
            <Text style={styles.moodEmoji}>😊</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.diaryButton} onPress={onFinish}>
          <Text style={styles.diaryButtonText}>DIARIO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  exerciseCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  exerciseIcon: {
    marginRight: 16,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  exerciseTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  moodContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  moodButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    borderColor: '#FF8C42',
    backgroundColor: '#FFF3E0',
  },
  moodEmoji: {
    fontSize: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  diaryButton: {
    backgroundColor: '#FF9500',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  diaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});