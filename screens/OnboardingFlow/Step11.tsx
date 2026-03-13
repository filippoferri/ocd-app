import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, G, ClipPath, Defs } from 'react-native-svg';
import ButtonNav from '../../components/ButtonNav';

interface Step11Props {
  onNext: (currentMood: 'sad' | 'neutral' | 'happy') => void;
  onBack: () => void;
}

const FaceSad = ({ selected }: { selected: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill={selected ? "#FFEBEB" : "#F8F7FF"}/>
    <Path d="M32.5 64.0001C14.8266 64.0001 0.5 49.6735 0.5 32.0001C0.5 14.3267 14.8266 0 32.5 0C50.1734 0 64.5 14.3267 64.5 32.0001C64.5 49.6735 50.1734 64.0001 32.5 64.0001ZM32.5 3.83787C16.9416 3.83787 4.33774 16.4417 4.33774 32.0001C4.33774 47.5585 16.9416 60.1623 32.5 60.1623C48.0583 60.1623 60.6623 47.5585 60.6623 32.0001C60.6623 16.4417 48.0583 3.83787 32.5 3.83787Z" fill={selected ? "#FF6B6B" : "#B8B8FF"}/>
    {/* Mouth - Frown */}
    <Path d="M21.5 46C21.5 46 25 40 32.5 40C40 40 43.5 46 43.5 46" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    {/* Eyes */}
    <Path d="M22 25.1992C23 25.1992 24.5 26.5 24.5 28" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M43 25.1992C42 25.1992 40.5 26.5 40.5 28" stroke={selected ? "#FF6B6B" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const FaceNeutral = ({ selected }: { selected: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill={selected ? "#FFFBEB" : "#F8F7FF"}/>
    <Path d="M32.5 64.0001C14.8266 64.0001 0.5 49.6735 0.5 32.0001C0.5 14.3267 14.8266 0 32.5 0C50.1734 0 64.5 14.3267 64.5 32.0001C64.5 49.6735 50.1734 64.0001 32.5 64.0001ZM32.5 3.83787C16.9416 3.83787 4.33774 16.4417 4.33774 32.0001C4.33774 47.5585 16.9416 60.1623 32.5 60.1623C48.0583 60.1623 60.6623 47.5585 60.6623 32.0001C60.6623 16.4417 48.0583 3.83787 32.5 3.83787Z" fill={selected ? "#FFD93D" : "#B8B8FF"}/>
    {/* Mouth - Neutral */}
    <Path d="M21 44H44" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    {/* Eyes */}
    <Path d="M20 27H26" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M39 27H45" stroke={selected ? "#FFD93D" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const FaceHappy = ({ selected }: { selected: boolean }) => (
  <Svg width={50} height={50} viewBox="0 0 65 64" fill="none">
    <Path d="M62.5777 31.9983C62.5777 48.6108 49.1105 62.0779 32.4979 62.0779C15.8852 62.0779 2.41797 48.6108 2.41797 31.9983C2.41797 15.3857 15.8852 1.91846 32.4979 1.91846C49.1105 1.91846 62.5777 15.3857 62.5777 31.9983Z" fill={selected ? "#EEF9EF" : "#F8F7FF"}/>
    <Path d="M32.4987 63.9974C14.8253 63.9974 0.5 49.6721 0.5 31.9987C0.5 14.3253 14.8253 0 32.4987 0C50.1721 0 64.4974 14.3253 64.4974 31.9987C64.4974 49.6721 50.1721 63.9974 32.4987 63.9974ZM32.4987 3.83771C16.9403 3.83771 4.33771 16.4403 4.33771 31.9987C4.33771 47.5571 16.9403 60.1597 32.4987 60.1597C48.057 60.1597 60.6596 47.5571 60.6596 31.9987C60.6596 16.4403 48.057 3.83771 32.4987 3.83771Z" fill={selected ? "#6BCF7F" : "#B8B8FF"}/>
    {/* Mouth - Smile */}
    <Path d="M21.5 40C21.5 40 25 46 32.5 46C40 46 43.5 40 43.5 40" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    {/* Eyes */}
    <Path d="M20 28C20 28 22 25 25 25C28 25 30 28 30 28" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
    <Path d="M35 28C35 28 37 25 40 25C43 25 45 28 45 28" stroke={selected ? "#6BCF7F" : "#B8B8FF"} strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

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

const getMoodColor = (mood: 'sad' | 'neutral' | 'happy') => {
  switch (mood) {
    case 'sad':
      return '#FF6B6B';
    case 'neutral':
      return '#FFD93D';
    case 'happy':
      return '#6BCF7F';
    default:
      return '#E8E8E8';
  }
};

export default function Step11({ onNext, onBack }: Step11Props) {
  const [selectedMood, setSelectedMood] = useState<'sad' | 'neutral' | 'happy' | null>(null);

  const handleContinue = () => {
    if (selectedMood) {
      onNext(selectedMood);
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
        <Text style={styles.title}>Come ti senti ora?</Text>
        
        <View style={styles.moodContainer}>
          {(['sad', 'neutral', 'happy'] as const).map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodButton,
                {
                  borderColor: selectedMood === mood ? getMoodColor(mood) : '#E8E8E8',
                  borderWidth: 2,
                },
              ]}
              focusable={false}
              onPress={() => setSelectedMood(mood)}
            >
              {getMoodComponent(mood, selectedMood === mood)}
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
    marginBottom: 60,
    minHeight: 80,
    textAlignVertical: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  moodButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});