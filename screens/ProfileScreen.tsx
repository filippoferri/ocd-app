import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Animated, Dimensions, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../services/AuthService';
import { UserActivity } from '../types/Activity';

interface ProfileScreenProps {
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  userActivities: UserActivity[];
  testCompleted: boolean;
  testResult: string | null;
  onRetakeTest: () => void;
  onResetOnboarding?: () => void;
}

export default function ProfileScreen({ onClose, user, onLogout, userActivities, testCompleted, testResult, onRetakeTest, onResetOnboarding }: ProfileScreenProps) {
  const [showSettings, setShowSettings] = useState(false);
  
  // Background shift when settings modal is open
  const backgroundShiftAnim = useRef(new Animated.Value(0)).current;
  const { height } = Dimensions.get('window');

  useEffect(() => {
    Animated.timing(backgroundShiftAnim, {
      toValue: showSettings ? -height * 0.08 : 0,
      duration: showSettings ? 350 : 300,
      easing: showSettings ? Easing.out(Easing.poly(4)) : Easing.in(Easing.poly(4)),
      useNativeDriver: true,
    }).start();
  }, [showSettings]);

  // Calcola il numero totale di attivazioni (ossessioni + compulsioni, escludendo esercizi)
  const totalActivations = userActivities.filter(activity => 
    !(activity.id?.startsWith('exercise_') || activity.description.includes('Esercizio completato'))
  ).length;
  
  // Calcola il numero totale di esercizi completati
  const totalExercises = userActivities.filter(activity => 
    activity.id?.startsWith('exercise_') || activity.description.includes('Esercizio completato')
  ).length;

  // Verifica se in una data (YYYY-MM-DD locale) è stato completato un esercizio
  const hasExerciseOnDate = (date: string) => {
    return userActivities.some(activity => {
      // Normalizza: prende solo la parte YYYY-MM-DD, sia ISO che locale
      const activityDate = activity.date?.split('T')[0];
      return activityDate === date && (activity.id?.startsWith('exercise_') || activity.description.includes('Esercizio completato'));
    });
  };

  // Helper: data locale nel formato YYYY-MM-DD (rispetta il fuso orario del dispositivo)
  const getLocalDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Genera le date per la settimana corrente (lunedì → domenica)
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domenica, 1 = lunedì, etc.
    const startOfWeek = new Date(today);
    // Sposta a lunedì: se hoje è domenica (0) → -6, altrimenti -(currentDay - 1)
    startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(getLocalDateString(date));
    }
    return weekDates;
  };

  const weekDates = getWeekDates();

  const renderSettings = () => {
    return (
      <Modal visible={showSettings} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.settingsContainer}>
          <View style={styles.settingsHeader}>
            <View style={{ width: 24 }} />
            <Text style={styles.settingsTitle}>General Settings</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.settingsContent}>
            <View style={styles.settingsSection}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <Ionicons name="notifications" size={20} color="#333" />
                  <Text style={styles.settingItemText}>Notifiche</Text>
                </View>
                <View style={[styles.toggle, styles.toggleActive]}>
                  <View style={[styles.toggleThumb, styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <Text style={styles.settingItemText}>In-app vibration</Text>
                </View>
                <View style={styles.toggle}>
                  <View style={styles.toggleThumb} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <Ionicons name="lock-closed" size={20} color="#333" />
                  <Text style={styles.settingItemText}>Password</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingItemText}>Open Sources used by DOC Relief</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingItemText}>Piano di pagamento</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              {onResetOnboarding && (
                <TouchableOpacity style={styles.settingItem} onPress={onResetOnboarding}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="refresh" size={20} color="#333" />
                    <Text style={styles.settingItemText}>Rifai Onboarding</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Sicurezza e privacy</Text>
            <View style={styles.settingsSection}>
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingItemText}>Help Desk</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingItemText}>Sicurezza</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={onLogout}>
                <View style={styles.settingItemLeft}>
                  <Ionicons name="exit" size={20} color="#333" />
                  <Text style={styles.settingItemText}>Esci</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.settingItem, styles.deleteItem]}>
                <Text style={[styles.settingItemText, styles.deleteText]}>Cancella l'account</Text>
                <Ionicons name="chevron-forward" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>

            <Text style={styles.versionText}>DOC Relief v1.0.0</Text>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.mainWrapper, { transform: [{ translateY: backgroundShiftAnim }] }]}>
        <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#666" />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.name || 'Utente'}</Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalActivations}</Text>
          <Text style={styles.statLabel}>Attivazioni</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalExercises}</Text>
          <Text style={styles.statLabel}>Esercizi</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Esercizi</Text>
          <View style={styles.exerciseCalendar}>
            {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day, index) => {
              const date = weekDates[index];
              const dayNumber = parseInt(date.split('-')[2], 10);
              const hasExercise = hasExerciseOnDate(date);
              
              return (
                <View key={day} style={styles.calendarDay}>
                  <View style={[styles.calendarDot, hasExercise && styles.calendarDotActive]} />
                  <Text style={styles.calendarDayText}>{day}</Text>
                  <Text style={styles.calendarDayNumber}>{dayNumber}</Text>
                </View>
              );
            })}
          </View>

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Obiettivi settimanali</Text>
          <View style={styles.goalSection}>
            <Text style={styles.goalText}>{Math.min(weekDates.filter(date => hasExerciseOnDate(date)).length, 3)} di 3</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(weekDates.filter(date => hasExerciseOnDate(date)).length / 3 * 100, 100)}%` }]} />
            </View>
          </View>
          <Text style={styles.goalDescription}>
            {weekDates.filter(date => hasExerciseOnDate(date)).length >= 3 
              ? "🎉 Fantastico! Hai raggiunto il tuo obiettivo settimanale. La costanza è la chiave del successo e della crescita personale!"
              : "Se esegui gli esercizi tre volte a settimana, i nostri dati dimostrano che ci sono miglioramenti tangibili."}
          </Text>
        </View>

        {testCompleted && testResult !== null && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risultato Test DOC</Text>
            <View style={styles.testResultCard}>
              <View style={styles.testResultHeader}>
                <View style={styles.testScoreCircle}>
                  <Text style={styles.testScoreText}>{testResult}</Text>
                </View>
                <View style={styles.testResultInfo}>
                  <Text style={styles.testResultTitle}>Disturbo Ossessivo Compulsivo</Text>
                  <Text style={styles.testResultStatus}>PRESENTE</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.retakeButton} onPress={onRetakeTest}>
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.retakeButtonText}>Rifai il test</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

        {renderSettings()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B7CF6',
  },
  mainWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  exerciseCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  calendarDay: {
    alignItems: 'center',
  },
  calendarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8E8E8',
    marginBottom: 8,
  },
  calendarDotActive: {
    backgroundColor: '#8B7CF6',
  },
  calendarDayText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  calendarDayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  exerciseText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  goalSection: {
    marginBottom: 15,
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B7CF6',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B7CF6',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Settings Modal Styles
  settingsContainer: {
    flex: 1,
    backgroundColor: '#8B7CF6',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsContent: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  deleteItem: {
    backgroundColor: '#FFE8E8',
  },
  deleteText: {
    color: '#F44336',
    marginLeft: 0,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginTop: 20,
    marginBottom: 40,
  },
  // Test Result Styles
  testResultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  testResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  testScoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B7CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  testScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  testResultInfo: {
    flex: 1,
  },
  testResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  testResultStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B7CF6',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B7CF6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
});
