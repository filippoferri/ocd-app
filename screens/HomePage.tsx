import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Svg, Path, G, ClipPath, Defs, Rect } from 'react-native-svg';
import { Exercise } from '../types/Exercise';
import ExerciseServiceAdapter from '../services/ExerciseServiceAdapter';
import ExerciseService from '../services/ExerciseService';

const CircleBackground = () => (
  <Svg width={120} height={120} viewBox="0 0 247 241" fill="none">
    <Defs>
      <ClipPath id="clip0_157_11949">
        <Rect width="247" height="241" fill="white"/>
      </ClipPath>
    </Defs>
    <G clipPath="url(#clip0_157_11949)">
      <Path d="M61.5553 16.9655C0.771564 53.7427 -22.3446 144.259 26.102 200.707C63.0845 243.962 124.115 252.047 176.209 226.596C275.889 177.896 272.183 25.9196 152.86 2.47987C121.38 -3.7051 85.8139 1.88324 61.5553 16.9655Z" fill="#B8B8FF"/>
      <Path d="M50.7825 55.7889C2.03544 108.508 20.081 200.549 97.55 214.45C158.266 225.345 214.117 182.561 222.073 129.559C224.24 96.9257 212.999 62.8075 185.088 41.7564C164.835 26.4883 138.883 20.8274 116.975 22.9955C90.814 25.5817 68.3731 36.1119 50.7825 55.7889Z" fill="#9381FF"/>
    </G>
  </Svg>
);

const FaceSad = () => (
<Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
  <Path d="M38.7991 19.9992C38.7991 30.3819 30.3821 38.7989 19.9994 38.7989C9.6166 38.7989 1.19922 30.3819 1.19922 19.9992C1.19922 9.61623 9.6166 1.19922 19.9994 1.19922C30.3821 1.19922 38.7991 9.61623 38.7991 19.9992Z" fill="#FAB3B3"/>
  <Path d="M19.9992 2.39857C17.6223 2.39857 15.3174 2.86379 13.1486 3.78125C11.0526 4.66767 9.17042 5.93689 7.55367 7.55368C5.93693 9.1705 4.66759 11.0529 3.781 13.1486C2.86362 15.3177 2.39849 17.6228 2.39849 19.9992C2.39849 22.3757 2.86362 24.6805 3.781 26.8498C4.66759 28.9454 5.93693 30.828 7.55367 32.4447C9.17042 34.0615 11.053 35.3308 13.1486 36.2174C15.3174 37.1348 17.6223 37.5999 19.9992 37.5999C22.3756 37.5999 24.6805 37.1348 26.8497 36.2174C28.9454 35.3308 30.8279 34.0615 32.4447 32.4447C34.0614 30.828 35.3308 28.9454 36.217 26.8498C37.1347 24.6805 37.5999 22.3757 37.5999 19.9992C37.5999 17.6228 37.1347 15.3177 36.217 13.1486C35.3308 11.0529 34.0614 9.1705 32.4447 7.55368C30.8279 5.93689 28.9454 4.66767 26.8497 3.78125C24.6805 2.86379 22.3756 2.39857 19.9992 2.39857ZM19.9992 39.9984C17.2999 39.9984 14.6805 39.4696 12.2142 38.4262C9.83234 37.4189 7.69388 35.9769 5.85746 34.1409C4.02105 32.3045 2.57946 30.1656 1.57222 27.7842C0.528787 25.3179 0 22.6985 0 19.9992C0 17.2999 0.528787 14.6806 1.57222 12.2142C2.57946 9.83263 4.02105 7.69392 5.85746 5.85763C7.69388 4.0213 9.83234 2.57946 12.2142 1.57214C14.6805 0.528914 17.2999 0 19.9992 0C22.6985 0 25.3179 0.528914 27.7842 1.57214C30.1656 2.57946 32.3045 4.0213 34.1409 5.85763C35.9769 7.69392 37.4189 9.83259 38.4261 12.2142C39.4696 14.6806 39.9984 17.2999 39.9984 19.9992C39.9984 22.6985 39.4696 25.3179 38.4261 27.7842C37.4189 30.1656 35.9769 32.3045 34.1409 34.1409C32.3045 35.9769 30.1656 37.4189 27.7842 38.4262C25.3179 39.4696 22.6985 39.9984 19.9992 39.9984Z" fill="#922C31"/>
  <Path d="M13.4909 30.6171C13.3253 30.6171 13.1572 30.5743 13.0041 30.4844C12.5444 30.2153 12.3909 29.6236 12.6596 29.1639C12.6854 29.1198 13.3066 28.0701 14.4886 27.0317C16.0783 25.635 17.9496 24.897 19.9009 24.897C21.8521 24.897 23.7235 25.635 25.3132 27.0317C26.4952 28.0701 27.1163 29.1198 27.1421 29.1639C27.4113 29.6236 27.2565 30.214 26.7972 30.4832C26.3383 30.7515 25.7492 30.598 25.4796 30.1408C25.4738 30.1308 24.9595 29.275 23.9951 28.4408C22.7562 27.3687 21.3787 26.8253 19.9009 26.8253C18.4231 26.8253 17.0456 27.3687 15.8066 28.4408C14.8418 29.2758 14.3271 30.132 14.3222 30.1408C14.1433 30.447 13.8217 30.6171 13.4909 30.6171Z" fill="#922C31"/>
  <Path d="M29.0962 15.9334C29.6046 16.3032 29.6283 17.0575 29.1378 17.4507C28.5079 17.9558 27.5501 18.4941 26.3295 18.4941C25.1096 18.4941 24.1527 17.9566 23.5224 17.4519C23.0315 17.0584 23.0552 16.3028 23.5644 15.9325C23.9139 15.6783 24.3899 15.6903 24.7281 15.96C25.1005 16.2566 25.6567 16.5753 26.3295 16.5753C27.0072 16.5753 27.5626 16.2575 27.9337 15.9608C28.2711 15.6909 28.7467 15.6794 29.0962 15.9334Z" fill="#922C31"/>
  <Path d="M16.2403 15.9334C16.7487 16.3032 16.7724 17.0575 16.2823 17.4507C15.652 17.9558 14.6947 18.4941 13.474 18.4941C12.2542 18.4941 11.2969 17.9566 10.667 17.4519C10.1761 17.0584 10.1998 16.3028 10.7086 15.9325C11.0585 15.6783 11.534 15.6903 11.8723 15.96C12.2451 16.2566 12.8013 16.5753 13.474 16.5753C14.1514 16.5753 14.7072 16.2575 15.0783 15.9608C15.4157 15.6909 15.8913 15.6794 16.2403 15.9334Z" fill="#922C31"/>
</Svg>
);

