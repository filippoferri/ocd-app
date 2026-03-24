import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

// SVG Components
const FaceSad = ({ selected }: { selected?: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill={selected ? "#FFEBEB" : "#F8F7FF"}/>
    <Path d="M32.5 64.0001C14.8266 64.0001 0.5 49.6735 0.5 32.0001C0.5 14.3267 14.8266 0 32.5 0C50.1734 0 64.5 14.3267 64.5 32.0001C64.5 49.6735 50.1734 64.0001 32.5 64.0001ZM32.5 3.83787C16.9416 3.83787 4.33774 16.4417 4.33774 32.0001C4.33774 47.5585 16.9416 60.1623 32.5 60.1623C48.0583 60.1623 60.6623 47.5585 60.6623 32.0001C60.6623 16.4417 48.0583 3.83787 32.5 3.83787Z" fill={selected ? "#FF6B6B" : "#B8B8FF"}/>
    <Path d="M21.5 46C21.5 46 25 40 32.5 40C40 40 43.5 46 43.5 46" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M22 25.1992C23 25.1992 24.5 26.5 24.5 28" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M43 25.1992C42 25.1992 40.5 26.5 40.5 28" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const FaceNeutral = ({ selected }: { selected?: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill={selected ? "#FFFBEB" : "#F8F7FF"}/>
    <Path d="M32.5 64.0001C14.8266 64.0001 0.5 49.6735 0.5 32.0001C0.5 14.3267 14.8266 0 32.5 0C50.1734 0 64.5 14.3267 64.5 32.0001C64.5 49.6735 50.1734 64.0001 32.5 64.0001ZM32.5 3.83787C16.9416 3.83787 4.33774 16.4417 4.33774 32.0001C4.33774 47.5585 16.9416 60.1623 32.5 60.1623C48.0583 60.1623 60.6623 47.5585 60.6623 32.0001C60.6623 16.4417 48.0583 3.83787 32.5 3.83787Z" fill={selected ? "#FFD93D" : "#B8B8FF"}/>
    <Path d="M21 44H44" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M20 27H26" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M39 27H45" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const FaceHappy = ({ selected }: { selected?: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5777 31.9983C62.5777 48.6108 49.1105 62.0779 32.4979 62.0779C15.8852 62.0779 2.41797 48.6108 2.41797 31.9983C2.41797 15.3857 15.8852 1.91846 32.4979 1.91846C49.1105 1.91846 62.5777 15.3857 62.5777 31.9983Z" fill={selected ? "#EEF9EF" : "#F8F7FF"}/>
    <Path d="M32.4987 63.9974C14.8253 63.9974 0.5 49.6721 0.5 31.9987C0.5 14.3253 14.8253 0 32.4987 0C50.1721 0 64.4974 14.3253 64.4974 31.9987C64.4974 49.6721 50.1721 63.9974 32.4987 63.9974ZM32.4987 3.83771C16.9403 3.83771 4.33771 16.4403 4.33771 31.9987C4.33771 47.5571 16.9403 60.1597 32.4987 60.1597C48.057 60.1597 60.6596 47.5571 60.6596 31.9987C60.6596 16.4403 48.057 3.83771 32.4987 3.83771Z" fill={selected ? "#6BCF7F" : "#B8B8FF"}/>
    <Path d="M21.5 40C21.5 40 25 46 32.5 46C40 46 43.5 40 43.5 40" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M20 28C20 28 22 25 25 25C28 25 30 28 30 28" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M35 28C35 28 37 25 40 25C43 25 45 28 45 28" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

interface MoodFlowProps {
  visible: boolean;
  onClose: () => void;
  onSave: (mood: 'sad' | 'neutral' | 'happy') => void;
}

const { width, height } = Dimensions.get('window');



const getMoodComponent = (mood: 'sad' | 'neutral' | 'happy', selected: boolean) => {
  switch (mood) {
    case 'sad':
      return <FaceSad selected={selected} />;
    case 'neutral':
      return <FaceNeutral selected={selected} />;
    case 'happy':
      return <FaceHappy selected={selected} />;
    default:
      return <FaceHappy selected={selected} />;
  }
};

const moodConfig = {
  sad: {
    color: '#FF6B6B',
    backgroundColor: '#FFEBEB',
  },
  neutral: {
    color: '#FFD93D',
    backgroundColor: '#FFFBEB',
  },
  happy: {
    color: '#6BCF7F',
    backgroundColor: '#EEF9EF',
  },
};

export default function MoodFlow({ visible, onClose, onSave }: MoodFlowProps) {
  const insets = useSafeAreaInsets();
  const [selectedMood, setSelectedMood] = useState<'sad' | 'neutral' | 'happy' | null>(null);

  const handleMoodSelect = (mood: 'sad' | 'neutral' | 'happy') => {
    setSelectedMood(mood);
  };

  const handleSave = () => {
    if (selectedMood) {
      onSave(selectedMood);
      setSelectedMood(null);
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
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View style={{ width: 44 }} />
          <TouchableOpacity onPress={handleClose} style={styles.xButton}>
            <Ionicons name="close" size={28} color="#333" />
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
                  {getMoodComponent(mood as 'sad' | 'neutral' | 'happy', isSelected)}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { opacity: selectedMood ? 1 : 0.5 },
            ]}
            onPress={handleSave}
            disabled={!selectedMood}
          >
            <Text style={styles.saveButtonText}>SALVA</Text>
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
    paddingBottom: 20,
  },
  xButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 80,
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 120,
  },
  moodButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  moodEmoji: {
    fontSize: 40,
  },
  saveButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});