import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
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
  onboardingCompleted: boolean | null;
  
  handleAuthSuccess: (user: User) => Promise<void>;
  handleLogout: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  setTestCompleted: (completed: boolean) => void;
  setTestResult: (result: string | null) => void;
  setCurrentMood: (mood: 'sad' | 'neutral' | 'happy' | null) => void;
  setOnboardingCompleted: (completed: boolean | null) => void;
  handleOnboardingComplete: (data: OnboardingData) => Promise<void>;
  handleResetOnboarding: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  handleUpdateAvatar: (avatarId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<'sad' | 'neutral' | 'happy' | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

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

  const loadingUserIds = useRef<Set<string>>(new Set());

  const loadUserData = async (userId: string) => {
    if (loadingUserIds.current.has(userId)) {
      console.log('⏳ [AuthContext] Caricamento già in corso per:', userId);
      return;
    }
    
    loadingUserIds.current.add(userId);
    console.log('🔄 [AuthContext] Caricamento dati utente per:', userId);
    
    try {
      // Impostiamo un timeout per i caricamenti dati per evitare deadlock
      const dataPromise = Promise.all([
        AuthService.getUserActivities().catch(e => {
          console.error('❌ [AuthContext] Errore getUserActivities:', e);
          return [];
        }),
        AuthService.hasCompletedOnboarding(userId).catch(e => {
          console.error('❌ [AuthContext] Errore hasCompletedOnboarding:', e);
          return false;
        })
      ]);

      // Timeout di 4 secondi per il caricamento dei dati specifici
      const timeoutPromise = new Promise<[UserActivity[], boolean]>((resolve) => 
        setTimeout(() => resolve([[], false]), 4000)
      );

      const [activities, completed] = await Promise.race([dataPromise, timeoutPromise]);

      console.log('✅ [AuthContext] Dati caricati. Onboarding completato:', completed);
      setUserActivities(activities);
      setOnboardingCompleted(completed);
      
      if (completed) {
        try {
          const onboardingData = await AuthService.getOnboardingData();
          if (onboardingData) {
            setCurrentMood(onboardingData.currentMood);
          }
        } catch (e) {
          console.warn('⚠️ [AuthContext] Errore recupero mood da onboarding:', e);
        }
      }
    } catch (error) {
      console.error('❌ [AuthContext] Errore fatale in loadUserData:', error);
      // Fallback sicuro per non bloccare l'interfaccia
      setOnboardingCompleted(false);
    } finally {
      loadingUserIds.current.delete(userId);
    }
  };

  const handleAuthSuccess = async (user: User) => {
    setCurrentUser(user);
    await loadUserData(user.id);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
    setUserActivities([]);
    setOnboardingCompleted(null);
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
      console.log('🔄 AuthContext: Chiamata resetOnboarding...');
      await AuthService.resetOnboarding();
      console.log('✅ AuthContext: ResetOnboarding completato su DB, settaggio stato locale a false');
      setOnboardingCompleted(false);
    } catch (error) {
      console.error('❌ AuthContext: Errore nel reset onboarding:', error);
    }
  };

  const handleUpdateAvatar = async (avatarId: string) => {
    try {
      await AuthService.updateProfileAvatar(avatarId);
      // Update local state immediately
      if (currentUser) {
        setCurrentUser({ ...currentUser, avatar_url: avatarId });
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento avatar:', error);
      throw error;
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await AuthService.deleteAccount();
      // Reset locale
      setCurrentUser(null);
      setUserActivities([]);
      setOnboardingCompleted(null);
      setTestCompleted(false);
      setTestResult(null);
      setCurrentMood(null);
    } catch (error) {
      console.error('Errore nella cancellazione account:', error);
      throw error;
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
          await loadUserData(user.id); // Attendiamo il caricamento dati
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
      console.log(`🔑 [AuthContext] Auth event: ${event}`, !!session ? '✅ Sessione presente' : '❌ No session');
      
      if (session?.user) {
        const mappedUser: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          email: session.user.email || '',
          avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
          createdAt: session.user.created_at,
          provider: session.user.app_metadata?.provider || session.user.identities?.[0]?.provider,
        };
        
        // Evitiamo ricaricamenti inutili se l'utente è lo stesso
        if (!currentUser || currentUser.id !== mappedUser.id) {
          setCurrentUser(mappedUser);
          await loadUserData(session.user.id); 
        }
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setUserActivities([]);
        setOnboardingCompleted(null);
        setTestCompleted(false);
        setTestResult(null);
        setCurrentMood(null);
        setIsLoading(false);
      } else if (event === 'INITIAL_SESSION') {
        if (!session) {
          console.log('ℹ️ [AuthContext] Nessuna sessione iniziale trovata');
          setIsLoading(false);
        }
      }
    });

    initSession();

    // Safety timeout ridotto e più visibile
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('🚨 [AuthContext] TIMEOUT SICUREZZA RAGGIUNTO! Sblocco forzato UI.');
        setIsLoading(false);
      }
    }, 6000);

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
      handleResetOnboarding,
      handleDeleteAccount,
      handleUpdateAvatar
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