const FaceNeutral = () => (
<Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
  <Path d="M38.8006 19.9999C38.8006 30.3831 30.3833 38.8004 19.9997 38.8004C9.61653 38.8004 1.19922 30.3831 1.19922 19.9999C1.19922 9.61656 9.61653 1.19922 19.9997 1.19922C30.3833 1.19922 38.8006 9.61656 38.8006 19.9999Z" fill="#F9D98D"/>
  <Path d="M26.6141 28.5617H13.3863C12.8537 28.5617 12.4219 28.1299 12.4219 27.5973C12.4219 27.0652 12.8537 26.6333 13.3863 26.6333H26.6141C27.1466 26.6333 27.5781 27.0652 27.5781 27.5973C27.5781 28.1299 27.1466 28.5617 26.6141 28.5617Z" fill="#AF8F3C"/>
  <Path d="M20 2.39867C17.6235 2.39867 15.3185 2.8639 13.1492 3.7814C11.0535 4.66785 9.17079 5.93713 7.55398 7.55398C5.93717 9.17087 4.66778 11.0533 3.78157 13.1491C2.86416 15.3184 2.39859 17.6235 2.39859 20C2.39859 22.3766 2.86416 24.6815 3.78157 26.8509C4.66778 28.9465 5.93717 30.8292 7.55398 32.446C9.17079 34.0628 11.0535 35.3322 13.1492 36.2188C15.3185 37.1363 17.6235 37.6014 20 37.6014C22.3769 37.6014 24.6819 37.1363 26.8508 36.2188C28.947 35.3322 30.8292 34.0628 32.446 32.446C34.0632 30.8292 35.3322 28.9465 36.2188 26.8509C37.1363 24.6815 37.6014 22.3766 37.6014 20C37.6014 17.6235 37.1363 15.3184 36.2188 13.1491C35.3322 11.0533 34.0632 9.17087 32.446 7.55398C30.8292 5.93713 28.947 4.66785 26.8508 3.7814C24.6819 2.8639 22.3769 2.39867 20 2.39867ZM20 40C17.3006 40 14.6815 39.4712 12.2147 38.4277C9.83316 37.4204 7.69419 35.9784 5.85812 34.1423C4.02163 32.3058 2.57957 30.1669 1.57229 27.7853C0.529227 25.3189 0 22.6994 0 20C0 17.3006 0.529227 14.6812 1.57229 12.2147C2.57957 9.83298 4.02163 7.69423 5.85812 5.85787C7.69419 4.02146 9.83316 2.57957 12.2147 1.5722C14.6815 0.528935 17.3006 0 20 0C22.6994 0 25.3189 0.528935 27.7853 1.5722C30.1673 2.57957 32.3058 4.02146 34.1423 5.85787C35.9788 7.69423 37.4204 9.83298 38.4281 12.2147C39.4712 14.6812 40 17.3006 40 20C40 22.6994 39.4712 25.3189 38.4281 27.7853C37.4204 30.1669 35.9788 32.3058 34.1423 34.1423C32.3058 35.9784 30.1673 37.4204 27.7853 38.4277C25.3189 39.4712 22.6994 40 20 40Z" fill="#AF8F3C"/>
  <Path d="M15.6765 18.0015H12.6522C12.1666 18.0015 11.7734 17.6079 11.7734 17.1228C11.7734 16.6372 12.1666 16.2437 12.6522 16.2437H15.6765C16.162 16.2437 16.5556 16.6372 16.5556 17.1228C16.5556 17.6079 16.162 18.0015 15.6765 18.0015Z" fill="#AF8F3C"/>
  <Path d="M27.3488 18.0015H24.324C23.8389 18.0015 23.4453 17.6079 23.4453 17.1228C23.4453 16.6372 23.8389 16.2437 24.324 16.2437H27.3488C27.8339 16.2437 28.2275 16.6372 28.2275 17.1228C28.2275 17.6079 27.8339 18.0015 27.3488 18.0015Z" fill="#AF8F3C"/>
</Svg>
);

