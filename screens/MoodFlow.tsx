import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MoodFlowProps {
  visible: boolean;
  onClose: () => void;
  onSaveMood: (mood: 'sad' | 'neutral' | 'happy') => void;
}

type MoodType = 'sad' | 'neutral' | 'happy' | null;

const moodConfig = {
  sad: {
    emoji: '😞',
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  neutral: {
    emoji: '😐',
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
  },
  happy: {
    emoji: '😊',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
  },
};

export default function MoodFlow({ visible, onClose, onSaveMood }: MoodFlowProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType>(null);

  const handleMoodSelect = (mood: 'sad' | 'neutral' | 'happy') => {
    setSelectedMood(mood);
  };

  const handleSave = () => {
    if (selectedMood) {
      onSaveMood(selectedMood);
      setSelectedMood(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedMood(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Come ti senti ora?</Text>

          <View style={styles.moodContainer}>
            {Object.entries(moodConfig).map(([mood, config]) => {
              const isSelected = selectedMood === mood;
              return (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.moodButton,
                    isSelected && {
                      backgroundColor: config.backgroundColor,
                      borderColor: config.color,
                      borderWidth: 3,
                    },
                  ]}
                  onPress={() => handleMoodSelect(mood as 'sad' | 'neutral' | 'happy')}
                >
                  <Text
                    style={[
                      styles.moodEmoji,
                      isSelected && { color: config.color },
                    ]}
                  >
                    {config.emoji}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              !selectedMood && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!selectedMood}
          >
            <Text
              style={[
                styles.saveButtonText,
                !selectedMood && styles.saveButtonTextDisabled,
              ]}
            >
              SALVA
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 80,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  moodButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  moodEmoji: {
    fontSize: 40,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: '#FF8C42',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonTextDisabled: {
    color: '#999',
  },
});