import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Svg, Path, G, Circle } from 'react-native-svg';
import { Exercise } from '../types/Exercise';
import { UserActivity } from '../types/Activity';
import DailyExerciseService, { DailySlotResult } from '../services/DailyExerciseService';
import AuthService from '../services/AuthService';
import { PREDEFINED_AVATARS } from '../components/AvatarPicker';

const CircleSvg = () => (
  <Svg width={180} height={180} viewBox="0 0 247 241" fill="none">
    <G>
      <Path d="M61.5553 16.9655C0.771564 53.7427 -22.3446 144.259 26.102 200.707C63.0845 243.962 124.115 252.047 176.209 226.596C275.889 177.896 272.183 25.9196 152.86 2.47987C121.38 -3.7051 85.8139 1.88324 61.5553 16.9655Z" fill="#B8B8FF"/>
      <Path d="M50.7825 55.7889C2.03544 108.508 20.081 200.549 97.55 214.45C158.266 225.345 214.117 182.561 222.073 129.559C224.24 96.9257 212.999 62.8075 185.088 41.7564C164.835 26.4883 138.883 20.8274 116.975 22.9955C90.814 25.5817 68.3731 36.1119 50.7825 55.7889Z" fill="#9381FF"/>
      <Path d="M30.8078 116.934H30.7914C30.6681 116.932 30.5459 116.905 30.4328 116.857C30.3195 116.807 30.2168 116.736 30.1312 116.647C30.0453 116.559 29.978 116.454 29.9325 116.339C29.8873 116.224 29.8652 116.101 29.8673 115.978C30.0521 105.561 32.9133 95.368 38.1748 86.381C38.2372 86.2746 38.3197 86.1816 38.4182 86.1072C38.5165 86.0327 38.6284 85.9784 38.7475 85.9472C38.8669 85.9162 38.991 85.9089 39.1132 85.9261C39.2351 85.943 39.3526 85.9838 39.4589 86.0463C39.5651 86.1088 39.658 86.1915 39.7324 86.2899C39.8067 86.3883 39.8609 86.5006 39.8919 86.6199C39.9231 86.7395 39.9303 86.8637 39.9132 86.9859C39.8963 87.1083 39.8555 87.2259 39.7324 87.3324C34.6951 96.0389 31.9231 105.914 31.7437 116.006C31.7406 116.252 31.6407 116.488 31.4655 116.662C31.2905 116.835 31.0541 116.933 30.8078 116.934Z" fill="white"/>
      <Path d="M30.4583 134.015C30.2538 134.015 30.0547 133.948 29.8917 133.824C29.7286 133.7 29.6104 133.526 29.5553 133.329C28.8737 130.872 28.8566 128.278 29.5061 125.813C29.5757 125.58 29.7326 125.383 29.944 125.264C30.155 125.144 30.4046 125.112 30.6394 125.173C30.8744 125.233 31.0768 125.383 31.2039 125.59C31.331 125.797 31.373 126.045 31.3214 126.283C30.7534 128.427 30.7679 130.685 31.3636 132.822C31.4023 132.962 31.4082 133.108 31.381 133.251C31.3535 133.393 31.2937 133.527 31.206 133.643C31.1183 133.758 31.0053 133.851 30.8756 133.915C30.7459 133.98 30.603 134.013 30.4583 134.013V134.015Z" fill="white"/>
    </G>
  </Svg>
);

const FacePurpleSmile = () => (
  <Svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <Circle cx="28" cy="28" r="28" fill="#ACA0FF" />
    <Path d="M17 25 C19 22 23 22 25 25" stroke="#8471F2" strokeWidth="3" strokeLinecap="round" fill="none" />
    <Path d="M31 25 C33 22 37 22 39 25" stroke="#8471F2" strokeWidth="3" strokeLinecap="round" fill="none" />
    <Path d="M19 33 C23 39 33 39 37 33" stroke="#8471F2" strokeWidth="3" strokeLinecap="round" fill="none" />
  </Svg>
);

