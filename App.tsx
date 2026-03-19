import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, Platform, ActivityIndicator, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import HomePage from './screens/HomePage';
import DiaryScreen from './screens/DiaryScreen';
import ActivityDetailScreen from './screens/ActivityDetailScreen';
import ExploreScreen from './screens/ExploreScreen';
import ExerciseDetailScreen from './screens/ExerciseDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import OCDTestScreen from './screens/OCDTestScreen';
import ActivationFlow from './screens/ActivationFlow/ActivationFlow';
import AuthFlow from './screens/AuthFlow/AuthFlow';
import OnboardingFlow, { OnboardingData } from './screens/OnboardingFlow/OnboardingFlow';
import AuthService, { User } from './services/AuthService';
import { UserActivity, ActivationEntry } from './types/Activity';
import MoodFlow from './components/MoodFlow';
import { Exercise } from './types/Exercise';
import DailyExerciseService from './services/DailyExerciseService';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SlideModal from './components/SlideModal';



function MainApp() {
  const insets = useSafeAreaInsets();
  const { 
    currentUser, userActivities, isLoading, testCompleted, testResult, 
    currentMood, onboardingCompleted, handleAuthSuccess, handleLogout, 
    refreshActivities, setTestCompleted, setTestResult, setCurrentMood,
    setOnboardingCompleted, handleOnboardingComplete, handleResetOnboarding
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'home' | 'explore'>('home');
  const [currentScreen, setCurrentScreen] = useState<'home' | 'diary' | 'OCDTest'>('home');
  const [showActivationFlow, setShowActivationFlow] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showActivityDetail, setShowActivityDetail] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivationEntry | null>(null);
  const [diaryRefreshKey, setDiaryRefreshKey] = useState(0);
  const [showMoodFlow, setShowMoodFlow] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [homeRefreshKey, setHomeRefreshKey] = useState(0);

  // Background animation for parallax effect
  const { width, height } = Dimensions.get('window');
  const backgroundSlideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shouldSlide = showActivityDetail || showExerciseDetail;
    Animated.timing(backgroundSlideAnim, {
      toValue: shouldSlide ? -height * 0.08 : 0, // Shifting 8% upwards
      duration: shouldSlide ? 350 : 300,
      easing: shouldSlide ? Easing.out(Easing.poly(4)) : Easing.in(Easing.poly(4)),
      useNativeDriver: true,
    }).start();
  }, [showActivityDetail, showExerciseDetail]);

  // Show Onboarding if not completed and authenticated
  useEffect(() => {
    if (currentUser && !isLoading && !onboardingCompleted) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [currentUser, isLoading, onboardingCompleted]);


  const handleHomePress = () => {
    setActiveTab('home');
    setCurrentScreen('home');
  };

  const handleExplorePress = () => {
    setActiveTab('explore');
    setCurrentScreen('home');
  };

  const handleAddPress = () => {
    setShowActivationFlow(true);
  };

  const handleCloseActivationFlow = () => {
    setShowActivationFlow(false);
  };

  const handleCompleteActivationFlow = async () => {
    setShowActivationFlow(false);
    setCurrentScreen('home');
    // Forza il refresh della home incrementando la key
    setHomeRefreshKey(prev => prev + 1);
    try {
      await refreshActivities();
    } catch (error) {
      console.error('Errore nel caricamento attività:', error);
    }
  };

  const handleToggleScreen = () => {
    if (currentScreen === 'home') {
      setCurrentScreen('diary');
      setActiveTab('home'); // Quando vai al diario, l'activeTab dovrebbe essere 'home'
    } else {
      setCurrentScreen('home');
      setActiveTab('home'); // Quando torni alla home, l'activeTab dovrebbe essere 'home'
    }
  };

  const handleAvatarPress = () => {
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const handleLocalLogout = async () => {
    await handleLogout();
    setShowProfile(false);
    setCurrentScreen('home');
    setActiveTab('home');
  };

  const handleActivityPress = (activity: ActivationEntry) => {
    setSelectedActivity(activity);
    setShowActivityDetail(true);
  };

  const handleCloseActivityDetail = () => {
    setShowActivityDetail(false);
    setSelectedActivity(null);
  };

  const handleSaveActivity = async (description: string) => {
    if (selectedActivity) {
      try {
        await AuthService.updateActivity(selectedActivity.id, { description });
        setDiaryRefreshKey(prev => prev + 1);
        setShowActivityDetail(false);
        setSelectedActivity(null);
        await refreshActivities();
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    }
  };

  const handleDeleteActivity = async () => {
    if (selectedActivity) {
      try {
        await AuthService.deleteActivity(selectedActivity.id);
        setDiaryRefreshKey(prev => prev + 1);
        setShowActivityDetail(false);
        setSelectedActivity(null);
        await refreshActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
  };

  const handleMoodPress = () => {
    setShowMoodFlow(true);
  };

  const handleCloseMoodFlow = () => {
    setShowMoodFlow(false);
  };

  const handleSaveMood = (mood: 'sad' | 'neutral' | 'happy') => {
    setCurrentMood(mood);
    setShowMoodFlow(false);
  };

  const handleLocalOnboardingComplete = async (onboardingData: OnboardingData) => {
    await handleOnboardingComplete(onboardingData);
    if (onboardingData.wantsOCDTest) {
      setCurrentScreen('OCDTest');
    }
  };

  const handleLocalResetOnboarding = async () => {
    await handleResetOnboarding();
    setShowProfile(false);
    setShowOnboarding(true);
  };

  const handleExercisePress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseDetail(true);
  };

  const handleCloseExerciseDetail = () => {
    setShowExerciseDetail(false);
    setSelectedExercise(null);
  };

  const handleExerciseComplete = async () => {
    if (selectedExercise) {
      const today = new Date();
      const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      await DailyExerciseService.markExerciseCompleted(selectedExercise.id, localToday);
    }
    setShowExerciseDetail(false);
    setSelectedExercise(null);
    setHomeRefreshKey(prev => prev + 1);
    await refreshActivities();
    
    // Al termine dell'esercizio torna alla Home del giorno
    setActiveTab('home');
    setCurrentScreen('home');
  };

  const handleNavigateToDiary = async () => {
    setShowExerciseDetail(false);
    setSelectedExercise(null);
    await refreshActivities();
    setActiveTab('home');
    setCurrentScreen('diary');
    setDiaryRefreshKey(prev => prev + 1);
  };


  // Mostra AuthFlow se l'utente non è autenticato
  if (!currentUser && !isLoading) {
    return <AuthFlow onAuthSuccess={handleAuthSuccess} />;
  }

  // Mostra loading se stiamo verificando l'autenticazione
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#8B7CF6" />
        <Text style={[styles.loadingText, { marginTop: 20 }]}>Caricamento...</Text>
        
        <TouchableOpacity 
          onPress={() => {
            console.warn('Bypass manuale del caricamento');
            // Questo forzerà l'unblock via AuthContext
            handleLogout(); 
          }}
          style={{ marginTop: 40, padding: 10 }}
        >
          <Text style={{ color: '#8B7CF6', fontSize: 14, textDecorationLine: 'underline' }}>
            Problemi nel caricamento? Clicca qui
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.mainWrapper, { transform: [{ translateY: backgroundSlideAnim }] }]}>
        <StatusBar style="dark" />
      
        <View style={styles.topNavContainer}>
          {(currentScreen === 'home' || currentScreen === 'diary') && activeTab === 'home' && (
            <TopNav 
              currentScreen={currentScreen}
              onToggle={handleToggleScreen}
              onAvatarPress={handleAvatarPress}
              userName={currentUser?.name}
            />
          )}
        </View>
        
        <View style={[styles.contentContainer, { paddingTop: ((currentScreen === 'home' || currentScreen === 'diary') && activeTab === 'home') ? insets.top + 85 : 0 }]}>
            {currentScreen === 'home' && activeTab === 'home' && (
              <HomePage
                key={homeRefreshKey}
                userName={currentUser?.name}
                setCurrentScreen={setCurrentScreen}
                testCompleted={testCompleted}
                currentMood={currentMood}
                onMoodPress={handleMoodPress}
                onExercisePress={handleExercisePress}
                userActivities={userActivities}
              />
            )}
            {currentScreen === 'home' && activeTab === 'explore' && (
              <ExploreScreen onExercisePress={handleExercisePress} />
            )}
            {currentScreen === 'diary' && (
              <DiaryScreen 
                key={diaryRefreshKey}
                onClose={() => setCurrentScreen('home')}
                onHomePress={handleHomePress}
                onExplorePress={handleExplorePress}
                onAddPress={handleAddPress}
                onActivityPress={handleActivityPress}
                activeTab={activeTab}
                testCompleted={testCompleted}
                testResult={testResult}
                onRetakeTest={() => {
                  setTestCompleted(false);
                  setTestResult(null);
                  setCurrentScreen('OCDTest');
                }}
                userActivities={userActivities}
                onProfilePress={handleAvatarPress}
              />
            )}
            
            {currentScreen === 'OCDTest' && (
              <OCDTestScreen 
                onBack={() => setCurrentScreen('home')}
                onTestComplete={async (evaluation: string) => {
                  setTestCompleted(true);
                  setTestResult(evaluation);
                  
                  // Salva il completamento del test come attività
                  const now = new Date();
                  const localNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                  const activity = {
                    id: `test_${Date.now()}`,
                    date: localNow,
                    time: now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false }),
                    type: 'test' as const,
                    symptom: 'Test DOC',
                    intensity: 'completato',
                    description: `Test DOC completato. Valutazione intensità: ${evaluation}`,
                  };
                  
                  try {
                    await AuthService.addActivity(activity);
                    await refreshActivities();
                  } catch (error) {
                    console.error('Errore nel salvare il completamento del test:', error);
                  }
                  
                  setCurrentScreen('home');
                }}
              />
            )}
          </View>

          {(currentScreen === 'home' || currentScreen === 'diary') && (
            <View style={styles.bottomNavContainer}>
              <BottomNav 
                activeTab={activeTab} 
                onHomePress={handleHomePress}
                onExplorePress={handleExplorePress}
                onAddPress={handleAddPress}
              />
            </View>
          )}
        </Animated.View>

        <SlideModal
          visible={showActivityDetail}
          onClose={handleCloseActivityDetail}
        >
          {selectedActivity && (
            <ActivityDetailScreen
              activity={selectedActivity}
              onBack={handleCloseActivityDetail}
              onSave={handleSaveActivity}
              onDelete={handleDeleteActivity}
            />
          )}
        </SlideModal>
        
        <SlideModal
          visible={showActivationFlow}
          onClose={handleCloseActivationFlow}
          direction="vertical"
        >
          <ActivationFlow 
            onClose={handleCloseActivationFlow}
            onComplete={handleCompleteActivationFlow}
            onOpenExercise={(exercise) => {
              setShowActivationFlow(false);
              setSelectedExercise(exercise);
              setShowExerciseDetail(true);
            }}
          />
        </SlideModal>

        <Modal
          visible={showProfile}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <ProfileScreen 
            onClose={handleCloseProfile}
            user={currentUser}
            onLogout={handleLogout}
            userActivities={userActivities}
            testCompleted={testCompleted}
            testResult={testResult}
            onRetakeTest={() => {
              setTestCompleted(false);
              setTestResult(null);
              setShowProfile(false);
              setCurrentScreen('OCDTest');
            }}
            onResetOnboarding={handleResetOnboarding}
          />
        </Modal>

        <MoodFlow
          visible={showMoodFlow}
          onClose={handleCloseMoodFlow}
          onSave={handleSaveMood}
        />

        <Modal
          visible={showOnboarding}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <OnboardingFlow onComplete={handleLocalOnboardingComplete} />
        </Modal>

        <SlideModal
          visible={showExerciseDetail}
          onClose={handleCloseExerciseDetail}
          direction="vertical"
        >
          {selectedExercise && (
             <ExerciseDetailScreen
               exercise={selectedExercise}
               onBack={handleCloseExerciseDetail}
               onClose={handleCloseExerciseDetail}
               onComplete={handleExerciseComplete}
               onNavigateToDiary={handleNavigateToDiary}
             />
           )}
        </SlideModal>
      </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    position: 'relative',
    overflow: 'hidden',
  },
  mainWrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 115,
    paddingBottom: 80, // Spazio per il BottomNav fisso
    zIndex: 0,
  },
  topNavContainer: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  bottomNavContainer: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    zIndex: 1000,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
