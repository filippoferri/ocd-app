import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Animated, Dimensions, Easing, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../services/AuthService';
import { UserActivity } from '../types/Activity';
import { NotificationService } from '../services/NotificationService';
import FAQScreen from './FAQScreen';
import PrivacyScreen from './PrivacyScreen';
import AccountScreen from './AccountScreen';
import TermsScreen from './TermsScreen';
import PolicyScreen from './PolicyScreen';
import { Linking } from 'react-native';

interface ProfileScreenProps {
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  userActivities: UserActivity[];
  testCompleted: boolean;
  testResult: string | null;
  onRetakeTest: () => void;
  onResetOnboarding?: () => void;
  onDeleteAccount?: () => Promise<void>;
}

const { width, height } = Dimensions.get('window');

export default function ProfileScreen({ onClose, user, onLogout, userActivities, testCompleted, testResult, onRetakeTest, onResetOnboarding, onDeleteAccount }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Time Picker State
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [reminderTime, setReminderTime] = useState('09:00');

  const [showFAQs, setShowFAQs] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  // New Modal Animation State
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalSlide = useRef(new Animated.Value(height)).current;
  
  // Sub-modal animation (FAQs, Privacy) - Right to Left
  const subModalSlide = useRef(new Animated.Value(width)).current;
  const subModalBackgroundShift = useRef(new Animated.Value(0)).current;

  const openTimePicker = () => {
    setShowTimePicker(true);
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalSlide, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeTimePicker = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalSlide, {
        toValue: height,
        duration: 300,
        easing: Easing.in(Easing.poly(4)),
        useNativeDriver: true,
      })
    ]).start(() => setShowTimePicker(false));
  };

  const openSubModal = (type: 'faq' | 'privacy' | 'account' | 'terms' | 'policy') => {
    if (type === 'faq') setShowFAQs(true);
    else if (type === 'privacy') setShowPrivacy(true);
    else if (type === 'account') setShowAccount(true);
    else if (type === 'terms') setShowTerms(true);
    else setShowPolicy(true);

    Animated.parallel([
      Animated.timing(subModalSlide, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }),
      Animated.timing(subModalBackgroundShift, {
        toValue: -width * 0.2,
        duration: 400,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeSubModal = () => {
    Animated.parallel([
      Animated.timing(subModalSlide, {
        toValue: width,
        duration: 350,
        easing: Easing.in(Easing.poly(4)),
        useNativeDriver: true,
      }),
      Animated.timing(subModalBackgroundShift, {
        toValue: 0,
        duration: 350,
        easing: Easing.in(Easing.poly(4)),
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowFAQs(false);
      setShowPrivacy(false);
      setShowAccount(false);
      setShowTerms(false);
      setShowPolicy(false);
    });
  };
  
  // Background shift when settings modal is open
  const backgroundShiftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(backgroundShiftAnim, {
      toValue: showSettings ? -height * 0.08 : 0,
      duration: showSettings ? 350 : 300,
      easing: showSettings ? Easing.out(Easing.poly(4)) : Easing.in(Easing.poly(4)),
      useNativeDriver: true,
    }).start();
    
    // Al caricamento, controlla lo stato reale dei permessi
    if (showSettings) {
      NotificationService.checkPermissions().then(setNotificationsEnabled);
    }
  }, [showSettings]);

  const handleToggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    if (newValue) {
      const granted = await NotificationService.requestPermissions();
      if (granted) {
        setNotificationsEnabled(true);
        await NotificationService.scheduleDailyReminder(8, 0);
        Alert.alert("Successo", "Promemoria giornaliero impostato dalle 08:00.");
      } else {
        Alert.alert("Permesso negato", "Abilita le notifiche nelle impostazioni di sistema per ricevere i promemoria.");
      }
    } else {
      setNotificationsEnabled(false);
      await NotificationService.cancelAllReminders();
    }
  };

  const handleSaveTime = async () => {
    const newTime = `${selectedHour}:${selectedMinute}`;
    setReminderTime(newTime);
    closeTimePicker();
    
    if (notificationsEnabled) {
      await NotificationService.scheduleDailyReminder(parseInt(selectedHour), parseInt(selectedMinute));
      Alert.alert("Successo", `Promemoria aggiornato per le ${newTime}.`);
    }
  };

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
        <>
          <Animated.View style={[styles.settingsContainer, { transform: [{ translateX: subModalBackgroundShift }] }]}>
            <View style={[styles.settingsHeader, { paddingTop: insets.top + 20 }]}>
              <View style={{ width: 24 }} />
              <Text style={styles.settingsTitle}>Impostazioni</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.settingsContent}>
              <View style={styles.settingsSection}>
                <TouchableOpacity 
                  style={styles.settingItem}
                  onPress={handleToggleNotifications}
                >
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="notifications" size={20} color="#333" />
                    <Text style={styles.settingItemText}>Notifiche reminder</Text>
                  </View>
                  <View style={[styles.toggle, notificationsEnabled && styles.toggleActive]}>
                    <View style={[styles.toggleThumb, notificationsEnabled && styles.toggleThumbActive]} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.settingItem}
                  onPress={openTimePicker}
                >
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="time" size={20} color="#333" />
                    <Text style={styles.settingItemText}>Orario Promemoria</Text>
                  </View>
                  <View style={styles.reminderTimeContainer}>
                    <Text style={styles.reminderTimeText}>{reminderTime}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="language" size={20} color="#333" />
                    <Text style={styles.settingItemText}>Lingua</Text>
                  </View>
                  <View style={styles.reminderTimeContainer}>
                    <Text style={styles.reminderTimeText}>Italiano</Text>
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={() => openSubModal('account')}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="person-circle" size={20} color="#333" />
                    <Text style={styles.settingItemText}>Account</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Tools per i Tester */}
                {user?.role === 'tester' && (
                  <>
                    <View style={styles.settingDivider} />
                    <Text style={[styles.sectionTitle, { marginTop: 10, marginBottom: 5, paddingHorizontal: 0 }]}>Strumenti Tester</Text>
                    
                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={() => {
                        NotificationService.sendTestNotification();
                        Alert.alert("Test", "Notifica di test inviata!");
                      }}
                    >
                      <View style={styles.settingItemLeft}>
                        <Ionicons name="flask" size={20} color="#FF8C00" />
                        <Text style={[styles.settingItemText, { color: '#FF8C00' }]}>Manda notifica di test</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#FF8C00" />
                    </TouchableOpacity>

                    {onResetOnboarding && (
                      <TouchableOpacity 
                        style={styles.settingItem} 
                        onPress={() => {
                          Alert.alert(
                            "Reset Onboarding",
                            "Vuoi davvero resettare l'onboarding? L'app si riavvierà.",
                            [
                              { text: "Annulla", style: "cancel" },
                              { text: "Reset", style: "destructive", onPress: () => {
                                setShowSettings(false);
                                onResetOnboarding();
                              }}
                            ]
                          );
                        }}
                      >
                        <View style={styles.settingItemLeft}>
                          <Ionicons name="refresh" size={20} color="#FF8C00" />
                          <Text style={[styles.settingItemText, { color: '#FF8C00' }]}>Rifai Onboarding</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#FF8C00" />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>

              <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Sicurezza e privacy</Text>
              <View style={styles.settingsSection}>
                <TouchableOpacity style={styles.settingItem} onPress={() => openSubModal('faq')}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="help-circle" size={20} color="#333" />
                    <Text style={styles.settingItemText}>FAQs</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={() => openSubModal('privacy')}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="shield-checkmark" size={20} color="#333" />
                    <Text style={styles.settingItemText}>Privacy e Sicurezza</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Risorse</Text>
              <View style={styles.settingsSection}>
                <TouchableOpacity style={styles.settingItem} onPress={() => openSubModal('terms')}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="document-text" size={20} color="#333" />
                    <Text style={styles.settingItemText}>Termini e Condizioni</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={() => openSubModal('policy')}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="shield-half" size={20} color="#333" />
                    <Text style={styles.settingItemText}>Privacy Policy</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.settingItem} 
                  onPress={() => Linking.openURL('https://forms.google.com/your-form-id')}
                >
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="chatbubble-ellipses" size={20} color="#333" />
                    <Text style={styles.settingItemText}>Feedback</Text>
                  </View>
                  <Ionicons name="open-outline" size={18} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={[styles.settingsSection, { marginBottom: 40 }]}>
                <TouchableOpacity 
                  style={[styles.settingItem, styles.deleteItem]}
                  onPress={() => {
                    Alert.alert(
                      "Cancella Account",
                      "Sei sicuro di voler cancellare il tuo account? Questa azione è irreversibile e tutti i tuoi dati verranno eliminati permanentemente.",
                      [
                        { text: "Annulla", style: "cancel" },
                        { 
                          text: "Elimina", 
                          style: "destructive",
                          onPress: async () => {
                            if (onDeleteAccount) {
                              try {
                                await onDeleteAccount();
                                onClose(); // Chiude il profilo prima del logout/reset
                              } catch (e) {
                                Alert.alert("Errore", "Impossibile cancellare l'account in questo momento.");
                              }
                            }
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Text style={[styles.settingItemText, styles.deleteText]}>Cancella l'account</Text>
                  <Ionicons name="chevron-forward" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>

              <Text style={styles.versionText}>DOC Relief v1.0.0</Text>
            </ScrollView>
          </Animated.View>

          {/* Sub-modal Overlay View (Right to Left Slide) */}
          {(showFAQs || showPrivacy || showAccount || showTerms || showPolicy) && (
            <Animated.View 
              style={[
                styles.subModalContainer,
                { 
                  transform: [{ translateX: subModalSlide }],
                  zIndex: 1000,
                }
              ]}
            >
              {showFAQs && <FAQScreen onClose={closeSubModal} />}
              {showPrivacy && <PrivacyScreen onClose={closeSubModal} />}
              {showTerms && <TermsScreen onClose={closeSubModal} />}
              {showPolicy && <PolicyScreen onClose={closeSubModal} />}
              {showAccount && (
                <AccountScreen 
                  onClose={closeSubModal} 
                  onLogout={onLogout}
                  userEmail={user?.email || undefined} 
                  provider={user?.provider}
                />
              )}
            </Animated.View>
          )}

          {/* New Smooth Time Picker Modal */}
          <Modal visible={showTimePicker} transparent animationType="none">
            <View style={styles.modalOverlay}>
              <Animated.View 
                style={[
                  styles.modalBackdrop, 
                  { opacity: modalOpacity }
                ]} 
              >
                <TouchableOpacity 
                  style={{ flex: 1 }} 
                  activeOpacity={1} 
                  onPress={closeTimePicker} 
                />
              </Animated.View>
              
              <Animated.View 
                style={[
                  styles.modalContent, 
                  { transform: [{ translateY: modalSlide }] }
                ]}
              >
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={closeTimePicker}>
                    <Text style={styles.modalCancel}>Annulla</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveTime}>
                    <Text style={styles.modalDone}>Fatto</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.pickerContainer}>
                  <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                    {Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
                      <TouchableOpacity
                        key={hour}
                        style={[styles.pickerItem, selectedHour === hour && styles.pickerItemSelected]}
                        onPress={() => setSelectedHour(hour)}
                      >
                        <Text style={[styles.pickerText, selectedHour === hour && styles.pickerTextSelected]}>{hour}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                    {Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
                      <TouchableOpacity
                        key={minute}
                        style={[styles.pickerItem, selectedMinute === minute && styles.pickerItemSelected]}
                        onPress={() => setSelectedMinute(minute)}
                      >
                        <Text style={[styles.pickerText, selectedMinute === minute && styles.pickerTextSelected]}>{minute}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </Animated.View>
            </View>
          </Modal>
        </>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.mainWrapper, { transform: [{ translateY: backgroundShiftAnim }] }]}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
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
    // paddingTop handled dynamically
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
    // paddingTop handled dynamically
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
  reminderTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTimeText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 15,
  },
  // Modal Picker Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    // Eliminiamo maxHeight: '50%' per evitare tagli durante l'animazione se necessario, 
    // ma lo teniamo se vogliamo che rimanga metà schermo.
    height: height * 0.45, 
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalCancel: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalDone: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 200,
  },
  picker: {
    flex: 1,
    paddingHorizontal: 10,
  },
  pickerItem: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemSelected: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  pickerText: {
    fontSize: 18,
    color: '#333',
  },
  pickerTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
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
  subModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});