const FaceHappy = () => (
<Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
  <Path d="M38.8006 19.9999C38.8006 30.3831 30.3832 38.8004 19.9999 38.8004C9.61659 38.8004 1.19922 30.3831 1.19922 19.9999C1.19922 9.61656 9.61659 1.19922 19.9999 1.19922C30.3832 1.19922 38.8006 9.61656 38.8006 19.9999Z" fill="#D7EBC8"/>
  <Path d="M20 2.39867C17.6233 2.39867 15.3184 2.8639 13.1491 3.7814C11.0534 4.66785 9.17086 5.93713 7.55401 7.55398C5.93712 9.17087 4.66785 11.0533 3.78139 13.1491C2.86386 15.3184 2.39866 17.6235 2.39866 20C2.39866 22.3766 2.86386 24.6815 3.78139 26.8509C4.66785 28.9465 5.93712 30.8292 7.55401 32.446C9.17086 34.0628 11.0534 35.3322 13.1491 36.2188C15.3184 37.1363 17.6233 37.6014 20 37.6014C22.3767 37.6014 24.6817 37.1363 26.8509 36.2188C28.9467 35.3322 30.8291 34.0628 32.446 32.446C34.0629 30.8292 35.3322 28.9465 36.2186 26.8509C37.1361 24.6815 37.6013 22.3766 37.6013 20C37.6013 17.6235 37.1361 15.3184 36.2186 13.1491C35.3322 11.0533 34.0629 9.17087 32.446 7.55398C30.8291 5.93713 28.9467 4.66785 26.8509 3.7814C24.6817 2.8639 22.3767 2.39867 20 2.39867ZM20 40C17.3006 40 14.6812 39.4712 12.2147 38.4277C9.83301 37.4204 7.69426 35.9784 5.85786 34.1423C4.02146 32.3058 2.57957 30.1669 1.5722 27.7853C0.528936 25.3189 0 22.6994 0 20C0 17.3006 0.528936 14.6812 1.5722 12.2147C2.57957 9.83298 4.02146 7.69423 5.85786 5.85787C7.69426 4.02146 9.83301 2.57957 12.2147 1.5722C14.6812 0.528935 17.3006 0 20 0C22.6995 0 25.3188 0.528935 27.7853 1.5722C30.167 2.57957 32.3058 4.02146 34.1421 5.85787C35.9785 7.69423 37.4204 9.83298 38.4278 12.2147C39.471 14.6812 40 17.3006 40 20C40 22.6994 39.471 25.3189 38.4278 27.7853C37.4204 30.1669 35.9785 32.3058 34.1421 34.1423C32.3058 35.9784 30.167 37.4204 27.7853 38.4277C25.3188 39.4712 22.6995 40 20 40Z" fill="#689240"/>
  <Path d="M26.4088 24.8975C26.5746 24.8975 26.7425 24.9403 26.8959 25.0302C27.3555 25.299 27.5092 25.891 27.2402 26.3503C27.2143 26.3949 26.5932 27.4442 25.4113 28.4826C23.8216 29.8794 21.9499 30.6179 19.9987 30.6179C18.0474 30.6179 16.1758 29.8794 14.5861 28.4826C13.4042 27.4442 12.7831 26.3949 12.7572 26.3503C12.4882 25.891 12.6427 25.3002 13.1022 25.0314C13.5609 24.7627 14.1501 24.9162 14.4198 25.3739C14.4258 25.3838 14.9401 26.2397 15.9042 27.0739C17.1433 28.1456 18.5209 28.6894 19.9987 28.6894C21.4766 28.6894 22.8541 28.1456 24.0932 27.0739C25.0582 26.2388 25.5725 25.3822 25.5776 25.3739C25.7568 25.0676 26.0783 24.8975 26.4088 24.8975Z" fill="#689240"/>
  <Path d="M10.802 18.3108C10.2937 17.941 10.2699 17.1867 10.7603 16.7935C11.3903 16.2884 12.348 15.75 13.5686 15.75C14.7885 15.75 15.7457 16.2875 16.3757 16.7926C16.8668 17.1858 16.8429 17.9414 16.334 18.3117C15.9843 18.5659 15.5085 18.5538 15.1703 18.2842C14.7977 17.9876 14.2413 17.6689 13.5686 17.6689C12.8911 17.6689 12.3353 17.9867 11.9643 18.2838C11.6269 18.5534 11.1513 18.5651 10.802 18.3108Z" fill="#689240"/>
  <Path d="M23.6614 18.3108C23.1531 17.941 23.1293 17.1867 23.6197 16.7935C24.2497 16.2884 25.2074 15.75 26.428 15.75C27.6478 15.75 28.6051 16.2875 29.2351 16.7926C29.7261 17.1858 29.7023 17.9414 29.1934 18.3117C28.8436 18.5659 28.3679 18.5538 28.0297 18.2842C27.6571 17.9876 27.1007 17.6689 26.428 17.6689C25.7504 17.6689 25.1947 17.9867 24.8236 18.2838C24.4862 18.5534 24.0107 18.5651 23.6614 18.3108Z" fill="#689240"/>
</Svg>
);
import { Ionicons } from '@expo/vector-icons';