const FaceSad = () => (
  <Svg width="40" height="40" viewBox="0 0 65 64" fill="none">
    <Path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill="#FFEBEB"/>
    <Path d="M32.5 64.0001C14.8266 64.0001 0.5 49.6735 0.5 32.0001C0.5 14.3267 14.8266 0 32.5 0C50.1734 0 64.5 14.3267 64.5 32.0001C64.5 49.6735 50.1734 64.0001 32.5 64.0001ZM32.5 3.83787C16.9416 3.83787 4.33774 16.4417 4.33774 32.0001C4.33774 47.5585 16.9416 60.1623 32.5 60.1623C48.0583 60.1623 60.6623 47.5585 60.6623 32.0001C60.6623 16.4417 48.0583 3.83787 32.5 3.83787Z" fill="#FF6B6B"/>
    <Path d="M21.5 46C21.5 46 25 40 32.5 40C40 40 43.5 46 43.5 46" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round"/>
    <Path d="M22 25.1992C23 25.1992 24.5 26.5 24.5 28" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round"/>
    <Path d="M43 25.1992C42 25.1992 40.5 26.5 40.5 28" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const FaceNeutral = () => (
  <Svg width="40" height="40" viewBox="0 0 65 64" fill="none">
    <Path d="M62.5802 32.0001C62.5802 48.6132 49.1125 62.0809 32.4988 62.0809C15.8857 62.0809 2.41797 48.6132 2.41797 32.0001C2.41797 15.3867 15.8857 1.91895 32.4988 1.91895C49.1125 1.91895 62.5802 15.3867 62.5802 32.0001Z" fill="#FFFBEB"/>
    <Path d="M32.5 64.0001C14.8266 64.0001 0.5 49.6735 0.5 32.0001C0.5 14.3267 14.8266 0 32.5 0C50.1734 0 64.5 14.3267 64.5 32.0001C64.5 49.6735 50.1734 64.0001 32.5 64.0001ZM32.5 3.83787C16.9416 3.83787 4.33774 16.4417 4.33774 32.0001C4.33774 47.5585 16.9416 60.1623 32.5 60.1623C48.0583 60.1623 60.6623 47.5585 60.6623 32.0001C60.6623 16.4417 48.0583 3.83787 32.5 3.83787Z" fill="#FFD93D"/>
    <Path d="M21 44H44" stroke="#FFD93D" strokeWidth="4" strokeLinecap="round"/>
    <Path d="M20 27H26" stroke="#FFD93D" strokeWidth="4" strokeLinecap="round"/>
    <Path d="M39 27H45" stroke="#FFD93D" strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

const FaceHappy = () => (
  <Svg width="40" height="40" viewBox="0 0 65 64" fill="none">
    <Path d="M62.5777 31.9983C62.5777 48.6108 49.1105 62.0779 32.4979 62.0779C15.8852 62.0779 2.41797 48.6108 2.41797 31.9983C2.41797 15.3857 15.8852 1.91846 32.4979 1.91846C49.1105 1.91846 62.5777 15.3857 62.5777 31.9983Z" fill="#EEF9EF"/>
    <Path d="M32.4987 63.9974C14.8253 63.9974 0.5 49.6721 0.5 31.9987C0.5 14.3253 14.8253 0 32.4987 0C50.1721 0 64.4974 14.3253 64.4974 31.9987C64.4974 49.6721 50.1721 63.9974 32.4987 63.9974ZM32.4987 3.83771C16.9403 3.83771 4.33771 16.4403 4.33771 31.9987C4.33771 47.5571 16.9403 60.1597 32.4987 60.1597C48.057 60.1597 60.6596 47.5571 60.6596 31.9987C60.6596 16.4403 48.057 3.83771 32.4987 3.83771Z" fill="#6BCF7F"/>
    <Path d="M21.5 40C21.5 40 25 46 32.5 46C40 46 43.5 40 43.5 40" stroke="#6BCF7F" strokeWidth="4" strokeLinecap="round"/>
    <Path d="M20 28C20 28 22 25 25 25C28 25 30 28 30 28" stroke="#6BCF7F" strokeWidth="4" strokeLinecap="round"/>
    <Path d="M35 28C35 28 37 25 40 25C43 25 45 28 45 28" stroke="#6BCF7F" strokeWidth="4" strokeLinecap="round"/>
  </Svg>
);

import { Ionicons } from '@expo/vector-icons';
import { calculateUserTrend, getHomeStatusPhrase, UserTrendState } from '../services/TrendService';

interface HomePageProps {
  userName?: string;
  setCurrentScreen: (screen: 'home' | 'diary' | 'OCDTest') => void;
  testCompleted: boolean;
  currentMood: 'sad' | 'neutral' | 'happy' | null;
  onMoodPress: () => void;
  onExercisePress: (exercise: Exercise) => void;
  userActivities: UserActivity[];
}

const getExerciseImagePNG = (imagePath: string) => {
  const imageId = imagePath.split('/').pop()?.replace('.png', '') || '';
  switch (imageId) {
    case 'body-scan':
      return require('../assets/exercises/body-scan.png');
    case 'contrasta-compulsione':
      return require('../assets/exercises/contrasta-compulsione.png');
    case 'contrasta-ossessione':
      return require('../assets/exercises/contrasta-ossessione.png');
    case 'gratitudine-mattino':
      return require('../assets/exercises/gratitudine-mattino.png');
    case 'gratitudine-sera':
      return require('../assets/exercises/gratitudine-sera.png');
    case 'respirazione-consapevole':
      return require('../assets/exercises/respirazione-consapevole.png');
    case 'scrittura':
      return require('../assets/exercises/scrittura.png');
    case 'meditazione-guidata':
      return require('../assets/exercises/meditazione-guidata.png');
    case 'success':
      return require('../assets/exercises/success.png');
    default:
      return require('../assets/exercises/body-scan.png');
  }
};

export default function HomePage({ userName, setCurrentScreen, testCompleted, currentMood, onMoodPress, onExercisePress, userActivities }: HomePageProps) {
  const today = React.useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);
  const [dailySlots, setDailySlots] = React.useState<DailySlotResult | null>(null);
  const [completedIds, setCompletedIds] = React.useState<string[]>([]);

  const loadDailyData = React.useCallback(async () => {
    try {
      const [slots, completed] = await Promise.all([
        DailyExerciseService.getDailyExercises(today),
        DailyExerciseService.getCompletedExercisesToday(today),
      ]);
      setDailySlots(slots);
      setCompletedIds(completed);
    } catch (error) {
      console.error('Errore nel caricamento esercizi giornalieri:', error);
    }
  }, [today]);

  React.useEffect(() => {
    loadDailyData();
  }, [loadDailyData]);

  // Re-check completed ids whenever activities update (e.g. after completing an exercise)
  React.useEffect(() => {
    DailyExerciseService.getCompletedExercisesToday(today).then(setCompletedIds);
  }, [userActivities, today]);

  // Ordered list of daily exercises, excluding completed ones
  const displayedExercises = React.useMemo((): Exercise[] => {
    if (!dailySlots) return [];
    return [dailySlots.morning, dailySlots.day, dailySlots.evening].filter(
      ex => !completedIds.includes(ex.id)
    );
  }, [dailySlots, completedIds]);

  const allExercisesDone = dailySlots !== null && displayedExercises.length === 0;

  const userTrend: UserTrendState = React.useMemo(() => 
    calculateUserTrend(userActivities, currentMood, completedIds.length), 
    [userActivities, currentMood, completedIds.length]
  );
  const statusPhrase = getHomeStatusPhrase(userTrend);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      {/* Welcome Section with Progress Circle */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Buongiorno,{"\n"}{userName || 'Utente'}</Text>
        <TouchableOpacity style={styles.progressContainer} onPress={onMoodPress}>
          <View style={styles.moodContainer}>
            <View style={styles.circleBackgroundWrapper}>
              <CircleSvg />
            </View>
            <View style={styles.moodIconBackground}>
              {/* Uses FacePurpleSmile based on the screenshot, or custom state faces */}
              {currentMood === 'sad' ? <FaceSad /> : 
               currentMood === 'neutral' ? <FaceNeutral /> : 
               currentMood === 'happy' ? <FaceHappy /> :
               <FacePurpleSmile />}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Status Box */}
      <View style={styles.trendSection}>
        <View style={styles.trendCard}>
          <View style={styles.trendIconContainer}>
            <Ionicons 
              name={
                userTrend === 'POSITIVE' ? 'sparkles-outline' : 
                userTrend === 'IMPROVING' ? 'trending-up-outline' : 
                userTrend === 'HARDER' ? 'leaf-outline' : 
                userTrend === 'BOOTSTRAP' ? 'map-outline' : 
                'sunny-outline'
              } 
              size={22} 
              color="#9381FF" 
            />
          </View>
          <View style={styles.trendTextContainer}>
            <Text style={styles.statusText}>"{statusPhrase}"</Text>
          </View>
        </View>
      </View>

      {/* Daily Exercises */}
      <View style={styles.exercisesSection}>
        <Text style={styles.sectionTitle}>Esercizi del giorno</Text>
        
        {displayedExercises.map(exercise => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseCard}
            onPress={() => onExercisePress(exercise)}
          >
            <View style={styles.exerciseImageContainer}>
              <Image
                source={getExerciseImagePNG(exercise.image)}
                style={styles.exerciseCardImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseTitle}>{exercise.name}</Text>
              <Text style={styles.exerciseDescription}>{exercise.objectiveText}</Text>
              <View style={styles.exerciseTime}>
                <Ionicons name="time" size={16} color="#666" />
                <Text style={styles.timeText}>{exercise.duration} min</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {allExercisesDone && testCompleted && (
          <View style={styles.completionCard}>
            <View style={styles.completionIcon}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            </View>
            <Text style={styles.completionTitle}>🎉 Fantastico!</Text>
            <Text style={styles.completionMessage}>
              Hai completato tutti gli esercizi di oggi. La costanza è la chiave del successo!
            </Text>
            <Text style={styles.completionSubMessage}>
              Torna domani per nuove sfide e continua il tuo percorso di crescita.
            </Text>
          </View>
        )}

        {!testCompleted && (
          <TouchableOpacity 
            style={styles.exerciseCard}
            onPress={() => setCurrentScreen('OCDTest')}
          >
            <View style={[styles.exerciseIcon, { backgroundColor: '#e5e3fd' }]}>
              <Ionicons name="clipboard-outline" size={24} color="#9381ff" />
            </View>
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseTitle}>Test DOC</Text>
              <Text style={styles.exerciseDescription}>Valutazione disturbo ossessivo compulsivo</Text>
              <View style={styles.exerciseTime}>
                <Ionicons name="time" size={16} color="#666" />
                <Text style={styles.timeText}>10 min</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeSection: {
    backgroundColor: '#9381FF',
    borderRadius: 24,
    paddingVertical: 35,
    paddingLeft: 25,
    paddingRight: 0, // Circles can touch the right edge
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '400',
    color: 'white',
    lineHeight: 32,
    letterSpacing: 0.3,
    flex: 1, // takes up space so it doesn't overlap circles
  },
  progressContainer: {
    position: 'relative',
  },
  moodContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
  },
  circleBackgroundWrapper: {
    position: 'absolute',
    right: 10, 
  },
  moodIconBackground: {
    position: 'absolute',
    right: 60, // Adjusted to center better with the new SVG blobs
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  homeAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  moodIcon: {
    zIndex: 2,
  },
  moodButton: {
    marginHorizontal: 10,
    borderRadius: 40,
    padding: 10,
  },
  selectedMoodButton: {
    backgroundColor: 'rgba(139, 124, 246, 0.1)',
  },
  exercisesSection: {
    marginBottom: 30,
  },
  trendSection: {
    marginBottom: 25,
  },
  trendCard: {
    backgroundColor: '#e5e3fd',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // No shadow for initial style
  },
  trendIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(147, 129, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trendTextContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: '400',
    color: '#4B3E9F',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D0140',
    marginBottom: 15,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  exerciseImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
  },
  exerciseCardImage: {
    width: 60,
    height: 60,
  },
  exerciseIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyScanIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    position: 'relative',
    overflow: 'hidden',
  },
  bodyScanWave: {
    position: 'absolute',
    top: 20,
    left: 15,
    width: 30,
    height: 20,
    backgroundColor: '#2196F3',
    borderRadius: 15,
    opacity: 0.6,
  },
  writingIconContainer: {
    backgroundColor: '#FFF3E0',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D0140',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
  completionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  completionIcon: {
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  completionMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  completionSubMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});