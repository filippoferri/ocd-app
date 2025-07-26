import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'therapist' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export interface UserActivity {
  id: string;
  date: string;
  time: string;
  type: 'ossessione' | 'compulsione';
  symptom: string;
  intensity: string;
  description: string;
}

export interface UserStats {
  totalActivations: number;
  totalExercises: number;
  weeklyGoal: number;
  weeklyProgress: number;
  streak: number;
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

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private userActivities: UserActivity[] = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Autenticazione
  async login(email: string, password: string): Promise<User> {
    try {
      // TODO: Implementare chiamata API reale
      // Per ora simuliamo con dati locali
      const users = await this.getStoredUsers();
      let user = users.find(u => u.email === email);
      
      if (!user) {
        // Per demo, creiamo automaticamente un utente se non esiste
        if (email === 'test@test.com' || email.includes('@')) {
          user = {
            id: Date.now().toString(),
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email: email,
            role: 'user' as const,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };
          const users = await this.getStoredUsers();
           users.push(user);
           await AsyncStorage.setItem('users', JSON.stringify(users));
        } else {
          throw new Error('Email non valida');
        }
      }

      // TODO: Verificare password hashata
      // Per ora accettiamo qualsiasi password per demo
      
      user.lastLogin = new Date().toISOString();
      await this.updateStoredUser(user);
      
      this.currentUser = user;
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      
      // Carica le attività dell'utente
      await this.loadUserActivities();
      
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Errore durante il login');
    }
  }

  async signup(name: string, email: string, password: string): Promise<User> {
    try {
      // Verifica se l'utente esiste già
      const users = await this.getStoredUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('Utente già registrato');
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Salva il nuovo utente
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      this.currentUser = newUser;
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      throw new Error('Errore durante la registrazione');
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    this.userActivities = [];
    await AsyncStorage.removeItem('currentUser');
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        // Carica le attività dell'utente
        await this.loadUserActivities();
        return this.currentUser;
      }
    } catch (error) {
      console.error('Errore nel recupero utente corrente:', error);
    }
    
