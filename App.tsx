import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
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
import AuthService, { User } from './services/AuthService';
import { UserActivity, ActivationEntry } from './types/Activity';
import MoodFlow from './components/MoodFlow';
import { Exercise } from './types/Exercise';

import { AuthProvider, useAuth } from './contexts/AuthContext';



function MainApp() {
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
    setCurrentScreen('diary');
    // Forza il refresh del diario incrementando la key
    setDiaryRefreshKey(prev => prev + 1);
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

  const handleExerciseComplete = () => {
    setShowExerciseDetail(false);
    setSelectedExercise(null);
    // Potresti voler aggiungere qui logica per aggiornare statistiche o mostrare congratulazioni
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
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
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
      
      <View style={[styles.contentContainer, { paddingTop: ((currentScreen === 'home' || currentScreen === 'diary') && activeTab === 'home') ? 115 : 0 }]}>
        {currentScreen === 'home' && activeTab === 'home' && (
          <HomePage 
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
              const activity = {
                id: `test_${Date.now()}`,
                date: now.toISOString().split('T')[0],
                time: now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false }),
                type: 'test' as const,
                symptom: 'Test DOC',
                intensity: 'completato',
                description: `Test DOC completato. Valutazione intensità: ${evaluation}`,
              };
              
              try {
                await AuthService.addActivity(activity);
                // Aggiorna la lista delle attività
                await refreshActivities();
              } catch (error) {
                console.error('Errore nel salvare il completamento del test:', error);
              }
              
              setCurrentScreen('home');
            }}
          />
        )}
      </View>
      
      {(currentScreen === 'home' || currentScreen === 'diary' || activeTab === 'explore') && (
        <View style={styles.bottomNavContainer}>
          <BottomNav 
            activeTab={activeTab}
            onHomePress={handleHomePress}
            onExplorePress={handleExplorePress}
            onAddPress={handleAddPress}
          />
        </View>
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
          onOpenExercise={(exercise) => {
            setShowActivationFlow(false);
            setSelectedExercise(exercise);
            setShowExerciseDetail(true);
          }}
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
        <OnboardingFlow onComplete={handleLocalOnboardingComplete} />
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
             onClose={handleCloseExerciseDetail}
             onComplete={handleExerciseComplete}
             onNavigateToDiary={handleNavigateToDiary}
           />
         )}
      </Modal>
    </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    position: 'relative',
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
