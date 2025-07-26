import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
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
import AuthService, { User, UserActivity } from './services/AuthService';
import MoodFlow from './components/MoodFlow';
import { Exercise } from './types/Exercise';

interface ActivationEntry {
  id: string;
  date: string;
  time: string;
  type: 'ossessione' | 'compulsione';
  symptom: string;
  intensity: string;
  description: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explore'>('home');
  const [currentScreen, setCurrentScreen] = useState<'home' | 'diary' | 'OCDTest'>('home');
  const [showActivationFlow, setShowActivationFlow] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showActivityDetail, setShowActivityDetail] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivationEntry | null>(null);
  const [diaryRefreshKey, setDiaryRefreshKey] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<number | null>(null);
  const [currentMood, setCurrentMood] = useState<'sad' | 'neutral' | 'happy' | null>(null);
  const [showMoodFlow, setShowMoodFlow] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleHomePress = () => {
    setActiveTab('home');
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
    setCurrentScreen('diary');
    // Forza il refresh del diario incrementando la key
    setDiaryRefreshKey(prev => prev + 1);
    // Ricarica le attività
    try {
      const activities = await AuthService.getUserActivities();
      setUserActivities(activities);
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

  const handleAuthSuccess = async (user: User) => {
    setCurrentUser(user);
    try {
      const activities = await AuthService.getUserActivities();
      setUserActivities(activities);
      // Controlla se l'utente ha completato l'onboarding
      const hasCompletedOnboarding = await AuthService.hasCompletedOnboarding();
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
        setOnboardingCompleted(false);
      } else {
        setOnboardingCompleted(true);
        // Carica i dati dell'onboarding per impostare il mood
        const onboardingData = await AuthService.getOnboardingData();
        if (onboardingData) {
          setCurrentMood(onboardingData.currentMood);
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento attività:', error);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
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
        const updatedActivity = { ...selectedActivity, description };
        await AuthService.updateActivity(selectedActivity.id, updatedActivity);
        setDiaryRefreshKey(prev => prev + 1);
        setShowActivityDetail(false);
        setSelectedActivity(null);
        // Ricarica le attività
        const activities = await AuthService.getUserActivities();
        setUserActivities(activities);
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
        // Ricarica le attività
        const activities = await AuthService.getUserActivities();
        setUserActivities(activities);
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

  const handleOnboardingComplete = async (onboardingData: OnboardingData) => {
    try {
      // Salva i dati dell'onboarding
      await AuthService.saveOnboardingData(onboardingData);
      // Imposta il mood iniziale
      setCurrentMood(onboardingData.currentMood);
      // Se l'utente vuole fare il test DOC, naviga al test
      if (onboardingData.wantsOCDTest) {
        setCurrentScreen('OCDTest');
      }
      setShowOnboarding(false);
      setOnboardingCompleted(true);
    } catch (error) {
      console.error('Errore nel salvataggio dati onboarding:', error);
    }
  };

  const handleResetOnboarding = async () => {
    try {
      await AuthService.resetOnboarding();
      setOnboardingCompleted(false);
      setShowProfile(false);
      setShowOnboarding(true);
    } catch (error) {
      console.error('Errore nel reset onboarding:', error);
    }
  };

  const handleExercisePress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseDetail(true);
  };

  const handleCloseExerciseDetail = () => {
    setShowExerciseDetail(false);
    setSelectedExercise(null);
  };

  const handleExerciseComplete = () => {
    setShowExerciseDetail(false);
    setSelectedExercise(null);
    // Potresti voler aggiungere qui logica per aggiornare statistiche o mostrare congratulazioni
  };

  // Verifica se l'utente è già autenticato all'avvio
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
        if (user) {
          const activities = await AuthService.getUserActivities();
          setUserActivities(activities);
          // Controlla se l'utente ha completato l'onboarding
          const hasCompletedOnboarding = await AuthService.hasCompletedOnboarding();
          if (!hasCompletedOnboarding) {
            setShowOnboarding(true);
            setOnboardingCompleted(false);
          } else {
            setOnboardingCompleted(true);
            // Carica i dati dell'onboarding per impostare il mood
            const onboardingData = await AuthService.getOnboardingData();
            if (onboardingData) {
              setCurrentMood(onboardingData.currentMood);
            }
          }
        }
      } catch (error) {
        console.error('Errore nel controllo autenticazione:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Mostra AuthFlow se l'utente non è autenticato
  if (!currentUser && !isLoading) {
    return (
      <SafeAreaProvider>
        <AuthFlow onAuthSuccess={handleAuthSuccess} />
      </SafeAreaProvider>
    );
  }

  // Mostra loading se stiamo verificando l'autenticazione
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={[styles.container, styles.loadingContainer]}>
          <StatusBar style="dark" />
          <Text style={styles.loadingText}>Caricamento...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />
      
      {currentScreen !== 'OCDTest' && activeTab !== 'explore' && (
        <TopNav 
          currentScreen={currentScreen}
          onToggle={handleToggleScreen}
          onAvatarPress={handleAvatarPress}
          userName={currentUser?.name}
        />
      )}
      
      <View style={styles.contentContainer}>
        {currentScreen === 'home' && activeTab === 'home' && (
          <HomePage 
                userName={currentUser?.name}
                setCurrentScreen={setCurrentScreen}
                testCompleted={testCompleted}
                currentMood={currentMood}
                onMoodPress={handleMoodPress}
                onExercisePress={handleExercisePress}
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
          />
        )}
        
        {currentScreen === 'OCDTest' && (
          <OCDTestScreen 
            onBack={() => setCurrentScreen('home')}
            onTestComplete={(score: number) => {
              setTestCompleted(true);
              setTestResult(score);
              setCurrentScreen('home');
            }}
          />
        )}
      </View>
      
      {(currentScreen === 'home' || currentScreen === 'diary') && (
        <SafeAreaView style={styles.bottomNavContainer} edges={['bottom']}>
          <BottomNav 
            activeTab={activeTab}
            onHomePress={handleHomePress}
            onExplorePress={handleExplorePress}
            onAddPress={handleAddPress}
          />
        </SafeAreaView>
      )}
      
      <Modal
        visible={showActivityDetail}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedActivity && (
          <ActivityDetailScreen
            activity={selectedActivity}
            onBack={handleCloseActivityDetail}
            onSave={handleSaveActivity}
            onDelete={handleDeleteActivity}
          />
        )}
      </Modal>
      
      <Modal
        visible={showActivationFlow}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <ActivationFlow 
          onClose={handleCloseActivationFlow}
          onComplete={handleCompleteActivationFlow}
        />
      </Modal>

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
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </Modal>

      <Modal
        visible={showExerciseDetail}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedExercise && (
           <ExerciseDetailScreen
             exercise={selectedExercise}
             onBack={handleCloseExerciseDetail}
             onComplete={handleExerciseComplete}
           />
         )}
      </Modal>
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 80, // Spazio per il BottomNav fisso
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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