    return null;
  }

  // Gestione attività utente
  async addActivity(activity: UserActivity): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Utente non autenticato');
    }

    console.log('AuthService: Aggiunta attività:', activity);
    this.userActivities.push(activity);
    console.log('AuthService: Attività totali dopo aggiunta:', this.userActivities.length);
    await this.saveUserActivities();
    console.log('AuthService: Attività salvata con successo');
  }

  async getUserActivities(): Promise<UserActivity[]> {
    if (!this.currentUser) {
      console.log('AuthService: Nessun utente autenticato');
      return [];
    }

    console.log('AuthService: Caricamento attività per utente:', this.currentUser.id);
    try {
      const activitiesData = await AsyncStorage.getItem(`activities_${this.currentUser.id}`);
      console.log('AuthService: Dati raw da AsyncStorage:', activitiesData);
      if (activitiesData) {
        this.userActivities = JSON.parse(activitiesData);
        console.log('AuthService: Attività parsate:', this.userActivities);
      } else {
        console.log('AuthService: Nessun dato trovato in AsyncStorage');
      }
    } catch (error) {
      console.error('Errore nel recupero attività:', error);
    }

    // Ordina le attivazioni per data e ora dal più recente al più vecchio
    const sortedActivities = this.userActivities.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeB.getTime() - dateTimeA.getTime();
    });

    console.log('AuthService: Ritorno attività ordinate:', sortedActivities.length);
    return sortedActivities;
  }

  async deleteActivity(activityId: string): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Utente non autenticato');
    }

    console.log('AuthService: Eliminazione attività:', activityId);
    this.userActivities = this.userActivities.filter(a => a.id !== activityId);
    console.log('AuthService: Attività totali dopo eliminazione:', this.userActivities.length);
    await this.saveUserActivities();
    console.log('AuthService: Attività eliminata con successo');
  }

  async updateActivity(activityId: string, updatedActivity: Partial<UserActivity>): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Utente non autenticato');
    }

    console.log('AuthService: Aggiornamento attività:', activityId, updatedActivity);
    const index = this.userActivities.findIndex(a => a.id === activityId);
    if (index !== -1) {
      this.userActivities[index] = { ...this.userActivities[index], ...updatedActivity };
      await this.saveUserActivities();
      console.log('AuthService: Attività aggiornata con successo');
    } else {
      throw new Error('Attività non trovata');
    }
  }

  async getUserStats(): Promise<UserStats> {
    const activities = await this.getUserActivities();
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    
    const totalActivations = activities.filter(a => a.type === 'compulsione').length;
    const totalExercises = activities.filter(a => a.type === 'ossessione').length;
    
    const weeklyActivities = activities.filter(a => {
      const activityDate = new Date(a.date);
      return activityDate >= weekStart;
    });
    
    const weeklyGoal = 3; // Obiettivo settimanale fisso per ora
    const weeklyProgress = weeklyActivities.length;
    
    // Calcolo streak (giorni consecutivi con attività)
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

    return {
      totalActivations,
      totalExercises,
      weeklyGoal,
      weeklyProgress,
      streak,
    };
  }

  // Metodi privati per gestione storage
  private async getStoredUsers(): Promise<User[]> {
    try {
      const usersData = await AsyncStorage.getItem('users');
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      return [];
    }
  }

  private async updateStoredUser(user: User): Promise<void> {
    const users = await this.getStoredUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  private async storeUser(user: User): Promise<void> {
    const users = await this.getStoredUsers();
    users.push(user);
    await AsyncStorage.setItem('users', JSON.stringify(users));
  }

  private async loadUserActivities(): Promise<void> {
    if (!this.currentUser) return;
    
    try {
      const activitiesData = await AsyncStorage.getItem(`activities_${this.currentUser.id}`);
      if (activitiesData) {
        this.userActivities = JSON.parse(activitiesData);
        console.log('AuthService: Attività caricate nel login:', this.userActivities.length);
      } else {
        this.userActivities = [];
        console.log('AuthService: Nessuna attività trovata, inizializzato array vuoto');
      }
    } catch (error) {
      console.error('Errore nel caricamento attività:', error);
      this.userActivities = [];
    }
  }

  private async saveUserActivities(): Promise<void> {
    if (!this.currentUser) return;
    
    try {
      await AsyncStorage.setItem(
        `activities_${this.currentUser.id}`,
        JSON.stringify(this.userActivities)
      );
    } catch (error) {
      console.error('Errore nel salvataggio attività:', error);
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      // TODO: Implementare chiamata API per reset password
      // Per ora simuliamo l'invio dell'email
      const users = await this.getStoredUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Email non trovata');
      }
      
      // Simulazione invio email
      console.log(`Email di reset password inviata a: ${email}`);
      
      // In una implementazione reale, qui invieresti l'email
      return Promise.resolve();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Errore durante l\'invio dell\'email di reset');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // TODO: Implementare con backend
    console.log('Password reset with token:', token);
  }

  // Gestione onboarding
  async hasCompletedOnboarding(): Promise<boolean> {
    if (!this.currentUser) {
      return false;
    }

    try {
      const onboardingData = await AsyncStorage.getItem(`onboarding_${this.currentUser.id}`);
      return onboardingData !== null;
    } catch (error) {
      console.error('Errore nel controllo onboarding:', error);
      return false;
    }
  }

  async saveOnboardingData(data: OnboardingData): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Utente non autenticato');
    }

    try {
      const onboardingWithTimestamp = {
        ...data,
        completedAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(
        `onboarding_${this.currentUser.id}`,
        JSON.stringify(onboardingWithTimestamp)
      );
      
      console.log('AuthService: Dati onboarding salvati con successo');
    } catch (error) {
      console.error('Errore nel salvataggio dati onboarding:', error);
      throw new Error('Errore nel salvataggio dei dati onboarding');
    }
  }

  async getOnboardingData(): Promise<OnboardingData | null> {
    if (!this.currentUser) {
      return null;
    }

    try {
      const onboardingData = await AsyncStorage.getItem(`onboarding_${this.currentUser.id}`);
      return onboardingData ? JSON.parse(onboardingData) : null;
    } catch (error) {
      console.error('Errore nel recupero dati onboarding:', error);
      return null;
    }
  }

  async resetOnboarding(): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Utente non autenticato');
    }

    try {
      await AsyncStorage.removeItem(`onboarding_${this.currentUser.id}`);
      console.log('AuthService: Onboarding resettato con successo');
    } catch (error) {
      console.error('Errore nel reset onboarding:', error);
      throw new Error('Errore nel reset dell\'onboarding');
    }
  }
}

export default AuthService.getInstance();