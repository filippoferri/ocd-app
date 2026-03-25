import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { UserActivity } from '../types/Activity';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: 'user' | 'tester' | 'admin';
  provider?: string;
  createdAt: string;
}

export interface OnboardingData {
  knowsOCD: boolean;
  hasTherapist: boolean;
  age: number;
  gender: 'Maschio' | 'Femmina' | 'Altro';
  fragilityDuration: string;
  fragilityLevel: number;
  dailyImpact: number;
  wantsOCDTest: boolean;
  currentMood: 'sad' | 'neutral' | 'happy';
  completedAt: string;
}

export interface UserStats {
  totalActivations: number;
  totalExercises: number;
  weeklyGoal: number;
  weeklyProgress: number;
  streak: number;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // ---------- Authentication ----------

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login fallito');

    this.currentUser = this.mapSessionUser(data.user);
    return this.currentUser;
  }

  async signup(name: string, email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Registrazione fallita');

    // Assign a default "Premium" avatar (Sun) for new email users
    try {
      await this.updateProfileAvatar('avatar_sun');
    } catch (e) {
      console.warn('Could not set default avatar:', e);
    }

    return this.mapSessionUser(data.user);
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<User | null> {
    console.log('🔍 [AuthService] Recupero sessione...');
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ [AuthService] Errore getSession:', error.message);
        return null;
      }
      
      if (!session?.user) {
        console.log('ℹ️ [AuthService] Nessuna sessione trovata');
        this.currentUser = null;
        return null;
      }
      
      console.log('✅ [AuthService] Sessione trovata per:', session.user.email);
      
      // Fetch profile to get manual avatar_url override
      // Usiamo una query semplice che non solleva eccezioni se il record non esiste
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.warn('⚠️ [AuthService] Errore (non critico) recupero profilo:', profileError.message);
      }

      this.currentUser = this.mapSessionUser(session.user);
      
      if (profile?.avatar_url) {
        console.log('🖼️ [AuthService] Avatar personalizzato trovato nel profilo:', profile.avatar_url);
        this.currentUser.avatar_url = profile.avatar_url;
      }
      
      return this.currentUser;
    } catch (e) {
      console.error('❌ [AuthService] Errore imprevisto in getCurrentUser:', e);
      return null;
    }
  }

  getUser(): User | null {
    return this.currentUser;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  }

  async resetPassword(_token: string, newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  }

  async resendEmailConfirmation(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) throw new Error(error.message);
  }

  // ---------- Social Authentication ----------

  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: Platform.OS === 'web' ? window.location.origin : 'docrelief://auth-callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw new Error(error.message);
  }

  async signInWithFacebook(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: Platform.OS === 'web' ? window.location.origin : 'docrelief://auth-callback',
      },
    });
    if (error) throw new Error(error.message);
  }

  async signInWithApple(): Promise<void> {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In è disponibile solo su iOS');
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'docrelief://auth-callback',
      },
    });
    if (error) throw new Error(error.message);
  }

  // ---------- Activities (CRUD) ----------

  async addActivity(activity: Omit<UserActivity, 'id'> & { id?: string }): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Utente non autenticato');

    const { error } = await supabase.from('activities').insert({
      user_id: session.user.id,
      date: activity.date,
      time: activity.time,
      type: activity.type,
      symptom: activity.symptom || '',
      intensity: activity.intensity || '',
      description: activity.description || '',
    });

    if (error) throw new Error(error.message);
  }

  async getUserActivities(): Promise<UserActivity[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false })
      .order('time', { ascending: false });

    if (error) {
      console.error('Errore nel recupero attività:', error.message);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      date: row.date,
      time: row.time,
      type: row.type,
      symptom: row.symptom,
      intensity: row.intensity,
      description: row.description,
    }));
  }

  async deleteActivity(activityId: string): Promise<void> {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', activityId);

    if (error) throw new Error(error.message);
  }

  async updateActivity(activityId: string, updates: Partial<UserActivity>): Promise<void> {
    const { error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', activityId);

    if (error) throw new Error(error.message);
  }

  async getUserStats(): Promise<UserStats> {
    const activities = await this.getUserActivities();
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());

    const totalActivations = activities.filter(a =>
      a.type === 'ossessione' || a.type === 'compulsione'
    ).length;
    const totalExercises = activities.filter(a =>
      a.id?.startsWith('exercise_') || a.description.includes('Esercizio completato')
    ).length;

    const weeklyActivities = activities.filter(a => {
      const activityDate = new Date(a.date);
      return activityDate >= weekStart;
    });

    const weeklyGoal = 3;
    const weeklyProgress = weeklyActivities.length;

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dayActivities = activities.filter(a => {
        const activityDate = new Date(a.date);
        return activityDate.toDateString() === checkDate.toDateString();
      });

      if (dayActivities.length > 0) {
        streak++;
      } else {
        break;
      }
    }

    return { totalActivations, totalExercises, weeklyGoal, weeklyProgress, streak };
  }

  // ---------- Onboarding (Profile) ----------

  async hasCompletedOnboarding(userId?: string): Promise<boolean> {
    let id = userId;
    
    if (!id) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;
      id = session.user.id;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', id)
      .single();

    if (error || !data) return false;
    return data.onboarding_completed === true;
  }

  async saveOnboardingData(onboardingData: OnboardingData): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Utente non autenticato');

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        onboarding_completed: true,
        wants_ocd_test: onboardingData.wantsOCDTest,
      });

    if (error) throw new Error(error.message);
  }

  async getOnboardingData(): Promise<OnboardingData | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed, wants_ocd_test')
      .eq('id', session.user.id)
      .single();

    if (error || !data || !data.onboarding_completed) return null;

    return {
      knowsOCD: false,
      hasTherapist: false,
      age: 0,
      gender: 'Altro',
      fragilityDuration: '',
      fragilityLevel: 0,
      dailyImpact: 0,
      wantsOCDTest: data.wants_ocd_test || false,
      currentMood: 'neutral',
      completedAt: '',
    };
  }

  async resetOnboarding(): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Utente non autenticato');

    const { error } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: false,
        wants_ocd_test: false,
      })
      .eq('id', session.user.id);

    if (error) throw new Error(error.message);
  }

  async updateProfileAvatar(avatarUrl: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Utente non autenticato');

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        avatar_url: avatarUrl,
      });

    if (error) throw new Error(error.message);
  }

  async deleteAccount(): Promise<void> {
    const { error } = await supabase.rpc('delete_user_account');
    if (error) throw new Error(error.message);
  }

  // ---------- Helpers ----------

  private mapSessionUser(authUser: any): User {
    // For MVP, we'll identify testers by a specific tag in metadata or email
    const role = authUser.user_metadata?.role || 
                 (authUser.email?.includes('test') ? 'tester' : 'user');

    return {
      id: authUser.id,
      name: authUser.user_metadata?.name || '',
      email: authUser.email || '',
      avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
      role: role as 'user' | 'tester' | 'admin',
      provider: authUser.app_metadata?.provider || authUser.identities?.[0]?.provider,
      createdAt: authUser.created_at,
    };
  }
}

export default AuthService.getInstance();
