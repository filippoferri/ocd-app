import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import AuthService, { User, OnboardingData } from '../services/AuthService';
import { UserActivity } from '../types/Activity';
import { initializeExerciseService } from '../config/exerciseConfig';

interface AuthContextData {
  currentUser: User | null;
  userActivities: UserActivity[];
  isLoading: boolean;
  testCompleted: boolean;
  testResult: string | null;
  currentMood: 'sad' | 'neutral' | 'happy' | null;
  onboardingCompleted: boolean;
  
  handleAuthSuccess: (user: User) => Promise<void>;
  handleLogout: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  setTestCompleted: (completed: boolean) => void;
  setTestResult: (result: string | null) => void;
  setCurrentMood: (mood: 'sad' | 'neutral' | 'happy' | null) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  handleOnboardingComplete: (data: OnboardingData) => Promise<void>;
  handleResetOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<'sad' | 'neutral' | 'happy' | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const checkTestStatus = (activities: UserActivity[]) => {
    const testActivities = activities.filter(a => a.type === 'test');
    
    if (testActivities.length === 0) {
      setTestCompleted(false);
      setTestResult(null);
      return;
    }

    const lastTest = testActivities[0];
    const match = lastTest.description.match(/Valutazione intensità: (.+)/);
    if (match) {
      setTestResult(match[1]);
    }

    const lastTestDate = new Date(lastTest.date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastTestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays > 30) {
      setTestCompleted(false);
    } else {
      setTestCompleted(true);
    }
  };

  useEffect(() => {
    checkTestStatus(userActivities);
  }, [userActivities]);

  const refreshActivities = async () => {
    try {
      const activities = await AuthService.getUserActivities();
      setUserActivities(activities);
    } catch (error) {
      console.error('Errore nel caricamento attività:', error);
    }
  };

  const loadUserData = async () => {
    console.log('🔄 AuthContext: Caricamento dati utente...');
    try {
      const activities = await AuthService.getUserActivities();
      console.log('✅ AuthContext: Attività caricate:', activities.length);
      setUserActivities(activities);
      
      const completed = await AuthService.hasCompletedOnboarding();
      console.log('✅ AuthContext: Onboarding completato:', completed);
      setOnboardingCompleted(completed);
      
      if (completed) {
        const onboardingData = await AuthService.getOnboardingData();
        if (onboardingData) {
          setCurrentMood(onboardingData.currentMood);
        }
      }
    } catch (error) {
      console.error('❌ AuthContext: Errore nel caricamento dati utente:', error);
    }
  };

  const handleAuthSuccess = async (user: User) => {
    setCurrentUser(user);
    await loadUserData();
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
    setUserActivities([]);
    setOnboardingCompleted(false);
    setTestCompleted(false);
    setTestResult(null);
    setCurrentMood(null);
  };

  const handleOnboardingComplete = async (onboardingData: OnboardingData) => {
    try {
      await AuthService.saveOnboardingData(onboardingData);
      setCurrentMood(onboardingData.currentMood);
      setOnboardingCompleted(true);
    } catch (error) {
      console.error('Errore nel salvataggio dati onboarding:', error);
    }
  };

  const handleResetOnboarding = async () => {
    try {
      await AuthService.resetOnboarding();
      setOnboardingCompleted(false);
    } catch (error) {
      console.error('Errore nel reset onboarding:', error);
    }
  };

  // Initialize: check existing session + listen for auth state changes
  useEffect(() => {
    initializeExerciseService();

    const initSession = async () => {
      console.log('🚀 AuthContext: Inizializzazione sessione...');
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          console.log('✅ AuthContext: Utente trovato:', user.email);
          setCurrentUser(user);
          loadUserData(); // Non attendiamo il caricamento dati per non bloccare la UI
        } else {
          console.log('ℹ️ AuthContext: Nessuna sessione attiva');
        }
      } catch (error) {
        console.error('❌ AuthContext: Errore nel controllo sessione:', error);
      } finally {
        console.log('🏁 AuthContext: Fine inizializzazione');
        setIsLoading(false);
      }
    };

    // Unified auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔑 AuthContext: Evento auth rilevato:', event, !!session);
      
      if (session?.user) {
        console.log('✅ AuthContext: Sessione attiva per', session.user.email);
        const mappedUser: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || '',
          email: session.user.email || '',
          avatar_url: session.user.user_metadata?.avatar_url,
          createdAt: session.user.created_at,
        };
        setCurrentUser(mappedUser);
        loadUserData(); 
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        console.log('ℹ️ AuthContext: Utente disconnesso');
        setCurrentUser(null);
        setUserActivities([]);
        setOnboardingCompleted(false);
        setTestCompleted(false);
        setTestResult(null);
        setCurrentMood(null);
        setIsLoading(false);
      } else if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
        if (!session) {
          console.log('ℹ️ AuthContext: Sessione inattiva');
          setIsLoading(false);
        }
      }
    });

    initSession();

    // Safety timeout: sblocca il caricamento dopo 5 secondi qualunque cosa accada
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ AuthContext: Timeout sicurezza raggiunto. Sblocco manuale...');
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      userActivities,
      isLoading,
      testCompleted,
      testResult,
      currentMood,
      onboardingCompleted,
      handleAuthSuccess,
      handleLogout,
      refreshActivities,
      setTestCompleted,
      setTestResult,
      setCurrentMood,
      setOnboardingCompleted,
      handleOnboardingComplete,
      handleResetOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
