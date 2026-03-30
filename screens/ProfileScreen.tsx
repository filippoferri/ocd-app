import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Animated, Dimensions, Easing, Alert, Linking, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UserActivity } from '../types/Activity';
import { NotificationService } from '../services/NotificationService';
import FAQScreen from './FAQScreen';
import PrivacyScreen from './PrivacyScreen';
import AccountScreen from './AccountScreen';
import TermsScreen from './TermsScreen';
import PolicyScreen from './PolicyScreen';
import { Colors, Spacing, Shadow } from '../config/Theme';
import { User } from '../services/AuthService';
import SlideModal from '../components/SlideModal';
import { useAuth } from '../contexts/AuthContext';

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

import { calculateUserTrend, getTrendCopy, UserTrendState } from '../services/TrendService';

const { width, height } = Dimensions.get('window');

const TREND_DAYS = 7;
const WEEKLY_GOAL = 3;

// Helper: data locale nel formato YYYY-MM-DD (rispetta il fuso orario del dispositivo)
const getLocalDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

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

export default function ProfileScreen({ onClose, user, onLogout, userActivities, testCompleted, testResult, onRetakeTest, onResetOnboarding, onDeleteAccount }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  
  const weekDates = React.useMemo(() => getWeekDates(), []);
  
  // Verifica se in una data (YYYY-MM-DD locale) è stato completato un esercizio
  const hasExerciseOnDate = (date: string) => {
    return userActivities.some(activity => {
      // Normalizza: prende solo la parte YYYY-MM-DD, sia ISO che locale
      const activityDate = activity.date?.split('T')[0];
      return activityDate === date && (activity.id?.startsWith('exercise_') || activity.description.includes('Esercizio completato'));
    });
  };
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

  const userState: UserTrendState = calculateUserTrend(userActivities);
  const trendCopy = getTrendCopy(userState);

  const activeDaysThisWeek = weekDates.filter(date => hasExerciseOnDate(date)).length;

  const heroContent = React.useMemo(() => {
    if (activeDaysThisWeek > 0) {
      return {
        title: `${activeDaysThisWeek} ${activeDaysThisWeek === 1 ? 'giorno attivo' : 'giorni attivi'} questa settimana`,
        subtitle: 'Continua così'
      };
    }
    return {
      title: 'Nessuna attività questa settimana',
      subtitle: 'Inizia oggi, anche con poco'
    };
  }, [activeDaysThisWeek]);

  const getRecentInsightContent = () => {
    return trendCopy.insight;
  };

  const supportPhrases = [
    'La continuità conta più della quantità',
    'Anche un piccolo passo oggi fa la differenza',
    'Non serve fare tutto, basta iniziare',
    'Ogni giorno attivo è un passo avanti'
  ];

  const supportPhrase = React.useMemo(() => {
    const dayIndex = new Date().getDay();
    return supportPhrases[dayIndex % supportPhrases.length];
  }, []);

  const weekDatesLocal = weekDates; // Alias for internal usage if needed

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

            <ScrollView style={styles.settingsContent} contentContainerStyle={{ paddingBottom: 40 }}>
              <Text style={styles.settingsSectionTitle}>Impostazioni generali</Text>
              
              <View style={styles.settingCard}>
                <TouchableOpacity 
                   style={styles.settingItemRow}
                  onPress={handleToggleNotifications}
                >
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="notifications" size={22} color="#0D0140" />
                    <Text style={styles.settingItemText}>Notifiche reminder</Text>
                  </View>
                  <View style={[styles.toggle, notificationsEnabled && { backgroundColor: '#4CD964' }]}>
                    <View style={[styles.toggleThumb, notificationsEnabled && styles.toggleThumbActive]} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.settingCard}>
                <TouchableOpacity 
                  style={styles.settingItemRow}
                  onPress={openTimePicker}
                >
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="time" size={22} color="#0D0140" />
                    <Text style={styles.settingItemText}>Orario Promemoria</Text>
                  </View>
                  <View style={styles.reminderTimeContainer}>
                    <Text style={styles.reminderTimeText}>{reminderTime}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#0D0140" />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.settingCard}>
                <TouchableOpacity style={styles.settingItemRow} onPress={() => openSubModal('account')}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="person-circle" size={22} color="#0D0140" />
                    <Text style={styles.settingItemText}>Account</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#0D0140" />
                </TouchableOpacity>
              </View>

              <Text style={styles.settingsSectionTitle}>Sicurezza e privacy</Text>

              <View style={styles.settingCard}>
                <TouchableOpacity style={styles.settingItemRow} onPress={() => openSubModal('faq')}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="help-circle" size={22} color="#0D0140" />
                    <Text style={styles.settingItemText}>FAQs</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#0D0140" />
                </TouchableOpacity>
              </View>

              <View style={styles.settingCard}>
                <TouchableOpacity style={styles.settingItemRow} onPress={() => openSubModal('privacy')}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="shield-checkmark" size={22} color="#0D0140" />
                    <Text style={styles.settingItemText}>Privacy e Sicurezza</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#0D0140" />
                </TouchableOpacity>
              </View>

              <View style={styles.settingCard}>
                <TouchableOpacity style={styles.settingItemRow} onPress={() => openSubModal('terms')}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="document-text" size={22} color="#0D0140" />
                    <Text style={styles.settingItemText}>Termini e Condizioni</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#0D0140" />
                </TouchableOpacity>
              </View>

              <View style={styles.settingCard}>
                <TouchableOpacity style={styles.settingItemRow} onPress={() => openSubModal('policy')}>
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="shield-half" size={22} color="#0D0140" />
                    <Text style={styles.settingItemText}>Privacy Policy</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#0D0140" />
                </TouchableOpacity>
              </View>

              <View style={styles.settingCard}>
                <TouchableOpacity 
                   style={styles.settingItemRow} 
                  onPress={() => Linking.openURL('https://forms.gle/DYzoUcJE3ch29WJF8')}
                >
                  <View style={styles.settingItemLeft}>
                    <Ionicons name="chatbubble-ellipses" size={22} color="#0D0140" />
                    <Text style={styles.settingItemText}>Feedback</Text>
                  </View>
                  <Ionicons name="open-outline" size={18} color="#0D0140" />
                </TouchableOpacity>
              </View>

              {/* Tools per i Tester */}
              {user?.role === 'tester' && (
                <>
                  <Text style={styles.settingsSectionTitle}>Per i tester</Text>
                  <View style={styles.settingCard}>
                    <TouchableOpacity 
                      style={styles.settingItemRow}
                      onPress={() => {
                        NotificationService.sendTestNotification();
                        Alert.alert("Test", "Notifica di test inviata!");
                      }}
                    >
                      <View style={styles.settingItemLeft}>
                        <Ionicons name="notifications" size={22} color="#EBB300" />
                        <Text style={[styles.settingItemText, { color: '#EBB300' }]}>Manda notifica di test</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#EBB300" />
                    </TouchableOpacity>
                  </View>

                  {onResetOnboarding && (
                    <View style={styles.settingCard}>
                      <TouchableOpacity 
                        style={styles.settingItemRow} 
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
                          <Ionicons name="refresh" size={22} color="#EBB300" />
                          <Text style={[styles.settingItemText, { color: '#EBB300' }]}>Rifai Onboarding</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#EBB300" />
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}

              <View style={{ height: 20 }} />

              <View style={[styles.settingCard, { backgroundColor: '#FDECEC' }]}>
                <TouchableOpacity 
                   style={styles.settingItemRow}
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
                                onClose();
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
                  <View style={styles.settingItemLeft}>
                    <Text style={[styles.settingItemText, { color: '#E53E3E' }]}>Cancella l'account</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E53E3E" />
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
                  avatarUrl={user?.avatar_url}
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
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profilo</Text>
          <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>{heroContent.title}</Text>
          <Text style={styles.heroSubtitle}>{heroContent.subtitle}</Text>
        </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questa settimana</Text>
          <View style={styles.exerciseCalendar}>
            {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day, index) => {
              const date = weekDates[index];
              const hasExercise = hasExerciseOnDate(date);
              const isToday = date === getLocalDateString(new Date());
              
              return (
                <View key={day} style={styles.calendarDay}>
                  <View style={[
                    styles.calendarDot, 
                    hasExercise && styles.calendarDotActive,
                    isToday && styles.calendarDotToday
                  ]}>
                    {hasExercise ? (
                      <Ionicons name="checkmark" size={12} color="white" />
                    ) : (
                      <View style={styles.calendarEmptyCircle} />
                    )}
                  </View>
                  <Text style={[styles.calendarDayText, isToday && styles.calendarDayTextToday]}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Obiettivo settimanale</Text>
          <View style={styles.goalSection}>
            <Text style={styles.goalText}>{Math.min(activeDaysThisWeek, WEEKLY_GOAL)} su {WEEKLY_GOAL} completati</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(activeDaysThisWeek / WEEKLY_GOAL * 100, 100)}%` }]} />
            </View>
          </View>
          <Text style={styles.goalDescription}>
            {supportPhrase}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Andamento recente</Text>
          <View style={styles.recentInsightCard}>
            <Ionicons name="analytics" size={24} color={Colors.accent} />
            <Text style={styles.recentInsightText}>{getRecentInsightContent()}</Text>
          </View>
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
                  <Text style={styles.testResultTitle}>DOC</Text>
                  <Text style={styles.testResultStatus}>PRESENTE</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.retakeButton} onPress={onRetakeTest}>
                <Ionicons name="refresh" size={20} color={Colors.onPrimary} />
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
    backgroundColor: Colors.primary,
  },
  mainWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onPrimary,
    letterSpacing: 0.5,
  },
  iconButton: {
    padding: Spacing.xs,
    borderRadius: 12,
  },
  heroSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.onPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 26,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    textAlign: 'center',
  },
  recentInsightCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentInsightText: {
    fontSize: 15,
    color: '#0D0140',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  calendarEmptyCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: Spacing.xl,
    ...Shadow.light,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D0140',
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  exerciseCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 20,
    ...Shadow.light,
  },
  calendarDay: {
    alignItems: 'center',
    flex: 1,
  },
  calendarDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarDotActive: {
    backgroundColor: Colors.success,
    transform: [{ scale: 1.15 }],
  },
  calendarDotToday: {
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  calendarDayText: {
    fontSize: 11,
    color: 'rgba(13, 1, 64, 0.5)',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  calendarDayTextToday: {
    color: Colors.accent,
    fontWeight: '800',
  },
  calendarDayNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0140',
    display: 'none',
  },
  goalSection: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 20,
    ...Shadow.light,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0140',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  goalDescription: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
    paddingHorizontal: Spacing.xs,
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  settingsContent: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    ...Shadow.light,
  },
  settingItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingItemText: {
    fontSize: 15,
    color: '#0D0140',
    fontWeight: '500',
  },
  settingDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  reminderTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reminderTimeText: {
    fontSize: 15,
    color: '#8f959e',
    fontWeight: '600',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    padding: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    ...Shadow.light,
  },
  toggleThumbActive: {
    marginLeft: 20,
  },
  subModalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalBottomSpacer: {
    height: 0,
    backgroundColor: 'white',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    ...Shadow.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalCancel: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalDone: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 250,
  },
  picker: {
    flex: 1,
  },
  pickerItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: '#F8F7FF',
  },
  pickerText: {
    fontSize: 20,
    color: Colors.secondary,
  },
  pickerTextSelected: {
    fontWeight: '700',
    color: Colors.accent,
  },
  testResultCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.md,
    ...Shadow.light,
  },
  testResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  testScoreCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  testScoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  testResultInfo: {
    flex: 1,
  },
  testResultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0140',
  },
  testResultStatus: {
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '800',
    marginTop: 2,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 10,
    gap: 8,
  },
  retakeButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  versionText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginVertical: 20,
    fontWeight: '600',
  },
  deleteItem: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  deleteText: {
    color: Colors.danger,
  },
});