interface HomePageProps {
  userName?: string;
  setCurrentScreen: (screen: 'home' | 'diary' | 'OCDTest') => void;
  testCompleted: boolean;
  currentMood: 'sad' | 'neutral' | 'happy' | null;
  onMoodPress: () => void;
  onExercisePress: (exercise: Exercise) => void;
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
    case 'success':
      return require('../assets/exercises/success.png');
    default:
      return require('../assets/exercises/body-scan.png');
  }
};

export default function HomePage({ userName, setCurrentScreen, testCompleted, currentMood, onMoodPress, onExercisePress }: HomePageProps) {
  const [dailyExercises, setDailyExercises] = React.useState<Exercise[]>([]);

  React.useEffect(() => {
    const loadExercises = async () => {
      try {
        // Carica i tre esercizi specifici richiesti
        const exercises = await ExerciseServiceAdapter.getDailyRecommendations();
        setDailyExercises(exercises);
      } catch (error) {
        console.error('Errore nel caricamento esercizi:', error);
        // Fallback ai dati locali se necessario
        const localExercises = ExerciseService.getDailyRecommendations();
        setDailyExercises(localExercises);
      }
    };
    
    loadExercises();
  }, []);

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
            <CircleBackground />
            <View style={styles.moodIconBackground}>
              {currentMood === 'sad' ? <FaceSad /> : 
               currentMood === 'neutral' ? <FaceNeutral /> : 
               currentMood === 'happy' ? <FaceHappy /> : <FaceHappy />}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Daily Exercises */}
      <View style={styles.exercisesSection}>
        <Text style={styles.sectionTitle}>Esercizi del giorno</Text>
        
        {dailyExercises.map((exercise, index) => {
           return (
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
           );
         })}

        {!testCompleted && (
          <TouchableOpacity 
            style={styles.exerciseCard}
            onPress={() => setCurrentScreen('OCDTest')}
          >
            <View style={styles.exerciseIcon}>
              <Ionicons name="clipboard-outline" size={24} color="#8B7CF6" />
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
    backgroundColor: '#8B7CF6',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 30,
  },
  progressContainer: {
    position: 'relative',
  },
  moodContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
  },
  circleBackground: {
    position: 'absolute',
  },
  moodIconBackground: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    color: '#333',
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
});